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
 * POST /api/donate/track-payment
 * Logs payment failures from client-side Razorpay handler for analytics.
 */
export async function POST(req: NextRequest) {
  const db = await getDb();
  try {
    let body: any;
    try { body = await req.json(); } catch { return NextResponse.json({ success: false }, { status: 400 }); }

    const { db_order_id, status, error_code, error_description } = body;
    if (!db_order_id || !["failed", "pending", "processing"].includes(status)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    await db.query(
      `UPDATE donation_payments SET
        status=?, error_code=?, error_description=?, updated_at=NOW()
       WHERE id=? AND status NOT IN ('success','refunded')`,
      [status, error_code || null, error_description || null, db_order_id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/donate/track-payment]", err);
    return NextResponse.json({ success: false }, { status: 500 });
  } finally {
    await db.end();
  }
}