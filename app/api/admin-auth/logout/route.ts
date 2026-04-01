export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_user_session")?.value;

    if (sessionToken) {
      try {
        await db.execute(`DELETE FROM admin_user_sessions WHERE session_token = ?`, [sessionToken]);
      } catch {}
      cookieStore.delete("admin_user_session");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin auth logout error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
