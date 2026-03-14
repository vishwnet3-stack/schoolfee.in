// app/api/public/digilocker/teacher-aadhaar-xml/route.ts
// Fetches full Aadhaar XML data from Surepass DigiLocker for teacher registration.
// Caches result in DB so the API is NEVER called twice for same session.
// SANDBOX only: uses sandbox.surepass.io

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs/promises";

const SUREPASS_TOKEN = process.env.SUREPASS_TOKEN || "";
const IS_SANDBOX = (process.env.SUREPASS_ENV || "sandbox") !== "production";
const SUREPASS_BASE = IS_SANDBOX
  ? "https://sandbox.surepass.io"
  : "https://kyc-api.surepass.io";

const authHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${SUREPASS_TOKEN}`,
};

async function safeJson(res: Response): Promise<any | null> {
  const text = await res.text();
  try { return JSON.parse(text); } catch {
    console.error("[TeacherAadhaarXML] Non-JSON:", text.slice(0, 300));
    return null;
  }
}

// Save a PDF from a URL to local disk — returns relative path or null
async function savePdfLocally(
  url: string,
  clientId: string,
  docType: string
): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const dir = path.join(process.cwd(), "private-uploads", "teacher-docs");
    await fs.mkdir(dir, { recursive: true });
    const filename = `${docType.toLowerCase()}_${clientId}_${Date.now()}.pdf`;
    const fullPath = path.join(dir, filename);
    await fs.writeFile(fullPath, buffer);
    return `teacher-docs/${filename}`;
  } catch (err) {
    console.error("[TeacherAadhaarXML] PDF save error:", err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();
    if (!clientId) {
      return NextResponse.json({ success: false, error: "clientId required" }, { status: 400 });
    }

    // ── 0. Load session & check cache ─────────────────────────────────────
    const [rows]: any = await db.execute(
      `SELECT * FROM digilocker_sessions WHERE client_id = ? LIMIT 1`,
      [clientId]
    );
    if (!rows?.length) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }
    const session = rows[0];

    // Return cached Aadhaar XML if already fetched
    if (session.aadhaar_xml_fetched && session.aadhaar_masked_number) {
      const aadhaarData = {
        full_name: session.aadhaar_full_name,
        care_of: session.aadhaar_care_of,
        dob: session.aadhaar_dob,
        yob: session.aadhaar_yob,
        zip: session.aadhaar_zip,
        gender: session.aadhaar_gender,
        masked_aadhaar: session.aadhaar_masked_number,
        full_address: session.aadhaar_full_address,
        father_name: session.aadhaar_father_name,
        address: session.aadhaar_address_json ? JSON.parse(session.aadhaar_address_json) : null,
        profile_image: session.aadhaar_profile_image,
        xml_url: session.aadhaar_xml_url,
      };
      const digilockerMeta = {
        name: session.full_name,
        gender: session.gender,
        dob: session.date_of_birth,
        mobile_number: session.digilocker_mobile,
      };
      return NextResponse.json({
        success: true,
        cached: true,
        aadhaar_xml_data: aadhaarData,
        digilocker_metadata: digilockerMeta,
        aadhaar_local_pdf: session.aadhaar_local_pdf,
        pan_local_pdf: session.pan_local_pdf,
        pan_number: session.pan_number,
        pan_full_name: session.pan_full_name,
        pan_dob: session.pan_dob,
      });
    }

    // ── 1. Download Aadhaar XML from Surepass ─────────────────────────────
    console.log(`[TeacherAadhaarXML] Fetching Aadhaar XML for client: ${clientId}`);
    const xmlRes = await fetch(
      `${SUREPASS_BASE}/api/v1/digilocker/download-aadhaar/${clientId}`,
      { method: "GET", headers: authHeaders }
    );
    const xmlData = await safeJson(xmlRes);

    if (!xmlRes.ok || !xmlData?.success || !xmlData?.data) {
      return NextResponse.json({
        success: false,
        error: xmlData?.message || "Aadhaar XML not available. Complete DigiLocker auth first.",
        raw: xmlData,
      }, { status: 422 });
    }

    const d = xmlData.data;
    const aadhaar = d.aadhaar_xml_data || {};
    const meta = d.digilocker_metadata || {};

    // ── 2. Save Aadhaar PDF locally ───────────────────────────────────────
    // First get the document list to find Aadhaar file_id
    let aadhaarLocalPdf: string | null = session.aadhaar_local_pdf || null;
    let panLocalPdf: string | null = session.pan_local_pdf || null;

    // Check if we already have docs in DB
    const [docRows]: any = await db.execute(
      `SELECT * FROM digilocker_documents WHERE client_id = ? ORDER BY id ASC`,
      [clientId]
    );
    const docs: any[] = docRows || [];

    // Download Aadhaar PDF
    const aadhaarDoc = docs.find((d: any) =>
      d.doc_type === "ADHAR" || d.doc_type === "AADHAAR"
    );
    if (aadhaarDoc?.download_url && !aadhaarLocalPdf) {
      aadhaarLocalPdf = await savePdfLocally(aadhaarDoc.download_url, clientId, "aadhaar");
    } else if (!aadhaarLocalPdf) {
      // Try to get fresh download URL for Aadhaar
      if (aadhaarDoc?.file_id) {
        const dlRes = await fetch(
          `${SUREPASS_BASE}/api/v1/digilocker/download-document/${clientId}/${aadhaarDoc.file_id}`,
          { method: "GET", headers: authHeaders }
        );
        const dlData = await safeJson(dlRes);
        if (dlData?.data?.download_url) {
          aadhaarLocalPdf = await savePdfLocally(dlData.data.download_url, clientId, "aadhaar");
          // Update the URL in doc table
          await db.execute(
            `UPDATE digilocker_documents SET download_url=?, downloaded=1 WHERE client_id=? AND file_id=?`,
            [dlData.data.download_url, clientId, aadhaarDoc.file_id]
          );
        }
      }
    }

    // Download PAN PDF if available
    const panDoc = docs.find((d: any) => d.doc_type === "PANCR" || d.doc_type === "PAN");
    if (panDoc?.file_id && !panLocalPdf) {
      const panDlRes = await fetch(
        `${SUREPASS_BASE}/api/v1/digilocker/download-document/${clientId}/${panDoc.file_id}`,
        { method: "GET", headers: authHeaders }
      );
      const panDlData = await safeJson(panDlRes);
      if (panDlData?.data?.download_url) {
        panLocalPdf = await savePdfLocally(panDlData.data.download_url, clientId, "pan");
        await db.execute(
          `UPDATE digilocker_documents SET download_url=?, downloaded=1 WHERE client_id=? AND file_id=?`,
          [panDlData.data.download_url, clientId, panDoc.file_id]
        );
      }
    }

    // ── 3. Save to DB ─────────────────────────────────────────────────────
    await db.execute(
      `UPDATE digilocker_sessions SET
        aadhaar_full_name=?, aadhaar_care_of=?, aadhaar_dob=?, aadhaar_yob=?,
        aadhaar_zip=?, aadhaar_gender=?, aadhaar_masked_number=?,
        aadhaar_full_address=?, aadhaar_father_name=?,
        aadhaar_address_json=?, aadhaar_profile_image=?, aadhaar_xml_url=?,
        aadhaar_xml_fetched=1,
        full_name=COALESCE(full_name, ?),
        gender=COALESCE(gender, ?),
        date_of_birth=COALESCE(date_of_birth, ?),
        digilocker_mobile=?,
        raw_aadhaar_xml=?,
        aadhaar_local_pdf=?, pan_local_pdf=?,
        updated_at=NOW()
       WHERE client_id=?`,
      [
        aadhaar.full_name || null,
        aadhaar.care_of || null,
        aadhaar.dob || null,
        aadhaar.yob || null,
        aadhaar.zip || null,
        aadhaar.gender || null,
        aadhaar.masked_aadhaar || null,
        aadhaar.full_address || null,
        aadhaar.father_name || null,
        JSON.stringify(aadhaar.address || {}),
        aadhaar.profile_image || null,
        d.xml_url || null,
        meta.name || aadhaar.full_name || null,
        meta.gender || aadhaar.gender || null,
        meta.dob || aadhaar.dob || null,
        meta.mobile_number || null,
        JSON.stringify(d),
        aadhaarLocalPdf,
        panLocalPdf,
        clientId,
      ]
    );

    // ── 4. Return ──────────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      cached: false,
      aadhaar_xml_data: {
        full_name: aadhaar.full_name,
        care_of: aadhaar.care_of,
        dob: aadhaar.dob,
        yob: aadhaar.yob,
        zip: aadhaar.zip,
        gender: aadhaar.gender,
        masked_aadhaar: aadhaar.masked_aadhaar,
        full_address: aadhaar.full_address,
        father_name: aadhaar.father_name,
        address: aadhaar.address,
        profile_image: aadhaar.profile_image,
        xml_url: d.xml_url,
      },
      digilocker_metadata: meta,
      aadhaar_local_pdf: aadhaarLocalPdf,
      pan_local_pdf: panLocalPdf,
      pan_number: session.pan_number,
      pan_full_name: session.pan_full_name,
      pan_dob: session.pan_dob,
    });

  } catch (error: any) {
    console.error("[TeacherAadhaarXML] Error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}