// app/api/public/razorpay-school-verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

// ── Secret loaded from .env — change only .env to switch test ↔ live
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, formData, publicUserId } = body;

    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 });
    }

    const cityValue = str(formData.city) || str(formData.state) || "—";
    const board     = str(formData.affiliation_board) === "Other"
      ? str(formData.otherAffiliationBoard, "Other")
      : str(formData.affiliation_board);

    const [result]: any = await db.execute(
      `INSERT INTO school_registrations (
        public_user_id,
        school_name, school_type, established_year,
        affiliation_board, other_affiliation_board, affiliation_id,
        school_address, city, state, pincode,
        contact_number, alternate_contact, official_email, website_url,
        principal_name, principal_email, principal_contact,
        total_students, total_teachers, infrastructure_details,
        razorpay_order_id, razorpay_payment_id,
        payment_status, payment_amount, status
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        publicUserId || null,
        str(formData.school_name),
        str(formData.school_type),
        parseInt(formData.established_year) || 2000,
        str(formData.affiliation_board),
        strOrNull(formData.otherAffiliationBoard),
        str(formData.affiliation_id),
        str(formData.school_address),
        cityValue,
        str(formData.state),
        str(formData.pincode, "000000"),
        str(formData.contact_number),
        strOrNull(formData.alternate_contact),
        str(formData.official_email),
        strOrNull(formData.website_url),
        str(formData.principal_name),
        str(formData.principal_email),
        str(formData.principal_contact),
        parseInt(formData.total_students) || 0,
        parseInt(formData.total_teachers) || 0,
        strOrNull(formData.infrastructure_details),
        razorpay_order_id,
        razorpay_payment_id,
        "paid", 1111.00, "pending",
      ]
    );

    const registrationId = result.insertId;

    try {
      await sendEmail(formData.official_email, "schoolRegistrationConfirmation", {
        schoolName: formData.school_name, registrationId,
        paymentId: razorpay_payment_id, principalName: formData.principal_name,
        board, city: cityValue, state: formData.state,
      });
    } catch (e) { console.error("School confirmation email failed (non-fatal):", e); }

    try {
      await sendEmail("schoolfee.in@gmail.com", "schoolRegistrationAdminAlert", {
        schoolName: formData.school_name, schoolType: formData.school_type,
        registrationId, paymentId: razorpay_payment_id,
        principalName: formData.principal_name, email: formData.official_email,
        phone: formData.contact_number, city: cityValue,
        state: formData.state, board, totalStudents: formData.total_students,
      });
    } catch (e) { console.error("Admin email failed (non-fatal):", e); }

    return NextResponse.json({ success: true, registrationId, message: "School registration submitted successfully" });
  } catch (error: any) {
    console.error("School verify/save error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}