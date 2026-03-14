// app/api/run-donations-migration/route.ts
// Call once: GET /api/run-donations-migration
// (identical pattern to run-parent-registration-migration)

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // ── 1. Main donations table ─────────────────────────────────────────────
    await db.execute(`
      CREATE TABLE IF NOT EXISTS donations (
        id                     INT AUTO_INCREMENT PRIMARY KEY,

        first_name             VARCHAR(100) NOT NULL,
        last_name              VARCHAR(100) NOT NULL,
        email                  VARCHAR(200) NOT NULL,
        phone                  VARCHAR(15)  NOT NULL,
        pan_number             VARCHAR(10)  NOT NULL,

        organization_name      VARCHAR(200) NULL,
        organization_type      ENUM('individual','ngo','corporate','trust','government','other') DEFAULT 'individual',
        gstin                  VARCHAR(15)  NULL,

        address                TEXT         NOT NULL,
        city                   VARCHAR(100) NOT NULL,
        state                  VARCHAR(100) NOT NULL,
        pincode                VARCHAR(6)   NOT NULL,

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

        expected_amount_paise  INT          NOT NULL,
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
        INDEX idx_pan            (pan_number),
        INDEX idx_payment_status (payment_status),
        INDEX idx_razorpay_order (razorpay_order_id),
        INDEX idx_receipt        (receipt_number),
        INDEX idx_created        (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ── 2. Audit / analytics table ──────────────────────────────────────────
    await db.execute(`
      CREATE TABLE IF NOT EXISTS donation_payment_attempts (
        id                  INT AUTO_INCREMENT PRIMARY KEY,
        donation_id         INT          NULL,
        razorpay_order_id   VARCHAR(100) NOT NULL,
        razorpay_payment_id VARCHAR(100) NULL,
        attempt_status      ENUM('initiated','success','failed','tampered') DEFAULT 'initiated',
        amount_paise        INT          NOT NULL,
        failure_reason      TEXT         NULL,
        ip_address          VARCHAR(45)  NULL,
        created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

        INDEX idx_order  (razorpay_order_id),
        INDEX idx_donate (donation_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    return NextResponse.json({
      success: true,
      message: "donations + donation_payment_attempts tables created successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}