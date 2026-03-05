// app/api/fix-contact-queries/route.ts
// TEMPORARY FIX - Run once to add email column
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔧 Fixing contact_queries table...');

    // Check if email column exists
    const [columns] = await db.execute<any[]>(
      `SHOW COLUMNS FROM contact_queries LIKE 'email'`
    );

    if (columns.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Email column already exists!',
      });
    }

    // Add email column after query_text
    await db.execute(`
      ALTER TABLE contact_queries 
      ADD COLUMN email VARCHAR(200) AFTER query_text,
      ADD INDEX idx_email (email)
    `);

    console.log('✅ Email column added successfully!');

    return NextResponse.json({
      success: true,
      message: 'Email column added to contact_queries table',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('❌ Fix failed:', error);
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