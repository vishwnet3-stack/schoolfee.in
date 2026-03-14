// lib/migrations/014_donations.ts
// Run via: GET /api/run-donations-migration

import { db } from "@/lib/db";

export const migrationName = "014_donations";

export async function up(): Promise<void> {
  // ── 1. Main donations table ─────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS donations (
      id                     INT AUTO_INCREMENT PRIMARY KEY,

      -- Donor details
      first_name             VARCHAR(100) NOT NULL,
      last_name              VARCHAR(100) NOT NULL,
      email                  VARCHAR(200) NOT NULL,
      phone                  VARCHAR(15)  NOT NULL,
      pan_number             VARCHAR(10)  NOT NULL,

      -- Organization details (for CSR / institutional donors)
      organization_name      VARCHAR(200) NULL,
      organization_type      ENUM('individual','ngo','corporate','trust','government','other') DEFAULT 'individual',
      gstin                  VARCHAR(15)  NULL,

      -- Address for 80G receipt
      address                TEXT         NOT NULL,
      city                   VARCHAR(100) NOT NULL,
      state                  VARCHAR(100) NOT NULL,
      pincode                VARCHAR(6)   NOT NULL,

      -- Donation specifics
      donation_amount        DECIMAL(12,2) NOT NULL,
      donation_purpose       VARCHAR(200) DEFAULT 'General Fund - Schoolfee.org / CHM Initiative',
      is_anonymous           TINYINT(1)   DEFAULT 0,
      message                TEXT         NULL,

      -- Payment / Razorpay
      razorpay_order_id      VARCHAR(100) NULL,
      razorpay_payment_id    VARCHAR(100) NULL,
      razorpay_signature     VARCHAR(255) NULL,
      payment_status         ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
      payment_method         VARCHAR(50)  NULL,
      payment_captured_at    TIMESTAMP    NULL,

      -- Amount verified server-side (fraud detection)
      expected_amount_paise  INT          NOT NULL,   -- amount locked at order-create time
      verified_amount_paise  INT          NULL,        -- amount confirmed by Razorpay

      -- 80G Receipt
      receipt_number         VARCHAR(50)  NULL,        -- e.g. CHM-DONATE-2025-000042
      receipt_issued_at      TIMESTAMP    NULL,
      financial_year         VARCHAR(9)   NULL,        -- e.g. 2025-2026

      -- Status & admin
      status                 ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
      admin_notes            TEXT         NULL,
      ip_address             VARCHAR(45)  NULL,
      user_agent             TEXT         NULL,

      -- Timestamps
      created_at             TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at             TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      -- Indexes
      INDEX idx_email          (email),
      INDEX idx_pan            (pan_number),
      INDEX idx_payment_status (payment_status),
      INDEX idx_razorpay_order (razorpay_order_id),
      INDEX idx_receipt        (receipt_number),
      INDEX idx_created        (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ donations");

  // ── 2. Donation payment attempts (for analytics / fraud detection) ──────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS donation_payment_attempts (
      id                  INT AUTO_INCREMENT PRIMARY KEY,
      donation_id         INT          NULL,           -- NULL if order never saved
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
  console.log("  ✅ donation_payment_attempts");
}