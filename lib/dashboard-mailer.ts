// lib/dashboard-mailer.ts
// Separate mailer for Admin Dashboard (Super Admin user management)
// Do NOT modify lib/mailer.ts for dashboard-related emails

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "schoolfee.in@gmail.com",
    pass: (process.env.GMAIL_PASS || "rycwxowlurroljhqq").replace(/\s/g, ""),
  },
});

const ADMIN_EMAIL = "schoolfee.in@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ─── Email Templates ──────────────────────────────────────────────────────────

const dashboardTemplates = {
  // Sent to newly created user with their login credentials
  newUserCredentials: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    loginUrl: string;
  }) => ({
    subject: "Your Schoolfee Dashboard Account Has Been Created",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2c3e50; margin: 0; padding: 0; background-color: #f4f6f9; }
          .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #00468E 0%, #003570 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 700; }
          .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.85; }
          .content { padding: 35px 30px; }
          .content p { color: #2c3e50; margin: 12px 0; }
          .credentials-box { background: #EBF5FF; border: 1px solid #00468E; border-radius: 10px; padding: 24px; margin: 24px 0; }
          .credentials-box h3 { margin: 0 0 16px 0; color: #00468E; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
          .cred-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(0,70,142,0.15); }
          .cred-row:last-child { border-bottom: none; }
          .cred-label { font-weight: 600; color: #555; font-size: 13px; }
          .cred-value { font-size: 13px; color: #00468E; font-weight: 700; word-break: break-all; }
          .btn { display: inline-block; background: #00468E; color: white !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 20px 0; }
          .warning { background: #fff8e1; border: 1px solid #ffc107; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #856404; }
          .footer { text-align: center; padding: 24px 30px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px; }
          .role-badge { display: inline-block; background: #00468E; color: white; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-left: 8px; vertical-align: middle; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Schoolfee Dashboard</h1>
            <p>Your admin account has been created</p>
          </div>
          <div class="content">
            <p>Dear <strong>${data.name}</strong>,</p>
            <p>Your dashboard account on <strong>Schoolfee.in</strong> has been created by the Super Admin. You can now log in to access your dashboard.</p>

            <div class="credentials-box">
              <h3>Your Login Credentials</h3>
              <div class="cred-row">
                <span class="cred-label">Login URL</span>
                <span class="cred-value">${data.loginUrl}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Email</span>
                <span class="cred-value">${data.email}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Password</span>
                <span class="cred-value">${data.password}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Role</span>
                <span class="cred-value">${data.role}</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${data.loginUrl}" class="btn">Login to Dashboard</a>
            </div>

            <div class="warning">
              ⚠️ <strong>Important:</strong> Please change your password immediately after your first login. Keep your credentials secure and do not share them with anyone.
            </div>

            <p>If you have any questions, please contact the Super Admin.</p>
            <p style="margin-top: 28px;">Regards,<br><strong>Team Schoolfee.in</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Schoolfee.in — India's First Community-Based Education Social Security System</p>
            <p>This is an automated email. Please do not reply directly to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Sent to super admin when a new dashboard user is created
  adminUserCreatedNotification: (data: {
    name: string;
    email: string;
    role: string;
    phone?: string;
    createdBy: string;
  }) => ({
    subject: `New Dashboard User Created: ${data.name} (${data.role})`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', sans-serif; color: #2c3e50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #00468E; color: white; padding: 24px; border-radius: 8px 8px 0 0; }
          .header h2 { margin: 0; font-size: 20px; }
          .info-box { background: #f8f9fa; padding: 24px; border: 1px solid #00468E; border-radius: 0 0 8px 8px; }
          .row { display: flex; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
          .row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #00468E; width: 120px; font-size: 13px; }
          .value { color: #2c3e50; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Dashboard User Created</h2>
          </div>
          <div class="info-box">
            <div class="row"><span class="label">Name</span><span class="value">${data.name}</span></div>
            <div class="row"><span class="label">Email</span><span class="value">${data.email}</span></div>
            <div class="row"><span class="label">Role</span><span class="value">${data.role}</span></div>
            ${data.phone ? `<div class="row"><span class="label">Phone</span><span class="value">${data.phone}</span></div>` : ""}
            <div class="row"><span class="label">Created By</span><span class="value">${data.createdBy}</span></div>
            <div class="row"><span class="label">Created At</span><span class="value">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span></div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Sent to user when their account is updated
  accountUpdated: (data: { name: string; email: string; changes: string }) => ({
    subject: "Your Schoolfee Dashboard Account Has Been Updated",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', sans-serif; color: #2c3e50; background: #f4f6f9; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #00468E, #003570); color: white; padding: 32px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; }
          .content { padding: 30px; }
          .info-box { background: #EBF5FF; border: 1px solid #00468E; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Account Updated</h1></div>
          <div class="content">
            <p>Dear <strong>${data.name}</strong>,</p>
            <p>Your Schoolfee dashboard account has been updated by the administrator.</p>
            <div class="info-box">
              <strong>Changes made:</strong><br><br>
              ${data.changes}
            </div>
            <p>If you did not expect these changes, please contact the Super Admin immediately.</p>
            <p style="margin-top: 24px;">Regards,<br><strong>Team Schoolfee.in</strong></p>
          </div>
          <div class="footer">© 2025 Schoolfee.in. All rights reserved.</div>
        </div>
      </body>
      </html>
    `,
  }),
};

// ─── Send Functions ───────────────────────────────────────────────────────────

async function sendDashboardEmail(
  to: string,
  template: keyof typeof dashboardTemplates,
  data: any
) {
  try {
    const emailContent = (dashboardTemplates[template] as any)(data);

    const info = await transporter.sendMail({
      from: '"Schoolfee Admin" <schoolfee.in@gmail.com>',
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
        "X-Entity-Ref-ID": Date.now().toString(),
      },
    });

    console.log("Dashboard email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Dashboard email error:", error);
    return { success: false, error };
  }
}

// Send credentials email to new dashboard user
export async function sendUserCredentialsEmail(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const loginUrl = `${SITE_URL}/dashboard/super-admin/login`;
  return sendDashboardEmail(data.email, "newUserCredentials", {
    ...data,
    loginUrl,
  });
}

// Notify super admin about new user creation
export async function sendAdminUserCreatedNotification(data: {
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdBy?: string;
}) {
  return sendDashboardEmail(ADMIN_EMAIL, "adminUserCreatedNotification", {
    ...data,
    createdBy: data.createdBy || "Super Admin",
  });
}

// Send account update notification to user
export async function sendAccountUpdatedEmail(data: {
  name: string;
  email: string;
  changes: string;
}) {
  return sendDashboardEmail(data.email, "accountUpdated", data);
}