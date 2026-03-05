// app/api/dashboard/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("dashboard_session")?.value;

    if (sessionToken) {
      await db.execute(
        "DELETE FROM dashboard_user_sessions WHERE session_token = ?",
        [sessionToken]
      );
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.delete("dashboard_session");
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}