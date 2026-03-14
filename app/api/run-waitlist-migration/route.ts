// app/api/run-waitlist-migration/route.ts
// GET /api/run-waitlist-migration
// Hit this URL once in your browser to create all waitlist & parent auth tables

import { NextResponse } from 'next/server';
import { up } from '@/lib/migrations/013_waitlist_and_parent_auth';

export async function GET() {
  try {
    await up();
    return NextResponse.json({
      success: true,
      message: 'Migration 013 completed — waitlist, waitlist_otps, parent_auth_otps, parent_sessions tables created.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}