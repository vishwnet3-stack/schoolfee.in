import { db } from "../db";

export const migrationName = "004_blog_posts";

export async function up(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(300) NOT NULL,
      slug VARCHAR(220) UNIQUE NOT NULL,
      content LONGTEXT NOT NULL,
      short_description TEXT,
      author VARCHAR(100) DEFAULT 'Admin',
      featured_image VARCHAR(255),
      featured_alt VARCHAR(200),
      category_id INT,
      meta_title VARCHAR(270),
      meta_description VARCHAR(360),
      primary_keyword VARCHAR(300),
      published_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_by INT,
      status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
      views INT DEFAULT 0,
      INDEX idx_slug (slug),
      INDEX idx_category (category_id),
      INDEX idx_status (status),
      INDEX idx_published (published_at),
      FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
      FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ blog_posts");
}