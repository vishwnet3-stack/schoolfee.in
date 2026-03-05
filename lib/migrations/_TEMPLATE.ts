/**
 * ============================================================
 *  TEMPLATE — Copy this file to create a new migration
 * ============================================================
 *
 *  NAMING CONVENTION:
 *    NNN_table_name.ts   (e.g. 012_payments.ts)
 *    NNN = next number after the last file in this folder
 *
 *  RULES:
 *  - Always use CREATE TABLE IF NOT EXISTS  (never DROP TABLE)
 *  - Never ALTER TABLE here — create a new numbered file for changes
 *  - The migrationName must match the filename (without extension)
 *  - The up() function runs once and is never repeated
 *  - The seed() function (optional) also runs once after up()
 *
 * ============================================================
 */

import { db } from "../db";

// Must match filename without extension
export const migrationName = "NNN_your_table_name";

export async function up(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS your_table_name (
      id INT AUTO_INCREMENT PRIMARY KEY,

      -- your columns here
      name VARCHAR(200) NOT NULL,
      status ENUM('active', 'inactive') DEFAULT 'active',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      INDEX idx_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ your_table_name");
}

// Optional: runs once after up() — use for default data
// export async function seed(): Promise<void> {
//   await db.execute(`INSERT IGNORE INTO your_table_name (name) VALUES (?)`, ["default"]);
//   console.log("  🌱 your_table_name seeded");
// }