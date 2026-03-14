// app/api/dashboard/apaar-doc/route.ts
// Serves APAAR PDF documents to authenticated admin users ONLY.
// Files are stored in /private-uploads/apaar/ which is NOT web-accessible.
// Normal users (parents, public) cannot access these documents.

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // ── 1. Admin auth check ────────────────────────────────────────────────
    const sessionToken = request.cookies.get("dashboard_session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [callerRows]: any = await db.execute(
      `SELECT u.id, u.role FROM dashboard_users u
       INNER JOIN dashboard_user_sessions s ON s.user_id = u.id
       WHERE s.session_token = ? AND s.expires_at > NOW() AND u.status = 'active'`,
      [sessionToken]
    );
    if (!callerRows.length) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const { role } = callerRows[0];
    if (!["super_admin", "admin"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── 2. Get file path from query param ─────────────────────────────────
    const { searchParams } = new URL(request.url);
    const fileParam = searchParams.get("file");

    if (!fileParam) {
      return NextResponse.json({ error: "file parameter required" }, { status: 400 });
    }

    // Sanitize: only allow alphanumeric, dash, underscore, dot, forward slash
    // Prevent path traversal attacks
    const sanitized = fileParam.replace(/[^a-zA-Z0-9_\-./]/g, "");
    if (sanitized !== fileParam || fileParam.includes("..")) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Resolve absolute path within private-uploads only
    const baseDir = path.join(process.cwd(), "private-uploads");
    const filePath = path.join(baseDir, sanitized);

    // Ensure the resolved path is still within private-uploads (security)
    if (!filePath.startsWith(baseDir)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── 3. Read & stream the file ─────────────────────────────────────────
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const filename = path.basename(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    console.error("[APAAR doc serve] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}