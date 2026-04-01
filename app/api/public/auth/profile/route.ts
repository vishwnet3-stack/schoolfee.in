export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/public-auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("public_user_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await getUserFromSession(sessionToken);

    if (!user) {
      return NextResponse.json(
        { error: "Session expired or invalid" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          createdAt: user.created_at,
          isActive: user.is_active,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
