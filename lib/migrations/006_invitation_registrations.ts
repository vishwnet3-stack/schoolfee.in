import { db } from "../db";

export const migrationName = "006_invitation_registrations";

export async function up(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS invitation_registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role ENUM('Parent Member', 'Partner School', 'CSR Partner', 'Donor/Community', 'Educationist/Policy Advocate') NOT NULL,
      name VARCHAR(200) NOT NULL,
      city VARCHAR(100) NOT NULL,
      mobile VARCHAR(15) NOT NULL,
      email VARCHAR(200) NOT NULL,
      opt_in BOOLEAN DEFAULT FALSE,
      source VARCHAR(100),
      ip_address VARCHAR(45),
      user_agent TEXT,
      status ENUM('pending', 'contacted', 'completed', 'rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_mobile (mobile),
      INDEX idx_email (email),
      INDEX idx_role (role),
      INDEX idx_status (status),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ invitation_registrations");
}