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
    const state = searchParams.get("state") || "all";
    const status = searchParams.get("status") || "all";
    const delayInFee = searchParams.get("delayInFee") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push(
        "(father_name LIKE ? OR mother_name LIKE ? OR guardian_name LIKE ? OR email LIKE ? OR mobile_number LIKE ?)"
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (state !== "all") { conditions.push("state = ?"); params.push(state); }
    if (status !== "all") { conditions.push("status = ?"); params.push(status); }
    if (delayInFee !== "all") { conditions.push("delay_in_fee = ?"); params.push(delayInFee); }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRows]: any = await db.execute(
      `SELECT COUNT(*) as total FROM survey_responses ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [rows]: any = await db.execute(
      `SELECT id, father_name, mother_name, guardian_name, email, mobile_number,
              state, family_type, number_of_children, monthly_income, income_source,
              delay_in_fee, borrowing_source, preferred_duration, status,
              school_type_quantity, school_incidents, borrowing_details,
              admin_notes, created_at, updated_at
       FROM survey_responses ${whereClause}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const parsed = rows.map((row: any) => ({
      ...row,
      school_type_quantity: (() => {
        try { return JSON.parse(row.school_type_quantity); } catch { return {}; }
      })(),
      school_incidents: (() => {
        try { return JSON.parse(row.school_incidents); } catch { return []; }
      })(),
      borrowing_details: (() => {
        try { return JSON.parse(row.borrowing_details); } catch { return {}; }
      })(),
    }));

    return NextResponse.json({
      success: true,
      surveys: parsed,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Survey submissions fetch error:", error);
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
    const { surveyId, status, adminNotes } = body;

    if (!surveyId) {
      return NextResponse.json({ success: false, error: "Survey ID is required" }, { status: 400 });
    }

    const validStatuses = ["new", "reviewed", "contacted", "completed"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (status) { updates.push("status = ?"); params.push(status); }
    if (adminNotes !== undefined) { updates.push("admin_notes = ?"); params.push(adminNotes); }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No updates provided" }, { status: 400 });
    }

    params.push(surveyId);
    await db.execute(
      `UPDATE survey_responses SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ?`,
      params
    );

    return NextResponse.json({ success: true, message: "Survey updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}