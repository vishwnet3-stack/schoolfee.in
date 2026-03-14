// app/api/public/digilocker/teacher-fetch-docs/route.ts
//
// DESIGN:
//  1. Always load existing PDF paths from teacher_digilocker_docs first
//  2. Fetch Aadhaar XML first (before PDF download)
//  3. Only download PDFs that are NOT already saved in DB
//  4. Parse PAN PDF text to extract panNumber, panFullName, panDob
//  5. Always return MERGED result: XML data + PDF paths from DB
//  6. Idempotent — safe to call multiple times (React StrictMode safe)
//  7. COALESCE in DB updates prevents overwriting existing good data

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
    console.error("[TeacherFetchDocs] Non-JSON:", text.slice(0, 300));
    return null;
  }
}

async function downloadAndSavePdf(
  url: string,
  clientId: string,
  docType: string
): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) {
      console.error(`[TeacherFetchDocs] PDF HTTP ${res.status} for ${docType}`);
      return null;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const isPdf = buffer.length >= 4 && buffer.slice(0, 4).toString() === "%PDF";
    if (!isPdf) {
      console.warn(`[TeacherFetchDocs] ${docType}: not a real PDF (${buffer.length} bytes). Saving anyway.`);
    }
    const dir = path.join(process.cwd(), "private-uploads", "teacher-docs");
    await fs.mkdir(dir, { recursive: true });
    const safe = docType.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const filename = `${safe}_${clientId}_${Date.now()}.pdf`;
    await fs.writeFile(path.join(dir, filename), buffer);
    return `teacher-docs/${filename}`;
  } catch (err) {
    console.error(`[TeacherFetchDocs] Save error (${docType}):`, err);
    return null;
  }
}

// Parse PAN PDF text to extract PAN number, name, DOB
async function parsePanPdf(localPath: string): Promise<{ panNumber: string | null; panFullName: string | null; panDob: string | null }> {
  try {
    const segments = localPath.replace(/\\/g, "/").split("/").filter(Boolean);
    const fullPath = path.join(process.cwd(), "private-uploads", ...segments);
    const buf = await fs.readFile(fullPath);
    if (buf.slice(0, 4).toString() !== "%PDF") return { panNumber: null, panFullName: null, panDob: null };

    const pdfParseModule = await import("pdf-parse");
    const pdfParse = (pdfParseModule as any).default ?? (pdfParseModule as any);
    const parsed = await (pdfParse as (buf: Buffer) => Promise<{ text: string }>)(buf);
    const text = parsed.text || "";

    const panMatch    = text.match(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/);
    const nameMatch   = text.match(/NAME\s+([A-Z ]+?)(?:\n|GENDER|DATE)/i);
    const dobMatch    = text.match(/DATE OF BIRTH\s+(\d{2}[-/]\d{2}[-/]\d{4})/i);

    return {
      panNumber:  panMatch  ? panMatch[1].trim()  : null,
      panFullName: nameMatch ? nameMatch[1].trim() : null,
      panDob:     dobMatch  ? dobMatch[1].trim()  : null,
    };
  } catch (err) {
    console.error("[TeacherFetchDocs] PAN parse error:", err);
    return { panNumber: null, panFullName: null, panDob: null };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();
    if (!clientId) {
      return NextResponse.json({ success: false, error: "clientId required" }, { status: 400 });
    }

    // 0. Load session
    const [rows]: any = await db.execute(
      `SELECT * FROM digilocker_sessions WHERE client_id = ? LIMIT 1`,
      [clientId]
    );
    if (!rows?.length) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }
    const session = rows[0];

    // 0a. Always load existing PDF paths from teacher_digilocker_docs
    const [existingDocs]: any = await db.execute(
      `SELECT * FROM teacher_digilocker_docs WHERE client_id = ?`,
      [clientId]
    );
    const existingAadhaar = (existingDocs || []).find((d: any) =>
      d.doc_type === "ADHAR" || d.doc_type === "AADHAAR"
    );
    const existingPan  = (existingDocs || []).find((d: any) =>
      d.doc_type === "PANCR" || d.doc_type === "PAN"
    );
    const existingApaar = (existingDocs || []).find((d: any) => d.doc_type === "ABCID");

    // 0b. Full cache: XML already fetched AND PDFs already saved
    if (session.aadhaar_xml_fetched && existingAadhaar?.local_pdf_path) {
      console.log("[TeacherFetchDocs] Full cache hit for", clientId);

      // If PAN pdf exists but pan_number not in session, parse now
      const panPdfPath = existingPan?.local_pdf_path || session.pan_local_pdf;
      let panNumber    = session.pan_number    || null;
      let panFullName  = session.pan_full_name || null;
      let panDob       = session.pan_dob       || null;

      if (panPdfPath && !panNumber) {
        const parsed = await parsePanPdf(panPdfPath);
        panNumber   = parsed.panNumber;
        panFullName = parsed.panFullName;
        panDob      = parsed.panDob;
        if (panNumber) {
          await db.execute(
            `UPDATE digilocker_sessions SET pan_number=?, pan_full_name=?, pan_dob=?, pan_fetched=1, updated_at=NOW() WHERE client_id=?`,
            [panNumber, panFullName, panDob, clientId]
          );
        }
      }

      return NextResponse.json({
        success: true,
        cached: true,
        fullName:       session.aadhaar_full_name  || session.full_name,
        dob:            session.aadhaar_dob,
        gender:         session.aadhaar_gender     || session.gender,
        maskedAadhaar:  session.aadhaar_masked_number,
        address:        session.aadhaar_full_address,
        zip:            session.aadhaar_zip,
        careOf:         session.aadhaar_care_of,
        fatherName:     session.aadhaar_father_name,
        addressDetails: session.aadhaar_address_json
          ? JSON.parse(session.aadhaar_address_json)
          : null,
        panNumber,
        panFullName,
        panDob,
        mobileNumber:   session.digilocker_mobile,
        aadhaarLocalPdf: existingAadhaar?.local_pdf_path || session.aadhaar_local_pdf,
        panLocalPdf:     panPdfPath,
        apaarLocalPdf:   existingApaar?.local_pdf_path   || session.apaar_local_pdf,
        documents: (existingDocs || []).map((d: any) => ({
          doc_type: d.doc_type, doc_name: d.doc_name,
          local_pdf_path: d.local_pdf_path, issuer: d.issuer,
        })),
      });
    }

    // 1. Check Surepass status
    const statusRes = await fetch(
      `${SUREPASS_BASE}/api/v1/digilocker/status/${clientId}`,
      { method: "GET", headers: authHeaders }
    );
    const statusData = await safeJson(statusRes);
    if (!statusData?.data?.completed) {
      return NextResponse.json({
        success: false,
        error: statusData?.data?.error_description || "DigiLocker verification not yet completed.",
        status: statusData?.data?.status || "pending",
      }, { status: 202 });
    }

    // 2. Fetch Aadhaar XML FIRST
    let aadhaarXml: any = {};
    let digilockerMeta: any = {};
    let xmlRaw: any = null;

    if (!session.aadhaar_xml_fetched) {
      console.log("[TeacherFetchDocs] Fetching Aadhaar XML for", clientId);
      const xmlRes = await fetch(
        `${SUREPASS_BASE}/api/v1/digilocker/download-aadhaar/${clientId}`,
        { method: "GET", headers: authHeaders }
      );
      xmlRaw = await safeJson(xmlRes);
      if (xmlRes.ok && xmlRaw?.success && xmlRaw?.data) {
        aadhaarXml     = xmlRaw.data.aadhaar_xml_data    || {};
        digilockerMeta = xmlRaw.data.digilocker_metadata || {};
        console.log("[TeacherFetchDocs] XML OK:", aadhaarXml.full_name, aadhaarXml.masked_aadhaar);
      } else {
        console.warn("[TeacherFetchDocs] XML failed:", xmlRaw?.message);
      }
    } else {
      aadhaarXml = {
        full_name:      session.aadhaar_full_name,
        care_of:        session.aadhaar_care_of,
        dob:            session.aadhaar_dob,
        yob:            session.aadhaar_yob,
        zip:            session.aadhaar_zip,
        gender:         session.aadhaar_gender,
        masked_aadhaar: session.aadhaar_masked_number,
        full_address:   session.aadhaar_full_address,
        father_name:    session.aadhaar_father_name,
        address:        session.aadhaar_address_json
          ? JSON.parse(session.aadhaar_address_json)
          : {},
      };
      digilockerMeta = { mobile_number: session.digilocker_mobile };
    }

    // 3. List documents
    console.log("[TeacherFetchDocs] Listing documents for", clientId);
    const listRes = await fetch(
      `${SUREPASS_BASE}/api/v1/digilocker/list-documents/${clientId}`,
      { method: "GET", headers: authHeaders }
    );
    const listData = await safeJson(listRes);
    if (!listRes.ok || !listData?.data?.documents?.length) {
      return NextResponse.json({
        success: false,
        error: listData?.message || "No documents found in DigiLocker.",
      }, { status: 422 });
    }

    const documents: any[] = listData.data.documents;
    console.log("[TeacherFetchDocs] Docs:", documents.map((d: any) => d.doc_type).join(", "));

    // Save to raw digilocker_documents table
    try {
      await db.execute(`DELETE FROM digilocker_documents WHERE session_id = ?`, [session.id]);
      for (const doc of documents) {
        await db.execute(
          `INSERT INTO digilocker_documents
           (session_id, client_id, file_id, doc_name, doc_type, issuer, description, downloaded)
           VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
          [session.id, clientId, doc.file_id, doc.name || null,
            doc.doc_type || null, doc.issuer || null, doc.description || null]
        );
      }
    } catch (dbErr) {
      console.warn("[TeacherFetchDocs] digilocker_documents insert warn:", dbErr);
    }

    // 4. Download PDFs — only if NOT already in DB
    const adharDoc = documents.find((d: any) => d.doc_type === "ADHAR" || d.doc_type === "AADHAAR");
    const panDoc   = documents.find((d: any) => d.doc_type === "PANCR" || d.doc_type === "PAN");
    const apaarDoc = documents.find((d: any) => d.doc_type === "ABCID");

    let aadhaarLocalPdf: string | null = existingAadhaar?.local_pdf_path || session.aadhaar_local_pdf || null;
    let panLocalPdf:     string | null = existingPan?.local_pdf_path     || session.pan_local_pdf     || null;
    let apaarLocalPdf:   string | null = existingApaar?.local_pdf_path   || session.apaar_local_pdf   || null;
    let panNumber:       string | null = session.pan_number    || null;
    let panFullName:     string | null = session.pan_full_name || null;
    let panDob:          string | null = session.pan_dob       || null;

    const needDownload = [
      { doc: adharDoc, existingPath: aadhaarLocalPdf },
      { doc: panDoc,   existingPath: panLocalPdf     },
      { doc: apaarDoc, existingPath: apaarLocalPdf   },
    ].filter(x => x.doc && !x.existingPath);

    const savedDocs: any[] = [];

    for (const { doc } of needDownload) {
      if (!doc) continue;
      try {
        console.log(`[TeacherFetchDocs] Getting URL for ${doc.doc_type}...`);
        const dlRes = await fetch(
          `${SUREPASS_BASE}/api/v1/digilocker/download-document/${clientId}/${doc.file_id}`,
          { method: "GET", headers: authHeaders }
        );
        const dlData      = await safeJson(dlRes);
        const downloadUrl = dlData?.data?.download_url || null;
        const mimeType    = dlData?.data?.mime_type    || null;

        let localPath: string | null = null;
        if (downloadUrl) {
          localPath = await downloadAndSavePdf(downloadUrl, clientId, doc.doc_type);
          console.log(`[TeacherFetchDocs] ${doc.doc_type} saved: ${localPath}`);
        }

        if (doc.doc_type === "ADHAR" || doc.doc_type === "AADHAAR") aadhaarLocalPdf = localPath;
        if (doc.doc_type === "PANCR" || doc.doc_type === "PAN")     panLocalPdf     = localPath;
        if (doc.doc_type === "ABCID")                               apaarLocalPdf   = localPath;

        // Parse PAN PDF immediately after download
        if ((doc.doc_type === "PANCR" || doc.doc_type === "PAN") && localPath && !panNumber) {
          const parsed = await parsePanPdf(localPath);
          panNumber   = parsed.panNumber;
          panFullName = parsed.panFullName;
          panDob      = parsed.panDob;
          console.log("[TeacherFetchDocs] PAN parsed:", { panNumber, panFullName, panDob });
        }

        await db.execute(
          `INSERT INTO teacher_digilocker_docs
           (client_id, doc_type, doc_name, file_id, issuer, local_pdf_path, s3_pdf_url, mime_type)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             local_pdf_path = COALESCE(VALUES(local_pdf_path), local_pdf_path),
             s3_pdf_url     = VALUES(s3_pdf_url),
             doc_name       = VALUES(doc_name),
             fetched_at     = NOW()`,
          [clientId, doc.doc_type, doc.name, doc.file_id,
            doc.issuer, localPath, downloadUrl, mimeType]
        );

        await db.execute(
          `UPDATE digilocker_documents
           SET download_url=?, mime_type=?, downloaded=1
           WHERE client_id=? AND file_id=?`,
          [downloadUrl, mimeType, clientId, doc.file_id]
        );

        savedDocs.push({
          doc_type: doc.doc_type, doc_name: doc.name,
          local_pdf_path: localPath, issuer: doc.issuer,
        });
      } catch (err) {
        console.error(`[TeacherFetchDocs] Error downloading ${doc?.doc_type}:`, err);
        savedDocs.push({ doc_type: doc?.doc_type, doc_name: doc?.name,
          local_pdf_path: null, issuer: doc?.issuer });
      }
    }

    // Add already-existing docs
    for (const ed of (existingDocs || [])) {
      if (!savedDocs.find((s: any) => s.doc_type === ed.doc_type)) {
        savedDocs.push({ doc_type: ed.doc_type, doc_name: ed.doc_name,
          local_pdf_path: ed.local_pdf_path, issuer: ed.issuer });
      }
    }

    // 5. Persist XML data + PDF paths + PAN data to session
    if (!session.aadhaar_xml_fetched && aadhaarXml.full_name) {
      await db.execute(
        `UPDATE digilocker_sessions SET
          status                = 'completed',
          aadhaar_full_name     = ?,  aadhaar_care_of       = ?,
          aadhaar_dob           = ?,  aadhaar_yob           = ?,
          aadhaar_zip           = ?,  aadhaar_gender        = ?,
          aadhaar_masked_number = ?,  aadhaar_full_address  = ?,
          aadhaar_father_name   = ?,  aadhaar_address_json  = ?,
          aadhaar_profile_image = ?,  aadhaar_xml_url       = ?,
          aadhaar_xml_fetched   = 1,
          full_name             = COALESCE(full_name,     ?),
          gender                = COALESCE(gender,        ?),
          date_of_birth         = COALESCE(date_of_birth, ?),
          digilocker_mobile     = ?,
          raw_aadhaar_xml       = ?,
          raw_documents         = ?,
          aadhaar_local_pdf     = COALESCE(aadhaar_local_pdf, ?),
          pan_local_pdf         = COALESCE(pan_local_pdf,     ?),
          apaar_local_pdf       = COALESCE(apaar_local_pdf,   ?),
          pan_number            = COALESCE(pan_number,        ?),
          pan_full_name         = COALESCE(pan_full_name,     ?),
          pan_dob               = COALESCE(pan_dob,           ?),
          pan_fetched           = IF(? IS NOT NULL, 1, pan_fetched),
          updated_at            = NOW()
         WHERE client_id = ?`,
        [
          aadhaarXml.full_name      || null, aadhaarXml.care_of    || null,
          aadhaarXml.dob            || null, aadhaarXml.yob        || null,
          aadhaarXml.zip            || null, aadhaarXml.gender     || null,
          aadhaarXml.masked_aadhaar || null, aadhaarXml.full_address || null,
          aadhaarXml.father_name    || null,
          JSON.stringify(aadhaarXml.address || {}),
          aadhaarXml.profile_image  || null,
          xmlRaw?.data?.xml_url     || null,
          digilockerMeta.name || aadhaarXml.full_name || null,
          digilockerMeta.gender     || aadhaarXml.gender || null,
          digilockerMeta.dob        || aadhaarXml.dob    || null,
          digilockerMeta.mobile_number || null,
          JSON.stringify(xmlRaw?.data || {}),
          JSON.stringify(documents),
          aadhaarLocalPdf, panLocalPdf, apaarLocalPdf,
          panNumber, panFullName, panDob, panNumber,
          clientId,
        ]
      );
    } else {
      await db.execute(
        `UPDATE digilocker_sessions SET
          aadhaar_local_pdf = COALESCE(aadhaar_local_pdf, ?),
          pan_local_pdf     = COALESCE(pan_local_pdf, ?),
          apaar_local_pdf   = COALESCE(apaar_local_pdf, ?),
          pan_number        = COALESCE(pan_number, ?),
          pan_full_name     = COALESCE(pan_full_name, ?),
          pan_dob           = COALESCE(pan_dob, ?),
          pan_fetched       = IF(? IS NOT NULL, 1, pan_fetched),
          updated_at        = NOW()
         WHERE client_id = ?`,
        [aadhaarLocalPdf, panLocalPdf, apaarLocalPdf, panNumber, panFullName, panDob, panNumber, clientId]
      );
    }

    // 6. Return complete merged response
    return NextResponse.json({
      success: true,
      cached: false,
      fullName:       aadhaarXml.full_name      || digilockerMeta.name   || null,
      dob:            aadhaarXml.dob            || digilockerMeta.dob    || null,
      gender:         aadhaarXml.gender         || digilockerMeta.gender || null,
      maskedAadhaar:  aadhaarXml.masked_aadhaar || null,
      address:        aadhaarXml.full_address   || null,
      zip:            aadhaarXml.zip            || null,
      careOf:         aadhaarXml.care_of        || null,
      fatherName:     aadhaarXml.father_name    || null,
      addressDetails: aadhaarXml.address        || null,
      panNumber,
      panFullName,
      panDob,
      mobileNumber:   digilockerMeta.mobile_number || null,
      aadhaarLocalPdf,
      panLocalPdf,
      apaarLocalPdf,
      documents: savedDocs,
    });

  } catch (error: any) {
    console.error("[TeacherFetchDocs] Fatal:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}