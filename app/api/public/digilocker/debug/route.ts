// app/api/public/digilocker/debug/route.ts
// TEMPORARY debug endpoint — remove in production
// Visit: GET /api/public/digilocker/debug to test Surepass connectivity

import { NextRequest, NextResponse } from "next/server";

const SUREPASS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc3MzA0MjIwOCwianRpIjoiYmFjNTE2MTktMDgzYi00YjE3LWFlZTEtODU5ODY1M2YwMDdmIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2Lm1haGVzaGt1bGthcm5pMDIyMEBzdXJlcGFzcy5pbyIsIm5iZiI6MTc3MzA0MjIwOCwiZXhwIjoxNzc1NjM0MjA4LCJlbWFpbCI6Im1haGVzaGt1bGthcm5pMDIyMEBzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.2YBbpPlEDLpXBeqjl8jhWTgi0-6rJQGGT1Wr3J301rg";

const REDIRECT_URL = "localhost:3000/digilocker-callback"; // change to your domain

// Endpoints to try in order
const ENDPOINTS_TO_TRY = [
  { base: "https://kyc-api.surepass.io",     path: "/api/v1/digilocker/generate-url" },
  { base: "https://kyc-api.surepass.io",     path: "/api/v1/digilocker/link" },
  { base: "https://sandbox.surepass.app",    path: "/api/v1/digilocker/generate-url" },
  { base: "https://sandbox.surepass.app",    path: "/api/v1/digilocker/link" },
];

async function tryEndpoint(base: string, path: string) {
  const url = base + path;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUREPASS_TOKEN}`,
      },
      body: JSON.stringify({
        expiry_minutes: 10,
        send_sms: false,
        send_email: false,
        verify_phone: false,
        verify_email: false,
        redirect_url: REDIRECT_URL,
        skip_main_screen: false,
        signup_flow: false,
      }),
    });

    const text = await res.text();
    let parsed: any = null;
    try { parsed = JSON.parse(text); } catch {}

    return {
      url,
      httpStatus: res.status,
      isJson: !!parsed,
      responsePreview: text.slice(0, 400),
      parsedData: parsed,
      hasClientId: !!(parsed?.data?.client_id),
      hasUrl: !!(parsed?.data?.url || parsed?.data?.redirect_url || parsed?.data?.link),
      success: res.ok && !!parsed?.data,
    };
  } catch (err: any) {
    return { url, error: err.message, success: false };
  }
}

export async function GET(request: NextRequest) {
  const results = [];
  let workingEndpoint = null;

  for (const ep of ENDPOINTS_TO_TRY) {
    const result = await tryEndpoint(ep.base, ep.path);
    results.push(result);
    if (result.success && !workingEndpoint) {
      workingEndpoint = result.url;
    }
  }

  return NextResponse.json({
    message: workingEndpoint
      ? `✅ Working endpoint found: ${workingEndpoint}`
      : "❌ No working endpoint found — check token expiry or Surepass account",
    workingEndpoint,
    tokenPreview: SUREPASS_TOKEN.slice(0, 40) + "...",
    results,
  }, { status: 200 });
}