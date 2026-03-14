// lib/migrations/016_teacher_email_otps.ts
// Creates teacher_email_otps table for OTP-based email verification
// during teacher registration flow.

import { db } from "@/lib/db";

export const migrationName = "016_teacher_email_otps";

export async function up(): Promise<void> {
  console.log("Running migration: 016_teacher_email_otps");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS teacher_email_otps (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      email      VARCHAR(255) NOT NULL,
      otp        VARCHAR(6)   NOT NULL,
      expires_at DATETIME     NOT NULL,
      used       TINYINT(1)   DEFAULT 0,
      created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log("Migration 016_teacher_email_otps completed");
}

export async function down(): Promise<void> {
  await db.execute(`DROP TABLE IF EXISTS teacher_email_otps`);
}