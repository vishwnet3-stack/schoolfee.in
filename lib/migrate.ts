/**
 * ============================================================
 *  lib/migrate.ts  —  Master Migration Runner
 * ============================================================
 *
 *  HOW IT WORKS
 *  ────────────
 *  1. Creates a `_migrations` tracker table on first run.
 *  2. Auto-resets any stale migrations listed in RESET_MIGRATIONS
 *     by deleting their tracker record so they re-run fresh.
 *  3. Auto-discovers every file in lib/migrations/ (001_xxx.ts …)
 *  4. Skips migrations already recorded in `_migrations`.
 *  5. Runs only NEW/RESET migrations — everything is automatic.
 *
 *  HOW TO ADD A NEW TABLE
 *  ──────────────────────
 *  1. Create lib/migrations/NNN_table_name.ts
 *  2. Export migrationName and up()
 *  3. Run: npm run migrate
 *  — Nothing else to change.
 *
 * ============================================================
 */

import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";
import bcrypt from "bcrypt";
import { db } from "./db";

// ─────────────────────────────────────────────────────────────────────────────
//  LIST OF MIGRATIONS TO AUTO-RESET ON NEXT RUN
//  Add a migration name here if you updated its file and want it to re-run.
//  The runner will delete it from _migrations and re-run it automatically.
//  Remove it from this list after it has re-run successfully.
//  ⚠️ DO NOT add 009, 010, 011 here - they will wipe production data!
// ─────────────────────────────────────────────────────────────────────────────
const RESET_MIGRATIONS: string[] = [];

// ─── Tracker table ────────────────────────────────────────────────────────────

async function ensureMigrationsTable(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const [rows] = await db.execute<any[]>("SELECT name FROM _migrations");
  return new Set(rows.map((r: any) => r.name));
}

async function recordMigration(name: string): Promise<void> {
  await db.execute("INSERT IGNORE INTO _migrations (name) VALUES (?)", [name]);
}

// ─── Auto-reset stale migrations ─────────────────────────────────────────────

async function resetStaleMigrations(): Promise<void> {
  if (RESET_MIGRATIONS.length === 0) return;

  for (const name of RESET_MIGRATIONS) {
    await db.execute("DELETE FROM _migrations WHERE name = ?", [name]);
  }

  console.log("Auto-reset migrations: " + RESET_MIGRATIONS.join(", "));
}

// ─── Auto-discover migration files ───────────────────────────────────────────

function getMigrationFiles(): string[] {
  const migrationsDir = path.join(__dirname, "migrations");

  if (!fs.existsSync(migrationsDir)) {
    console.warn("migrations/ folder not found at: " + migrationsDir);
    return [];
  }

  return fs
    .readdirSync(migrationsDir)
    .filter((f) => /^\d+_.+\.(ts|js)$/.test(f))
    .sort()
    .map((f) => path.join(migrationsDir, f));
}

// ─── Run all pending migrations ───────────────────────────────────────────────

async function runPendingMigrations(): Promise<void> {
  const applied = await getAppliedMigrations();
  const files = getMigrationFiles();

  if (files.length === 0) {
    console.log("No migration files found in lib/migrations/");
    return;
  }

  let ran = 0;

  for (const filePath of files) {
    const fileName = path.basename(filePath).replace(/\.(ts|js)$/, "");
    const fileUrl = pathToFileURL(filePath).href;
    const mod = await import(fileUrl);
    const name: string = mod.migrationName ?? fileName;

    if (applied.has(name)) {
      continue;
    }

    console.log("\nRunning migration: " + name);

    try {
      if (typeof mod.up === "function") {
        await mod.up();
      }

      if (typeof mod.seed === "function") {
        console.log("  Seeding: " + name);
        await mod.seed();
      }

      await recordMigration(name);
      ran++;
      console.log("  Recorded: " + name);
    } catch (err) {
      console.error("  Migration failed: " + name, err);
      throw err;
    }
  }

  if (ran === 0) {
    console.log("All migrations already applied — nothing to do.");
  } else {
    console.log("\n" + ran + " migration(s) applied successfully.");
  }
}

// ─── Default admin seed ───────────────────────────────────────────────────────

async function seedDefaultAdmin(): Promise<void> {
  try {
    const [rows] = await db.execute<any[]>(
      "SELECT id FROM admin_users WHERE username = ?",
      ["admin"]
    );

    if (rows && rows.length > 0) {
      console.log("Default admin already exists — skipping.");
      return;
    }

    const hashed = await bcrypt.hash("admin123", 10);
    await db.execute(
      `INSERT INTO admin_users (username, email, password, full_name) VALUES (?, ?, ?, ?)`,
      ["admin", "admin@schoolfee.in", hashed, "System Administrator"]
    );

    console.log("Default admin created — username: admin / password: admin123");
    console.log("Change password after first login!");
  } catch (err: any) {
    if (err?.code === "ER_NO_SUCH_TABLE") {
      console.warn("admin_users table not found — skipping admin seed.");
    } else {
      throw err;
    }
  }
}

// ─── Session cleanup ──────────────────────────────────────────────────────────

async function cleanupExpiredSessions(): Promise<void> {
  try {
    const [result] = await db.execute<any>(
      "DELETE FROM admin_sessions WHERE expires_at < NOW()"
    );
    const deleted = result?.affectedRows ?? 0;
    console.log("Cleaned " + deleted + " expired admin session(s).");
  } catch (err: any) {
    if (err?.code !== "ER_NO_SUCH_TABLE") {
      console.warn("Could not clean sessions:", err.message);
    }
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export async function runMigrations(): Promise<void> {
  console.log("Starting migrations...\n");

  try {
    console.log("Connecting to database...");
    console.log("  Host     : " + process.env.DB_HOST);
    console.log("  Port     : " + process.env.DB_PORT);
    console.log("  User     : " + process.env.DB_USER);
    console.log("  Database : " + process.env.DB_NAME);

    try {
      const conn = await db.getConnection();
      conn.release();
      console.log("Database connection successful!\n");
    } catch (connErr: any) {
      console.error("\nCannot connect to database!");
      console.error("  Error :", connErr.message);
      process.exit(1);
    }

    // Step 1 — tracker table
    await ensureMigrationsTable();

    // Step 2 — auto-reset stale migrations (no manual SQL needed)
    await resetStaleMigrations();

    // Step 3 — run all pending/reset migrations
    await runPendingMigrations();

    // Step 4 — seed admin
    console.log("\nChecking default admin...");
    await seedDefaultAdmin();

    // Step 5 — cleanup
    console.log("\nCleaning expired sessions...");
    await cleanupExpiredSessions();

    console.log("\nAll done!\n");
  } catch (err) {
    console.error("\nMigration process failed:", err);
    throw err;
  } finally {
    await db.end();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default runMigrations;
