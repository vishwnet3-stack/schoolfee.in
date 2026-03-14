// app/api/run-teacher-migration/route.ts
// Visit once: GET http://localhost:3000/api/run-teacher-migration
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const results: string[] = [];

  try {
    // ── 1. Create teacher_registrations table ─────────────────────────────
    await db.execute(`
      CREATE TABLE IF NOT EXISTS teacher_registrations (
        id                  INT AUTO_INCREMENT PRIMARY KEY,
        public_user_id      INT NULL,
        -- Step 1: Personal
        full_name           VARCHAR(200) NOT NULL,
        dob                 DATE         NOT NULL,
        gender              ENUM('Male','Female','Other') NOT NULL,
        phone               VARCHAR(15)  NOT NULL,
        email               VARCHAR(200) NOT NULL,
        address             TEXT         NOT NULL,
        state               VARCHAR(100) NOT NULL,
        pincode             VARCHAR(10)  NULL,
        father_name         VARCHAR(200) NULL,
        -- Step 2: Professional
        qualification       VARCHAR(100) NOT NULL,
        other_qualification VARCHAR(200) NULL,
        subject             VARCHAR(100) NOT NULL,
        other_subject       VARCHAR(200) NULL,
        experience          VARCHAR(50)  NOT NULL,
        -- Step 3: Employment
        school_name         VARCHAR(200) NOT NULL,
        employee_id         VARCHAR(100) NOT NULL,
        salary_monthly      DECIMAL(12,2) NOT NULL,
        joining_date        DATE         NOT NULL,
        employment_type     ENUM('Permanent','Contract','Part-time','Guest Faculty') NOT NULL,
        -- Payment
        razorpay_order_id   VARCHAR(100) NULL,
        razorpay_payment_id VARCHAR(100) NULL,
        payment_status      ENUM('pending','paid','failed') DEFAULT 'pending',
        payment_amount      DECIMAL(10,2) DEFAULT 111.00,
        -- DigiLocker KYC fields
        digilocker_client_id VARCHAR(200) NULL,
        masked_aadhaar       VARCHAR(20)  NULL,
        pan_number           VARCHAR(15)  NULL,
        aadhaar_local_pdf    VARCHAR(500) NULL,
        pan_local_pdf        VARCHAR(500) NULL,
        apaar_local_pdf      VARCHAR(500) NULL,
        -- Admin
        status              ENUM('pending','under_review','approved','rejected') DEFAULT 'pending',
        admin_notes         TEXT NULL,
        submitted_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user      (public_user_id),
        INDEX idx_email     (email),
        INDEX idx_status    (status),
        INDEX idx_payment   (payment_status),
        INDEX idx_submitted (submitted_at),
        INDEX idx_digilocker (digilocker_client_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push("✅ teacher_registrations table created/exists");

    // ── 2. Add missing columns to existing table (safe ALTER IF NOT EXISTS) ──
    const alterColumns = [
      `ALTER TABLE teacher_registrations ADD COLUMN IF NOT EXISTS pincode VARCHAR(10) NULL AFTER state`,
      `ALTER TABLE teacher_registrations ADD COLUMN IF NOT EXISTS father_name VARCHAR(200) NULL AFTER pincode`,
      `ALTER TABLE teacher_registrations ADD COLUMN IF NOT EXISTS digilocker_client_id VARCHAR(200) NULL AFTER payment_amount`,
      `ALTER TABLE teacher_registrations ADD COLUMN IF NOT EXISTS masked_aadhaar VARCHAR(20) NULL AFTER digilocker_client_id`,
      `ALTER TABLE teacher_registrations ADD COLUMN IF NOT EXISTS pan_number VARCHAR(15) NULL AFTER masked_aadhaar`,
      `ALTER TABLE teacher_registrations ADD COLUMN IF NOT EXISTS aadhaar_local_pdf VARCHAR(500) NULL AFTER pan_number`,
      `ALTER TABLE teacher_registrations ADD COLUMN IF NOT EXISTS pan_local_pdf VARCHAR(500) NULL AFTER aadhaar_local_pdf`,
      `ALTER TABLE teacher_registrations ADD COLUMN IF NOT EXISTS apaar_local_pdf VARCHAR(500) NULL AFTER pan_local_pdf`,
    ];

    for (const sql of alterColumns) {
      try {
        await db.execute(sql);
        results.push(`✅ ${sql.match(/ADD COLUMN IF NOT EXISTS (\w+)/)?.[1] || "column"} added`);
      } catch (err: any) {
        if (err.message?.includes("Duplicate column")) {
          results.push(`⏭️  Column already exists (skipped)`);
        } else {
          results.push(`⚠️  ${err.message}`);
        }
      }
    }

    // ── 3. Add indexes if missing ──────────────────────────────────────────
    try {
      await db.execute(`ALTER TABLE teacher_registrations ADD INDEX idx_digilocker (digilocker_client_id)`);
      results.push("✅ idx_digilocker index added");
    } catch (err: any) {
      results.push(`⏭️  idx_digilocker already exists`);
    }

    return NextResponse.json({
      success: true,
      message: "Teacher migration completed successfully.",
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, results }, { status: 500 });
  }
}