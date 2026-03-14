// app/api/run-parent-registration-migration/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS parent_registrations (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        public_user_id  INT NULL,
        first_name      VARCHAR(100) NOT NULL,
        last_name       VARCHAR(100) NOT NULL,
        email           VARCHAR(200) NOT NULL,
        phone           VARCHAR(15)  NOT NULL,
        pan_number      VARCHAR(10)  NOT NULL,
        address         TEXT         NOT NULL,
        city            VARCHAR(100) NOT NULL,
        state           VARCHAR(100) NOT NULL,
        fee_amount      DECIMAL(12,2) NOT NULL,
        fee_period      ENUM('monthly','quarterly','halfYearly','annual') NOT NULL,
        reason_for_support VARCHAR(50) NOT NULL,
        other_reason    VARCHAR(255) NULL,
        description     TEXT         NOT NULL,
        repayment_duration INT        NOT NULL,
        razorpay_order_id   VARCHAR(100) NULL,
        razorpay_payment_id VARCHAR(100) NULL,
        payment_status  ENUM('pending','paid','failed') DEFAULT 'pending',
        payment_amount  DECIMAL(10,2) DEFAULT 11.00,
        status          ENUM('pending','under_review','approved','rejected') DEFAULT 'pending',
        admin_notes     TEXT NULL,
        submitted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user      (public_user_id),
        INDEX idx_email     (email),
        INDEX idx_status    (status),
        INDEX idx_payment   (payment_status),
        INDEX idx_submitted (submitted_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS parent_registration_children (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        registration_id  INT NOT NULL,
        child_index      INT NOT NULL,
        full_name        VARCHAR(200) NOT NULL,
        class_grade      VARCHAR(50)  NOT NULL,
        admission_number VARCHAR(100) NOT NULL,
        school_name      VARCHAR(200) NOT NULL,
        school_city      VARCHAR(100) NOT NULL,
        apaar_id         VARCHAR(50)  NULL,
        -- DigiLocker verification fields
        digilocker_client_id  VARCHAR(200) NULL,
        digilocker_verified   TINYINT(1)   DEFAULT 0,
        digilocker_full_name  VARCHAR(200) NULL,
        doc_gender            VARCHAR(10)  NULL,
        doc_dob               VARCHAR(20)  NULL,
        -- APAAR document storage (admin-only, stored server-side)
        apaar_doc_path   VARCHAR(500) NULL COMMENT 'Relative path in private-uploads/apaar/',
        apaar_doc_url    TEXT         NULL COMMENT 'Original S3 URL from DigiLocker (may expire)',
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_registration (registration_id),
        INDEX idx_apaar_id (apaar_id),
        INDEX idx_digilocker (digilocker_client_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ── Alter existing table: add new APAAR/DigiLocker columns if missing ──
    const alterColumns = [
      "ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS digilocker_client_id VARCHAR(200) NULL",
      "ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS digilocker_verified TINYINT(1) DEFAULT 0",
      "ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS digilocker_full_name VARCHAR(200) NULL",
      "ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS doc_gender VARCHAR(10) NULL",
      "ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS doc_dob VARCHAR(20) NULL",
      "ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS apaar_doc_path VARCHAR(500) NULL",
      "ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS apaar_doc_url TEXT NULL",
      // These are also used by razorpay-verify INSERT
      "ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS apaar_id_number VARCHAR(50) NULL",
      "ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS apaar_doc_local_path VARCHAR(500) NULL",
    ];
    for (const sql of alterColumns) {
      try { await db.execute(sql); } catch (e: any) {
        // Ignore "Duplicate column" errors on fresh installs
        if (!e.message?.includes("Duplicate column")) console.warn("ALTER warn:", e.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "parent_registrations + parent_registration_children tables created/updated with APAAR doc storage.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}