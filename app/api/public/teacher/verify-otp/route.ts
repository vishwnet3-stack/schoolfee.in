// app/api/public/teacher/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const [rows]: any = await db.execute(
      `SELECT id FROM teacher_email_otps
       WHERE email = ? AND otp = ? AND expires_at > NOW() AND used = 0
       ORDER BY id DESC LIMIT 1`,
      [normalizedEmail, otp]
    );

    if (!rows.length) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP. Please try again." },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await db.execute(`UPDATE teacher_email_otps SET used = 1 WHERE id = ?`, [
      rows[0].id,
    ]);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    console.error("Teacher verify-otp error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}   