import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

async function getDb() {
  return mysql.createConnection({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    ssl: process.env.DB_HOST !== "localhost" ? { rejectUnauthorized: false } : undefined,
  });
}

function getMailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

function buildReceiptData(row: any) {
  const address = [row.address_line1, row.address_city, row.address_state, row.address_pincode, "India"]
    .filter(Boolean).join(", ");
  return {
    receipt_number: row.receipt_number,
    payment_id: row.razorpay_payment_id,
    order_id: row.razorpay_order_id,
    org_name: row.org_name,
    contact_name: row.contact_name,
    contact_email: row.contact_email,
    contact_phone: row.contact_phone,
    pan_number: row.pan_number || "",
    donation_amount: Number(row.amount),
    donation_purpose: row.donation_purpose || "",
    donation_note: row.donation_note || "",
    address,
    paid_at: row.paid_at || new Date().toISOString(),
    is_80g_eligible: !!row.consent_80g,
  };
}

// ── Email: donor receipt ───────────────────────────────────────────────────────
async function sendDonorEmail(r: ReturnType<typeof buildReceiptData>) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  const mailer = getMailer();
  const paidDate = new Date(r.paid_at).toLocaleString("en-IN", {
    dateStyle: "long", timeStyle: "short",
  });
  const fromName = process.env.SMTP_FROM_NAME || "Schoolfee.in";
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  await mailer.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: r.contact_email,
    subject: `✅ Donation Receipt ${r.receipt_number} — ${fmtINR(r.donation_amount)} | Schoolfee.in`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
        <div style="background:linear-gradient(135deg,#001f4d,#00468E);padding:28px 32px;border-radius:12px 12px 0 0;">
          <p style="color:#fff;font-size:20px;font-weight:700;margin:0;">Schoolfee.in</p>
          <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:4px 0 0;">Official Donation Receipt</p>
        </div>
        <div style="background:#ecfdf5;padding:14px 32px;border-bottom:1px solid #d1fae5;">
          <p style="color:#065f46;font-weight:600;font-size:14px;margin:0;">✓ Donation Received · ${paidDate}</p>
        </div>
        <div style="padding:28px 32px;background:#f8faff;text-align:center;border-bottom:1px solid #e8edf5;">
          <p style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Total Donated</p>
          <p style="font-size:40px;font-weight:800;color:#00468E;margin:0;">${fmtINR(r.donation_amount)}</p>
        </div>
        <div style="padding:24px 32px;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            ${[
              ["Receipt Number", r.receipt_number],
              ["Payment ID", r.payment_id],
              ["Organization", r.org_name],
              ["Contact Person", r.contact_name],
              ["Email", r.contact_email],
              ["Phone", r.contact_phone],
              ...(r.pan_number ? [["PAN", r.pan_number]] : []),
              ["Purpose", r.donation_purpose],
              ["Address", r.address],
            ].map(([l, v]) => `
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:8px 0;color:#6b7280;width:140px;vertical-align:top;">${l}</td>
                <td style="padding:8px 0;color:#111827;font-weight:500;">${v}</td>
              </tr>
            `).join("")}
          </table>
          ${r.is_80g_eligible ? `
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;margin-top:20px;">
            <p style="color:#92400e;font-weight:700;font-size:13px;margin:0 0 4px;">80G Tax Exemption Applicable</p>
            <p style="color:#b45309;font-size:12px;margin:0;">Your 80G certificate will be sent to this email within 7 working days.</p>
          </div>` : ""}
          <p style="text-align:center;font-size:10px;color:#9ca3af;margin-top:24px;padding-top:16px;border-top:1px solid #f3f4f6;">
            Computer-generated receipt · Legally valid without signature<br/>
            Schoolfee Technologies Pvt. Ltd. · support@schoolfee.in
          </p>
        </div>
      </div>
    `,
  });
}

// ── Email: admin notification ──────────────────────────────────────────────────
async function sendAdminEmail(r: ReturnType<typeof buildReceiptData>) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  const mailer = getMailer();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@schoolfee.in";
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  await mailer.sendMail({
    from: `"Schoolfee Donations" <${fromEmail}>`,
    to: adminEmail,
    subject: `🎉 New Donation: ${fmtINR(r.donation_amount)} from ${r.org_name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;">
        <div style="background:#001f4d;padding:20px 24px;border-radius:8px 8px 0 0;">
          <p style="color:#fff;font-size:18px;font-weight:700;margin:0;">💰 New Donation Received</p>
        </div>
        <div style="background:#ecfdf5;padding:14px 24px;border-left:4px solid #10b981;">
          <span style="color:#065f46;font-size:22px;font-weight:800;">${fmtINR(r.donation_amount)}</span>
          <span style="color:#059669;font-size:13px;margin-left:10px;">Payment Verified ✓</span>
        </div>
        <div style="padding:20px 24px;background:#fff;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            ${[
              ["Receipt No.", r.receipt_number],
              ["Payment ID", r.payment_id],
              ["Organization", r.org_name],
              ["Contact", r.contact_name],
              ["Email", r.contact_email],
              ["Phone", r.contact_phone],
              ["Purpose", r.donation_purpose],
              ["80G Requested", r.is_80g_eligible ? "Yes" : "No"],
            ].map(([l, v]) => `
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:8px 0;color:#6b7280;width:130px;">${l}</td>
                <td style="padding:8px 0;color:#111827;font-weight:500;">${v}</td>
              </tr>
            `).join("")}
          </table>
        </div>
      </div>
    `,
  });
}

/**
 * POST /api/donate/verify-payment
 * Verifies Razorpay HMAC signature, updates DB, sends emails.
 */
export async function POST(req: NextRequest) {
  const db = await getDb();
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, db_order_id } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification parameters." },
        { status: 400 }
      );
    }

    // ── CRITICAL: Verify Razorpay HMAC-SHA256 signature ──────────────────────
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("[verify-payment] RAZORPAY_KEY_SECRET not configured");
      return NextResponse.json({ success: false, message: "Payment gateway not configured." }, { status: 500 });
    }

    const expectedSig = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      console.error("[FRAUD ALERT] Signature mismatch", { razorpay_order_id, razorpay_payment_id });
      if (db_order_id) {
        await db.query(
          `UPDATE donation_payments SET status='failed', error_code='SIGNATURE_MISMATCH',
           error_description='Payment signature verification failed', updated_at=NOW() WHERE id=?`,
          [db_order_id]
        ).catch(() => {});
      }
      return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 400 });
    }

    // ── Fetch DB record ───────────────────────────────────────────────────────
    const [rows] = await db.query<any[]>(
      `SELECT * FROM donation_payments WHERE id=? AND razorpay_order_id=? LIMIT 1`,
      [db_order_id, razorpay_order_id]
    );
    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    const row = rows[0];

    // Idempotency — already processed
    if (row.status === "success") {
      return NextResponse.json({ success: true, receipt: buildReceiptData(row) });
    }

    // ── Mark success in DB ────────────────────────────────────────────────────
    await db.query(
      `UPDATE donation_payments SET
        razorpay_payment_id=?, razorpay_signature=?,
        status='success', paid_at=NOW(), updated_at=NOW()
       WHERE id=?`,
      [razorpay_payment_id, razorpay_signature, db_order_id]
    );

    const updatedRow = { ...row, razorpay_payment_id, razorpay_signature, paid_at: new Date().toISOString() };
    const receipt = buildReceiptData(updatedRow);

    // ── Send emails (non-blocking) ────────────────────────────────────────────
    Promise.all([
      sendDonorEmail(receipt).catch(e => console.error("[EMAIL] Donor:", e?.message)),
      sendAdminEmail(receipt).catch(e => console.error("[EMAIL] Admin:", e?.message)),
    ]);

    return NextResponse.json({ success: true, receipt });
  } catch (err: any) {
    console.error("[/api/donate/verify-payment]", err);
    return NextResponse.json(
      { success: false, message: "Payment verification failed. Contact support@schoolfee.in" },
      { status: 500 }
    );
  } finally {
    await db.end();
  }
}