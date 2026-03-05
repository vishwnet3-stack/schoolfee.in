// app/api/dashboard/auth/me/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("dashboard_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const [rows]: any = await db.execute(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.custom_role_name, u.permissions, u.status, u.last_login
       FROM dashboard_users u
       INNER JOIN dashboard_user_sessions s ON s.user_id = u.id
       WHERE s.session_token = ? AND s.expires_at > NOW() AND u.status = 'active'`,
      [sessionToken]
    );

    if (rows.length === 0) {
      const response = NextResponse.json({ success: false, error: "Session expired or account inactive" }, { status: 401 });
      response.cookies.delete("dashboard_session");
      return response;
    }

    const user = rows[0];
    // Parse permissions JSON if it's a string
    if (user.permissions && typeof user.permissions === "string") {
      try { user.permissions = JSON.parse(user.permissions); } catch {}
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}