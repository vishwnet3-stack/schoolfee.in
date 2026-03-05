/**
 * 011_survey_submissions.ts
 * Correct schema matching lib/migrations/survey-submissions.ts (original file)
 */

import { db } from "../db";

export const migrationName = "011_survey_submissions";

export async function up(): Promise<void> {
  await db.execute(`DROP TABLE IF EXISTS survey_submissions`);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS survey_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      employee_id INT,
      survey_data LONGTEXT NOT NULL,
      ip_address VARCHAR(45),
      user_agent TEXT,
      status ENUM('new', 'reviewed', 'contacted', 'completed') DEFAULT 'new',
      admin_notes TEXT,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user (user_id),
      INDEX idx_employee (employee_id),
      INDEX idx_status (status),
      INDEX idx_submitted (submitted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ survey_submissions");
}