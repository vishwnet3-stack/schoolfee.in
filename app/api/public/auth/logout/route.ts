import { NextRequest, NextResponse } from "next/server";
import { logoutPublicUser } from "@/lib/public-auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("public_user_session")?.value;

    if (sessionToken) {
      await logoutPublicUser(sessionToken);
    }

    // Clear session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    response.cookies.set("public_user_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { error: "Logout failed. Please try again." },
      { status: 500 }
    );
  }
}
