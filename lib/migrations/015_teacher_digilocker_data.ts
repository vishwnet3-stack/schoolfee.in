// lib/migrations/015_teacher_digilocker_data.ts
// Extends digilocker_sessions with full Aadhaar XML data, PAN data,
// and local PDF storage for teacher registration flow.

import { db } from "@/lib/db";

export const migrationName = "015_teacher_digilocker_data";

export async function up(): Promise<void> {
  console.log("Running migration: 015_teacher_digilocker_data");

  // ── Extend digilocker_sessions with Aadhaar XML + PAN + local PDF paths ──
  const alterStatements = [
    // Aadhaar XML parsed fields
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_full_name VARCHAR(250) NULL AFTER aadhaar_last4`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_care_of VARCHAR(250) NULL AFTER aadhaar_full_name`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_dob VARCHAR(20) NULL AFTER aadhaar_care_of`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_yob VARCHAR(4) NULL AFTER aadhaar_dob`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_zip VARCHAR(10) NULL AFTER aadhaar_yob`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_gender VARCHAR(5) NULL AFTER aadhaar_zip`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_masked_number VARCHAR(20) NULL AFTER aadhaar_gender`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_full_address TEXT NULL AFTER aadhaar_masked_number`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_father_name VARCHAR(250) NULL AFTER aadhaar_full_address`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_address_json JSON NULL AFTER aadhaar_father_name`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_profile_image LONGTEXT NULL AFTER aadhaar_address_json`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_xml_url TEXT NULL AFTER aadhaar_profile_image`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_xml_fetched TINYINT(1) DEFAULT 0 AFTER aadhaar_xml_url`,

    // PAN data
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS pan_full_name VARCHAR(250) NULL AFTER pan_number`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS pan_dob VARCHAR(20) NULL AFTER pan_full_name`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS pan_father_name VARCHAR(250) NULL AFTER pan_dob`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS pan_fetched TINYINT(1) DEFAULT 0 AFTER pan_father_name`,

    // Local PDF storage paths
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_local_pdf VARCHAR(500) NULL AFTER pan_fetched`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS pan_local_pdf VARCHAR(500) NULL AFTER aadhaar_local_pdf`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS apaar_local_pdf VARCHAR(500) NULL AFTER pan_local_pdf`,

    // DigiLocker metadata
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS digilocker_mobile VARCHAR(15) NULL AFTER apaar_local_pdf`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS raw_aadhaar_xml JSON NULL AFTER digilocker_mobile`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS raw_pan_data JSON NULL AFTER raw_aadhaar_xml`,

    // Link to teacher registration
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS teacher_registration_id INT NULL AFTER registration_child_id`,
    `ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS session_type ENUM('child','teacher','parent') DEFAULT 'child' AFTER teacher_registration_id`,
  ];

  for (const sql of alterStatements) {
    try {
      await db.execute(sql);
    } catch (err: any) {
      // Ignore "Duplicate column" errors — column already exists
      if (!err.message?.includes("Duplicate column")) {
        console.warn(`  ⚠️  ${sql.slice(0, 80)}… → ${err.message}`);
      }
    }
  }

  // ── local PDF storage for teacher documents ───────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS teacher_digilocker_docs (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      client_id         VARCHAR(200) NOT NULL,
      doc_type          VARCHAR(50)  NOT NULL,   -- ADHAR, PANCR, ABCID, etc.
      doc_name          VARCHAR(200) NULL,
      file_id           VARCHAR(200) NULL,
      issuer            VARCHAR(200) NULL,
      local_pdf_path    VARCHAR(500) NULL,        -- relative path under private-uploads/
      s3_pdf_url        TEXT         NULL,        -- original S3 URL
      mime_type         VARCHAR(100) NULL,
      fetched_at        DATETIME     DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uk_client_doctype (client_id, doc_type),
      INDEX idx_client  (client_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log("✅ Migration 015_teacher_digilocker_data completed");
}