// lib/migrations/017_parent_digilocker_fields.ts
// Adds DigiLocker fields to parent_registrations,
// adds apaar_id_number to parent_registration_children,
// and creates parent_email_otps table.

import { db } from "@/lib/db";

export async function up() {
  // 1. parent_registrations — add DigiLocker fields
  const [prCols]: any = await db.execute(`SHOW COLUMNS FROM parent_registrations`);
  const prColNames: string[] = prCols.map((c: any) => c.Field);

  if (!prColNames.includes("digilocker_client_id")) {
    await db.execute(`
      ALTER TABLE parent_registrations
      ADD COLUMN digilocker_client_id VARCHAR(255) NULL AFTER pan_number
    `);
    console.log("[017] Added digilocker_client_id to parent_registrations");
  }

  if (!prColNames.includes("masked_aadhaar")) {
    await db.execute(`
      ALTER TABLE parent_registrations
      ADD COLUMN masked_aadhaar VARCHAR(20) NULL AFTER digilocker_client_id
    `);
    console.log("[017] Added masked_aadhaar to parent_registrations");
  }

  if (!prColNames.includes("aadhaar_local_pdf")) {
    await db.execute(`
      ALTER TABLE parent_registrations
      ADD COLUMN aadhaar_local_pdf VARCHAR(500) NULL AFTER masked_aadhaar
    `);
    console.log("[017] Added aadhaar_local_pdf to parent_registrations");
  }

  if (!prColNames.includes("digilocker_verified_at")) {
    await db.execute(`
      ALTER TABLE parent_registrations
      ADD COLUMN digilocker_verified_at DATETIME NULL AFTER aadhaar_local_pdf
    `);
    console.log("[017] Added digilocker_verified_at to parent_registrations");
  }

  // 2. parent_registration_children — add apaar_id_number
  const [cCols]: any = await db.execute(`SHOW COLUMNS FROM parent_registration_children`);
  const cColNames: string[] = cCols.map((c: any) => c.Field);

  if (!cColNames.includes("apaar_id_number")) {
    await db.execute(`
      ALTER TABLE parent_registration_children
      ADD COLUMN apaar_id_number VARCHAR(20) NULL AFTER apaar_id
    `);
    console.log("[017] Added apaar_id_number to parent_registration_children");
  }

  if (!cColNames.includes("apaar_doc_local_path")) {
    await db.execute(`
      ALTER TABLE parent_registration_children
      ADD COLUMN apaar_doc_local_path VARCHAR(500) NULL AFTER apaar_id_number
    `);
    console.log("[017] Added apaar_doc_local_path to parent_registration_children");
  }

  // 3. Create parent_email_otps if not exists
  await db.execute(`
    CREATE TABLE IF NOT EXISTS parent_email_otps (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      email         VARCHAR(255) NOT NULL,
      otp           VARCHAR(10)  NOT NULL,
      expires_at    DATETIME     NOT NULL,
      used          TINYINT(1)   NOT NULL DEFAULT 0,
      created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_parent_email_otps_email (email),
      INDEX idx_parent_email_otps_expires (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("[017] Ensured parent_email_otps table exists");
}

export async function down() {
  // Remove added columns — only call if rolling back intentionally
  try {
    await db.execute(`ALTER TABLE parent_registrations DROP COLUMN IF EXISTS digilocker_client_id`);
    await db.execute(`ALTER TABLE parent_registrations DROP COLUMN IF EXISTS masked_aadhaar`);
    await db.execute(`ALTER TABLE parent_registrations DROP COLUMN IF EXISTS aadhaar_local_pdf`);
    await db.execute(`ALTER TABLE parent_registrations DROP COLUMN IF EXISTS digilocker_verified_at`);
    await db.execute(`ALTER TABLE parent_registration_children DROP COLUMN IF EXISTS apaar_id_number`);
    await db.execute(`ALTER TABLE parent_registration_children DROP COLUMN IF EXISTS apaar_doc_local_path`);
    await db.execute(`DROP TABLE IF EXISTS parent_email_otps`);
  } catch (err) {
    console.error("[017 down] Error:", err);
  }
}