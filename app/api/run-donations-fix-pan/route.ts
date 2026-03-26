// app/api/run-donations-fix-pan/route.ts
// Run ONCE via: GET /api/run-donations-fix-pan
// Fixes the donations table so pan_number allows NULL (PAN is only required > ₹2000)
// Also re-creates the table with the correct schema if it doesn't exist yet.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const results: string[] = [];
  const errors: string[] = [];

  // ── 1. Alter pan_number to allow NULL ─────────────────────────────────────
  try {
    await db.execute(
      `ALTER TABLE donations MODIFY COLUMN pan_number VARCHAR(10) NULL DEFAULT NULL`
    );
    results.push("✅ pan_number column altered to NULL DEFAULT NULL");
  } catch (e: any) {
    // If column already allows null or table doesn't exist yet, note it
    if (e.code === "ER_NO_SUCH_TABLE") {
      errors.push("⚠️  donations table does not exist yet — run /api/run-donations-migration first");
    } else {
      errors.push(`pan_number alter: ${e.message}`);
    }
  }

  // ── 2. Ensure donation_payment_attempts table exists ──────────────────────
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS donation_payment_attempts (
        id                  INT AUTO_INCREMENT PRIMARY KEY,
        donation_id         INT          NULL,
        razorpay_order_id   VARCHAR(100) NOT NULL,
        razorpay_payment_id VARCHAR(100) NULL,
        attempt_status      ENUM('initiated','success','failed','tampered') DEFAULT 'initiated',
        amount_paise        INT          NOT NULL DEFAULT 0,
        failure_reason      TEXT         NULL,
        ip_address          VARCHAR(45)  NULL,
        created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_order  (razorpay_order_id),
        INDEX idx_donate (donation_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push("✅ donation_payment_attempts table ensured");
  } catch (e: any) {
    errors.push(`attempts table: ${e.message}`);
  }

  // ── 3. Ensure donations table exists with correct schema ──────────────────
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS donations (
        id                     INT AUTO_INCREMENT PRIMARY KEY,
        first_name             VARCHAR(100) NOT NULL,
        last_name              VARCHAR(100) NOT NULL,
        email                  VARCHAR(200) NOT NULL,
        phone                  VARCHAR(15)  NOT NULL,
        pan_number             VARCHAR(10)  NULL DEFAULT NULL,
        organization_name      VARCHAR(200) NULL,
        organization_type      ENUM('individual','ngo','corporate','trust','government','other') DEFAULT 'individual',
        gstin                  VARCHAR(15)  NULL,
        address                TEXT         NOT NULL DEFAULT '',
        city                   VARCHAR(100) NOT NULL DEFAULT '',
        state                  VARCHAR(100) NOT NULL DEFAULT '',
        pincode                VARCHAR(6)   NOT NULL DEFAULT '000000',
        donation_amount        DECIMAL(12,2) NOT NULL,
        donation_purpose       VARCHAR(200) DEFAULT 'General Fund - Schoolfee.org / CHM Initiative',
        is_anonymous           TINYINT(1)   DEFAULT 0,
        message                TEXT         NULL,
        razorpay_order_id      VARCHAR(100) NULL,
        razorpay_payment_id    VARCHAR(100) NULL,
        razorpay_signature     VARCHAR(255) NULL,
        payment_status         ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
        payment_method         VARCHAR(50)  NULL,
        payment_captured_at    TIMESTAMP    NULL,
        expected_amount_paise  INT          NOT NULL DEFAULT 0,
        verified_amount_paise  INT          NULL,
        receipt_number         VARCHAR(50)  NULL,
        receipt_issued_at      TIMESTAMP    NULL,
        financial_year         VARCHAR(9)   NULL,
        status                 ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
        admin_notes            TEXT         NULL,
        ip_address             VARCHAR(45)  NULL,
        user_agent             TEXT         NULL,
        created_at             TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        updated_at             TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email          (email),
        INDEX idx_payment_status (payment_status),
        INDEX idx_razorpay_order (razorpay_order_id),
        INDEX idx_receipt        (receipt_number),
        INDEX idx_created        (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push("✅ donations table ensured (with pan_number NULL)");
  } catch (e: any) {
    errors.push(`donations table create: ${e.message}`);
  }

  return NextResponse.json({
    success: errors.length === 0,
    results,
    errors,
    message: errors.length === 0
      ? "All fixes applied. Donations should now work for any amount."
      : "Some steps had issues — check errors array.",
  });
}