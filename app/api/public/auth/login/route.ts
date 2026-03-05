import { NextRequest, NextResponse } from "next/server";
import { loginPublicUser } from "@/lib/public-auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Login user
    const { user, sessionToken } = await loginPublicUser(email, password);

    // Set session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged in successfully",
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set("public_user_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);

    if (error.message.includes("Invalid email or password")) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
