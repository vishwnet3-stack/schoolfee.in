// app/api/public/digilocker/status/route.ts
// Poll whether a digilocker session has been completed by the user
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json({ success: false, error: "clientId is required" }, { status: 400 });
    }

    const [rows]: any = await db.execute(
      `SELECT client_id, status, apaar_id, full_name, date_of_birth,
              gender, aadhaar_last4, pan_number, expires_at, created_at
       FROM digilocker_sessions WHERE client_id = ? LIMIT 1`,
      [clientId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    const s = rows[0];
    const isExpired = new Date(s.expires_at) < new Date();

    return NextResponse.json({
      success: true,
      clientId: s.client_id,
      status: isExpired && s.status === "initiated" ? "expired" : s.status,
      apaarId: s.apaar_id,
      fullName: s.full_name,
      dateOfBirth: s.date_of_birth,
      gender: s.gender,
      aadhaarLast4: s.aadhaar_last4,
      panNumber: s.pan_number,
      isExpired,
    });
  } catch (error: any) {
    console.error("Digilocker status error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}