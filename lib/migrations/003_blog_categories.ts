import { db } from "../db";

export const migrationName = "003_blog_categories";

export async function up(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blog_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(300) NOT NULL,
      slug VARCHAR(220) UNIQUE NOT NULL,
      featured_image VARCHAR(255),
      featured_alt VARCHAR(200),
      meta_title VARCHAR(270),
      meta_description VARCHAR(360),
      primary_keyword VARCHAR(400),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_by INT,
      is_active BOOLEAN DEFAULT TRUE,
      INDEX idx_slug (slug),
      INDEX idx_name (name),
      FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ blog_categories");
}