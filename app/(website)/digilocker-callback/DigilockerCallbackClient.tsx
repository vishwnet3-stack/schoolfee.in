"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

// This page is the redirect_url target after user completes Digilocker auth on Surepass.
// Surepass appends ?client_id=... to this URL.
// We fetch document data, then redirect back to the registration form with the data.

export default function DigilockerCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Fetching your Digilocker documents…");
  const [apaarId, setApaarId] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientId = searchParams.get("client_id") || searchParams.get("clientId");

    if (!clientId) {
      setStatus("error");
      setError("Missing client_id in callback URL. Please try again.");
      return;
    }

    // Store clientId so the parent form can pick it up
    sessionStorage.setItem("digilocker_client_id", clientId);

    fetchDigilockerData(clientId);
  }, [searchParams]);

  const fetchDigilockerData = async (clientId: string) => {
    try {
      setMessage("Connecting to Digilocker… please wait.");

      const res = await fetch("/api/public/digilocker/fetch-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch documents from Digilocker");
      }

      // Store the result in sessionStorage for the form to read
      sessionStorage.setItem(
        "digilocker_result",
        JSON.stringify({
          clientId,
          apaarId: data.apaarId || null,
          fullName: data.fullName || null,
          dateOfBirth: data.dateOfBirth || null,
          gender: data.gender || null,
          aadhaarLast4: data.aadhaarLast4 || null,
          panNumber: data.panNumber || null,
          documentsCount: data.documentsCount || 0,
          documents: data.documents || [],
        })
      );

      setApaarId(data.apaarId);
      setFullName(data.fullName);
      setStatus("success");
      setMessage("Digilocker verification complete!");

      // Auto-redirect back to registration form after 2 seconds
      setTimeout(() => {
        router.push("/registration/parent?digilocker=done");
      }, 2000);
    } catch (err: any) {
      console.error("Callback error:", err);
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
        {/* Icon */}
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

        {/* Title */}
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">
          {status === "loading" && "Fetching Digilocker Data"}
          {status === "success" && "Verification Complete!"}
          {status === "error" && "Verification Failed"}
        </h2>

        {/* Message */}
        <p className="text-sm text-slate-500 mb-4">{message}</p>

        {/* Success details */}
        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-[10px] p-4 mb-6 text-left">
            {fullName && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 font-medium">Name</span>
                <span className="font-bold text-slate-800">{fullName}</span>
              </div>
            )}
            {apaarId ? (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">APAAR ID</span>
                <span className="font-bold text-[#00468E] font-mono">{apaarId}</span>
              </div>
            ) : (
              <div className="text-xs text-amber-600 mt-1">
                APAAR ID not found in Digilocker — you can enter it manually.
              </div>
            )}
          </div>
        )}

        {/* Error details */}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 mb-6 text-left">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Redirect notice */}
        {status === "success" && (
          <p className="text-xs text-slate-400">Redirecting you back to the form…</p>
        )}

        {/* Manual redirect for error */}
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