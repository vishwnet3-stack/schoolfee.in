// app/api/run-digilocker-migration/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS digilocker_sessions (
        id                  INT AUTO_INCREMENT PRIMARY KEY,
        client_id           VARCHAR(200)  NOT NULL UNIQUE,
        redirect_url        VARCHAR(500)  NOT NULL,
        status              ENUM('initiated','completed','failed','expired') DEFAULT 'initiated',
        raw_documents       JSON          NULL,
        raw_profile         JSON          NULL,
        apaar_id            VARCHAR(50)   NULL,
        full_name           VARCHAR(200)  NULL,
        date_of_birth       DATE          NULL,
        gender              VARCHAR(10)   NULL,
        aadhaar_last4       VARCHAR(4)    NULL,
        pan_number          VARCHAR(10)   NULL,
        registration_child_id INT         NULL,
        expires_at          DATETIME      NOT NULL,
        created_at          DATETIME      DEFAULT CURRENT_TIMESTAMP,
        updated_at          DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_client    (client_id),
        INDEX idx_status    (status),
        INDEX idx_apaar     (apaar_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS digilocker_documents (
        id                  INT AUTO_INCREMENT PRIMARY KEY,
        session_id          INT          NOT NULL,
        client_id           VARCHAR(200) NOT NULL,
        file_id             VARCHAR(200) NOT NULL,
        doc_name            VARCHAR(200) NULL,
        doc_type            VARCHAR(50)  NULL,
        issuer              VARCHAR(200) NULL,
        description         VARCHAR(500) NULL,
        downloaded          TINYINT(1)   DEFAULT 0,
        download_url        TEXT         NULL,
        mime_type           VARCHAR(100) NULL,
        created_at          DATETIME     DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session   (session_id),
        INDEX idx_client    (client_id),
        INDEX idx_doc_type  (doc_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ── Add all columns that may be missing on existing installations ──────
    const alterColumns = [
      // Aadhaar XML data columns
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_full_name     VARCHAR(200) NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_care_of       VARCHAR(200) NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_dob           VARCHAR(20)  NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_yob           VARCHAR(10)  NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_zip           VARCHAR(20)  NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_gender        VARCHAR(10)  NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_masked_number VARCHAR(20)  NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_full_address  TEXT         NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_father_name   VARCHAR(200) NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_address_json  JSON         NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_profile_image TEXT         NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_xml_url       TEXT         NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_xml_fetched   TINYINT(1)   DEFAULT 0",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS raw_aadhaar_xml       JSON         NULL",
      // DigiLocker metadata
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS digilocker_mobile     VARCHAR(20)  NULL",
      // PDF storage paths (local server paths)
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS aadhaar_local_pdf     VARCHAR(500) NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS pan_local_pdf         VARCHAR(500) NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS apaar_local_pdf       VARCHAR(500) NULL",
      // PAN data
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS pan_full_name         VARCHAR(200) NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS pan_dob               VARCHAR(20)  NULL",
      "ALTER TABLE digilocker_sessions ADD COLUMN IF NOT EXISTS pan_fetched           TINYINT(1)   DEFAULT 0",
    ];

    const results: string[] = [];
    for (const sql of alterColumns) {
      try {
        await db.execute(sql);
        results.push("OK: " + sql.split("ADD COLUMN IF NOT EXISTS")[1]?.trim().split(" ")[0]);
      } catch (e: any) {
        if (!e.message?.includes("Duplicate column")) {
          results.push("WARN: " + e.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "digilocker_sessions + digilocker_documents tables created/updated successfully.",
      columns: results,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 