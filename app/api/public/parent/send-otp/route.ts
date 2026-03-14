// app/api/public/parent/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vishwnet.schoolfee@gmail.com",
    pass: "jjoa hcgw gwyz cnvt",
  },
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await db.execute(`
      CREATE TABLE IF NOT EXISTS parent_email_otps (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        email      VARCHAR(255) NOT NULL,
        otp        VARCHAR(6)   NOT NULL,
        expires_at DATETIME     NOT NULL,
        used       TINYINT(1)   DEFAULT 0,
        created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await db.execute(
      `UPDATE parent_email_otps SET used = 1 WHERE email = ? AND used = 0`,
      [normalizedEmail]
    );

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.execute(
      `INSERT INTO parent_email_otps (email, otp, expires_at) VALUES (?, ?, ?)`,
      [normalizedEmail, otp, expiresAt]
    );

    await transporter.sendMail({
      from: `"Schoolfee.in" <vishwnet.schoolfee@gmail.com>`,
      to: normalizedEmail,
      subject: "Your Email Verification OTP - Schoolfee Parent Registration",
      html: `
        <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
        <body style="font-family:'Segoe UI',sans-serif;background:#f4f6f9;margin:0;padding:0;">
          <div style="max-width:500px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#00468E,#003570);padding:30px 24px;text-align:center;">
              <h2 style="color:#fff;margin:0;font-size:20px;">Email Verification</h2>
              <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:6px 0 0;">Schoolfee Parent Registration</p>
            </div>
            <div style="padding:32px 24px;text-align:center;">
              <p style="color:#444;font-size:15px;margin-bottom:8px;">Use the OTP below to verify your email address:</p>
              <div style="background:#f0f7ff;border:2px dashed #00468E;border-radius:12px;padding:20px;margin:20px auto;display:inline-block;">
                <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#00468E;">${otp}</span>
              </div>
              <p style="color:#777;font-size:13px;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
              <p style="color:#999;font-size:12px;margin-top:16px;">If you did not request this, please ignore this email.</p>
            </div>
            <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#aaa;font-size:11px;margin:0;">© ${new Date().getFullYear()} Schoolfee.in — All rights reserved</p>
            </div>
          </div>
        </body></html>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent to your email address" });
  } catch (error: any) {
    console.error("Parent send-otp error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}