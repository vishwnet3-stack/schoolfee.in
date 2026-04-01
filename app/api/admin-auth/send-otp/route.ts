export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "schoolfee.in@gmail.com",
    pass: "rycwxowlurrojhqq",
  },
});

// Resolve a user record from ANY registration table.
// Priority: waitlist → teacher_registrations → parent_registrations → school_registrations
async function resolveUser(normalizedEmail: string): Promise<{
  id: number;
  full_name: string;
  email: string;
  role: "parent" | "teacher" | "school";
  status: string;
  source: "waitlist" | "teacher_registrations" | "parent_registrations" | "school_registrations";
} | null> {
  // 1. Waitlist (legacy / pre-approved users)
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

  // 4. School registrations (uses official_email)
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
    const { email } = await request.json();
    if (!email) return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });

    const normalizedEmail = email.toLowerCase().trim();

    // Ensure OTP table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admin_user_otps (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        otp_code VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        used TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);

    const user = await resolveUser(normalizedEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No account found with this email. Please register first." },
        { status: 404 }
      );
    }

    // Delete old OTPs for this email
    await db.execute(`DELETE FROM admin_user_otps WHERE email = ?`, [normalizedEmail]);

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.execute(
      `INSERT INTO admin_user_otps (email, otp_code, expires_at) VALUES (?, ?, ?)`,
      [normalizedEmail, otp, expiresAt]
    );

    // Send OTP email
    const roleLabel =
      user.role === "parent"  ? "Parent"  :
      user.role === "teacher" ? "Teacher" : "School";

    await transporter.sendMail({
      from: '"Schoolfee Dashboard" <schoolfee.in@gmail.com>',
      to: normalizedEmail,
      subject: "Your Schoolfee Dashboard Login OTP",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
        <body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;margin:0;padding:0;">
          <div style="max-width:520px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <div style="background:linear-gradient(135deg,#00468E,#003570);padding:32px 40px;text-align:center;">
              <img src="https://schoolfee.in/logo/schoolfee%20logo.webp" alt="Schoolfee" style="height:40px;filter:brightness(0)invert(1);" />
              <h2 style="color:#ffffff;margin:16px 0 4px;font-size:20px;">Dashboard Login OTP</h2>
              <p style="color:rgba(255,255,255,0.75);margin:0;font-size:14px;">${roleLabel} Portal Access</p>
            </div>
            <div style="padding:36px 40px;">
              <p style="color:#444;font-size:15px;margin:0 0 8px;">Hello, <strong>${user.full_name}</strong></p>
              <p style="color:#666;font-size:14px;margin:0 0 28px;">Use the OTP below to log in to your Schoolfee <strong>${roleLabel}</strong> dashboard.</p>
              <div style="text-align:center;margin:28px 0;">
                <div style="display:inline-block;background:#f0f5ff;border:2px dashed #00468E;border-radius:12px;padding:20px 40px;">
                  <span style="font-size:38px;font-weight:800;letter-spacing:10px;color:#00468E;">${otp}</span>
                </div>
              </div>
              <p style="color:#999;font-size:12px;text-align:center;margin:12px 0 0;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
              <div style="margin-top:28px;padding-top:20px;border-top:1px solid #f0f0f0;">
                <p style="color:#bbb;font-size:11px;text-align:center;margin:0;">
                  If you didn't request this, please ignore this email or contact 
                  <a href="mailto:support@schoolfee.in" style="color:#00468E;">support@schoolfee.in</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      role: user.role,
      name: user.full_name,
    });

  } catch (error: any) {
    console.error("Admin auth send-otp error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}