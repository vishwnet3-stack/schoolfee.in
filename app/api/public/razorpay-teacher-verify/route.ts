// app/api/public/razorpay-teacher-verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

// ── Secret loaded from .env — change only .env to switch test ↔ live
const RAZORPAY_KEY_SECRET  = process.env.RAZORPAY_KEY_SECRET!;
const TEACHER_DASHBOARD_URL = "https://schoolfee.in/dashboard/admin/login";

function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const body     = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body).digest("hex");
  return expected === signature;
}

function str(val: any, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  const s = String(val).trim();
  return s.length > 0 ? s : fallback;
}
function strOrNull(val: any): string | null {
  const s = str(val);
  return s.length > 0 ? s : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      formData,
      publicUserId,
      digilockerClientId,
      maskedAadhaar,
      panNumber,
      aadhaarLocalPdf,
      panLocalPdf,
    } = body;

    // 1. Verify Razorpay signature
    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 });
    }

    const normalizedEmail = str(formData.email).toLowerCase();

    // 2. Duplicate email check across all registration tables
    const [existingTeacher]: any = await db.execute(
      `SELECT id FROM teacher_registrations WHERE email = ? LIMIT 1`, [normalizedEmail]
    );
    if (existingTeacher.length > 0) {
      return NextResponse.json(
        { success: false, error: "This email is already registered as a teacher." },
        { status: 409 }
      );
    }
    const [existingParent]: any = await db.execute(
      `SELECT id FROM parent_registrations WHERE email = ? LIMIT 1`, [normalizedEmail]
    );
    if (existingParent.length > 0) {
      return NextResponse.json(
        { success: false, error: "This email is already registered as a parent. A single email can only be used for one registration form." },
        { status: 409 }
      );
    }
    const [existingSchool]: any = await db.execute(
      `SELECT id FROM school_registrations WHERE official_email = ? OR principal_email = ? LIMIT 1`,
      [normalizedEmail, normalizedEmail]
    );
    if (existingSchool.length > 0) {
      return NextResponse.json(
        { success: false, error: "This email is already registered as a school. A single email can only be used for one registration form." },
        { status: 409 }
      );
    }

    // 3. Save teacher registration — every field null-safe
    const [result]: any = await db.execute(
      `INSERT INTO teacher_registrations (
        public_user_id,
        full_name, dob, gender, phone, email, address, state, pincode, father_name,
        qualification, other_qualification, subject, other_subject, experience,
        school_name, employee_id, salary_monthly, joining_date, employment_type,
        razorpay_order_id, razorpay_payment_id,
        payment_status, payment_amount, status,
        digilocker_client_id, masked_aadhaar, pan_number,
        aadhaar_local_pdf, pan_local_pdf
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        publicUserId          || null,
        str(formData.full_name),
        str(formData.dob),
        str(formData.gender),
        str(formData.phone),
        normalizedEmail,
        str(formData.address),
        str(formData.state),
        strOrNull(formData.pincode),
        strOrNull(formData.father_name),
        str(formData.qualification),
        strOrNull(formData.otherQualification),
        str(formData.subject),
        strOrNull(formData.otherSubject),
        str(formData.experience),
        str(formData.school_name),
        str(formData.employee_id),
        parseFloat(formData.salary_monthly) || 0,
        str(formData.joining_date),
        str(formData.employment_type),
        razorpay_order_id,
        razorpay_payment_id,
        "paid", 111.00, "pending",
        strOrNull(digilockerClientId),
        strOrNull(maskedAadhaar),
        strOrNull(panNumber),
        strOrNull(aadhaarLocalPdf),
        strOrNull(panLocalPdf),
      ]
    );

    const registrationId = result.insertId;

    // 4. Link digilocker session
    if (digilockerClientId) {
      try {
        await db.execute(
          `UPDATE digilocker_sessions SET teacher_registration_id = ?, session_type = 'teacher', updated_at = NOW() WHERE client_id = ?`,
          [registrationId, digilockerClientId]
        );
      } catch (e) { console.warn("Could not link digilocker session:", e); }
    }

    const subjectLabel = str(formData.subject) === "Other"
      ? str(formData.otherSubject, "Other")
      : str(formData.subject);
    const qualLabel = str(formData.qualification) === "Other"
      ? str(formData.otherQualification, "Other")
      : str(formData.qualification);

    // 5. Confirmation email to teacher
    try {
      await sendEmail(normalizedEmail, "teacherRegistrationConfirmation", {
        name: formData.full_name, registrationId,
        paymentId: razorpay_payment_id, school: formData.school_name,
        subject: subjectLabel, qualification: qualLabel,
        experience: formData.experience,
      });
    } catch (e) { console.error("Teacher confirmation email failed (non-fatal):", e); }

    // 6. Dashboard access email
    try {
      await sendEmail(normalizedEmail, "teacherDashboardAccess", {
        name: formData.full_name, registrationId,
        dashboardUrl: TEACHER_DASHBOARD_URL, email: normalizedEmail,
      });
    } catch (e) { console.error("Teacher dashboard access email failed (non-fatal):", e); }

    // 7. Admin alert
    try {
      await sendEmail("schoolfee.in@gmail.com", "teacherRegistrationAdminAlert", {
        name: formData.full_name, email: normalizedEmail,
        phone: formData.phone, registrationId,
        paymentId: razorpay_payment_id, school: formData.school_name,
        state: formData.state, subject: subjectLabel,
        employmentType: formData.employment_type,
      });
    } catch (e) { console.error("Admin email failed (non-fatal):", e); }

    return NextResponse.json({ success: true, registrationId, message: "Teacher registration submitted successfully" });
  } catch (error: any) {
    console.error("Teacher verify/save error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}