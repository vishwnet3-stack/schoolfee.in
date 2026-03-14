// app/api/public/digilocker/fetch-data/route.ts
// Fetches documents from Surepass, gets S3 PDF download URLs, saves to DB.
// We do NOT parse the PDF — we return the URL so the UI can display it.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SUREPASS_TOKEN = process.env.SUREPASS_TOKEN || "";
const IS_SANDBOX = (process.env.SUREPASS_ENV || "sandbox") !== "production";
const SUREPASS_BASE = IS_SANDBOX ? "https://sandbox.surepass.io" : "https://kyc-api.surepass.io";

async function safeJson(res: Response): Promise<any | null> {
  const text = await res.text();
  try { return JSON.parse(text); } catch {
    console.error("[DigiLocker] Non-JSON response (status", res.status, "):", text.slice(0, 200));
    return null;
  }
}
const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${SUREPASS_TOKEN}` };

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();
    if (!clientId) return NextResponse.json({ success: false, error: "clientId required" }, { status: 400 });

    // ── 0. Load session ───────────────────────────────────────────────
    const [rows]: any = await db.execute("SELECT * FROM digilocker_sessions WHERE client_id = ? LIMIT 1", [clientId]);
    if (!rows?.length) return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    const session = rows[0];

    // ── Return cached if already have URLs ────────────────────────────
    if (session.status === "completed") {
      const [docRows]: any = await db.execute(
        "SELECT * FROM digilocker_documents WHERE client_id = ? ORDER BY id ASC", [clientId]
      );
      const apaarDoc = (docRows || []).find((d: any) => d.doc_type === "ABCID");
      const aadhaarDoc = (docRows || []).find((d: any) => d.doc_type === "ADHAR" || d.doc_type === "AADHAAR");
      if (apaarDoc?.download_url || aadhaarDoc?.download_url) {
        return NextResponse.json({
          success: true, cached: true,
          fullName: session.full_name || null,
          dateOfBirth: session.date_of_birth || null,
          gender: session.gender || null,
          documents: docRows || [],
          apaarDownloadUrl: apaarDoc?.download_url || null,
          aadhaarDownloadUrl: aadhaarDoc?.download_url || null,
        });
      }
    }

    // ── 1. List documents from Surepass ───────────────────────────────
    const listRes = await fetch(`${SUREPASS_BASE}/api/v1/digilocker/list-documents/${clientId}`, { method: "GET", headers: authHeaders });
    const listData = await safeJson(listRes);
    if (!listRes.ok || !listData?.data?.documents) {
      return NextResponse.json({ success: false, error: listData?.message || "Documents not ready yet." }, { status: 422 });
    }

    const documents: any[] = listData.data.documents || [];
    console.log("[DigiLocker] Documents:", documents.map(d => `${d.doc_type}(${d.name})`).join(", "));

    // ── 2. Save documents to DB ───────────────────────────────────────
    const sessionId = session.id;
    await db.execute("DELETE FROM digilocker_documents WHERE session_id = ?", [sessionId]);
    for (const doc of documents) {
      await db.execute(
        `INSERT INTO digilocker_documents (session_id, client_id, file_id, doc_name, doc_type, issuer, description, downloaded) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
        [sessionId, clientId, doc.file_id, doc.name || null, doc.doc_type || null, doc.issuer || null, doc.description || null]
      );
    }

    // ── 3. Download each unique doc type to get S3 PDF URL ────────────
    // Pick one of each type
    const abcidDoc = documents.find(d => d.doc_type === "ABCID");
    const adharDoc = documents.find(d => d.doc_type === "ADHAR" || d.doc_type === "AADHAAR");
    const toDownload = [abcidDoc, adharDoc].filter(Boolean);
    if (!toDownload.length) {
      // Fallback: download first unique doc type
      const seen = new Set<string>();
      for (const d of documents) { if (!seen.has(d.doc_type)) { seen.add(d.doc_type); toDownload.push(d); } }
    }

    let fullName: string | null = null;
    let gender: string | null = null;
    let dateOfBirth: string | null = null;
    let apaarDownloadUrl: string | null = null;
    let aadhaarDownloadUrl: string | null = null;

    for (const doc of toDownload) {
      try {
        const dlRes = await fetch(
          `${SUREPASS_BASE}/api/v1/digilocker/download-document/${clientId}/${doc.file_id}`,
          { method: "GET", headers: authHeaders }
        );
        const dlData = await safeJson(dlRes);
        if (!dlRes.ok || !dlData?.data) { console.log(`[DigiLocker] Download failed ${doc.doc_type}:`, dlData?.message); continue; }

        const dl = dlData.data;
        const pdfUrl: string | null = dl.download_url || null;
        const mimeType: string | null = dl.mime_type || null;
        console.log(`[DigiLocker] ${doc.doc_type} → URL: ${pdfUrl ? "✅" : "❌ none"}`);

        // Save PDF URL to DB for this file
        await db.execute(
          "UPDATE digilocker_documents SET download_url = ?, mime_type = ?, downloaded = 1 WHERE client_id = ? AND file_id = ?",
          [pdfUrl, mimeType, clientId, doc.file_id]
        );

        if (doc.doc_type === "ABCID") apaarDownloadUrl = pdfUrl;
        if (doc.doc_type === "ADHAR" || doc.doc_type === "AADHAAR") aadhaarDownloadUrl = pdfUrl;

        // Extract profile info from structured data if Surepass provides it
        const d = dl.data || dl.digilocker_metadata;
        if (d) {
          if (!fullName) fullName = d.full_name || d.name || d.student_name || null;
          if (!gender) gender = d.gender || null;
          if (!dateOfBirth) dateOfBirth = d.dob || d.date_of_birth || null;
        }
      } catch (err) { console.error(`[DigiLocker] Error downloading ${doc.doc_type}:`, err); }
    }

    // ── 4. Mark session completed ─────────────────────────────────────
    await db.execute(
      `UPDATE digilocker_sessions SET status='completed', raw_documents=?, full_name=?, gender=?, date_of_birth=?, updated_at=NOW() WHERE client_id=?`,
      [JSON.stringify(documents), fullName, gender, dateOfBirth, clientId]
    );

    // ── 5. Return ─────────────────────────────────────────────────────
    const [updatedDocs]: any = await db.execute(
      "SELECT * FROM digilocker_documents WHERE client_id = ? ORDER BY id ASC", [clientId]
    );
    const finalApaar = (updatedDocs || []).find((d: any) => d.doc_type === "ABCID");
    const finalAadhaar = (updatedDocs || []).find((d: any) => d.doc_type === "ADHAR" || d.doc_type === "AADHAAR");

    return NextResponse.json({
      success: true, cached: false,
      fullName, gender, dateOfBirth,
      documentsCount: documents.length,
      documents: updatedDocs || [],
      apaarDownloadUrl: finalApaar?.download_url || apaarDownloadUrl,
      aadhaarDownloadUrl: finalAadhaar?.download_url || aadhaarDownloadUrl,
    });

  } catch (error: any) {
    console.error("[DigiLocker] fetch-data error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}