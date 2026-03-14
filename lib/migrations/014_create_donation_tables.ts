import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

async function runMigration() {
  console.log("🚀 Running donation system migration...\n");

  const db = await mysql.createConnection({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    ssl: process.env.DB_HOST !== "localhost" ? { rejectUnauthorized: false } : undefined,
    multipleStatements: true,
  });

  try {
    // ── 1. app_config ──────────────────────────────────────────────────────────
    console.log("Creating table: app_config...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`app_config\` (
        \`id\`           INT AUTO_INCREMENT PRIMARY KEY,
        \`config_key\`   VARCHAR(100) UNIQUE NOT NULL,
        \`config_value\` TEXT,
        \`updated_at\`   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("  ✓ app_config ready\n");

    // ── 2. Seed default config values ─────────────────────────────────────────
    console.log("Seeding app_config defaults...");
    await db.query(`
      INSERT IGNORE INTO \`app_config\` (\`config_key\`, \`config_value\`) VALUES
        ('donation_min_amount', '1000'),
        ('donation_max_amount', '50000000')
    `);
    console.log("  ✓ donation_min_amount = 1000");
    console.log("  ✓ donation_max_amount = 50000000\n");

    // ── 3. donation_payments ───────────────────────────────────────────────────
    console.log("Creating table: donation_payments...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`donation_payments\` (
        \`id\`                    INT AUTO_INCREMENT PRIMARY KEY,
        \`receipt_number\`        VARCHAR(30)   UNIQUE NOT NULL COMMENT 'e.g. SFD-20250601-ABC123',
        \`razorpay_order_id\`     VARCHAR(100)  UNIQUE         COMMENT 'Razorpay order_id',
        \`razorpay_payment_id\`   VARCHAR(100)  UNIQUE         COMMENT 'Razorpay payment_id after success',
        \`razorpay_signature\`    VARCHAR(256)                 COMMENT 'HMAC-SHA256 signature from Razorpay',

        \`org_name\`              VARCHAR(255)  NOT NULL,
        \`org_type\`              VARCHAR(100),
        \`org_registration\`      VARCHAR(100)  COMMENT 'CIN / NGO Reg. / Trust No.',

        \`contact_name\`          VARCHAR(255)  NOT NULL,
        \`contact_designation\`   VARCHAR(100),
        \`contact_email\`         VARCHAR(255)  NOT NULL,
        \`contact_phone\`         VARCHAR(20)   NOT NULL,

        \`address_line1\`         VARCHAR(500),
        \`address_city\`          VARCHAR(100),
        \`address_state\`         VARCHAR(100),
        \`address_pincode\`       VARCHAR(10),
        \`address_country\`       VARCHAR(50)   DEFAULT 'India',

        \`amount\`                DECIMAL(12,2) NOT NULL COMMENT 'Server-stored amount in INR',
        \`currency\`              VARCHAR(10)   DEFAULT 'INR',
        \`donation_purpose\`      VARCHAR(255),
        \`donation_note\`         TEXT,

        \`pan_number\`            VARCHAR(10)   COMMENT 'Donor PAN for 80G',
        \`consent_80g\`           TINYINT(1)    DEFAULT 0 COMMENT '1 = donor wants 80G certificate',

        \`status\`                ENUM('pending','processing','success','failed','refunded') DEFAULT 'pending',
        \`error_code\`            VARCHAR(100)  COMMENT 'Razorpay error code on failure',
        \`error_description\`     TEXT          COMMENT 'Razorpay error description on failure',
        \`ip_address\`            VARCHAR(45)   COMMENT 'Donor IP for rate limiting',
        \`user_agent\`            VARCHAR(500),

        \`created_at\`            DATETIME      DEFAULT CURRENT_TIMESTAMP,
        \`paid_at\`               DATETIME      NULL COMMENT 'Set when payment is verified',
        \`updated_at\`            DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        INDEX \`idx_email\`   (\`contact_email\`),
        INDEX \`idx_status\`  (\`status\`),
        INDEX \`idx_created\` (\`created_at\`),
        INDEX \`idx_ip\`      (\`ip_address\`),
        INDEX \`idx_order\`   (\`razorpay_order_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("  ✓ donation_payments ready\n");

    // ── 4. Verify tables exist ─────────────────────────────────────────────────
    console.log("Verifying tables...");
    const [tables] = await db.query<any[]>(`SHOW TABLES LIKE 'donation%'`);
    const [configs] = await db.query<any[]>(`SELECT config_key, config_value FROM app_config`);

    console.log(`  ✓ Tables found: ${tables.map((t: any) => Object.values(t)[0]).join(", ")}`);
    console.log(`  ✓ Config rows: ${configs.map((r: any) => `${r.config_key}=${r.config_value}`).join(", ")}`);

    console.log("\n✅ Migration completed successfully!");
    console.log("\nNext steps:");
    console.log("  1. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env");
    console.log("  2. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to your .env");
    console.log("  3. Add ADMIN_NOTIFICATION_EMAIL to your .env");

  } catch (err: any) {
    console.error("\n❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    await db.end();
  }
}

runMigration();