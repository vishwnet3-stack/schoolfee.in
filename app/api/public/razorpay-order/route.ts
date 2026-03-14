// app/api/public/razorpay-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// ── Your Razorpay TEST credentials (key + secret MUST match) ──────────────
const razorpay = new Razorpay({
  key_id:     "rzp_test_SNWMyYGGnFaJ0I",   // ✅ Your Test Key ID
  key_secret: "tJgfeUFLJvJtAlbSj4apzx2l",  // ✅ Your Test Key Secret
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    const order = await razorpay.orders.create({
      amount:   1100,   // ₹11 in paise
      currency: "INR",
      receipt:  `parent_reg_${Date.now()}`,
      notes: {
        email:   email || "",
        name:    name  || "",
        purpose: "Parent Registration Fee",
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Razorpay order error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}