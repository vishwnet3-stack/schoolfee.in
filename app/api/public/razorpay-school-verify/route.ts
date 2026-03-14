// app/api/public/razorpay-school-verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

const RAZORPAY_KEY_SECRET = "tJgfeUFLJvJtAlbSj4apzx2l"; // ✅ Must match order route

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
    } = body;

    // ── 1. Verify Razorpay signature ──────────────────────────────────────
    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // ── 2. Save school registration ───────────────────────────────────────
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
        formData.school_name,
        formData.school_type,
        parseInt(formData.established_year),
        formData.affiliation_board,
        formData.otherAffiliationBoard || null,
        formData.affiliation_id,
        formData.school_address,
        formData.city,
        formData.state,
        formData.pincode,
        formData.contact_number,
        formData.alternate_contact || null,
        formData.official_email,
        formData.website_url || null,
        formData.principal_name,
        formData.principal_email,
        formData.principal_contact,
        parseInt(formData.total_students),
        parseInt(formData.total_teachers),
        formData.infrastructure_details || null,
        razorpay_order_id,
        razorpay_payment_id,
        "paid",
        1111.00,
        "pending",
      ]
    );

    const registrationId = result.insertId;

    // ── 3. Confirmation email to school ───────────────────────────────────
    try {
      await sendEmail(formData.official_email, "schoolRegistrationConfirmation", {
        schoolName:    formData.school_name,
        registrationId,
        paymentId:     razorpay_payment_id,
        principalName: formData.principal_name,
        board:         formData.affiliation_board === "Other"
                         ? formData.otherAffiliationBoard
                         : formData.affiliation_board,
        city:          formData.city,
        state:         formData.state,
      });
    } catch (e) { console.error("School confirmation email failed (non-fatal):", e); }

    // ── 4. Admin alert ────────────────────────────────────────────────────
    try {
      await sendEmail("vishwnet.schoolfee@gmail.com", "schoolRegistrationAdminAlert", {
        schoolName:    formData.school_name,
        schoolType:    formData.school_type,
        registrationId,
        paymentId:     razorpay_payment_id,
        principalName: formData.principal_name,
        email:         formData.official_email,
        phone:         formData.contact_number,
        city:          formData.city,
        state:         formData.state,
        board:         formData.affiliation_board === "Other"
                         ? formData.otherAffiliationBoard
                         : formData.affiliation_board,
        totalStudents: formData.total_students,
      });
    } catch (e) { console.error("Admin email failed (non-fatal):", e); }

    return NextResponse.json({
      success: true,
      registrationId,
      message: "School registration submitted successfully",
    });
  } catch (error: any) {
    console.error("School verify/save error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}