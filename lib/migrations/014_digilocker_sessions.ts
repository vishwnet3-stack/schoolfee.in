// lib/migrations/014_digilocker_sessions.ts
// Stores Digilocker verification sessions and fetched document data

import { db } from "@/lib/db";

export const migrationName = "014_digilocker_sessions";

export async function up(): Promise<void> {
  console.log("Running migration: 014_digilocker_sessions");

  // ── 1. digilocker_sessions ──────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS digilocker_sessions (
      id                  INT AUTO_INCREMENT PRIMARY KEY,
      client_id           VARCHAR(200)  NOT NULL UNIQUE,
      redirect_url        VARCHAR(500)  NOT NULL,
      status              ENUM('initiated','completed','failed','expired') DEFAULT 'initiated',
      
      -- Raw API data
      raw_documents       JSON          NULL,
      raw_profile         JSON          NULL,
      
      -- Extracted APAAR / Aadhaar data
      apaar_id            VARCHAR(50)   NULL,
      full_name           VARCHAR(200)  NULL,
      date_of_birth       DATE          NULL,
      gender              VARCHAR(10)   NULL,
      aadhaar_last4       VARCHAR(4)    NULL,
      
      -- PAN data
      pan_number          VARCHAR(10)   NULL,
      
      -- Reference back to child row (optional, linked after form submit)
      registration_child_id INT         NULL,

      expires_at          DATETIME      NOT NULL,
      created_at          DATETIME      DEFAULT CURRENT_TIMESTAMP,
      updated_at          DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      INDEX idx_client    (client_id),
      INDEX idx_status    (status),
      INDEX idx_apaar     (apaar_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ digilocker_sessions");

  // ── 2. digilocker_documents ────────────────────────────────────────────
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
  console.log("  ✅ digilocker_documents");

  console.log("✅ Migration 014_digilocker_sessions completed");
}