// app/api/public/digilocker/parent-fetch-docs/route.ts
//
// Called after a child completes DigiLocker consent (Step 2 of parent registration).
// Downloads the APAAR (ABCID) PDF, parses it to extract:
//   - APAAR ID (12-digit number after "APAAR\tID")
//   - Full Name  (after "Name", before "Date of Birth")
//   - Date of Birth (after "Date of Birth")
//   - Gender  (after "Gender")
// Returns parsed data so UI can show read-only verified fields.
// Idempotent — safe to call multiple times.

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
    console.error("[ParentFetchDocs] Non-JSON:", text.slice(0, 300));
    return null;
  }
}

async function downloadAndSaveApaarPdf(
  url: string,
  clientId: string
): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) { console.error(`[ParentFetchDocs] PDF HTTP ${res.status}`); return null; }
    const buffer = Buffer.from(await res.arrayBuffer());
    const dir = path.join(process.cwd(), "private-uploads", "apaar");
    await fs.mkdir(dir, { recursive: true });
    const safeClient = clientId.replace(/[^a-zA-Z0-9_-]/g, "");
    const filename = `apaar_${safeClient}_${Date.now()}.pdf`;
    await fs.writeFile(path.join(dir, filename), buffer);
    return `apaar/${filename}`;
  } catch (err) {
    console.error("[ParentFetchDocs] PDF save error:", err);
    return null;
  }
}

// Parse APAAR PDF text to extract structured data.
// Real format (from DigiLocker ABCID docs):
//   "...NamesatyampanditDate of Birth21/12/2004GenderMaleAPAAR\tID713079012640..."
async function parseApaarPdf(localPath: string): Promise<{
  apaarId: string | null;
  fullName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
}> {
  const empty = { apaarId: null, fullName: null, dateOfBirth: null, gender: null };
  try {
    const segments = localPath.replace(/\\/g, "/").split("/").filter(Boolean);
    const fullPath = path.join(process.cwd(), "private-uploads", ...segments);
    const buf = await fs.readFile(fullPath);

    // Check it's a real PDF (not image-only/scanned)
    if (buf.slice(0, 4).toString() !== "%PDF") return empty;

    const pdfParseModule = await import("pdf-parse");
    const pdfParse = (pdfParseModule as any).default ?? (pdfParseModule as any);
    const parsed = await (pdfParse as (buf: Buffer) => Promise<{ text: string }>)(buf);
    const raw = parsed.text || "";

    // Normalize whitespace for consistent matching
    // Real PDFs have tabs: "APAAR\tID713079012640", "NamesatyamDate of Birth..."
    const text = raw.replace(/\r/g, " ").replace(/\t/g, " ").replace(/\s{2,}/g, " ");

    console.log("[ParentFetchDocs] PDF text sample:", text.slice(0, 400));

    // APAAR ID: 12-digit number after "APAAR ID"
    const apaarMatch = text.match(/APAAR\s+ID\s*(\d{12})/i)
      || text.match(/\b(\d{12})\b/); // fallback: any 12-digit number

    // Name: after "Name", before "Date of Birth" or "DOB"
    const nameMatch = text.match(/Name\s+([A-Za-z][A-Za-z\s]{1,60}?)(?:\s+Date\s+of\s+Birth|\s+DOB)/i)
      || text.match(/India\s+Name\s*([A-Za-z][A-Za-z\s]{1,60}?)(?:\s+Date|\s+DOB)/i);

    // Date of Birth: DD/MM/YYYY or DD-MM-YYYY
    const dobMatch = text.match(/Date\s+of\s+Birth\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i)
      || text.match(/DOB\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i);

    // Gender
    const genderMatch = text.match(/Gender\s*(Male|Female|Other|Transgender)/i);

    const result = {
      apaarId:     apaarMatch ? apaarMatch[1].trim() : null,
      fullName:    nameMatch  ? nameMatch[1].replace(/\s+/g, " ").trim() : null,
      dateOfBirth: dobMatch   ? dobMatch[1].trim()   : null,
      gender:      genderMatch ? genderMatch[1].trim() : null,
    };

    console.log("[ParentFetchDocs] Parsed from PDF:", result);
    return result;
  } catch (err) {
    console.error("[ParentFetchDocs] PDF parse error:", err);
    return empty;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.clientId) {
      return NextResponse.json({ success: false, error: "clientId is required" }, { status: 400 });
    }
    const { clientId } = body;

    // 0. Load session
    const [rows]: any = await db.execute(
      `SELECT * FROM digilocker_sessions WHERE client_id = ? LIMIT 1`,
      [clientId]
    );
    if (!rows?.length) {
      return NextResponse.json(
        { success: false, error: "DigiLocker session not found. Please try again." },
        { status: 404 }
      );
    }
    const session = rows[0];

    // 0a. Cache hit — already fully processed
    if (session.apaar_local_pdf && session.apaar_id) {
      console.log("[ParentFetchDocs] Full cache hit for", clientId);
      return NextResponse.json({
        success:      true,
        cached:       true,
        apaarId:      session.apaar_id         || null,
        fullName:     session.aadhaar_full_name || session.full_name || null,
        dateOfBirth:  session.aadhaar_dob       || session.date_of_birth || null,
        gender:       session.aadhaar_gender    || session.gender || null,
        maskedAadhaar: session.aadhaar_masked_number || null,
        apaarLocalPdf: session.apaar_local_pdf  || null,
        noApaarDoc:   false,
      });
    }

    // 1. Check Surepass status
    const statusRes = await fetch(
      `${SUREPASS_BASE}/api/v1/digilocker/status/${clientId}`,
      { method: "GET", headers: authHeaders }
    );
    const statusData = await safeJson(statusRes);
    if (!statusData?.data?.completed) {
      return NextResponse.json(
        {
          success: false,
          error: statusData?.data?.error_description ||
            "DigiLocker verification not yet complete. Please complete the DigiLocker flow first.",
          status: statusData?.data?.status || "pending",
        },
        { status: 202 }
      );
    }

    // 2. Fetch Aadhaar XML for child identity (name/DOB/gender from official source)
    let aadhaarXml: any = {};
    let digilockerMeta: any = {};
    let xmlRaw: any = null;

    if (!session.aadhaar_xml_fetched) {
      console.log("[ParentFetchDocs] Fetching Aadhaar XML for", clientId);
      const xmlRes = await fetch(
        `${SUREPASS_BASE}/api/v1/digilocker/download-aadhaar/${clientId}`,
        { method: "GET", headers: authHeaders }
      );
      xmlRaw = await safeJson(xmlRes);
      if (xmlRes.ok && xmlRaw?.success && xmlRaw?.data) {
        aadhaarXml     = xmlRaw.data.aadhaar_xml_data    || {};
        digilockerMeta = xmlRaw.data.digilocker_metadata || {};
        console.log("[ParentFetchDocs] Aadhaar XML:", aadhaarXml.full_name, aadhaarXml.dob);
      } else {
        console.warn("[ParentFetchDocs] Aadhaar XML not available:", xmlRaw?.message);
      }
    } else {
      aadhaarXml = {
        full_name:      session.aadhaar_full_name,
        dob:            session.aadhaar_dob,
        gender:         session.aadhaar_gender,
        masked_aadhaar: session.aadhaar_masked_number,
      };
    }

    // 3. List documents
    console.log("[ParentFetchDocs] Listing documents for", clientId);
    const listRes = await fetch(
      `${SUREPASS_BASE}/api/v1/digilocker/list-documents/${clientId}`,
      { method: "GET", headers: authHeaders }
    );
    const listData = await safeJson(listRes);
    const documents: any[] = listData?.data?.documents || [];
    console.log("[ParentFetchDocs] Docs:", documents.map((d: any) => d.doc_type).join(", ") || "none");

    // Find APAAR (ABCID) document
    const apaarDoc = documents.find(
      (d: any) => d.doc_type === "ABCID" || d.doc_type === "APAAR"
    );

    let apaarLocalPdf: string | null   = session.apaar_local_pdf || null;
    let apaarId: string | null         = session.apaar_id        || null;
    let pdfFullName: string | null     = null;
    let pdfDateOfBirth: string | null  = null;
    let pdfGender: string | null       = null;
    let apaarDownloadUrl: string | null = null;
    let noApaarDoc = !apaarDoc;

    // Save raw document list
    if (documents.length > 0) {
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
        console.warn("[ParentFetchDocs] digilocker_documents warn:", dbErr);
      }
    }

    // 4. Download APAAR PDF
    if (apaarDoc && !apaarLocalPdf) {
      try {
        console.log("[ParentFetchDocs] Getting APAAR download URL...");
        const dlRes = await fetch(
          `${SUREPASS_BASE}/api/v1/digilocker/download-document/${clientId}/${apaarDoc.file_id}`,
          { method: "GET", headers: authHeaders }
        );
        const dlData = await safeJson(dlRes);
        apaarDownloadUrl = dlData?.data?.download_url || null;

        if (apaarDownloadUrl) {
          apaarLocalPdf = await downloadAndSaveApaarPdf(apaarDownloadUrl, clientId);
          console.log("[ParentFetchDocs] APAAR saved:", apaarLocalPdf);
          await db.execute(
            `UPDATE digilocker_documents SET download_url=?, downloaded=1
             WHERE client_id=? AND file_id=?`,
            [apaarDownloadUrl, clientId, apaarDoc.file_id]
          );
        }
      } catch (err) {
        console.error("[ParentFetchDocs] APAAR download error:", err);
      }
    }

    // 5. Parse APAAR PDF to extract APAAR ID + identity fields
    if (apaarLocalPdf) {
      const parsed = await parseApaarPdf(apaarLocalPdf);
      if (parsed.apaarId)     apaarId      = parsed.apaarId;
      if (parsed.fullName)    pdfFullName  = parsed.fullName;
      if (parsed.dateOfBirth) pdfDateOfBirth = parsed.dateOfBirth;
      if (parsed.gender)      pdfGender    = parsed.gender;
      console.log("[ParentFetchDocs] PDF parsed:", { apaarId, pdfFullName, pdfDateOfBirth, pdfGender });
    }

    // 6. Determine best identity values:
    //    Aadhaar XML (authoritative) > PDF parsed > nothing
    const finalName    = aadhaarXml.full_name   || pdfFullName    || digilockerMeta.name  || null;
    const finalDob     = aadhaarXml.dob         || pdfDateOfBirth || null;
    const finalGender  = aadhaarXml.gender      || pdfGender      || null;

    // 7. Persist to DB
    if (!session.aadhaar_xml_fetched && (aadhaarXml.full_name || aadhaarXml.masked_aadhaar)) {
      await db.execute(
        `UPDATE digilocker_sessions SET
          status                = 'completed',
          aadhaar_full_name     = ?,  aadhaar_dob           = ?,
          aadhaar_gender        = ?,  aadhaar_masked_number = ?,
          aadhaar_full_address  = ?,  aadhaar_care_of       = ?,
          aadhaar_zip           = ?,  aadhaar_father_name   = ?,
          aadhaar_address_json  = ?,  aadhaar_profile_image = ?,
          aadhaar_xml_fetched   = 1,
          full_name             = COALESCE(full_name,     ?),
          gender                = COALESCE(gender,        ?),
          date_of_birth         = COALESCE(date_of_birth, ?),
          digilocker_mobile     = ?,
          raw_aadhaar_xml       = ?,  raw_documents         = ?,
          apaar_local_pdf       = COALESCE(apaar_local_pdf, ?),
          apaar_id              = COALESCE(apaar_id, ?),
          updated_at            = NOW()
         WHERE client_id = ?`,
        [
          aadhaarXml.full_name      || null, aadhaarXml.dob            || null,
          aadhaarXml.gender         || null, aadhaarXml.masked_aadhaar || null,
          aadhaarXml.full_address   || null, aadhaarXml.care_of        || null,
          aadhaarXml.zip            || null, aadhaarXml.father_name    || null,
          JSON.stringify(aadhaarXml.address || {}), aadhaarXml.profile_image || null,
          finalName, finalGender, finalDob,
          digilockerMeta.mobile_number || null,
          JSON.stringify(xmlRaw?.data || {}), JSON.stringify(documents),
          apaarLocalPdf, apaarId,
          clientId,
        ]
      );
    } else {
      await db.execute(
        `UPDATE digilocker_sessions SET
          apaar_local_pdf = COALESCE(apaar_local_pdf, ?),
          apaar_id        = COALESCE(apaar_id, ?),
          status          = 'completed',
          raw_documents   = COALESCE(raw_documents, ?),
          updated_at      = NOW()
         WHERE client_id = ?`,
        [apaarLocalPdf, apaarId, JSON.stringify(documents), clientId]
      );
    }

    // 8. Return complete result
    return NextResponse.json({
      success:       true,
      cached:        false,
      apaarId,
      fullName:      finalName,
      dateOfBirth:   finalDob,
      gender:        finalGender,
      maskedAadhaar: aadhaarXml.masked_aadhaar || null,
      apaarLocalPdf,
      apaarDownloadUrl,
      noApaarDoc,
      // PDF-parsed identity (in case Aadhaar XML was unavailable)
      pdfParsed: {
        fullName:    pdfFullName,
        dateOfBirth: pdfDateOfBirth,
        gender:      pdfGender,
      },
      documents: documents.map((d: any) => ({
        doc_type: d.doc_type, doc_name: d.name, issuer: d.issuer,
      })),
    });

  } catch (error: any) {
    console.error("[ParentFetchDocs] Fatal:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}