import { db } from "../db";

export const migrationName = "005_quick_signups";

export async function up(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS quick_signups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL,
      source ENUM('hero', 'cta_bottom') DEFAULT 'hero',
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_mobile (mobile),
      INDEX idx_source (source),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ quick_signups");
}