// app/api/public/digilocker/teacher-pdf-proxy/route.ts
// Serves locally-saved PDF files for teacher DigiLocker documents.
// - For valid PDFs (PAN): serves directly
// - For XML files (Aadhaar sandbox): generates a clean PDF from XML data
// - Also handles PAN PDF text extraction for JSON data endpoint

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { db } from "@/lib/db";

// ── helpers ────────────────────────────────────────────────────────────────────

function parseAadhaarXml(xmlStr: string): Record<string, string> {
  const get = (tag: string, attr: string) => {
    const m = xmlStr.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i"));
    return m ? m[1] : "";
  };
  const name       = get("Poi", "name");
  const dob        = get("Poi", "dob");
  const gender     = get("Poi", "gender") === "M" ? "Male" : get("Poi", "gender") === "F" ? "Female" : get("Poi", "gender");
  const uid        = (xmlStr.match(/uid="([^"]*)"/) || [])[1] || "";
  const co         = get("Poa", "co");
  const house      = get("Poa", "house");
  const street     = get("Poa", "street");
  const loc        = get("Poa", "loc");
  const vtc        = get("Poa", "vtc");
  const po         = get("Poa", "po");
  const dist       = get("Poa", "dist");
  const state      = get("Poa", "state");
  const pc         = get("Poa", "pc");
  const country    = get("Poa", "country");
  const lm         = get("Poa", "lm");
  const subdist    = get("Poa", "subdist");
  const address = [house, street, lm, loc, vtc, po, subdist, dist, state, pc, country]
    .filter(Boolean).join(", ");
  return { name, dob, gender, uid, careOf: co, address, pincode: pc, state };
}

function generateAadhaarPdfHtml(data: Record<string, string>): string {
  const ts = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Aadhaar Verification Record</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; background: #fff; color: #1a1a1a; padding: 40px; }
  .header { text-align: center; border-bottom: 3px solid #003580; padding-bottom: 16px; margin-bottom: 24px; }
  .logo-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px; }
  .logo-box { width: 48px; height: 48px; background: #003580; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
  .logo-box span { color: #fff; font-size: 20px; font-weight: bold; }
  h1 { font-size: 20px; color: #003580; font-weight: 700; }
  h2 { font-size: 13px; color: #555; font-weight: 400; margin-top: 2px; }
  .aadhaar-label { font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
  .uid { font-family: monospace; font-size: 20px; font-weight: bold; letter-spacing: 3px; color: #1a1a1a; }
  .section { background: #f5f8ff; border: 1px solid #dde8ff; border-radius: 8px; padding: 18px 20px; margin-bottom: 16px; }
  .section-title { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #003580; margin-bottom: 12px; border-bottom: 1px solid #c5d8f0; padding-bottom: 6px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .field label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 3px; }
  .field span { font-size: 13px; font-weight: 600; color: #1a1a1a; }
  .address-field { grid-column: 1 / -1; }
  .verified-badge { display: inline-block; background: #e6f4ea; color: #1a7f37; border: 1px solid #a8d8b0; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-top: 8px; }
  .footer { text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 10px; color: #888; }
  .note { background: #fffbe6; border: 1px solid #ffe083; border-radius: 6px; padding: 10px 14px; margin-top: 12px; font-size: 11px; color: #7a5c00; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo-row">
      <div class="logo-box"><span>ID</span></div>
      <div>
        <h1>Aadhaar Verification Record</h1>
        <h2>Unique Identification Authority of India (UIDAI)</h2>
      </div>
    </div>
    <p class="aadhaar-label">Aadhaar Number (Masked)</p>
    <p class="uid">${data.uid || "XXXXXXXX0000"}</p>
    <span class="verified-badge">✓ DigiLocker Verified</span>
  </div>

  <div class="section">
    <p class="section-title">Personal Information</p>
    <div class="grid">
      <div class="field"><label>Full Name</label><span>${data.name || "—"}</span></div>
      <div class="field"><label>Date of Birth</label><span>${data.dob || "—"}</span></div>
      <div class="field"><label>Gender</label><span>${data.gender || "—"}</span></div>
      ${data.careOf ? `<div class="field"><label>Father / Care Of</label><span>${data.careOf}</span></div>` : ""}
    </div>
  </div>

  <div class="section">
    <p class="section-title">Address Information</p>
    <div class="grid">
      <div class="field address-field"><label>Full Address</label><span>${data.address || "—"}</span></div>
      <div class="field"><label>PIN Code</label><span>${data.pincode || "—"}</span></div>
      <div class="field"><label>State</label><span>${data.state || "—"}</span></div>
    </div>
  </div>

  <div class="note">
    <strong>Note:</strong> This Aadhaar data is accessed using DigiLocker.
    This document is digitally verified and valid as per IT Act 2000.
    Generated on ${ts}.
  </div>

  <div class="footer">
    <p>Powered by DigiLocker | Issued by UIDAI, Government of India</p>
    <p style="margin-top:4px">This is a computer-generated document and does not require a physical signature.</p>
  </div>
</body>
</html>`;
}

// ── GET: serve PDF or generate one from XML ───────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawFile = searchParams.get("file");

    if (!rawFile) {
      return NextResponse.json({ error: "file parameter required" }, { status: 400 });
    }

    const normalized = rawFile
      .replace(/\\/g, "/")
      .replace(/^\/+/, "")
      .replace(/\.\.\//g, "")
      .replace(/^\.\//, "")
      .trim();

    console.log("[PdfProxy] raw:", rawFile, "→ normalized:", normalized);

    if (
      !normalized.startsWith("teacher-docs/") &&
      !normalized.startsWith("apaar/")
    ) {
      return NextResponse.json(
        { error: `Invalid path: ${normalized}` },
        { status: 403 }
      );
    }

    const segments = normalized.split("/").filter(Boolean);
    const fullPath = path.join(process.cwd(), "private-uploads", ...segments);

    console.log("[PdfProxy] Serving file:", fullPath);

    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json({ error: `File not found: ${normalized}` }, { status: 404 });
    }

    const buffer = await fs.readFile(fullPath);

    // ── Valid PDF → serve directly ────────────────────────────────────────
    if (buffer.length >= 4 && buffer.slice(0, 4).toString() === "%PDF") {
      const filename = path.basename(fullPath);
      return new NextResponse(buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${filename}"`,
          "Content-Length": String(buffer.length),
          "Cache-Control": "private, max-age=3600",
          "X-Frame-Options": "SAMEORIGIN",
        },
      });
    }

    // ── XML file (Aadhaar sandbox) → parse & return HTML "viewer" ────────
    const xmlStr = buffer.toString("utf-8");
    if (xmlStr.trim().startsWith("<?xml") || xmlStr.trim().startsWith("<Certificate")) {
      console.log("[PdfProxy] Aadhaar XML detected — generating HTML viewer");
      const aadhaarData = parseAadhaarXml(xmlStr);
      const html = generateAadhaarPdfHtml(aadhaarData);
      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "private, max-age=3600",
        },
      });
    }

    // Unknown format
    return NextResponse.json(
      { error: "This document is not a valid PDF or XML file.", isInvalidPdf: true, fileSize: buffer.length },
      { status: 415 }
    );

  } catch (error: any) {
    console.error("[TeacherPdfProxy] Error:", error);
    return NextResponse.json({ error: "Server error: " + (error?.message || "unknown") }, { status: 500 });
  }
}

// ── POST: extract JSON data from a PAN PDF (text parsing) ────────────────────

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();
    if (!clientId) {
      return NextResponse.json({ success: false, error: "clientId required" }, { status: 400 });
    }

    // Load session to find PAN PDF path
    const [rows]: any = await db.execute(
      `SELECT pan_local_pdf, pan_number, pan_full_name, pan_dob FROM digilocker_sessions WHERE client_id = ? LIMIT 1`,
      [clientId]
    );
    if (!rows?.length) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }
    const session = rows[0];

    // If we already have parsed PAN data in DB, return it directly
    if (session.pan_number) {
      return NextResponse.json({
        success: true,
        cached: true,
        panNumber:  session.pan_number,
        panFullName: session.pan_full_name,
        panDob:     session.pan_dob,
      });
    }

    if (!session.pan_local_pdf) {
      return NextResponse.json({ success: false, error: "No PAN PDF available" }, { status: 404 });
    }

    const segments = session.pan_local_pdf.replace(/\\/g, "/").split("/").filter(Boolean);
    const fullPath = path.join(process.cwd(), "private-uploads", ...segments);

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await fs.readFile(fullPath);
    } catch {
      return NextResponse.json({ success: false, error: "PAN PDF file not found on disk" }, { status: 404 });
    }

    if (pdfBuffer.slice(0, 4).toString() !== "%PDF") {
      return NextResponse.json({ success: false, error: "PAN file is not a valid PDF" }, { status: 415 });
    }

    // ── Parse PDF text using pdf-parse ────────────────────────────────────
    let pdfText = "";
    try {
      // Dynamic import to avoid build-time issues
      const pdfParseModule = await import("pdf-parse");
      const pdfParse = (pdfParseModule as any).default ?? (pdfParseModule as any);
      const parsed = await (pdfParse as (buf: Buffer) => Promise<{ text: string }>)(pdfBuffer);
      pdfText = parsed.text || "";
    } catch (parseErr) {
      console.error("[PdfProxy] pdf-parse error:", parseErr);
      // Fallback: regex on raw buffer string
      pdfText = pdfBuffer.toString("binary");
    }

    // Extract PAN number: format like AABCP1234D (10 chars uppercase)
    const panMatch = pdfText.match(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/);
    const panNumber = panMatch ? panMatch[1] : null;

    // Extract name: line after "NAME" keyword
    const nameMatch = pdfText.match(/NAME\s+([A-Z ]+?)(?:\n|GENDER|DATE)/i);
    const panFullName = nameMatch ? nameMatch[1].trim() : null;

    // Extract DOB: DD-MM-YYYY or DD/MM/YYYY format
    const dobMatch = pdfText.match(/DATE OF BIRTH\s+(\d{2}[-/]\d{2}[-/]\d{4})/i);
    const panDob = dobMatch ? dobMatch[1] : null;

    console.log("[PdfProxy] PAN parsed:", { panNumber, panFullName, panDob });

    // Save parsed PAN data to DB so we don't re-parse next time
    if (panNumber) {
      await db.execute(
        `UPDATE digilocker_sessions SET pan_number=?, pan_full_name=?, pan_dob=?, pan_fetched=1, updated_at=NOW() WHERE client_id=?`,
        [panNumber, panFullName, panDob, clientId]
      );
    }

    return NextResponse.json({
      success: true,
      cached: false,
      panNumber,
      panFullName,
      panDob,
    });

  } catch (error: any) {
    console.error("[TeacherPdfProxy] POST error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}