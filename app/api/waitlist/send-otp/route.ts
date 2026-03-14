// app/api/waitlist/send-otp/route.ts
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
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Ensure table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS waitlist_otps (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        used TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);

    // Invalidate any existing OTPs for this email
    await db.execute(`UPDATE waitlist_otps SET used = 1 WHERE email = ?`, [email]);

    // Insert new OTP
    await db.execute(
      `INSERT INTO waitlist_otps (email, otp, expires_at) VALUES (?, ?, ?)`,
      [email.toLowerCase().trim(), otp, expiresAt]
    );

    // Send OTP email
    await transporter.sendMail({
      from: `"Schoolfee.in" <vishwnet.schoolfee@gmail.com>`,
      to: email,
      subject: "Your OTP for Schoolfee Waitlist",
      html: `
        <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
        <body style="font-family:'Segoe UI',sans-serif;background:#f4f6f9;margin:0;padding:0;">
          <div style="max-width:500px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#00468E,#003570);padding:30px 24px;text-align:center;">
              <img src="https://schoolfee.in/logo/schoolfee%20logo.webp" alt="Schoolfee" style="height:40px;margin-bottom:12px;" />
              <h2 style="color:#fff;margin:0;font-size:20px;">Email Verification</h2>
            </div>
            <div style="padding:32px 24px;text-align:center;">
              <p style="color:#444;font-size:15px;margin-bottom:8px;">Use the OTP below to verify your email address:</p>
              <div style="background:#f0f7ff;border:2px dashed #00468E;border-radius:12px;padding:20px;margin:20px 0;display:inline-block;">
                <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#00468E;">${otp}</span>
              </div>
              <p style="color:#777;font-size:13px;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
            </div>
            <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#aaa;font-size:11px;margin:0;">© 2025 Schoolfee.in — All rights reserved</p>
            </div>
          </div>
        </body></html>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch (error: any) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 });
  }
}