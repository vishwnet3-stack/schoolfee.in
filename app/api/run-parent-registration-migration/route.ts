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
        last_name       VARCHAR(100) NOT NULL DEFAULT '',
        email           VARCHAR(200) NOT NULL,
        phone           VARCHAR(15)  NOT NULL,
        pan_number      VARCHAR(10)  NULL,
        address         TEXT         NOT NULL,
        city            VARCHAR(100) NOT NULL DEFAULT '',
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
        digilocker_client_id  VARCHAR(200) NULL,
        digilocker_verified   TINYINT(1)   DEFAULT 0,
        digilocker_full_name  VARCHAR(200) NULL,
        doc_gender            VARCHAR(10)  NULL,
        doc_dob               VARCHAR(20)  NULL,
        apaar_doc_path   VARCHAR(500) NULL,
        apaar_doc_url    TEXT         NULL,
        apaar_id_number  VARCHAR(50)  NULL,
        apaar_doc_local_path VARCHAR(500) NULL,
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_registration (registration_id),
        INDEX idx_apaar_id (apaar_id),
        INDEX idx_digilocker (digilocker_client_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Alter existing live tables to fix NOT NULL constraints
    const alterStmts = [
      `ALTER TABLE parent_registrations MODIFY COLUMN pan_number VARCHAR(10) NULL`,
      `ALTER TABLE parent_registrations MODIFY COLUMN city VARCHAR(100) NOT NULL DEFAULT ''`,
      `ALTER TABLE parent_registrations MODIFY COLUMN last_name VARCHAR(100) NOT NULL DEFAULT ''`,
      `ALTER TABLE parent_registrations ADD COLUMN IF NOT EXISTS digilocker_client_id VARCHAR(200) NULL`,
      `ALTER TABLE parent_registrations ADD COLUMN IF NOT EXISTS masked_aadhaar VARCHAR(20) NULL`,
      `ALTER TABLE parent_registrations ADD COLUMN IF NOT EXISTS aadhaar_local_pdf VARCHAR(500) NULL`,
      `ALTER TABLE parent_registrations ADD COLUMN IF NOT EXISTS digilocker_verified_at DATETIME NULL`,
      `ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS apaar_id_number VARCHAR(50) NULL`,
      `ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS apaar_doc_local_path VARCHAR(500) NULL`,
      `ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS digilocker_client_id VARCHAR(200) NULL`,
      `ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS digilocker_verified TINYINT(1) DEFAULT 0`,
      `ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS digilocker_full_name VARCHAR(200) NULL`,
      `ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS doc_gender VARCHAR(10) NULL`,
      `ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS doc_dob VARCHAR(20) NULL`,
      `ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS apaar_doc_path VARCHAR(500) NULL`,
      `ALTER TABLE parent_registration_children ADD COLUMN IF NOT EXISTS apaar_doc_url TEXT NULL`,
    ];
    const results: string[] = [];
    for (const sql of alterStmts) {
      try {
        await db.execute(sql);
        results.push("OK: " + sql.slice(0, 60));
      } catch (e: any) {
        if (!e.message?.includes("Duplicate column")) {
          results.push("WARN: " + e.message);
        }
      }
    }

    return NextResponse.json({ success: true, message: "Tables created/updated.", results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}