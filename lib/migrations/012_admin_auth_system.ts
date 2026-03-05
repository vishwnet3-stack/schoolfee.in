import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function up() {
  console.log('Running migration: 012_admin_auth_system');

  try {
    // Check if table already exists
    const tables = await db.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()`
    );
    
    const tableNames = (tables as any[]).map((t: any) => t.TABLE_NAME);

    // Create admin_accounts table
    if (!tableNames.includes('admin_accounts')) {
      await db.execute(`
        CREATE TABLE admin_accounts (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(100) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          role ENUM('super_admin', 'admin', 'manager') DEFAULT 'admin',
          status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
          last_login DATETIME,
          login_attempts INT DEFAULT 0,
          locked_until DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          deleted_at DATETIME,
          INDEX idx_username (username),
          INDEX idx_email (email),
          INDEX idx_status (status)
        )
      `);
      console.log('✓ Created admin_accounts table');
    }

    // Use existing admin_sessions table from migration 002
    // No need to create - it already exists

    // Create admin_activity_logs table
    if (!tableNames.includes('admin_activity_logs')) {
      await db.execute(`
        CREATE TABLE admin_activity_logs (
          id INT PRIMARY KEY AUTO_INCREMENT,
          admin_id INT NOT NULL,
          action VARCHAR(100) NOT NULL,
          resource_type VARCHAR(50),
          resource_id INT,
          description TEXT,
          ip_address VARCHAR(45),
          status VARCHAR(20),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (admin_id) REFERENCES admin_accounts(id) ON DELETE CASCADE,
          INDEX idx_admin_id (admin_id),
          INDEX idx_action (action),
          INDEX idx_created_at (created_at)
        )
      `);
      console.log('✓ Created admin_activity_logs table');
    }

    // Seed default admin account
    const adminExists = await db.execute(
      `SELECT id FROM admin_accounts WHERE username = 'admin' LIMIT 1`
    );

    if ((adminExists as any[]).length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.execute(
        `INSERT INTO admin_accounts (username, email, password_hash, full_name, role, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['admin', 'admin@schoolfee.local', hashedPassword, 'System Administrator', 'super_admin', 'active']
      );
      console.log('✓ Seeded default admin account (admin / admin123)');
    } else {
      console.log('✓ Admin account already exists');
    }

    console.log('✓ Migration 012_admin_auth_system completed successfully');
    return true;
  } catch (error) {
    console.error('✗ Migration 012_admin_auth_system failed:', error);
    throw error;
  }
}

export async function down() {
  try {
    await db.execute(`DROP TABLE IF EXISTS admin_activity_logs`);
    await db.execute(`DROP TABLE IF EXISTS admin_sessions`);
    await db.execute(`DROP TABLE IF EXISTS admin_accounts`);
    console.log('✓ Rolled back migration 012_admin_auth_system');
    return true;
  } catch (error) {
    console.error('✗ Rollback failed:', error);
    throw error;
  }
}
