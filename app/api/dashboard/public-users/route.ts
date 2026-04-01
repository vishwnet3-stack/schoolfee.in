export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const hasSearch = search.trim().length > 0;
    const searchValues = hasSearch ? [`%${search}%`, `%${search}%`] : [];

    const whereClause = hasSearch
      ? `WHERE (full_name LIKE ? OR email LIKE ?)`
      : "";

    // Total count
    const [countRows]: any = await db.execute(
      `SELECT COUNT(*) as total FROM public_users ${whereClause}`,
      searchValues
    );
    const total = countRows[0]?.total ?? 0;

    // Active count — is_active = 1
    const activeWhere = hasSearch
      ? `WHERE is_active = 1 AND (full_name LIKE ? OR email LIKE ?)`
      : `WHERE is_active = 1`;

    const [activeRows]: any = await db.execute(
      `SELECT COUNT(*) as active_count FROM public_users ${activeWhere}`,
      searchValues
    );
    const activeCount = activeRows[0]?.active_count ?? 0;

    // Users — exact columns from public_users table (no phone, no last_login, no status)
    const [rows]: any = await db.execute(
      `SELECT id, full_name, email, created_at, updated_at, is_active
       FROM public_users
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...searchValues, limit, offset]
    );

    return NextResponse.json({
      success: true,
      users: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total,
        active: activeCount,
        pageCount: rows.length,
      },
    });
  } catch (error: any) {
    console.error("Public users fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch users",
        code: error?.code || "UNKNOWN",
      },
      { status: 500 }
    );
  }
}