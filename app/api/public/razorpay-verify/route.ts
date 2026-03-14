// app/api/public/razorpay-verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

// ── Must match key_secret in razorpay-order/route.ts ──────────────────────
const RAZORPAY_KEY_SECRET = "tJgfeUFLJvJtAlbSj4apzx2l";  // ✅ Your Test Secret

function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const body     = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body).digest("hex");
  return expected === signature;
}

/**
 * Downloads a PDF from a remote URL and saves it to the server's
 * private uploads directory. Returns the relative path for DB storage.
 * The file is NOT served publicly — only admins can access it via
 * /api/dashboard/apaar-doc?file=...
 */
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
    // Save to /private-uploads/apaar/ — NOT inside /public so it's inaccessible to browser
    const uploadDir = path.join(process.cwd(), "private-uploads", "apaar");
    fs.mkdirSync(uploadDir, { recursive: true });
    const filename = `apaar_reg${registrationId}_child${childIndex}_${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);
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

    // ── 1. Verify signature ───────────────────────────────────────────────
    const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 });
    }

    // ── 2. Load parent DigiLocker session data if available ───────────────
    let parentMaskedAadhaar: string | null = null;
    let parentAadhaarLocalPdf: string | null = null;

    if (parentDigilockerClientId) {
      try {
        const [digiRows]: any = await db.execute(
          `SELECT aadhaar_masked_number, aadhaar_local_pdf FROM digilocker_sessions WHERE client_id = ? LIMIT 1`,
          [parentDigilockerClientId]
        );
        if (digiRows?.length) {
          parentMaskedAadhaar    = digiRows[0].aadhaar_masked_number || null;
          parentAadhaarLocalPdf  = digiRows[0].aadhaar_local_pdf     || null;
        }
      } catch (e) {
        console.warn("[RazorpayVerify] DigiLocker session lookup warn:", e);
      }
    }

    // Support both old shape (firstName/lastName) and new shape (full_name)
    let firstName = formData.firstName || "";
    let lastName  = formData.lastName  || "";
    if (!firstName && formData.full_name) {
      const parts = (formData.full_name as string).trim().split(/\s+/);
      firstName = parts[0] || "";
      lastName  = parts.slice(1).join(" ") || "";
    }

    // ── 3. Save registration ──────────────────────────────────────────────
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
        publicUserId || null,
        firstName, lastName, formData.email,
        formData.phone, formData.panNumber,
        formData.address, formData.city || null, formData.state,
        parseFloat(formData.feeAmount), formData.feePeriod,
        formData.reasonForSupport, formData.otherReason || null,
        formData.description, parseInt(formData.repaymentDuration),
        razorpay_order_id, razorpay_payment_id,
        "paid", 11.00, "pending",
        parentDigilockerClientId || null,
        parentMaskedAadhaar,
        parentAadhaarLocalPdf,
        parentDigilockerClientId ? new Date() : null,
      ]
    );

    const registrationId = result.insertId;

    // ── 4. Save children with APAAR doc ──────────────────────────────────
    const childrenToInsert = formData.children.slice(0, formData.numberOfChildren);
    for (let i = 0; i < childrenToInsert.length; i++) {
      const c = childrenToInsert[i];

      // Download & store APAAR PDF locally (admin-only access)
      let apaarDocPath: string | null = null;
      if (c.apaarDocUrl) {
        apaarDocPath = await downloadAndSaveApaarPdf(c.apaarDocUrl, registrationId, i + 1);
        if (apaarDocPath) {
          console.log(`[APAAR] Saved PDF for child ${i + 1}: ${apaarDocPath}`);
        }
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
          registrationId, i + 1,
          c.fullName, c.classGrade,
          c.admissionNumber, c.schoolName, c.schoolCity,
          c.apaarId || c.manualApaarId || null,
          c.apaarId || c.manualApaarId || null,
          c.apaarLocalPdf || apaarDocPath || null,
          c.digilockerClientId || null,
          c.digilockerVerified ? 1 : 0,
          c.digilockerFullName || null,
          c.docGender || null,
          c.docDob || null,
          apaarDocPath,
          c.apaarDocUrl || null,
        ]
      );

      // Link digilocker session to this registration
      if (c.digilockerClientId) {
        try {
          await db.execute(
            `UPDATE digilocker_sessions SET registration_child_id = ? WHERE client_id = ?`,
            [registrationId, c.digilockerClientId]
          );
        } catch {}
      }
    }

    // ── 5. Email to parent ────────────────────────────────────────────────
    try {
      await sendEmail(formData.email, "parentRegistrationConfirmation", {
        name: `${firstName} ${lastName}`.trim(),
        registrationId, paymentId: razorpay_payment_id,
        feeAmount: formData.feeAmount, feePeriod: formData.feePeriod,
        numberOfChildren: formData.numberOfChildren,
        children: childrenToInsert,
      });
    } catch (e) { console.error("Parent email failed (non-fatal):", e); }

    // ── 5. Admin alert ────────────────────────────────────────────────────
    try {
      await sendEmail("vishwnet.schoolfee@gmail.com", "parentRegistrationAdminAlert", {
        name: `${firstName} ${lastName}`.trim(),
        email: formData.email, phone: formData.phone,
        registrationId, paymentId: razorpay_payment_id,
        feeAmount: formData.feeAmount, numberOfChildren: formData.numberOfChildren,
        city: formData.city, state: formData.state,
      });
    } catch (e) { console.error("Admin email failed (non-fatal):", e); }

    return NextResponse.json({ success: true, registrationId, message: "Registration submitted successfully" });
  } catch (error: any) {
    console.error("Verify/save error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}