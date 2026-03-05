/**
 * 010_employees.ts
 * Correct schema matching lib/migrations/employees.ts (original file)
 */

import { db } from "../db";

export const migrationName = "010_employees";

export async function up(): Promise<void> {
  // Drop in reverse FK order then recreate correctly
  await db.execute(`DROP TABLE IF EXISTS employee_sessions`);
  await db.execute(`DROP TABLE IF EXISTS employees`);
  await db.execute(`DROP TABLE IF EXISTS employee_roles`); // wrong name from old guess
  await db.execute(`DROP TABLE IF EXISTS roles`);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role_name VARCHAR(50) UNIQUE NOT NULL,
      description TEXT,
      permissions JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_role_name (role_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ roles");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(200) NOT NULL,
      email VARCHAR(200) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'employee',
      is_active BOOLEAN DEFAULT TRUE,
      last_login TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_role (role),
      INDEX idx_is_active (is_active),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ employees");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS employee_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id INT NOT NULL,
      session_token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_token (session_token),
      INDEX idx_employee (employee_id),
      INDEX idx_expires (expires_at),
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ employee_sessions");
}

export async function seed(): Promise<void> {
  const [rows] = await db.execute<any[]>("SELECT COUNT(*) as count FROM roles");
  if (rows[0]?.count > 0) {
    console.log("  ℹ️  Roles already seeded — skipping.");
    return;
  }

  const defaultRoles = [
    {
      role_name: "admin",
      description: "System Administrator with full access",
      permissions: JSON.stringify({
        users: ["create", "read", "update", "delete"],
        employees: ["create", "read", "update", "delete"],
        surveys: ["read", "update", "delete", "export"],
        roles: ["read", "update"],
      }),
    },
    {
      role_name: "manager",
      description: "Manager with survey tracking access",
      permissions: JSON.stringify({
        users: ["read"],
        employees: ["read"],
        surveys: ["read", "update"],
        roles: [],
      }),
    },
    {
      role_name: "employee",
      description: "Employee with survey submission access",
      permissions: JSON.stringify({
        surveys: ["create", "read"],
        roles: [],
      }),
    },
    {
      role_name: "guest",
      description: "Guest with limited access",
      permissions: JSON.stringify({
        surveys: ["read"],
        roles: [],
      }),
    },
  ];

  for (const role of defaultRoles) {
    await db.execute(
      `INSERT IGNORE INTO roles (role_name, description, permissions) VALUES (?, ?, ?)`,
      [role.role_name, role.description, role.permissions]
    );
    console.log(`  ✅ Role seeded: ${role.role_name}`);
  }
}