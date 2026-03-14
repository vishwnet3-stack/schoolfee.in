// app/api/waitlist/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and OTP are required" }, { status: 400 });
    }

    const [rows]: any = await db.execute(
      `SELECT id FROM waitlist_otps WHERE email = ? AND otp = ? AND expires_at > NOW() AND used = 0 ORDER BY id DESC LIMIT 1`,
      [email.toLowerCase().trim(), otp]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Mark OTP as used
    await db.execute(`UPDATE waitlist_otps SET used = 1 WHERE id = ?`, [rows[0].id]);

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ success: false, error: "Failed to verify OTP" }, { status: 500 });
  }
}