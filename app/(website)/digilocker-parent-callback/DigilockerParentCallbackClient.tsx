"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaIdCard } from "react-icons/fa";

// DigiLocker callback page for parent registration.
//
// TWO MODES (determined by ?flow= param set before redirect):
//   flow=parent  → Fetch parent's own Aadhaar XML + PAN via teacher-fetch-docs
//                  Stores result in sessionStorage as "parent_digilocker_result"
//   flow=child   → Fetch child's APAAR doc via parent-fetch-docs
//                  Stores result in sessionStorage as "parent_digilocker_result_for_child"
//
// The flow param is saved to sessionStorage before redirect because Surepass
// strips custom query params on callback — we read it back from sessionStorage.

export default function DigilockerParentCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status,   setStatus]   = useState<"loading" | "success" | "error">("loading");
  const [message,  setMessage]  = useState("Connecting to DigiLocker...");
  const [headline, setHeadline] = useState("Fetching DigiLocker Data");
  const [summary,  setSummary]  = useState<Record<string, string>>({});
  const [error,    setError]    = useState<string | null>(null);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;

    const clientId = searchParams.get("client_id") || searchParams.get("clientId");
    if (!clientId) {
      setStatus("error");
      setError("Missing client_id in callback URL. Please try again.");
      return;
    }

    fetchedRef.current = true;
    sessionStorage.setItem("parent_digilocker_client_id", clientId);

    // Determine flow: read from sessionStorage (set before redirect)
    const flow = sessionStorage.getItem("parent_digilocker_flow") || "parent";

    if (flow === "child") {
      fetchChildApaar(clientId);
    } else {
      fetchParentKyc(clientId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ── Parent KYC: Aadhaar XML + PAN via teacher-fetch-docs ───────────────
  const fetchParentKyc = async (clientId: string) => {
    try {
      setHeadline("Fetching Your Aadhaar & PAN");
      setMessage("Connecting to DigiLocker and fetching your documents...");

      const res = await fetch("/api/public/digilocker/teacher-fetch-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch DigiLocker documents. Please try again.");
      }

      // Store parent KYC result — same shape as teacher
      sessionStorage.setItem("parent_digilocker_result", JSON.stringify({
        clientId,
        fullName:        data.fullName        || null,
        dob:             data.dob             || null,
        gender:          data.gender          || null,
        maskedAadhaar:   data.maskedAadhaar   || null,
        address:         data.address         || null,
        zip:             data.zip             || null,
        careOf:          data.careOf          || null,
        fatherName:      data.fatherName      || null,
        addressDetails:  data.addressDetails  || null,
        panNumber:       data.panNumber       || null,
        panFullName:     data.panFullName     || null,
        panDob:          data.panDob          || null,
        mobileNumber:    data.mobileNumber    || null,
        aadhaarLocalPdf: data.aadhaarLocalPdf || null,
        panLocalPdf:     data.panLocalPdf     || null,
        apaarLocalPdf:   data.apaarLocalPdf   || null,
        documents:       data.documents       || [],
      }));

      sessionStorage.removeItem("parent_digilocker_flow");

      const summaryData: Record<string, string> = {};
      if (data.fullName)      summaryData["Name"]        = data.fullName;
      if (data.maskedAadhaar) summaryData["Aadhaar"]     = data.maskedAadhaar;
      if (data.panNumber)     summaryData["PAN"]         = data.panNumber;
      if (data.dob)           summaryData["Date of Birth"] = data.dob;

      setSummary(summaryData);
      setStatus("success");
      setHeadline("Verification Complete!");
      setMessage("Aadhaar details fetched successfully. Redirecting...");

      setTimeout(() => {
        router.push("/registration/parent?digilocker=done");
      }, 2500);

    } catch (err: any) {
      console.error("[ParentCallback] Parent KYC error:", err);
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  // ── Child APAAR: via parent-fetch-docs ─────────────────────────────────
  const fetchChildApaar = async (clientId: string) => {
    try {
      setHeadline("Fetching Child APAAR Document");
      setMessage("Fetching your child's APAAR document from DigiLocker...");

      const res = await fetch("/api/public/digilocker/parent-fetch-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch APAAR document. Please try again.");
      }

      // Store the complete result for the form to read
      sessionStorage.setItem("parent_digilocker_result", JSON.stringify({
        clientId,
        apaarId:       data.apaarId       || null,
        fullName:      data.fullName      || null,
        dateOfBirth:   data.dateOfBirth   || null,
        gender:        data.gender        || null,
        apaarLocalPdf: data.apaarLocalPdf || null,
        noApaarDoc:    data.noApaarDoc    || false,
        documents:     data.documents     || [],
      }));

      // Also store indexed result for the specific child
      const pendingStr = sessionStorage.getItem("parent_digilocker_pending_child");
      if (pendingStr) {
        const pending = JSON.parse(pendingStr);
        sessionStorage.setItem("parent_digilocker_result_for_child", JSON.stringify({
          ...pending,
          result: {
            clientId,
            apaarId:       data.apaarId       || null,
            fullName:      data.fullName      || null,
            dateOfBirth:   data.dateOfBirth   || null,
            gender:        data.gender        || null,
            apaarLocalPdf: data.apaarLocalPdf || null,
            noApaarDoc:    data.noApaarDoc    || false,
          },
        }));
      }

      sessionStorage.removeItem("parent_digilocker_flow");

      const summaryData: Record<string, string> = {};
      if (data.fullName) summaryData["Student Name"] = data.fullName;
      if (data.apaarId)  summaryData["APAAR ID"]     = data.apaarId;

      setSummary(summaryData);
      setStatus("success");
      setHeadline(data.noApaarDoc ? "DigiLocker Connected" : "APAAR Document Fetched!");
      setMessage(data.noApaarDoc
        ? "DigiLocker connected. No APAAR document found — you can enter it manually."
        : "APAAR document fetched successfully!");

      setTimeout(() => {
        router.push("/registration/parent?digilocker=done");
      }, 2500);

    } catch (err: any) {
      console.error("[ParentCallback] Child APAAR error:", err);
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(160deg, #F6F5F1 0%, #EEF4FB 50%, #F6F5F1 100%)" }}
    >
      <div className="bg-white rounded-[10px] border border-slate-200 p-10 text-center max-w-md w-full">

        <div className="mb-6 flex justify-center">
          {status === "loading" && (
            <div className="w-20 h-20 rounded-[10px] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00468E, #0058B4)" }}>
              <FaSpinner className="text-white text-3xl animate-spin" />
            </div>
          )}
          {status === "success" && (
            <div className="w-20 h-20 rounded-[10px] bg-green-500 flex items-center justify-center">
              <FaCheckCircle className="text-white text-3xl" />
            </div>
          )}
          {status === "error" && (
            <div className="w-20 h-20 rounded-[10px] bg-red-500 flex items-center justify-center">
              <FaTimesCircle className="text-white text-3xl" />
            </div>
          )}
        </div>

        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-[10px] mb-4">
          <FaIdCard /> Parent KYC Verification
        </div>

        <h2 className="text-xl font-extrabold text-slate-800 mb-2">{headline}</h2>
        <p className="text-sm text-slate-500 mb-4">{message}</p>

        {status === "success" && Object.keys(summary).length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-[10px] p-4 mb-6 text-left space-y-2">
            {Object.entries(summary).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">{k}</span>
                <span className="font-bold text-slate-800 font-mono">{v}</span>
              </div>
            ))}
            <div className="pt-1 border-t border-green-200">
              <p className="text-xs text-green-600 font-medium">✅ Data fetched from DigiLocker</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 mb-6 text-left">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {status === "success" && (
          <p className="text-xs text-slate-400">Redirecting you back to the form...</p>
        )}

        {status === "error" && (
          <button
            onClick={() => router.push("/registration/parent")}
            className="w-full py-3 rounded-[10px] font-bold text-sm text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #00468E, #0058B4)" }}
          >
            Back to Registration
          </button>
        )}
      </div>
    </div>
  );
}