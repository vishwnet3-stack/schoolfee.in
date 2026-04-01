export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

// Same multi-table resolver as send-otp
async function resolveUser(normalizedEmail: string): Promise<{
  id: number;
  full_name: string;
  email: string;
  role: "parent" | "teacher" | "school";
  status: string;
  source: "waitlist" | "teacher_registrations" | "parent_registrations" | "school_registrations";
} | null> {
  // 1. Waitlist
  const [waitlistRows]: any = await db.execute(
    `SELECT id, full_name, email, role, status FROM waitlist WHERE email = ? LIMIT 1`,
    [normalizedEmail]
  );
  if (waitlistRows.length > 0) {
    return { ...waitlistRows[0], source: "waitlist" };
  }

  // 2. Teacher registrations
  const [teacherRows]: any = await db.execute(
    `SELECT id, full_name, email, 'teacher' AS role, status FROM teacher_registrations WHERE email = ? LIMIT 1`,
    [normalizedEmail]
  );
  if (teacherRows.length > 0) {
    return { ...teacherRows[0], source: "teacher_registrations" };
  }

  // 3. Parent registrations
  const [parentRows]: any = await db.execute(
    `SELECT id, full_name, email, 'parent' AS role, status FROM parent_registrations WHERE email = ? LIMIT 1`,
    [normalizedEmail]
  );
  if (parentRows.length > 0) {
    return { ...parentRows[0], source: "parent_registrations" };
  }

  // 4. School registrations
  const [schoolRows]: any = await db.execute(
    `SELECT id, school_name AS full_name, official_email AS email, 'school' AS role, status
     FROM school_registrations WHERE official_email = ? OR principal_email = ? LIMIT 1`,
    [normalizedEmail, normalizedEmail]
  );
  if (schoolRows.length > 0) {
    return { ...schoolRows[0], source: "school_registrations" };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) return NextResponse.json({ success: false, error: "Email and OTP are required" }, { status: 400 });

    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP
    const [otpRows]: any = await db.execute(
      `SELECT id FROM admin_user_otps WHERE email = ? AND otp_code = ? AND expires_at > NOW() AND used = 0 ORDER BY created_at DESC LIMIT 1`,
      [normalizedEmail, otp]
    );

    if (!otpRows.length) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP. Please try again." }, { status: 400 });
    }

    // Mark OTP as used
    await db.execute(`UPDATE admin_user_otps SET used = 1 WHERE id = ?`, [otpRows[0].id]);

    // Resolve user from any registration table
    const user = await resolveUser(normalizedEmail);

    if (!user) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
    }

    // Ensure session table exists (original schema without user_source)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admin_user_sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        session_token VARCHAR(64) NOT NULL UNIQUE,
        user_email VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (session_token),
        INDEX idx_email (user_email)
      )
    `);

    // Add user_source column if it doesn't exist yet (ALTER is safe to run repeatedly)
    try {
      await db.execute(
        `ALTER TABLE admin_user_sessions ADD COLUMN user_source VARCHAR(50) NOT NULL DEFAULT 'waitlist'`
      );
    } catch (alterErr: any) {
      // Error 1060 = column already exists — safe to ignore
      if (alterErr.errno !== 1060) throw alterErr;
    }

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.execute(
      `INSERT INTO admin_user_sessions (session_token, user_email, user_id, user_source, expires_at) VALUES (?, ?, ?, ?, ?)`,
      [sessionToken, normalizedEmail, user.id, user.source, expiresAt]
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_user_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        id:     user.id,
        name:   user.full_name,
        email:  user.email,
        role:   user.role,
        status: user.status,
        source: user.source,
      },
    });

  } catch (error: any) {
    console.error("Admin auth verify-otp error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}