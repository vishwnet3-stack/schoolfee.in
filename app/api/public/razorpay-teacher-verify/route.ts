// app/api/public/razorpay-teacher-verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

const RAZORPAY_KEY_SECRET = "tJgfeUFLJvJtAlbSj4apzx2l";
const TEACHER_DASHBOARD_URL = "https://schoolfee.in/dashboard/admin/login";

function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const body     = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expected === signature;
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
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // 1b. Duplicate email check across all registration tables
    const normalizedEmail = (formData.email || "").toLowerCase().trim();

    const [existingTeacher]: any = await db.execute(
      `SELECT id FROM teacher_registrations WHERE email = ? LIMIT 1`,
      [normalizedEmail]
    );
    if (existingTeacher.length > 0) {
      return NextResponse.json(
        { success: false, error: "This email is already registered as a teacher." },
        { status: 409 }
      );
    }

    const [existingParent]: any = await db.execute(
      `SELECT id FROM parent_registrations WHERE email = ? LIMIT 1`,
      [normalizedEmail]
    );
    if (existingParent.length > 0) {
      return NextResponse.json(
        { success: false, error: "This email is already registered as a parent. A single email can only be used for one registration form." },
        { status: 409 }
      );
    }

    // school_registrations uses official_email / principal_email — not a generic "email" column
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

    // 2. Save teacher registration
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
        publicUserId || null,
        formData.full_name,
        formData.dob,
        formData.gender,
        formData.phone,
        normalizedEmail,
        formData.address,
        formData.state,
        formData.pincode || null,
        formData.father_name || null,
        formData.qualification,
        formData.otherQualification || null,
        formData.subject,
        formData.otherSubject || null,
        formData.experience,
        formData.school_name,
        formData.employee_id,
        parseFloat(formData.salary_monthly),
        formData.joining_date,
        formData.employment_type,
        razorpay_order_id,
        razorpay_payment_id,
        "paid",
        111.00,
        "pending",
        digilockerClientId  || null,
        maskedAadhaar       || null,
        panNumber           || null,
        aadhaarLocalPdf     || null,
        panLocalPdf         || null,
      ]
    );

    const registrationId = result.insertId;

    // 3. Link digilocker_session to this registration
    if (digilockerClientId) {
      try {
        await db.execute(
          `UPDATE digilocker_sessions SET teacher_registration_id = ?, session_type = 'teacher', updated_at = NOW() WHERE client_id = ?`,
          [registrationId, digilockerClientId]
        );
      } catch (e) {
        console.warn("Could not link digilocker session:", e);
      }
    }

    // 4. Registration confirmation email to teacher
    try {
      await sendEmail(normalizedEmail, "teacherRegistrationConfirmation", {
        name:           formData.full_name,
        registrationId,
        paymentId:      razorpay_payment_id,
        school:         formData.school_name,
        subject:        formData.subject === "Other" ? formData.otherSubject : formData.subject,
        qualification:  formData.qualification === "Other" ? formData.otherQualification : formData.qualification,
        experience:     formData.experience,
      });
    } catch (e) { console.error("Teacher confirmation email failed (non-fatal):", e); }

    // 5. Dashboard access email to teacher
    try {
      await sendEmail(normalizedEmail, "teacherDashboardAccess", {
        name:           formData.full_name,
        registrationId,
        dashboardUrl:   TEACHER_DASHBOARD_URL,
        email:          normalizedEmail,
      });
    } catch (e) { console.error("Teacher dashboard access email failed (non-fatal):", e); }

    // 6. Admin alert
    try {
      await sendEmail("vishwnet.schoolfee@gmail.com", "teacherRegistrationAdminAlert", {
        name:           formData.full_name,
        email:          normalizedEmail,
        phone:          formData.phone,
        registrationId,
        paymentId:      razorpay_payment_id,
        school:         formData.school_name,
        state:          formData.state,
        subject:        formData.subject === "Other" ? formData.otherSubject : formData.subject,
        employmentType: formData.employment_type,
      });
    } catch (e) { console.error("Admin email failed (non-fatal):", e); }

    return NextResponse.json({
      success: true,
      registrationId,
      message: "Teacher registration submitted successfully",
    });
  } catch (error: any) {
    console.error("Teacher verify/save error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}