import { NextRequest, NextResponse } from "next/server";
import { registerPublicUser } from "@/lib/public-auth";
import { sendEmail } from "@/lib/mailer";
import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { fullName, email, password } = validation.data;

    // Register user
    const user = await registerPublicUser(fullName, email, password);

    // Send welcome email
    try {
      await sendEmail(email, "publicUserWelcome", {
        name: fullName,
        role: "Public User",
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please check your email.",
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.message.includes("Email already registered")) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
