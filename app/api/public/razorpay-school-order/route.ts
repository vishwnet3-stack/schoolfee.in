// app/api/public/razorpay-school-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// ── Razorpay credentials loaded from .env ─────────────────────────────────
// To switch test ↔ live, only change RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    const order = await razorpay.orders.create({
      amount:   111100,  // ₹1111 in paise
      currency: "INR",
      receipt:  `school_reg_${Date.now()}`,
      notes: {
        email:   email || "",
        name:    name  || "",
        purpose: "School Registration Fee",
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Razorpay school order error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}