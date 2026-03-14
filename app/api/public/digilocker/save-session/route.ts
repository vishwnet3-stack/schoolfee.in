// app/api/public/digilocker/save-session/route.ts
// Called by browser AFTER it gets client_id back from Surepass directly
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { clientId, redirectUrl } = await request.json();
    if (!clientId) {
      return NextResponse.json({ success: false, error: "clientId is required" }, { status: 400 });
    }
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await db.execute(
      `INSERT INTO digilocker_sessions (client_id, redirect_url, status, expires_at)
       VALUES (?, ?, 'initiated', ?)
       ON DUPLICATE KEY UPDATE
         redirect_url = VALUES(redirect_url),
         status = 'initiated',
         expires_at = VALUES(expires_at),
         updated_at = NOW()`,
      [clientId, redirectUrl || "", expiresAt]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("save-session error:", error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}