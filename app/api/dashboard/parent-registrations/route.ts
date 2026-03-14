// app/api/dashboard/parent-registrations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // ── Auth check ────────────────────────────────────────────────────────
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
    const search        = searchParams.get("search") || "";
    const status        = searchParams.get("status") || "all";
    const paymentStatus = searchParams.get("payment_status") || "all";
    const page          = parseInt(searchParams.get("page") || "1");
    const limit         = parseInt(searchParams.get("limit") || "20");
    const offset        = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push(
        "(pr.first_name LIKE ? OR pr.last_name LIKE ? OR pr.email LIKE ? OR pr.phone LIKE ?)"
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status !== "all") {
      conditions.push("pr.status = ?");
      params.push(status);
    }
    if (paymentStatus !== "all") {
      conditions.push("pr.payment_status = ?");
      params.push(paymentStatus);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Total
    const [countRows]: any = await db.execute(
      `SELECT COUNT(*) as total FROM parent_registrations pr ${where}`,
      params
    );
    const total = countRows[0].total;

    // Stats
    const [statsRows]: any = await db.execute(
      `SELECT
         COUNT(*) as total,
         SUM(payment_status = 'paid') as paid,
         SUM(status = 'pending') as pending_review,
         SUM(status = 'approved') as approved
       FROM parent_registrations`
    );
    const stats = statsRows[0];

    // Registrations with user info
    const [rows]: any = await db.execute(
      `SELECT
         pr.id, pr.public_user_id,
         pr.first_name, pr.last_name, pr.email, pr.phone, pr.pan_number,
         pr.city, pr.state,
         pr.fee_amount, pr.fee_period, pr.reason_for_support,
         pr.repayment_duration,
         pr.razorpay_payment_id, pr.payment_status, pr.payment_amount,
         pr.status, pr.admin_notes,
         pr.submitted_at, pr.updated_at,
         pu.full_name  AS user_full_name,
         pu.email      AS user_email,
         (SELECT COUNT(*) FROM parent_registration_children c WHERE c.registration_id = pr.id) AS children_count
       FROM parent_registrations pr
       LEFT JOIN public_users pu ON pu.id = pr.public_user_id
       ${where}
       ORDER BY pr.submitted_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Fetch children with APAAR doc info for each registration
    const registrationIds = rows.map((r: any) => r.id);
    let childrenMap: Record<number, any[]> = {};
    if (registrationIds.length > 0) {
      const placeholders = registrationIds.map(() => "?").join(",");
      const [childRows]: any = await db.execute(
        `SELECT
           id, registration_id, child_index,
           full_name, class_grade, admission_number,
           school_name, school_city, apaar_id,
           digilocker_client_id, digilocker_verified,
           digilocker_full_name, doc_gender, doc_dob,
           apaar_doc_path, apaar_doc_url,
           created_at
         FROM parent_registration_children
         WHERE registration_id IN (${placeholders})
         ORDER BY registration_id, child_index`,
        registrationIds
      );
      for (const child of (childRows || [])) {
        if (!childrenMap[child.registration_id]) childrenMap[child.registration_id] = [];
        // Build admin doc URL if file exists on server
        const adminDocUrl = child.apaar_doc_path
          ? `/api/dashboard/apaar-doc?file=${encodeURIComponent(child.apaar_doc_path)}`
          : null;
        childrenMap[child.registration_id].push({ ...child, admin_doc_url: adminDocUrl });
      }
    }

    const registrationsWithChildren = rows.map((r: any) => ({
      ...r,
      children: childrenMap[r.id] || [],
    }));

    return NextResponse.json({
      success: true,
      registrations: registrationsWithChildren,
      stats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Parent registrations fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Update status / admin notes
export async function PATCH(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("dashboard_session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, admin_notes } = body;

    await db.execute(
      `UPDATE parent_registrations SET status = ?, admin_notes = ?, updated_at = NOW() WHERE id = ?`,
      [status, admin_notes || null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}