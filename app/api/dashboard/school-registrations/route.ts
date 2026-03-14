// app/api/dashboard/school-registrations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────
    const sessionToken = request.cookies.get("dashboard_session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    const [caller]: any = await db.execute(
      `SELECT u.role FROM dashboard_users u
       INNER JOIN dashboard_user_sessions s ON s.user_id = u.id
       WHERE s.session_token = ? AND s.expires_at > NOW() AND u.status = 'active'`,
      [sessionToken]
    );
    if (!caller.length) {
      return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 });
    }

    // ── Query params ──────────────────────────────────────────────────────
    const { searchParams } = new URL(request.url);
    const search        = searchParams.get("search")         || "";
    const status        = searchParams.get("status")         || "all";
    const paymentStatus = searchParams.get("payment_status") || "all";
    const stateFilter   = searchParams.get("state")          || "all";
    const page          = parseInt(searchParams.get("page")  || "1");
    const limit         = parseInt(searchParams.get("limit") || "20");
    const offset        = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push(
        "(sr.school_name LIKE ? OR sr.official_email LIKE ? OR sr.contact_number LIKE ? OR sr.principal_name LIKE ?)"
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status !== "all")        { conditions.push("sr.status = ?");         params.push(status); }
    if (paymentStatus !== "all") { conditions.push("sr.payment_status = ?"); params.push(paymentStatus); }
    if (stateFilter !== "all")   { conditions.push("sr.state = ?");          params.push(stateFilter); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Total count
    const [countRows]: any = await db.execute(
      `SELECT COUNT(*) as total FROM school_registrations sr ${where}`,
      params
    );
    const total = countRows[0].total;

    // Stats
    const [statsRows]: any = await db.execute(
      `SELECT
         COUNT(*) as total,
         SUM(payment_status = 'paid')  as paid,
         SUM(status = 'pending')       as pending_review,
         SUM(status = 'approved')      as approved
       FROM school_registrations`
    );
    const stats = statsRows[0];

    // Records
    const [rows]: any = await db.execute(
      `SELECT
         sr.id, sr.public_user_id,
         sr.school_name, sr.school_type, sr.established_year,
         sr.affiliation_board, sr.other_affiliation_board, sr.affiliation_id,
         sr.city, sr.state, sr.pincode,
         sr.contact_number, sr.alternate_contact,
         sr.official_email, sr.website_url,
         sr.principal_name, sr.principal_email, sr.principal_contact,
         sr.total_students, sr.total_teachers,
         sr.razorpay_payment_id, sr.payment_status, sr.payment_amount,
         sr.status, sr.admin_notes,
         sr.submitted_at, sr.updated_at,
         pu.full_name AS user_full_name,
         pu.email     AS user_email
       FROM school_registrations sr
       LEFT JOIN public_users pu ON pu.id = sr.public_user_id
       ${where}
       ORDER BY sr.submitted_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      success: true,
      registrations: rows,
      stats,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("School registrations fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("dashboard_session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    const body = await request.json();
    const { id, status, admin_notes } = body;
    await db.execute(
      `UPDATE school_registrations SET status = ?, admin_notes = ?, updated_at = NOW() WHERE id = ?`,
      [status, admin_notes || null, id]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}