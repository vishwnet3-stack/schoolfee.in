// TEMPORARY TEST ROUTE — DELETE THIS FILE AFTER CONFIRMING EMAIL WORKS
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const user = process.env.GMAIL_USER || "schoolfee.in@gmail.com";
  const pass = (process.env.GMAIL_PASS || "rycwxowlurroljhqq").replace(/\s/g, "");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  try {
    await transporter.verify();

    // Send a real test email to yourself
    await transporter.sendMail({
      from: `"Schoolfee Test" <${user}>`,
      to: user,
      subject: "✅ Email Test - Schoolfee",
      html: "<p>Email is working correctly. You can delete <code>/app/api/test-email/route.ts</code> now.</p>",
    });

    return NextResponse.json({
      status: "✅ SUCCESS — test email sent to " + user,
      gmail_user: user,
      pass_length: pass.length, // should be 16
    });
  } catch (err: any) {
    return NextResponse.json({
      status: "❌ FAILED",
      error: err.message,
      gmail_user: user,
      pass_length: pass.length,
    }, { status: 500 });
  }
}
