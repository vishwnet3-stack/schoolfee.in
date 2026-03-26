// app/api/public/razorpay-verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

// ── Secret loaded from .env — change only .env to switch test ↔ live
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const body     = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body).digest("hex");
  return expected === signature;
}

/** Safely coerce any value to a non-empty string, or return the fallback */
function str(val: any, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  const s = String(val).trim();
  return s.length > 0 ? s : fallback;
}

/** Safely coerce to string | null */
function strOrNull(val: any): string | null {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  return s.length > 0 ? s : null;
}

async function downloadAndSaveApaarPdf(
  pdfUrl: string,
  registrationId: number,
  childIndex: number
): Promise<string | null> {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      console.error(`[APAAR] Failed to download PDF: ${response.status}`);
      return null;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "private-uploads", "apaar");
    fs.mkdirSync(uploadDir, { recursive: true });
    const filename = `apaar_reg${registrationId}_child${childIndex}_${Date.now()}.pdf`;
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    return `apaar/${filename}`;
  } catch (err) {
    console.error("[APAAR] Error saving PDF:", err);
    return null;
  }
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
      parentDigilockerClientId,
    } = body;

    // ── 1. Verify Razorpay signature ─────────────────────────────────────
    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 });
    }

    // ── 2. Load parent DigiLocker session data ────────────────────────────
    let parentMaskedAadhaar: string | null = null;
    let parentAadhaarLocalPdf: string | null = null;

    if (parentDigilockerClientId) {
      try {
        const [digiRows]: any = await db.execute(
          `SELECT aadhaar_masked_number, aadhaar_local_pdf FROM digilocker_sessions WHERE client_id = ? LIMIT 1`,
          [parentDigilockerClientId]
        );
        if (digiRows?.length) {
          parentMaskedAadhaar   = digiRows[0].aadhaar_masked_number || null;
          parentAadhaarLocalPdf = digiRows[0].aadhaar_local_pdf     || null;
        }
      } catch (e) {
        console.warn("[RazorpayVerify] DigiLocker session lookup warn:", e);
      }
    }

    // ── 3. Derive safe field values ───────────────────────────────────────
    // Split full_name into first / last (supports both old and new form shape)
    let firstName = str(formData.firstName);
    let lastName  = str(formData.lastName);
    if (!firstName && formData.full_name) {
      const parts = str(formData.full_name).split(/\s+/).filter(Boolean);
      firstName = parts[0]            || "";
      lastName  = parts.slice(1).join(" ") || "";
    }
    // Ensure first_name is never blank (NOT NULL in DB)
    if (!firstName) firstName = str(formData.full_name, "Unknown");

    // city: parent form has no city field — derive from state or address
    const cityValue = str(formData.city) || str(formData.state) || "—";

    // pan_number: NULL is fine (column is nullable after migration)
    const panNumber = strOrNull(formData.panNumber);

    // ── 4. Save parent registration ───────────────────────────────────────
    const [result]: any = await db.execute(
      `INSERT INTO parent_registrations (
        public_user_id,
        first_name, last_name, email, phone, pan_number,
        address, city, state,
        fee_amount, fee_period,
        reason_for_support, other_reason, description, repayment_duration,
        razorpay_order_id, razorpay_payment_id,
        payment_status, payment_amount, status,
        digilocker_client_id, masked_aadhaar, aadhaar_local_pdf,
        digilocker_verified_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        publicUserId   || null,
        firstName,
        lastName,
        str(formData.email),
        str(formData.phone),
        panNumber,
        str(formData.address),
        cityValue,
        str(formData.state),
        parseFloat(formData.feeAmount)      || 0,
        str(formData.feePeriod),
        str(formData.reasonForSupport),
        strOrNull(formData.otherReason),
        str(formData.description),
        parseInt(formData.repaymentDuration) || 0,
        razorpay_order_id,
        razorpay_payment_id,
        "paid", 11.00, "pending",
        strOrNull(parentDigilockerClientId),
        parentMaskedAadhaar,
        parentAadhaarLocalPdf,
        parentDigilockerClientId ? new Date() : null,
      ]
    );

    const registrationId = result.insertId;

    // ── 5. Save children ──────────────────────────────────────────────────
    const childrenToInsert = (formData.children || []).slice(0, formData.numberOfChildren || 1);
    for (let i = 0; i < childrenToInsert.length; i++) {
      const c = childrenToInsert[i];

      let apaarDocPath: string | null = null;
      if (c.apaarDocUrl) {
        apaarDocPath = await downloadAndSaveApaarPdf(c.apaarDocUrl, registrationId, i + 1);
        if (apaarDocPath) console.log(`[APAAR] Saved PDF for child ${i + 1}: ${apaarDocPath}`);
      }

      await db.execute(
        `INSERT INTO parent_registration_children
          (registration_id, child_index, full_name, class_grade,
           admission_number, school_name, school_city, apaar_id,
           apaar_id_number, apaar_doc_local_path,
           digilocker_client_id, digilocker_verified,
           digilocker_full_name, doc_gender, doc_dob,
           apaar_doc_path, apaar_doc_url)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          registrationId,
          i + 1,
          str(c.fullName),
          str(c.classGrade),
          str(c.admissionNumber),
          str(c.schoolName),
          str(c.schoolCity),
          strOrNull(c.apaarId)         || strOrNull(c.manualApaarId),
          strOrNull(c.apaarId)         || strOrNull(c.manualApaarId),
          strOrNull(c.apaarLocalPdf)   || apaarDocPath,
          strOrNull(c.digilockerClientId),
          c.digilockerVerified ? 1 : 0,
          strOrNull(c.digilockerFullName),
          strOrNull(c.docGender),
          strOrNull(c.docDob),
          apaarDocPath,
          strOrNull(c.apaarDocUrl),
        ]
      );

      if (c.digilockerClientId) {
        try {
          await db.execute(
            `UPDATE digilocker_sessions SET registration_child_id = ? WHERE client_id = ?`,
            [registrationId, c.digilockerClientId]
          );
        } catch {}
      }
    }

    // ── 6. Confirmation email to parent ───────────────────────────────────
    try {
      await sendEmail(formData.email, "parentRegistrationConfirmation", {
        name: `${firstName} ${lastName}`.trim(),
        registrationId,
        paymentId: razorpay_payment_id,
        feeAmount: formData.feeAmount,
        feePeriod: formData.feePeriod,
        numberOfChildren: formData.numberOfChildren,
        children: childrenToInsert,
      });
    } catch (e) { console.error("Parent email failed (non-fatal):", e); }

    // ── 7. Admin alert ────────────────────────────────────────────────────
    try {
      await sendEmail("schoolfee.in@gmail.com", "parentRegistrationAdminAlert", {
        name: `${firstName} ${lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        registrationId,
        paymentId: razorpay_payment_id,
        feeAmount: formData.feeAmount,
        numberOfChildren: formData.numberOfChildren,
        city: cityValue,
        state: formData.state,
      });
    } catch (e) { console.error("Admin email failed (non-fatal):", e); }

    return NextResponse.json({ success: true, registrationId, message: "Registration submitted successfully" });
  } catch (error: any) {
    console.error("Verify/save error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}