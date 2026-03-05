// app/api/run-migrations/route.ts
import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/migrate';

export async function GET() {
  try {
    await runMigrations();
    
    return NextResponse.json({
      success: true,
      message: 'All migrations completed successfully!',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Migration failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}