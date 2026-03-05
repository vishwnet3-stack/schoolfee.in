// app/api/dashboard/auth/login/route.ts
// POST /api/dashboard/auth/login
// Login endpoint for users created by super admin

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const [rows]: any = await db.execute(
      `SELECT id, name, email, phone, role, status, password_hash
       FROM dashboard_users WHERE email = ?`,
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Check if account is active
    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Your account has been deactivated. Please contact the administrator." },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session token (valid 7 days)
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.execute(
      `INSERT INTO dashboard_user_sessions (user_id, session_token, expires_at)
       VALUES (?, ?, ?)`,
      [user.id, sessionToken, expiresAt]
    );

    // Update last login
    await db.execute(
      "UPDATE dashboard_users SET last_login = NOW() WHERE id = ?",
      [user.id]
    );

    // Set cookie in response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("dashboard_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Dashboard login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}