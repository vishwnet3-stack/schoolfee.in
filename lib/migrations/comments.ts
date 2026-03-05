// lib/migrations/comments.ts
// Example: How to add more tables for different functionality

import { db } from '../db';

// Define new table schema
const commentsTables = {
  blog_comments: `
    CREATE TABLE IF NOT EXISTS blog_comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      author_name VARCHAR(100) NOT NULL,
      author_email VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      is_approved BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_post (post_id),
      INDEX idx_approved (is_approved),
      FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,

  comment_replies: `
    CREATE TABLE IF NOT EXISTS comment_replies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      comment_id INT NOT NULL,
      author_name VARCHAR(100) NOT NULL,
      author_email VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_comment (comment_id),
      FOREIGN KEY (comment_id) REFERENCES blog_comments(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
};

// Function to create comments tables
export async function migrateCommentsTables() {
  console.log('🔧 Creating comments tables...');

  try {
    const tableOrder = ['blog_comments', 'comment_replies'];

    for (const tableName of tableOrder) {
      const schema = commentsTables[tableName as keyof typeof commentsTables];
      await db.execute(schema);
      console.log(`✅ Table created: ${tableName}`);
    }

    console.log('✅ Comments tables created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error creating comments tables:', error);
    throw error;
  }
}