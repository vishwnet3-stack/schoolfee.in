// app/api/waitlist/join/route.ts
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

const DASHBOARD_BASE_URL = "https://schoolfee.in/dashboard/admin/login";

function getRoleDashboardUrl(role: string): string {
  return DASHBOARD_BASE_URL;
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    parent: "Parent",
    teacher: "Teacher",
    school: "School",
  };
  return labels[role] || role;
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, role } = await request.json();

    if (!fullName || !email || !phone || !role) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }
    if (!["parent", "teacher", "school"].includes(role)) {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
    }

    // Ensure waitlist table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id INT PRIMARY KEY AUTO_INCREMENT,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        role ENUM('parent','teacher','school') NOT NULL,
        status ENUM('pending','approved','rejected') DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);

    // Check duplicate
    const [existing]: any = await db.execute(
      `SELECT id FROM waitlist WHERE email = ?`,
      [email.toLowerCase().trim()]
    );
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "This email is already on the waitlist" }, { status: 409 });
    }

    // Insert into waitlist
    await db.execute(
      `INSERT INTO waitlist (full_name, email, phone, role) VALUES (?, ?, ?, ?)`,
      [fullName.trim(), email.toLowerCase().trim(), phone.trim(), role]
    );

    const dashboardUrl = getRoleDashboardUrl(role);
    const roleLabel = getRoleLabel(role);

    // Send success email
    await transporter.sendMail({
      from: `"Schoolfee.in" <vishwnet.schoolfee@gmail.com>`,
      to: email,
      subject: `Welcome to Schoolfee Waitlist — ${roleLabel} Registration Confirmed`,
      html: `
        <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
        <body style="font-family:'Segoe UI',sans-serif;background:#f4f6f9;margin:0;padding:0;">
          <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#00468E,#003570);padding:32px 24px;text-align:center;">
              <img src="https://schoolfee.in/logo/schoolfee%20logo.webp" alt="Schoolfee" style="height:44px;margin-bottom:16px;" />
              <h1 style="color:#fff;font-size:22px;margin:0;">You're on the Waitlist!</h1>
              <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:8px 0 0;">Welcome to the Schoolfee family</p>
            </div>
            <div style="padding:32px 24px;">
              <p style="color:#444;font-size:15px;">Dear <strong>${fullName}</strong>,</p>
              <p style="color:#444;font-size:15px;">Thank you for joining the Schoolfee waitlist as a <strong>${roleLabel}</strong>. We're excited to have you on board!</p>
              <p style="color:#444;font-size:15px;">Once your account is approved, you can manage all your activities through your personalized dashboard:</p>
              <div style="text-align:center;margin:24px 0;">
                <a href="${dashboardUrl}" style="background:linear-gradient(135deg,#00468E,#0056b3);color:#fff;text-decoration:none;padding:14px 32px;border-radius:30px;font-weight:700;font-size:15px;display:inline-block;">
                  Access Your Dashboard
                </a>
              </div>
              <div style="background:#f0f7ff;border-left:4px solid #00468E;border-radius:8px;padding:16px;margin:20px 0;">
                <p style="margin:0;color:#00468E;font-weight:600;font-size:14px;">What's next?</p>
                <ul style="color:#444;font-size:14px;margin:8px 0 0;padding-left:20px;">
                  <li>Our team will review your registration</li>
                  <li>You'll receive login credentials via email</li>
                  <li>Log in using your email and OTP at: <a href="${dashboardUrl}" style="color:#00468E;">${dashboardUrl}</a></li>
                </ul>
              </div>
            </div>
            <div style="background:#f8fafc;padding:16px 24px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="color:#999;font-size:12px;margin:0;">Questions? Email us at <a href="mailto:support@schoolfee.in" style="color:#00468E;">support@schoolfee.in</a></p>
              <p style="color:#bbb;font-size:11px;margin:8px 0 0;">© 2025 Schoolfee.in — All rights reserved</p>
            </div>
          </div>
        </body></html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully joined the waitlist! Check your email for confirmation.",
    });
  } catch (error: any) {
    console.error("Waitlist join error:", error);
    return NextResponse.json({ success: false, error: "Failed to join waitlist. Please try again." }, { status: 500 });
  }
}