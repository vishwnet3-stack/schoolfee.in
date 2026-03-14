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
 * POST /api/donate/get-amount
 *
 * Server-side fraud detection:
 * - Accepts amount as number OR numeric string (handles both cases safely)
 * - Validates min/max from DB config (not hardcoded in frontend)
 * - Rate-limits by IP (max 10 attempts per hour)
 */
export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, verified: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    // Accept both number and string — parse safely
    const rawAmount = body?.requested_amount;
    const requested_amount = typeof rawAmount === "string"
      ? parseFloat(rawAmount)
      : typeof rawAmount === "number"
        ? rawAmount
        : NaN;

    // Basic check before hitting DB
    if (isNaN(requested_amount) || requested_amount <= 0) {
      return NextResponse.json(
        { success: false, verified: false, message: "Please enter a valid donation amount." },
        { status: 200 } // Return 200 so frontend doesn't crash — just unverified
      );
    }

    // ── Load DB limits ────────────────────────────────────────────────────────
    let minAmount = 1000;
    let maxAmount = 50000000;

    const db = await getDb();
    try {
      const [rows] = await db.query<any[]>(
        `SELECT config_key, config_value FROM app_config
         WHERE config_key IN ('donation_min_amount', 'donation_max_amount')`
      );
      for (const row of rows) {
        if (row.config_key === "donation_min_amount") minAmount = Number(row.config_value);
        if (row.config_key === "donation_max_amount") maxAmount = Number(row.config_value);
      }
    } catch {
      // app_config table may not exist yet — use defaults
    }

    // ── Amount range validation ───────────────────────────────────────────────
    if (requested_amount < minAmount) {
      await db.end();
      return NextResponse.json({
        success: false,
        verified: false,
        message: `Minimum donation amount is Rs. ${minAmount.toLocaleString("en-IN")}.`,
      }, { status: 200 });
    }

    if (requested_amount > maxAmount) {
      await db.end();
      return NextResponse.json({
        success: false,
        verified: false,
        message: `Maximum donation per transaction is Rs. ${maxAmount.toLocaleString("en-IN")}.`,
      }, { status: 200 });
    }

    // ── IP rate limiting ──────────────────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    try {
      const [recentRows] = await db.query<any[]>(
        `SELECT COUNT(*) AS cnt FROM donation_payments
         WHERE ip_address = ?
         AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
         AND status NOT IN ('refunded')`,
        [ip]
      );
      const count = Number(recentRows[0]?.cnt ?? 0);
      if (count >= 10) {
        await db.end();
        return NextResponse.json({
          success: false,
          verified: false,
          message: "Too many donation attempts from your network. Please try again in an hour.",
        }, { status: 200 });
      }
    } catch {
      // donation_payments table may not exist yet — skip rate limit check
    }

    await db.end();

    return NextResponse.json({
      success: true,
      verified: true,
      amount: requested_amount,
      message: "Amount verified.",
    });
  } catch (err: any) {
    console.error("[/api/donate/get-amount]", err);
    return NextResponse.json(
      { success: false, verified: false, message: "Verification failed. Please try again." },
      { status: 200 } // Always 200 so client handles it gracefully
    );
  }
}