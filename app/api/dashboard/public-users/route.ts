import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("dashboard_session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const [callerRows]: any = await db.execute(
      `SELECT u.role FROM dashboard_users u
       INNER JOIN dashboard_user_sessions s ON s.user_id = u.id
       WHERE s.session_token = ? AND s.expires_at > NOW() AND u.status = 'active'`,
      [sessionToken]
    );

    if (callerRows.length === 0) {
      return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push("(full_name LIKE ? OR email LIKE ? OR phone LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRows]: any = await db.execute(
      `SELECT COUNT(*) as total FROM public_users ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [rows]: any = await db.execute(
      `SELECT id, full_name, email, phone, status, created_at, last_login
       FROM public_users ${whereClause}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      success: true,
      users: rows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Public users fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}