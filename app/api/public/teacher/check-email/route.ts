// app/api/public/teacher/check-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, blocked: true, error: "Valid email is required" },
        { status: 400 }
      );
    }

    const e = email.toLowerCase().trim();

    // 1. Already a teacher?
    try {
      const [rows]: any = await db.execute(
        `SELECT id FROM teacher_registrations WHERE email = ? LIMIT 1`,
        [e]
      );
      if (rows.length > 0) {
        return NextResponse.json({
          success: false,
          blocked: true,
          reason: "already_registered",
          error: "This email is already registered as a teacher. Please use a different email.",
        });
      }
    } catch (err: any) {
      console.error("check-email: teacher_registrations query failed:", err.message);
      // If table doesn't exist yet, that's fine — treat as not found
    }

    // 2. Already a parent?
    try {
      const [rows]: any = await db.execute(
        `SELECT id FROM parent_registrations WHERE email = ? LIMIT 1`,
        [e]
      );
      if (rows.length > 0) {
        return NextResponse.json({
          success: false,
          blocked: true,
          reason: "email_used_other_form",
          error: "This email is already used for a parent registration. Each email can only be used for one form.",
        });
      }
    } catch (err: any) {
      console.error("check-email: parent_registrations query failed:", err.message);
    }

    // 3. Already a school? (school table uses official_email and principal_email, not email)
    try {
      const [rows]: any = await db.execute(
        `SELECT id FROM school_registrations WHERE official_email = ? OR principal_email = ? LIMIT 1`,
        [e, e]
      );
      if (rows.length > 0) {
        return NextResponse.json({
          success: false,
          blocked: true,
          reason: "email_used_other_form",
          error: "This email is already used for a school registration. Each email can only be used for one form.",
        });
      }
    } catch (err: any) {
      console.error("check-email: school_registrations query failed:", err.message);
    }

    // 4. In waitlist?
    try {
      const [rows]: any = await db.execute(
        `SELECT id, full_name, role FROM waitlist WHERE email = ? LIMIT 1`,
        [e]
      );
      if (rows.length > 0) {
        const row = rows[0];
        if (row.role !== "teacher") {
          return NextResponse.json({
            success: false,
            blocked: true,
            reason: "waitlist_wrong_role",
            error: `This email joined the waitlist as "${row.role}". It can only be used for the ${row.role} registration form.`,
          });
        }
        // Waitlist teacher — pre-verified
        return NextResponse.json({
          success: true,
          status: "waitlist_verified",
          message: "Email already verified from waitlist. No OTP required.",
        });
      }
    } catch (err: any) {
      console.error("check-email: waitlist query failed:", err.message);
      // waitlist table may not exist — treat as no entry
    }

    // 5. New email — needs OTP
    return NextResponse.json({
      success: true,
      status: "new_email",
      message: "Email is available. Please verify via OTP.",
    });

  } catch (error: any) {
    console.error("check-email: unexpected error:", error.message);
    // Always return a usable response — never leave the frontend spinning
    return NextResponse.json(
      { success: true, status: "new_email", message: "Please verify your email via OTP." },
      { status: 200 }
    );
  }
}