// app/api/public/my-activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession } from "@/lib/public-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("public_user_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserFromSession(sessionToken);
    if (!user) {
      return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 });
    }

    const userId = user.id;

    // ── Parent Registrations ──────────────────────────────────────────────
    const [parentRows]: any = await db.execute(
      `SELECT
         id, first_name, last_name, email, phone, pan_number,
         city, state, address,
         fee_amount, fee_period, reason_for_support, other_reason,
         description, repayment_duration,
         razorpay_payment_id, payment_status, payment_amount,
         status, admin_notes, submitted_at, updated_at
       FROM parent_registrations
       WHERE public_user_id = ?
       ORDER BY submitted_at DESC`,
      [userId]
    );

    // ── Parent Children ───────────────────────────────────────────────────
    let parentRegistrations = parentRows;
    if (parentRows.length > 0) {
      const parentIds = parentRows.map((r: any) => r.id);
      const placeholders = parentIds.map(() => "?").join(",");
      const [childRows]: any = await db.execute(
        `SELECT registration_id, full_name, class_grade, admission_number,
                school_name, school_city, apaar_id
         FROM parent_registration_children
         WHERE registration_id IN (${placeholders})
         ORDER BY id ASC`,
        parentIds
      );
      // attach children to each parent registration
      parentRegistrations = parentRows.map((pr: any) => ({
        ...pr,
        children: childRows.filter((c: any) => c.registration_id === pr.id),
      }));
    }

    // ── Teacher Registrations ─────────────────────────────────────────────
    const [teacherRows]: any = await db.execute(
      `SELECT
         id, full_name, dob, gender, phone, email, address, state,
         qualification, other_qualification, subject, other_subject, experience,
         school_name, employee_id, salary_monthly, joining_date, employment_type,
         razorpay_payment_id, payment_status, payment_amount,
         status, admin_notes, submitted_at, updated_at
       FROM teacher_registrations
       WHERE public_user_id = ?
       ORDER BY submitted_at DESC`,
      [userId]
    );

    // ── School Registrations ──────────────────────────────────────────────
    const [schoolRows]: any = await db.execute(
      `SELECT
         id, school_name, school_type, established_year,
         affiliation_board, other_affiliation_board, affiliation_id,
         school_address, city, state, pincode,
         contact_number, alternate_contact, official_email, website_url,
         principal_name, principal_email, principal_contact,
         total_students, total_teachers, infrastructure_details,
         razorpay_payment_id, payment_status, payment_amount,
         status, admin_notes, submitted_at, updated_at
       FROM school_registrations
       WHERE public_user_id = ?
       ORDER BY submitted_at DESC`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      activity: {
        parent:  parentRegistrations,
        teacher: teacherRows,
        school:  schoolRows,
      },
    });
  } catch (error: any) {
    console.error("My activity fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}