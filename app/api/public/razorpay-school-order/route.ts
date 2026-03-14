// app/api/public/razorpay-school-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id:     "rzp_test_SNWMyYGGnFaJ0I",   // ✅ Test Key ID
  key_secret: "tJgfeUFLJvJtAlbSj4apzx2l",  // ✅ Test Key Secret
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