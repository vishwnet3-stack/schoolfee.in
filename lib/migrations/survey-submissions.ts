// lib/migrations/survey-submissions.ts
// Migration for tracking survey submissions by users and employees

import { db } from '../db';

const surveySubmissionsTables = {
  survey_submissions: `
    CREATE TABLE IF NOT EXISTS survey_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      employee_id INT,
      survey_data LONGTEXT NOT NULL,
      ip_address VARCHAR(45),
      user_agent TEXT,
      status ENUM('new', 'reviewed', 'contacted', 'completed') DEFAULT 'new',
      admin_notes TEXT,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user (user_id),
      INDEX idx_employee (employee_id),
      INDEX idx_status (status),
      INDEX idx_submitted (submitted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
};

export async function migrateSurveySubmissionsTables() {
  console.log('🔧 Creating survey submissions tables...');

  try {
    const tableOrder = ['survey_submissions'];

    for (const tableName of tableOrder) {
      const schema = surveySubmissionsTables[tableName as keyof typeof surveySubmissionsTables];
      await db.execute(schema);
      console.log(`✅ Table created: ${tableName}`);
    }

    console.log('✅ Survey submissions tables created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error creating survey submissions tables:', error);
    throw error;
  }
}

export default migrateSurveySubmissionsTables;
