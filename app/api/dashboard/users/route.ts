// app/api/dashboard/users/route.ts
// GET  /api/dashboard/users  — list users
// POST /api/dashboard/users  — create user

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendUserCredentialsEmail, sendAdminUserCreatedNotification } from "@/lib/dashboard-mailer";
import bcrypt from "bcryptjs";

const VALID_ROLES = ["super_admin","admin","manager","employee","parent","teacher","school","custom"];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push("(name LIKE ? OR email LIKE ? OR phone LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (role !== "all") { conditions.push("role = ?"); params.push(role); }
    if (status !== "all") { conditions.push("status = ?"); params.push(status); }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRows]: any = await db.execute(
      `SELECT COUNT(*) as total FROM dashboard_users ${whereClause}`, params
    );
    const total = countRows[0].total;

    const [rows]: any = await db.execute(
      `SELECT id, name, email, phone, role, custom_role_name, status, created_at, last_login
       FROM dashboard_users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      success: true, users: rows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // ── Server-side: verify caller is admin or super_admin ─────────────────
    const sessionToken = request.cookies.get("dashboard_session")?.value;
    if (sessionToken) {
      const [callerRows]: any = await db.execute(
        `SELECT u.role FROM dashboard_users u
         INNER JOIN dashboard_user_sessions s ON s.user_id = u.id
         WHERE s.session_token = ? AND s.expires_at > NOW() AND u.status = 'active'`,
        [sessionToken]
      );
      if (callerRows.length > 0) {
        const callerRole = callerRows[0].role;
        if (callerRole !== "super_admin" && callerRole !== "admin") {
          return NextResponse.json(
            { success: false, error: "Only Admin or Super Admin can create users." },
            { status: 403 }
          );
        }
      }
    }

    const body = await request.json();
    const { name, email, phone, role, status, password, customRoleName, permissions } = body;

    const errors: Record<string, string> = {};
    if (!name || name.trim().length < 2) errors.name = "Full name must be at least 2 characters";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address";
    if (!role || !VALID_ROLES.includes(role)) errors.role = "Please select a valid role";
    if (role === "custom" && !customRoleName?.trim()) errors.customRoleName = "Custom role name is required";
    if (!password || password.length < 8) errors.password = "Password must be at least 8 characters";
    if (phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(phone)) errors.phone = "Invalid phone number";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, error: "Validation failed" }, { status: 422 });
    }

    const [existing]: any = await db.execute(
      "SELECT id FROM dashboard_users WHERE email = ?", [email.toLowerCase().trim()]
    );
    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        errors: { email: "A user with this email already exists" },
        error: "Email already in use",
      }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userStatus = status || "active";
    const permissionsJson = (role === "custom" && permissions) ? JSON.stringify(permissions) : null;

    const [result]: any = await db.execute(
      `INSERT INTO dashboard_users (name, email, phone, password_hash, role, custom_role_name, permissions, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(), email.toLowerCase().trim(), phone?.trim() || null,
        passwordHash, role, customRoleName?.trim() || null, permissionsJson, userStatus,
      ]
    );

    const userId = result.insertId;

    // Send emails non-blocking
    Promise.all([
      sendUserCredentialsEmail({ name: name.trim(), email: email.toLowerCase().trim(), password, role }),
      sendAdminUserCreatedNotification({ name: name.trim(), email: email.toLowerCase().trim(), role, phone: phone?.trim() }),
    ]).catch((err) => console.error("Email error:", err));

    return NextResponse.json({
      success: true,
      message: "User created. Login credentials sent to email.",
      user: { id: userId, name: name.trim(), email: email.toLowerCase().trim(), role, status: userStatus },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}