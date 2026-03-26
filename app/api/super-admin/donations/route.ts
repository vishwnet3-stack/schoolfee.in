import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

async function getDb() {
  return mysql.createConnection({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    ssl: process.env.DB_HOST !== "localhost" ? { rejectUnauthorized: false } : undefined,
  });
}

/**
 * GET /api/super-admin/donations
 * Returns all donation_payments records for the super-admin panel.
 * Supports query params: status, search, page, limit, from, to
 */
export async function GET(req: NextRequest) {
  const db = await getDb();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "25")));
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (status !== "all") {
      conditions.push("status = ?");
      params.push(status);
    }

    if (search.trim()) {
      conditions.push(
        `(contact_name LIKE ? OR contact_email LIKE ? OR contact_phone LIKE ?
         OR receipt_number LIKE ? OR razorpay_payment_id LIKE ?
         OR razorpay_order_id LIKE ? OR pan_number LIKE ?
         OR address_city LIKE ? OR address_state LIKE ? OR org_name LIKE ?)`
      );
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s, s, s, s, s, s, s);
    }

    if (from) {
      conditions.push("DATE(created_at) >= ?");
      params.push(from);
    }
    if (to) {
      conditions.push("DATE(created_at) <= ?");
      params.push(to);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Total count
    const [countRows] = await db.query<any[]>(
      `SELECT COUNT(*) AS total FROM donation_payments ${where}`,
      params
    );
    const total = Number(countRows[0]?.total ?? 0);

    // Paginated rows
    const [rows] = await db.query<any[]>(
      `SELECT
        id, receipt_number, razorpay_order_id, razorpay_payment_id,
        org_name, org_type, contact_name, contact_email, contact_phone,
        address_line1, address_city, address_state, address_pincode,
        amount, donation_purpose, donation_note,
        pan_number, consent_80g, status,
        error_code, error_description,
        ip_address, user_agent,
        created_at, paid_at, updated_at
       FROM donation_payments
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Summary stats (all-time, unfiltered by search/date)
    const [statsRows] = await db.query<any[]>(`
      SELECT
        COUNT(*) AS total_records,
        SUM(CASE WHEN status='success' THEN 1 ELSE 0 END) AS success_count,
        SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pending_count,
        SUM(CASE WHEN status='failed'  THEN 1 ELSE 0 END) AS failed_count,
        SUM(CASE WHEN status='success' THEN amount ELSE 0 END) AS total_amount,
        SUM(CASE WHEN status='success' AND DATE(paid_at) = CURDATE() THEN amount ELSE 0 END) AS today_amount,
        SUM(CASE WHEN status='success' AND MONTH(paid_at)=MONTH(NOW()) AND YEAR(paid_at)=YEAR(NOW()) THEN amount ELSE 0 END) AS month_amount
      FROM donation_payments
    `);

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      stats: statsRows[0] ?? {},
    });
  } catch (err: any) {
    console.error("[/api/super-admin/donations GET]", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to fetch donations." },
      { status: 500 }
    );
  } finally {
    await db.end();
  }
}

/**
 * PATCH /api/super-admin/donations
 * Update a single donation's status (manual admin override).
 */
export async function PATCH(req: NextRequest) {
  const db = await getDb();
  try {
    const body = await req.json();
    const { id, status } = body;

    const allowed = ["success", "pending", "failed", "refunded"];
    if (!id || !allowed.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid id or status." }, { status: 400 });
    }

    await db.query(
      `UPDATE donation_payments SET status=?, updated_at=NOW() WHERE id=?`,
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[/api/super-admin/donations PATCH]", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Update failed." },
      { status: 500 }
    );
  } finally {
    await db.end();
  }
}