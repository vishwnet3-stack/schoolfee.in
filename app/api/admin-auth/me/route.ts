export const dynamic = 'force-dynamic';
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

    // Targeted single-query lookup based on user_source (fast path)
    if (user_source === "teacher_registrations") {
      const [rows]: any = await db.execute(
        `SELECT id, full_name, email, phone, 'teacher' AS role, status FROM teacher_registrations WHERE email = ? LIMIT 1`,
        [user_email]
      );
      if (rows.length > 0) user = { ...rows[0], created_at: null };
    } else if (user_source === "parent_registrations") {
      const [rows]: any = await db.execute(
        `SELECT id, full_name, email, phone, 'parent' AS role, status FROM parent_registrations WHERE email = ? LIMIT 1`,
        [user_email]
      );
      if (rows.length > 0) user = { ...rows[0], created_at: null };
    } else if (user_source === "school_registrations") {
      const [rows]: any = await db.execute(
        `SELECT id, school_name AS full_name, official_email AS email,
                contact_number AS phone, 'school' AS role, status
         FROM school_registrations WHERE official_email = ? OR principal_email = ? LIMIT 1`,
        [user_email, user_email]
      );
      if (rows.length > 0) user = { ...rows[0], created_at: null };
    } else {
      // waitlist (default / legacy sessions without user_source)
      try {
        const [rows]: any = await db.execute(
          `SELECT id, full_name, email, phone, role, status, created_at FROM waitlist WHERE email = ? LIMIT 1`,
          [user_email]
        );
        if (rows.length > 0) user = { ...rows[0] };
      } catch { /* skip if column mismatch */ }
    }

    // Fallback: scan remaining tables for legacy sessions with no user_source
    if (!user && !user_source) {
      for (const query of [
        [`SELECT id, full_name, email, phone, 'teacher' AS role, status FROM teacher_registrations WHERE email = ? LIMIT 1`, false],
        [`SELECT id, full_name, email, phone, 'parent' AS role, status FROM parent_registrations WHERE email = ? LIMIT 1`, false],
        [`SELECT id, school_name AS full_name, official_email AS email, contact_number AS phone, 'school' AS role, status FROM school_registrations WHERE official_email = ? OR principal_email = ? LIMIT 1`, true],
      ] as [string, boolean][]) {
        try {
          const params = query[1] ? [user_email, user_email] : [user_email];
          const [rows]: any = await db.execute(query[0], params);
          if (rows.length > 0) { user = { ...rows[0], created_at: null }; break; }
        } catch { /* skip */ }
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json({
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

    // Cache for 30 seconds on the client — avoids hammering the DB on rapid navigation
    // while staying fresh enough for session validity checks
    response.headers.set("Cache-Control", "private, max-age=30");

    return response;

  } catch (error: any) {
    console.error("Admin auth me error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
