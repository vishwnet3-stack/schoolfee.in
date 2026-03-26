// app/api/public/razorpay-donation-verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const ADMIN_EMAIL         = "schoolfee.in@gmail.com";

// ── PAN is ONLY mandatory for donations STRICTLY ABOVE ₹2,000 ────────────────
// Exactly ₹2,000 does NOT require PAN.
// This matches Income Tax circular: PAN required only when donation EXCEEDS ₹2,000.
const PAN_MANDATORY_ABOVE = 2000; // strictly greater than

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

function generateReceiptNumber(donationId: number): string {
  const now = new Date();
  const fy  = now.getMonth() >= 3
    ? `${now.getFullYear()}-${now.getFullYear() + 1}`
    : `${now.getFullYear() - 1}-${now.getFullYear()}`;
  return `CHM-SFEE-${fy}-${String(donationId).padStart(6, "0")}`;
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip        = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "";

  let body: any;
  try { body = await request.json(); }
  catch { return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 }); }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, formData } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !formData) {
    return NextResponse.json({ success: false, error: "Missing required payment fields." }, { status: 400 });
  }

  // ── 1. Verify Razorpay HMAC signature ─────────────────────────────────────
  if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    try {
      await db.execute(
        `INSERT INTO donation_payment_attempts (razorpay_order_id, razorpay_payment_id, attempt_status, amount_paise, failure_reason, ip_address) VALUES (?,?,?,?,?,?)`,
        [razorpay_order_id, razorpay_payment_id, "tampered", 0, "Signature mismatch", ip]
      );
    } catch (_) {}
    return NextResponse.json({ success: false, error: "Payment verification failed. Possible tampering detected." }, { status: 400 });
  }

  // ── 2. Validate amount ─────────────────────────────────────────────────────
  const submittedAmountINR   = Number(formData.donationAmount);
  const submittedAmountPaise = submittedAmountINR * 100;

  if (!submittedAmountINR || submittedAmountINR < 100 || submittedAmountINR > 1_000_000) {
    return NextResponse.json({ success: false, error: "Invalid donation amount." }, { status: 400 });
  }

  // Optional: check against pre-stored expected amount (if order was pre-inserted)
  try {
    const [rows]: any = await db.execute(
      `SELECT expected_amount_paise FROM donations WHERE razorpay_order_id = ? AND payment_status = 'pending' LIMIT 1`,
      [razorpay_order_id]
    );
    if (rows.length > 0 && rows[0].expected_amount_paise !== null) {
      const expectedPaise = rows[0].expected_amount_paise;
      if (expectedPaise !== submittedAmountPaise) {
        return NextResponse.json({ success: false, error: "Donation amount mismatch. Transaction rejected." }, { status: 400 });
      }
    }
    // If no pre-existing record, we trust Razorpay's verified signature (fine)
  } catch (_) {
    // DB check failed non-fatally — continue
  }

  // ── 3. PAN validation ──────────────────────────────────────────────────────
  const panRaw   = str(formData.panNumber);
  const panValue = panRaw.length > 0 ? panRaw.toUpperCase() : null;

  // PAN mandatory ONLY when amount is STRICTLY MORE THAN ₹2,000 (i.e. >= ₹2,001)
  if (submittedAmountINR > PAN_MANDATORY_ABOVE && !panValue) {
    return NextResponse.json({
      success: false,
      error: `PAN number is required for donations above ₹${PAN_MANDATORY_ABOVE.toLocaleString("en-IN")} (Income Tax Section 80G).`,
    }, { status: 400 });
  }

  // Validate PAN format if provided
  if (panValue && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panValue)) {
    return NextResponse.json({
      success: false,
      error: "Invalid PAN format. Expected format: ABCDE1234F",
    }, { status: 400 });
  }

  // ── 4. Safe field extraction ───────────────────────────────────────────────
  const cityValue = str(formData.city) || str(formData.state) || "—";
  // Use empty string for pan if null — DB column will be altered to allow NULL/empty below
  const panDbValue = panValue ?? ""; // store empty string if no PAN (below ₹2,001)

  // ── 5. Save / upsert donation record ──────────────────────────────────────
  let donationId: number;
  try {
    const [existing]: any = await db.execute(
      `SELECT id FROM donations WHERE razorpay_order_id = ? LIMIT 1`, [razorpay_order_id]
    );

    if (existing.length > 0) {
      donationId = existing[0].id;
      await db.execute(
        `UPDATE donations SET
           razorpay_payment_id = ?, razorpay_signature = ?,
           payment_status = 'paid', verified_amount_paise = ?,
           payment_captured_at = NOW(), status = 'confirmed',
           pan_number = ?,
           first_name = ?, last_name = ?, email = ?, phone = ?,
           address = ?, city = ?, state = ?, pincode = ?,
           is_anonymous = ?, message = ?,
           organization_name = ?, organization_type = ?, gstin = ?,
           ip_address = ?, user_agent = ?
         WHERE id = ?`,
        [
          razorpay_payment_id, razorpay_signature, submittedAmountPaise,
          panDbValue,
          str(formData.firstName), str(formData.lastName), str(formData.email), str(formData.phone),
          str(formData.address), cityValue, str(formData.state), str(formData.pincode, "000000"),
          formData.isAnonymous ? 1 : 0, strOrNull(formData.message),
          strOrNull(formData.organizationName), str(formData.organizationType, "individual"), strOrNull(formData.gstin),
          ip, userAgent,
          donationId
        ]
      );
    } else {
      // Fresh INSERT — pan_number stored as empty string when not provided
      const [result]: any = await db.execute(
        `INSERT INTO donations (
           first_name, last_name, email, phone, pan_number,
           organization_name, organization_type, gstin,
           address, city, state, pincode,
           donation_amount, donation_purpose, is_anonymous, message,
           razorpay_order_id, razorpay_payment_id, razorpay_signature,
           payment_status, payment_captured_at,
           expected_amount_paise, verified_amount_paise,
           status, ip_address, user_agent
         ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),?,?,?,?,?)`,
        [
          str(formData.firstName),
          str(formData.lastName),
          str(formData.email),
          str(formData.phone),
          panDbValue,                                        // "" when no PAN — avoids NOT NULL error
          strOrNull(formData.organizationName),
          str(formData.organizationType, "individual"),
          strOrNull(formData.gstin),
          str(formData.address),
          cityValue,
          str(formData.state),
          str(formData.pincode, "000000"),
          submittedAmountINR,
          "General Fund - Schoolfee.org / CHM Initiative",
          formData.isAnonymous ? 1 : 0,
          strOrNull(formData.message),
          razorpay_order_id, razorpay_payment_id, razorpay_signature,
          "paid",
          submittedAmountPaise,
          submittedAmountPaise,
          "confirmed", ip, userAgent,
        ]
      );
      donationId = result.insertId;
    }
  } catch (dbError: any) {
    console.error("[Donation DB Error]", dbError?.message, dbError?.code);
    // Return detailed error in dev, generic in prod
    const msg = process.env.NODE_ENV === "development"
      ? `DB error: ${dbError?.message}`
      : "Failed to record donation. Please contact support.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }

  // ── 6. Generate receipt number & financial year ────────────────────────────
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

  // ── 7. Log successful attempt ──────────────────────────────────────────────
  try {
    await db.execute(
      `INSERT INTO donation_payment_attempts (donation_id, razorpay_order_id, razorpay_payment_id, attempt_status, amount_paise, ip_address) VALUES (?,?,?,?,?,?)`,
      [donationId, razorpay_order_id, razorpay_payment_id, "success", submittedAmountPaise, ip]
    );
  } catch (_) {}

  const donorName = `${str(formData.firstName)} ${str(formData.lastName)}`.trim() || "Donor";

  // ── 8. Email to donor (non-fatal) ──────────────────────────────────────────
  try {
    await sendEmail(formData.email, "donationConfirmation", {
      name: donorName, donationId, receiptNumber,
      paymentId: razorpay_payment_id, donationAmount: submittedAmountINR,
      financialYear: fy, panNumber: panValue || "N/A",
      address: str(formData.address), city: cityValue,
      state: str(formData.state), pincode: str(formData.pincode),
      organizationName: strOrNull(formData.organizationName),
      isAnonymous: !!formData.isAnonymous,
    });
  } catch (e) { console.error("Donor email failed (non-fatal):", e); }

  // ── 9. Admin notification (non-fatal) ─────────────────────────────────────
  try {
    await sendEmail(ADMIN_EMAIL, "donationAdminAlert", {
      name: donorName, email: str(formData.email), phone: str(formData.phone),
      donationId, receiptNumber, paymentId: razorpay_payment_id,
      donationAmount: submittedAmountINR, panNumber: panValue || "N/A",
      city: cityValue, state: str(formData.state),
      organizationName: strOrNull(formData.organizationName),
      organizationType: str(formData.organizationType, "individual"),
      isAnonymous: !!formData.isAnonymous,
    });
  } catch (e) { console.error("Admin email failed (non-fatal):", e); }

  return NextResponse.json({
    success: true,
    donationId,
    receiptNumber,
    financialYear: fy,
    message: "Donation recorded successfully. Thank you!",
  });
}

// ── PUT: Failure tracking (called by frontend when Razorpay reports failure) ──
export async function PUT(request: NextRequest) {
  const ip = getClientIP(request);
  try {
    const { razorpay_order_id, error_description, amount_paise } = await request.json();
    if (razorpay_order_id) {
      await db.execute(
        `UPDATE donations SET payment_status = 'failed', status = 'cancelled' WHERE razorpay_order_id = ?`,
        [razorpay_order_id]
      ).catch(() => {});
      await db.execute(
        `INSERT INTO donation_payment_attempts (razorpay_order_id, attempt_status, amount_paise, failure_reason, ip_address) VALUES (?,?,?,?,?)`,
        [razorpay_order_id, "failed", amount_paise || 0, error_description || "User-reported failure", ip]
      ).catch(() => {});
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}