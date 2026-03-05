import { db } from "../db";

export const migrationName = "008_survey_responses";

export async function up(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id INT AUTO_INCREMENT PRIMARY KEY,

      -- Basic Information
      father_name VARCHAR(200),
      mother_name VARCHAR(200),
      guardian_name VARCHAR(200),
      address TEXT NOT NULL,
      state VARCHAR(100) NOT NULL,
      mobile_number VARCHAR(15) NOT NULL,
      alternate_mobile VARCHAR(15),
      email VARCHAR(200) NOT NULL,

      -- Family Information
      family_type VARCHAR(50) NOT NULL,
      number_of_children VARCHAR(10) NOT NULL,
      school_type_quantity JSON NOT NULL,

      -- Financial Stress
      monthly_income VARCHAR(50) NOT NULL,
      income_source VARCHAR(100) NOT NULL,
      delay_in_fee VARCHAR(10) NOT NULL,
      reason_for_delay VARCHAR(100),
      reason_for_delay_other TEXT,

      -- Community Support
      support_source VARCHAR(100) NOT NULL,
      support_source_other TEXT,
      community_support VARCHAR(100),
      school_incidents JSON,
      school_incidents_other TEXT,
      social_isolation VARCHAR(10) NOT NULL,
      isolation_reason TEXT,

      -- Government Aid
      gov_assistance VARCHAR(10) NOT NULL,
      gov_application VARCHAR(50),
      gov_help_reasons VARCHAR(100),
      gov_help_reasons_other TEXT,
      bank_short_term VARCHAR(10) NOT NULL,
      bank_reasons VARCHAR(100),
      bank_reasons_other TEXT,

      -- Borrowing Patterns
      borrowing_source VARCHAR(100) NOT NULL,
      borrowing_details JSON,
      interest_rate VARCHAR(50),
      interest_rate_other TEXT,

      -- Support Model
      preferred_duration VARCHAR(100) NOT NULL,
      confidential_support VARCHAR(100) NOT NULL,
      recommend VARCHAR(100) NOT NULL,

      -- Open Feedback
      education_fear TEXT NOT NULL,
      support_needed TEXT NOT NULL,
      community_network VARCHAR(100) NOT NULL,

      -- Metadata
      ip_address VARCHAR(45),
      user_agent TEXT,
      status ENUM('new', 'reviewed', 'contacted', 'completed') DEFAULT 'new',
      admin_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      INDEX idx_mobile (mobile_number),
      INDEX idx_email (email),
      INDEX idx_state (state),
      INDEX idx_status (status),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("  ✅ survey_responses");
}