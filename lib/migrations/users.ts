// lib/migrations/users.ts
// Migration for normal users registration and login

import { db } from '../db';

const usersTables = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(200) NOT NULL,
      email VARCHAR(200) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_status (status),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,

  user_sessions: `
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      session_token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_token (session_token),
      INDEX idx_user (user_id),
      INDEX idx_expires (expires_at),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
};

export async function migrateUsersTables() {
  console.log('Creating users tables...');

  try {
    const tableOrder = ['users', 'user_sessions'];

    for (const tableName of tableOrder) {
      const schema = usersTables[tableName as keyof typeof usersTables];
      await db.execute(schema);
      console.log(`Table created: ${tableName}`);
    }

    console.log('Users tables created successfully!');
    return true;
  } catch (error) {
    console.error('Error creating users tables:', error);
    throw error;
  }
}

export default migrateUsersTables;
