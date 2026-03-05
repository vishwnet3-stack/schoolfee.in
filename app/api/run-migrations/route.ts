  // app/api/run-migrations/route.ts
  // TEMPORARY API ROUTE - Delete after running migrations
  import { NextResponse } from 'next/server';
  import { db } from '@/lib/db';

  export async function GET() {
    try {
      console.log('🚀 Starting database migrations...');

      // Define table schemas
      const tables = [
        {
          name: 'quick_signups',
          sql: `
            CREATE TABLE IF NOT EXISTS quick_signups (
              id INT AUTO_INCREMENT PRIMARY KEY,
              mobile VARCHAR(15) NOT NULL,
              source ENUM('hero', 'cta_bottom') DEFAULT 'hero',
              ip_address VARCHAR(45),
              user_agent TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              INDEX idx_mobile (mobile),
              INDEX idx_source (source),
              INDEX idx_created (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `
        },
        {
          name: 'invitation_registrations',
          sql: `
            CREATE TABLE IF NOT EXISTS invitation_registrations (
              id INT AUTO_INCREMENT PRIMARY KEY,
              role ENUM('Parent Member', 'Partner School', 'CSR Partner', 'Donor/Community', 'Educationist/Policy Advocate') NOT NULL,
              name VARCHAR(200) NOT NULL,
              city VARCHAR(100) NOT NULL,
              mobile VARCHAR(15) NOT NULL,
              email VARCHAR(200) NOT NULL,
              opt_in BOOLEAN DEFAULT FALSE,
              source VARCHAR(100),
              ip_address VARCHAR(45),
              user_agent TEXT,
              status ENUM('pending', 'contacted', 'completed', 'rejected') DEFAULT 'pending',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX idx_mobile (mobile),
              INDEX idx_email (email),
              INDEX idx_role (role),
              INDEX idx_status (status),
              INDEX idx_created (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `
        },
        {
          name: 'contact_queries',
          sql: `
            CREATE TABLE IF NOT EXISTS contact_queries (
              id INT AUTO_INCREMENT PRIMARY KEY,
              query_text TEXT NOT NULL,
              email VARCHAR(200),
              ip_address VARCHAR(45),
              user_agent TEXT,
              status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
              admin_notes TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX idx_email (email),
              INDEX idx_status (status),
              INDEX idx_created (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `
        }
      ];

      const results = [];

      // Create each table
      for (const table of tables) {
        try {
          await db.execute(table.sql);
          results.push({ table: table.name, status: 'created' });
          console.log(`✅ Table created: ${table.name}`);
        } catch (error: any) {
          if (error.code === 'ER_TABLE_EXISTS_ERROR') {
            results.push({ table: table.name, status: 'already exists' });
            console.log(`ℹ️  Table already exists: ${table.name}`);
          } else {
            throw error;
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Migration completed successfully!',
        results,
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error('❌ Migration failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }
  }