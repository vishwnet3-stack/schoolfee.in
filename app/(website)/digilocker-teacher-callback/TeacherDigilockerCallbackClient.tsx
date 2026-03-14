"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaIdCard } from "react-icons/fa";

// DigiLocker callback page for teacher registration.
// Surepass redirects here with ?client_id=... after the user completes DigiLocker auth.
// This page does ONE API call to fetch all docs + XML, stores in sessionStorage, then redirects.

export default function TeacherDigilockerCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting to DigiLocker…");
  const [fullName, setFullName] = useState<string | null>(null);
  const [maskedAadhaar, setMaskedAadhaar] = useState<string | null>(null);
  const [docsCount, setDocsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Guard against React StrictMode double-invocation
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
    sessionStorage.setItem("teacher_digilocker_client_id", clientId);
    fetchAllDocs(clientId);
  }, [searchParams]);

  const fetchAllDocs = async (clientId: string) => {
    try {
      setMessage("Fetching your Aadhaar & document data from DigiLocker…");

      const res = await fetch("/api/public/digilocker/teacher-fetch-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch DigiLocker documents. Please try again.");
      }

      // Store the COMPLETE result — form reads from here, no extra API call needed
      sessionStorage.setItem("teacher_digilocker_result", JSON.stringify({
        clientId,
        fullName:       data.fullName       || null,
        dob:            data.dob            || null,
        gender:         data.gender         || null,
        maskedAadhaar:  data.maskedAadhaar  || null,
        address:        data.address        || null,
        zip:            data.zip            || null,
        careOf:         data.careOf         || null,
        fatherName:     data.fatherName     || null,
        addressDetails: data.addressDetails || null,
        panNumber:      data.panNumber      || null,
        panFullName:    data.panFullName    || null,
        panDob:         data.panDob         || null,
        mobileNumber:   data.mobileNumber   || null,
        aadhaarLocalPdf: data.aadhaarLocalPdf || null,
        panLocalPdf:     data.panLocalPdf     || null,
        apaarLocalPdf:   data.apaarLocalPdf   || null,
        documents:       data.documents       || [],
      }));

      setFullName(data.fullName || null);
      setMaskedAadhaar(data.maskedAadhaar || null);
      setDocsCount((data.documents || []).length);
      setStatus("success");
      setMessage("DigiLocker verification complete!");

      setTimeout(() => {
        router.push("/registration/teacher?digilocker=done");
      }, 2500);

    } catch (err: any) {
      console.error("[TeacherCallback] Error:", err);
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(160deg, #F6F5F1 0%, #EEF4FB 50%, #F6F5F1 100%)" }}
    >
      <div className="bg-white rounded-[10px] border border-slate-200 shadow-sm p-10 text-center max-w-md w-full">

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          {status === "loading" && (
            <div
              className="w-20 h-20 rounded-[10px] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00468E, #0058B4)" }}
            >
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

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-[10px] mb-4">
          <FaIdCard /> Teacher KYC Verification
        </div>

        {/* Title */}
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">
          {status === "loading" && "Fetching DigiLocker Data"}
          {status === "success" && "Verification Complete!"}
          {status === "error" && "Verification Failed"}
        </h2>

        <p className="text-sm text-slate-500 mb-4">{message}</p>

        {/* Success data */}
        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-[10px] p-4 mb-6 text-left space-y-2">
            {fullName && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Name</span>
                <span className="font-bold text-slate-800">{fullName}</span>
              </div>
            )}
            {maskedAadhaar && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Aadhaar</span>
                <span className="font-bold text-slate-800 font-mono">{maskedAadhaar}</span>
              </div>
            )}
            {docsCount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Documents saved</span>
                <span className="font-bold text-green-700">{docsCount} documents</span>
              </div>
            )}
            <div className="pt-1 border-t border-green-200">
              <p className="text-xs text-green-600 font-medium">
                ✅ Aadhaar details fetched successfully
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 mb-6 text-left">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Redirect notice */}
        {status === "success" && (
          <p className="text-xs text-slate-400">Redirecting you back to the registration form…</p>
        )}

        {/* Retry button */}
        {status === "error" && (
          <button
            onClick={() => router.push("/registration/teacher")}
            className="w-full py-3 rounded-[10px] font-bold text-sm text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #00468E, #0058B4)" }}
          >
            Back to Teacher Registration
          </button>
        )}
      </div>
    </div>
  );
}