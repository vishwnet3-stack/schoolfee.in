// app/api/dashboard/teacher-registrations/route.ts
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
        "(tr.full_name LIKE ? OR tr.email LIKE ? OR tr.phone LIKE ? OR tr.school_name LIKE ?)"
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status !== "all")        { conditions.push("tr.status = ?");         params.push(status); }
    if (paymentStatus !== "all") { conditions.push("tr.payment_status = ?"); params.push(paymentStatus); }
    if (stateFilter !== "all")   { conditions.push("tr.state = ?");          params.push(stateFilter); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Total count
    const [countRows]: any = await db.execute(
      `SELECT COUNT(*) as total FROM teacher_registrations tr ${where}`,
      params
    );
    const total = countRows[0].total;

    // Stats
    const [statsRows]: any = await db.execute(
      `SELECT
         COUNT(*) as total,
         SUM(payment_status = 'paid')     as paid,
         SUM(status = 'pending')          as pending_review,
         SUM(status = 'approved')         as approved
       FROM teacher_registrations`
    );
    const stats = statsRows[0];

    // Records — include DigiLocker KYC fields via LEFT JOIN on digilocker_sessions
    const [rows]: any = await db.execute(
      `SELECT
         tr.id, tr.public_user_id,
         tr.full_name, tr.dob, tr.gender, tr.phone, tr.email,
         tr.address, tr.state, tr.pincode, tr.father_name,
         tr.qualification, tr.other_qualification,
         tr.subject, tr.other_subject, tr.experience,
         tr.school_name, tr.employee_id, tr.salary_monthly,
         tr.joining_date, tr.employment_type,
         tr.razorpay_payment_id, tr.payment_status, tr.payment_amount,
         tr.status, tr.admin_notes,
         tr.submitted_at, tr.updated_at,
         tr.digilocker_client_id,
         tr.masked_aadhaar,
         tr.pan_number,
         tr.aadhaar_local_pdf,
         tr.pan_local_pdf,
         tr.apaar_local_pdf,
         pu.full_name  AS user_full_name,
         pu.email      AS user_email,
         -- Additional KYC fields from digilocker_sessions
         ds.pan_full_name,
         ds.pan_dob,
         ds.aadhaar_xml_fetched AS kyc_verified
       FROM teacher_registrations tr
       LEFT JOIN public_users pu ON pu.id = tr.public_user_id
       LEFT JOIN digilocker_sessions ds ON ds.client_id = tr.digilocker_client_id
       ${where}
       ORDER BY tr.submitted_at DESC
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
    console.error("Teacher registrations fetch error:", error);
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
      `UPDATE teacher_registrations SET status = ?, admin_notes = ?, updated_at = NOW() WHERE id = ?`,
      [status, admin_notes || null, id]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}