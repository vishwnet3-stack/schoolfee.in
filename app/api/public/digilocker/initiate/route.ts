// app/api/public/digilocker/initiate/route.ts
//
// SUREPASS ENDPOINT RULES (from official docs):
//   Sandbox token  → https://sandbox.surepass.io/api/v1/...
//   Production token → https://kyc-api.surepass.io/api/v1/...
//
// Your current token identity starts with "dev." = SANDBOX token
// So you MUST use sandbox.surepass.io
//
// Set in .env:
//   SUREPASS_ENV=sandbox    ← for sandbox/testing
//   SUREPASS_ENV=production ← for production
//   SUREPASS_TOKEN=<copy full token from Surepass dashboard → Credential>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SUREPASS_TOKEN = process.env.SUREPASS_TOKEN || "";
const IS_SANDBOX = (process.env.SUREPASS_ENV || "sandbox") !== "production";

// Sandbox token → sandbox.surepass.io
// Production token → kyc-api.surepass.io
const SUREPASS_BASE = IS_SANDBOX
  ? "https://sandbox.surepass.io"
  : "https://kyc-api.surepass.io";

const SUREPASS_ENDPOINT = `${SUREPASS_BASE}/api/v1/digilocker/initialize`;

async function safeJson(res: Response): Promise<any | null> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error(`[Digilocker] Surepass non-JSON (HTTP ${res.status}):`, text.slice(0, 500));
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { redirectUrl } = await request.json();

    if (!redirectUrl) {
      return NextResponse.json({ success: false, error: "redirectUrl is required" }, { status: 400 });
    }

    if (!SUREPASS_TOKEN) {
      return NextResponse.json({
        success: false,
        error: "SUREPASS_TOKEN is missing. Add it to your .env file from Surepass Dashboard → Credential page.",
      }, { status: 500 });
    }

    const isLocalhost = redirectUrl.includes("localhost") || redirectUrl.includes("127.0.0.1");
    if (isLocalhost) {
      return NextResponse.json({
        success: false,
        isLocalhostError: true,
        error: "Surepass requires a public HTTPS URL. localhost will not work.",
        instructions: [
          "1. Run: npx ngrok http 3000",
          "2. Set NEXT_PUBLIC_APP_URL=https://your-ngrok-url in .env",
          "3. Restart app and open via ngrok URL"
        ]
      }, { status: 400 });
    }

    console.log(`[Digilocker] Mode: ${IS_SANDBOX ? "SANDBOX" : "PRODUCTION"}`);
    console.log(`[Digilocker] Endpoint: ${SUREPASS_ENDPOINT}`);
    console.log(`[Digilocker] Redirect URL: ${redirectUrl}`);

    const spRes = await fetch(SUREPASS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUREPASS_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          signup_flow: true,
          expiry_minutes: 10,
          send_sms: false,
          send_email: false,
          verify_phone: false,
          verify_email: false,
          redirect_url: redirectUrl,
          skip_main_screen: false,
        }
      }),
    });

    const spData = await safeJson(spRes);

    console.log(`[Digilocker] Surepass HTTP status: ${spRes.status}`);
    console.log(`[Digilocker] Surepass response:`, JSON.stringify(spData || {}).slice(0, 400));

    if (!spData) {
      return NextResponse.json({
        success: false,
        error: `Surepass returned non-JSON (HTTP ${spRes.status}). Check SUREPASS_ENV matches your token type (sandbox vs production).`,
        debug: {
          endpoint: SUREPASS_ENDPOINT,
          mode: IS_SANDBOX ? "sandbox" : "production",
          tokenPreview: SUREPASS_TOKEN.slice(0, 30) + "...",
        }
      }, { status: 502 });
    }

    if (!spRes.ok || !spData?.data) {
      return NextResponse.json({
        success: false,
        error: spData?.message || `Surepass error (HTTP ${spRes.status})`,
        raw: spData,
        debug: {
          endpoint: SUREPASS_ENDPOINT,
          mode: IS_SANDBOX ? "sandbox" : "production",
        }
      }, { status: 502 });
    }

    const clientId: string = spData.data.client_id;
    const url: string = spData.data.url;

    if (!clientId || !url) {
      return NextResponse.json({
        success: false,
        error: "Surepass did not return client_id or url: " + JSON.stringify(spData).slice(0, 300),
      }, { status: 502 });
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await db.execute(
      `INSERT INTO digilocker_sessions (client_id, redirect_url, status, expires_at)
       VALUES (?, ?, 'initiated', ?)
       ON DUPLICATE KEY UPDATE
         redirect_url = VALUES(redirect_url), status = 'initiated',
         expires_at = VALUES(expires_at), updated_at = NOW()`,
      [clientId, redirectUrl, expiresAt]
    );

    return NextResponse.json({ success: true, clientId, digilockerUrl: url });

  } catch (error: any) {
    console.error("[Digilocker] initiate error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}