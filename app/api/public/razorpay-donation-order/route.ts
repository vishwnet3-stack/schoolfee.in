// app/api/public/razorpay-donation-order/route.ts
// Creates a Razorpay order for a donation.
// Amount is locked HERE on the server — never trusted from the client.

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// ── Razorpay credentials loaded from .env ─────────────────────────────────
// To switch test ↔ live, only change RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ── Preset amounts that are allowed (in ₹) ─────────────────────────────────
// Any custom amount between MIN and MAX is also accepted.
const PRESET_AMOUNTS_INR = [1000, 2500, 5000, 10000, 25000, 50000];
const MIN_DONATION_INR = 100;
const MAX_DONATION_INR = 1_000_000; // ₹10 lakh cap

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, name } = body;

    // ── Server-side amount validation ───────────────────────────────────────
    const amountINR = Number(amount);
    if (
      !amountINR ||
      isNaN(amountINR) ||
      amountINR < MIN_DONATION_INR ||
      amountINR > MAX_DONATION_INR
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Donation must be between ₹${MIN_DONATION_INR} and ₹${MAX_DONATION_INR.toLocaleString()}.`,
        },
        { status: 400 },
      );
    }

    // Only allow whole-rupee amounts
    if (!Number.isInteger(amountINR)) {
      return NextResponse.json(
        {
          success: false,
          error: "Donation amount must be a whole number (no decimals).",
        },
        { status: 400 },
      );
    }

    const amountPaise = amountINR * 100;

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `donate_${Date.now()}`,
      notes: {
        email: email || "",
        name: name || "",
        purpose: "Donation - Schoolfee.org / CHM Initiative",
      },
    });

    // Return the order + the server-locked amount so the frontend can display it
    return NextResponse.json({
      success: true,
      order,
      lockedAmountINR: amountINR,
    });
  } catch (error: any) {
    console.error("Razorpay donation order error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create order" },
      { status: 500 },
    );
  }
}