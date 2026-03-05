// app/api/dashboard/migrate/route.ts
// GET /api/dashboard/migrate — run once to create tables

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS dashboard_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('super_admin','admin','manager','employee','parent','teacher','school','custom') NOT NULL DEFAULT 'parent',
        custom_role_name VARCHAR(100),
        permissions JSON,
        status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
        created_by INT,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS dashboard_user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES dashboard_users(id) ON DELETE CASCADE,
        INDEX idx_token (session_token),
        INDEX idx_user_id (user_id),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Alter existing table to add new columns if they don't exist (safe upgrade)
    try {
      await db.execute(`ALTER TABLE dashboard_users ADD COLUMN custom_role_name VARCHAR(100) AFTER role`);
    } catch {}
    try {
      await db.execute(`ALTER TABLE dashboard_users ADD COLUMN permissions JSON AFTER custom_role_name`);
    } catch {}
    try {
      await db.execute(`ALTER TABLE dashboard_users MODIFY COLUMN role ENUM('super_admin','admin','manager','employee','parent','teacher','school','custom') NOT NULL DEFAULT 'parent'`);
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Dashboard tables created/updated successfully!",
      tables: ["dashboard_users", "dashboard_user_sessions"],
    });
  } catch (error: any) {
    console.error("Migration failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}