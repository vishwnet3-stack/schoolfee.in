
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendAccountUpdatedEmail } from "@/lib/dashboard-mailer";
import bcrypt from "bcryptjs";

// Helper: get caller's role from session cookie
async function getCallerRole(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get("dashboard_session")?.value;
  if (!token) return null;
  const [rows]: any = await db.execute(
    `SELECT u.role FROM dashboard_users u
     INNER JOIN dashboard_user_sessions s ON s.user_id = u.id
     WHERE s.session_token = ? AND s.expires_at > NOW() AND u.status = 'active'`,
    [token]
  );
  return rows.length > 0 ? rows[0].role : null;
}

// ─── GET: Single user ────────────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows]: any = await db.execute(
      `SELECT id, name, email, phone, role, status, created_at, last_login
       FROM dashboard_users WHERE id = ?`,
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─── PATCH: Update user ──────────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Only admin, super_admin, and manager can edit users
    const callerRole = await getCallerRole(request);
    if (!callerRole || !["super_admin", "admin", "manager"].includes(callerRole)) {
      return NextResponse.json(
        { success: false, error: "You do not have permission to edit users." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, phone, role, status, password } = body;

    // Get existing user
    const [existing]: any = await db.execute(
      "SELECT id, name, email FROM dashboard_users WHERE id = ?",
      [params.id]
    );
    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = existing[0];

    // Validation
    const errors: Record<string, string> = {};
    if (name && name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email address";
    if (role && !["parent", "teacher", "school", "manager", "employee"].includes(role)) {
      errors.role = "Invalid role";
    }
    if (password && password.length < 8) errors.password = "Password must be at least 8 characters";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, error: "Validation failed" }, { status: 422 });
    }

    // Check email conflict
    if (email && email !== user.email) {
      const [emailCheck]: any = await db.execute(
        "SELECT id FROM dashboard_users WHERE email = ? AND id != ?",
        [email.toLowerCase().trim(), params.id]
      );
      if (emailCheck.length > 0) {
        return NextResponse.json(
          { success: false, errors: { email: "Email already used by another user" }, error: "Email conflict" },
          { status: 409 }
        );
      }
    }

    // Build update fields
    const updates: string[] = [];
    const values: any[] = [];
    const changes: string[] = [];

    if (name) { updates.push("name = ?"); values.push(name.trim()); changes.push(`Name updated`); }
    if (email) { updates.push("email = ?"); values.push(email.toLowerCase().trim()); changes.push(`Email updated`); }
    if (phone !== undefined) { updates.push("phone = ?"); values.push(phone?.trim() || null); }
    if (role) { updates.push("role = ?"); values.push(role); changes.push(`Role changed to ${role}`); }
    if (status) { updates.push("status = ?"); values.push(status); changes.push(`Status changed to ${status}`); }
    if (password) {
      const hash = await bcrypt.hash(password, 12);
      updates.push("password_hash = ?");
      values.push(hash);
      changes.push("Password updated");
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
    }

    values.push(params.id);
    await db.execute(
      `UPDATE dashboard_users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    // Send update notification (non-blocking)
    if (changes.length > 0) {
      sendAccountUpdatedEmail({
        name: name || user.name,
        email: email || user.email,
        changes: changes.join("<br>"),
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─── DELETE: Remove user ─────────────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Only super_admin and admin can delete users
    const callerRole = await getCallerRole(request);
    if (!callerRole || !["super_admin", "admin"].includes(callerRole)) {
      return NextResponse.json(
        { success: false, error: "Only Admin or Super Admin can delete users." },
        { status: 403 }
      );
    }

    const [existing]: any = await db.execute(
      "SELECT id FROM dashboard_users WHERE id = ?",
      [params.id]
    );
    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    await db.execute("DELETE FROM dashboard_users WHERE id = ?", [params.id]);

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}