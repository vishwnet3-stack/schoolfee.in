import { db } from "../db";

export const migrationName = "007_contact_queries";

export async function up(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_queries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      query_text TEXT NOT NULL,
      email VARCHAR(200),
      ip_address VARCHAR(45),
      user_agent TEXT,
      status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
      admin_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_status (status),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ contact_queries");
}