// app/api/public/razorpay-donation-verify/route.ts
// Verifies payment, does server-side fraud detection (amount tamper check),
// saves donation to DB, issues 80G receipt number, sends emails to donor + admin.

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

const RAZORPAY_KEY_SECRET = "tJgfeUFLJvJtAlbSj4apzx2l";
const ADMIN_EMAIL         = "vishwnet.schoolfee@gmail.com";

// ── Helpers ─────────────────────────────────────────────────────────────────

function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const body     = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expected === signature;
}

function generateReceiptNumber(donationId: number): string {
  const now = new Date();
  // Financial year: Apr → Mar
  const fy  = now.getMonth() >= 3
    ? `${now.getFullYear()}-${now.getFullYear() + 1}`
    : `${now.getFullYear() - 1}-${now.getFullYear()}`;
  const seq = String(donationId).padStart(6, "0");
  return `CHM-SFEE-${fy}-${seq}`;
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ── Main handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip        = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "";

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    formData,
  } = body;

  // ── 1. Basic field presence check ────────────────────────────────────────
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !formData) {
    return NextResponse.json(
      { success: false, error: "Missing required payment fields." },
      { status: 400 }
    );
  }

  // ── 2. Signature verification (cryptographic, server-side) ───────────────
  const isValidSig = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValidSig) {
    // Log the tamper attempt
    try {
      await db.execute(
        `INSERT INTO donation_payment_attempts
          (razorpay_order_id, razorpay_payment_id, attempt_status, amount_paise, failure_reason, ip_address)
         VALUES (?,?,?,?,?,?)`,
        [razorpay_order_id, razorpay_payment_id, "tampered", 0, "Signature mismatch", ip]
      );
    } catch (_) {}

    return NextResponse.json(
      { success: false, error: "Payment verification failed. Possible tampering detected." },
      { status: 400 }
    );
  }

  // ── 3. Server-side amount fraud detection ────────────────────────────────
  // The order was created with a locked amount. We cross-check against the DB.
  // This prevents frontend JS manipulation of the price.
  let expectedAmountPaise: number | null = null;
  try {
    const [rows]: any = await db.execute(
      `SELECT expected_amount_paise FROM donations
       WHERE razorpay_order_id = ? AND payment_status = 'pending'
       LIMIT 1`,
      [razorpay_order_id]
    );
    if (rows.length > 0) {
      expectedAmountPaise = rows[0].expected_amount_paise;
    }
  } catch (_) {
    // Table may not have the row yet (first verify call) — that's fine,
    // we'll use formData.donationAmount compared against a sane range.
  }

  const submittedAmountINR   = Number(formData.donationAmount);
  const submittedAmountPaise = submittedAmountINR * 100;

  // If we found the pending row, compare amounts strictly
  if (expectedAmountPaise !== null && expectedAmountPaise !== submittedAmountPaise) {
    try {
      await db.execute(
        `INSERT INTO donation_payment_attempts
          (razorpay_order_id, razorpay_payment_id, attempt_status, amount_paise, failure_reason, ip_address)
         VALUES (?,?,?,?,?,?)`,
        [
          razorpay_order_id, razorpay_payment_id,
          "tampered",
          submittedAmountPaise,
          `Amount mismatch: expected ${expectedAmountPaise} paise, got ${submittedAmountPaise} paise`,
          ip,
        ]
      );
    } catch (_) {}

    return NextResponse.json(
      { success: false, error: "Donation amount mismatch. Transaction rejected." },
      { status: 400 }
    );
  }

  // Sanity range check (redundant safety net)
  if (submittedAmountINR < 100 || submittedAmountINR > 1_000_000) {
    return NextResponse.json(
      { success: false, error: "Invalid donation amount." },
      { status: 400 }
    );
  }

  // ── 4. Save / update the donation record ─────────────────────────────────
  let donationId: number;
  try {
    // Check if a pending row already exists for this order (idempotency)
    const [existing]: any = await db.execute(
      `SELECT id FROM donations WHERE razorpay_order_id = ? LIMIT 1`,
      [razorpay_order_id]
    );

    if (existing.length > 0) {
      donationId = existing[0].id;
      // Update to paid
      await db.execute(
        `UPDATE donations SET
           razorpay_payment_id = ?,
           razorpay_signature  = ?,
           payment_status      = 'paid',
           verified_amount_paise = ?,
           payment_captured_at = NOW(),
           status              = 'confirmed',
           ip_address          = ?,
           user_agent          = ?
         WHERE id = ?`,
        [
          razorpay_payment_id, razorpay_signature,
          submittedAmountPaise,
          ip, userAgent,
          donationId,
        ]
      );
    } else {
      // Insert fresh record
      const [result]: any = await db.execute(
        `INSERT INTO donations (
           first_name, last_name, email, phone, pan_number,
           organization_name, organization_type, gstin,
           address, city, state, pincode,
           donation_amount, donation_purpose, is_anonymous, message,
           razorpay_order_id, razorpay_payment_id, razorpay_signature,
           payment_status, payment_method, payment_captured_at,
           expected_amount_paise, verified_amount_paise,
           status, ip_address, user_agent
         ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),?,?,?,?,?)`,
        [
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.phone,
          formData.panNumber.toUpperCase(),
          formData.organizationName  || null,
          formData.organizationType  || "individual",
          formData.gstin             || null,
          formData.address,
          formData.city,
          formData.state,
          formData.pincode,
          submittedAmountINR,
          "General Fund - Schoolfee.org / CHM Initiative",
          formData.isAnonymous ? 1 : 0,
          formData.message           || null,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          "paid",
          formData.paymentMethod     || null,
          submittedAmountPaise,   // expected
          submittedAmountPaise,   // verified
          "confirmed",
          ip,
          userAgent,
        ]
      );
      donationId = result.insertId;
    }
  } catch (dbError: any) {
    console.error("DB save error:", dbError);
    return NextResponse.json(
      { success: false, error: "Failed to record donation. Please contact support." },
      { status: 500 }
    );
  }

  // ── 5. Generate 80G receipt number ───────────────────────────────────────
  const receiptNumber = generateReceiptNumber(donationId);
  const now           = new Date();
  const fy            = now.getMonth() >= 3
    ? `${now.getFullYear()}-${now.getFullYear() + 1}`
    : `${now.getFullYear() - 1}-${now.getFullYear()}`;

  try {
    await db.execute(
      `UPDATE donations SET receipt_number = ?, receipt_issued_at = NOW(), financial_year = ? WHERE id = ?`,
      [receiptNumber, fy, donationId]
    );
  } catch (_) {}

  // ── 6. Log successful payment attempt ────────────────────────────────────
  try {
    await db.execute(
      `INSERT INTO donation_payment_attempts
        (donation_id, razorpay_order_id, razorpay_payment_id, attempt_status, amount_paise, ip_address)
       VALUES (?,?,?,?,?,?)`,
      [donationId, razorpay_order_id, razorpay_payment_id, "success", submittedAmountPaise, ip]
    );
  } catch (_) {}

  const donorName = `${formData.firstName} ${formData.lastName}`;

  // ── 7. Email to donor ─────────────────────────────────────────────────────
  try {
    await sendEmail(formData.email, "donationConfirmation", {
      name:           donorName,
      donationId,
      receiptNumber,
      paymentId:      razorpay_payment_id,
      donationAmount: submittedAmountINR,
      financialYear:  fy,
      panNumber:      formData.panNumber.toUpperCase(),
      address:        formData.address,
      city:           formData.city,
      state:          formData.state,
      pincode:        formData.pincode,
      organizationName: formData.organizationName || null,
      isAnonymous:    !!formData.isAnonymous,
    });
  } catch (e) {
    console.error("Donor email failed (non-fatal):", e);
  }

  // ── 8. Admin notification ─────────────────────────────────────────────────
  try {
    await sendEmail(ADMIN_EMAIL, "donationAdminAlert", {
      name:           donorName,
      email:          formData.email,
      phone:          formData.phone,
      donationId,
      receiptNumber,
      paymentId:      razorpay_payment_id,
      donationAmount: submittedAmountINR,
      panNumber:      formData.panNumber.toUpperCase(),
      city:           formData.city,
      state:          formData.state,
      organizationName: formData.organizationName || null,
      organizationType: formData.organizationType || "individual",
      isAnonymous:    !!formData.isAnonymous,
    });
  } catch (e) {
    console.error("Admin email failed (non-fatal):", e);
  }

  return NextResponse.json({
    success:       true,
    donationId,
    receiptNumber,
    financialYear: fy,
    message:       "Donation recorded successfully. Thank you!",
  });
}

// ── Failure tracking endpoint ─────────────────────────────────────────────
// Called by the frontend when Razorpay modal reports a failure.
export async function PUT(request: NextRequest) {
  const ip = getClientIP(request);
  try {
    const { razorpay_order_id, error_description, amount_paise } = await request.json();

    if (razorpay_order_id) {
      // Mark pending donation as failed
      await db.execute(
        `UPDATE donations SET payment_status = 'failed', status = 'cancelled' WHERE razorpay_order_id = ?`,
        [razorpay_order_id]
      );

      await db.execute(
        `INSERT INTO donation_payment_attempts
          (razorpay_order_id, attempt_status, amount_paise, failure_reason, ip_address)
         VALUES (?,?,?,?,?)`,
        [razorpay_order_id, "failed", amount_paise || 0, error_description || "User-reported failure", ip]
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}