import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import mysql from "mysql2/promise";
import crypto from "crypto";

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

async function ensureTables(db: mysql.Connection) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS donation_payments (
      id                    INT AUTO_INCREMENT PRIMARY KEY,
      receipt_number        VARCHAR(30)    UNIQUE NOT NULL,
      razorpay_order_id     VARCHAR(100)   UNIQUE,
      razorpay_payment_id   VARCHAR(100)   UNIQUE,
      razorpay_signature    VARCHAR(256),
      org_name              VARCHAR(255)   NOT NULL,
      org_type              VARCHAR(100),
      org_registration      VARCHAR(100),
      contact_name          VARCHAR(255)   NOT NULL,
      contact_designation   VARCHAR(100),
      contact_email         VARCHAR(255)   NOT NULL,
      contact_phone         VARCHAR(20)    NOT NULL,
      address_line1         VARCHAR(500),
      address_city          VARCHAR(100),
      address_state         VARCHAR(100),
      address_pincode       VARCHAR(10),
      address_country       VARCHAR(50)    DEFAULT 'India',
      amount                DECIMAL(12,2)  NOT NULL,
      currency              VARCHAR(10)    DEFAULT 'INR',
      donation_purpose      VARCHAR(255),
      donation_note         TEXT,
      pan_number            VARCHAR(10),
      consent_80g           TINYINT(1)     DEFAULT 0,
      status                ENUM('pending','processing','success','failed','refunded') DEFAULT 'pending',
      error_code            VARCHAR(100),
      error_description     TEXT,
      ip_address            VARCHAR(45),
      user_agent            VARCHAR(500),
      created_at            DATETIME       DEFAULT CURRENT_TIMESTAMP,
      paid_at               DATETIME       NULL,
      updated_at            DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email   (contact_email),
      INDEX idx_status  (status),
      INDEX idx_created (created_at),
      INDEX idx_ip      (ip_address),
      INDEX idx_order   (razorpay_order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS app_config (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      config_key   VARCHAR(100) UNIQUE NOT NULL,
      config_value TEXT,
      updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.query(`
    INSERT IGNORE INTO app_config (config_key, config_value) VALUES
    ('donation_min_amount', '11'),
    ('donation_max_amount', '500000')
  `);

  // Ensure existing rows also reflect the correct limits (idempotent)
  await db.query(`
    INSERT INTO app_config (config_key, config_value) VALUES
      ('donation_min_amount', '11'),
      ('donation_max_amount', '500000')
    ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)
  `);
}

function generateReceiptNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `SFD-${ymd}-${rand}`;
}

/**
 * POST /api/donate/create-order
 * Creates a Razorpay order. Amount is re-validated server-side — never trusted from client.
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

    const {
      org_name, org_type, org_registration,
      contact_name, contact_designation, contact_email, contact_phone,
      address_line1, address_city, address_state, address_pincode,
      amount, donation_purpose, donation_note,
      pan_number, consent_80g,
    } = body;

    await ensureTables(db);

    // ── Server-side re-validation of amount (fraud protection) ───────────────
    let minAmount = 11;
    let maxAmount = 500000;
    try {
      const [rows] = await db.query<any[]>(
        `SELECT config_key, config_value FROM app_config
         WHERE config_key IN ('donation_min_amount', 'donation_max_amount')`
      );
      for (const row of rows) {
        if (row.config_key === "donation_min_amount") minAmount = Number(row.config_value);
        if (row.config_key === "donation_max_amount") maxAmount = Number(row.config_value);
      }
    } catch {}

    const validatedAmount = Math.floor(Number(amount));
    if (!amount || isNaN(validatedAmount) || !isFinite(validatedAmount) || validatedAmount < minAmount || validatedAmount > maxAmount) {
      return NextResponse.json(
        { success: false, message: `Donation amount must be between ₹${minAmount.toLocaleString("en-IN")} and ₹${maxAmount.toLocaleString("en-IN")}.` },
        { status: 400 }
      );
    }

    // ── Required field validation ─────────────────────────────────────────────
    if (!org_name?.trim()) return NextResponse.json({ success: false, message: "Organization name is required." }, { status: 400 });
    if (!contact_name?.trim()) return NextResponse.json({ success: false, message: "Contact name is required." }, { status: 400 });
    if (!contact_email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email))
      return NextResponse.json({ success: false, message: "Valid email is required." }, { status: 400 });
    if (!contact_phone?.trim() || !/^[6-9]\d{9}$/.test(contact_phone))
      return NextResponse.json({ success: false, message: "Valid 10-digit mobile number is required." }, { status: 400 });
    if (pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan_number.toUpperCase()))
      return NextResponse.json({ success: false, message: "Invalid PAN number format." }, { status: 400 });

    // ── Check Razorpay credentials ────────────────────────────────────────────
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error("[create-order] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set in .env");
      return NextResponse.json(
        { success: false, message: "Payment gateway not configured. Please contact admin." },
        { status: 500 }
      );
    }

    // ── IP rate limiting ──────────────────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const ua = req.headers.get("user-agent") || "";

    try {
      const [rows] = await db.query<any[]>(
        `SELECT COUNT(*) AS cnt FROM donation_payments
         WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
        [ip]
      );
      if (Number(rows[0]?.cnt ?? 0) >= 10) {
        return NextResponse.json(
          { success: false, message: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    } catch {}

    // ── Create Razorpay order ─────────────────────────────────────────────────
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const receiptNumber = generateReceiptNumber();

    const rzpOrder = await rzp.orders.create({
      amount: Math.round(validatedAmount * 100), // paise
      currency: "INR",
      receipt: receiptNumber,
      notes: {
        org_name: org_name?.trim() || "",
        purpose: donation_purpose || "",
        pan: pan_number?.toUpperCase() || "",
        contact_email: contact_email?.trim() || "",
      },
    });

    // ── Save pending record to DB ─────────────────────────────────────────────
    const [result] = await db.query<any>(
      `INSERT INTO donation_payments (
        receipt_number, razorpay_order_id,
        org_name, org_type, org_registration,
        contact_name, contact_designation, contact_email, contact_phone,
        address_line1, address_city, address_state, address_pincode, address_country,
        amount, donation_purpose, donation_note,
        pan_number, consent_80g,
        status, ip_address, user_agent
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'pending',?,?)`,
      [
        receiptNumber, rzpOrder.id,
        org_name?.trim() || "", org_type || "", org_registration?.trim() || "",
        contact_name?.trim() || "", contact_designation?.trim() || "",
        contact_email?.trim() || "", contact_phone?.trim() || "",
        address_line1?.trim() || "", address_city?.trim() || "",
        address_state || "", address_pincode?.trim() || "", "India",
        validatedAmount, donation_purpose || "", donation_note?.trim() || "",
        pan_number?.toUpperCase() || "", consent_80g ? 1 : 0,
        ip, ua,
      ]
    );

    return NextResponse.json({
      success: true,
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: "INR",
      key_id: keyId,
      db_order_id: (result as any).insertId,
      receipt_number: receiptNumber,
    });
  } catch (err: any) {
    console.error("[/api/donate/create-order]", err);
    const msg = err?.error?.description || err?.message || "Failed to create payment order.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  } finally {
    await db.end();
  }
}