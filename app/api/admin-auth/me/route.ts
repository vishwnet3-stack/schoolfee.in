import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_user_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    // Fetch session — user_source tells us exactly which table to hit
    const [sessionRows]: any = await db.execute(
      `SELECT s.user_email, s.user_id, s.user_source, s.expires_at
       FROM admin_user_sessions s
       WHERE s.session_token = ? AND s.expires_at > NOW()
       LIMIT 1`,
      [sessionToken]
    );

    if (!sessionRows.length) {
      return NextResponse.json({ success: false, error: "Session expired or invalid" }, { status: 401 });
    }

    const { user_email, user_source } = sessionRows[0];
    let user: any = null;

    // Each table has different columns — only select what actually exists per table.
    // user_source directs us to the right table; fall through all for old sessions without it.

    if (!user && (user_source === "waitlist" || !user_source)) {
      try {
        const [rows]: any = await db.execute(
          `SELECT id, full_name, email, phone, role, status, created_at FROM waitlist WHERE email = ? LIMIT 1`,
          [user_email]
        );
        if (rows.length > 0) user = { ...rows[0] };
      } catch { /* skip if column mismatch */ }
    }

    if (!user && (user_source === "teacher_registrations" || !user_source)) {
      // teacher_registrations has: id, full_name, email, phone, status — NO created_at
      const [rows]: any = await db.execute(
        `SELECT id, full_name, email, phone, 'teacher' AS role, status FROM teacher_registrations WHERE email = ? LIMIT 1`,
        [user_email]
      );
      if (rows.length > 0) user = { ...rows[0], created_at: null };
    }

    if (!user && (user_source === "parent_registrations" || !user_source)) {
      try {
        const [rows]: any = await db.execute(
          `SELECT id, full_name, email, phone, 'parent' AS role, status FROM parent_registrations WHERE email = ? LIMIT 1`,
          [user_email]
        );
        if (rows.length > 0) user = { ...rows[0], created_at: null };
      } catch { /* skip if column mismatch */ }
    }

    if (!user && (user_source === "school_registrations" || !user_source)) {
      // school_registrations: name → school_name, phone → contact_number, NO created_at
      const [rows]: any = await db.execute(
        `SELECT id, school_name AS full_name, official_email AS email,
                contact_number AS phone, 'school' AS role, status
         FROM school_registrations WHERE official_email = ? OR principal_email = ? LIMIT 1`,
        [user_email, user_email]
      );
      if (rows.length > 0) user = { ...rows[0], created_at: null };
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id:         user.id,
        name:       user.full_name,
        email:      user.email,
        phone:      user.phone      ?? null,
        role:       user.role,
        status:     user.status,
        created_at: user.created_at ?? null,
        source:     user_source     || "waitlist",
      },
    });

  } catch (error: any) {
    console.error("Admin auth me error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}