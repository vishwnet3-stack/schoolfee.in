"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  FaUserTie, FaChild, FaMoneyBillWave, FaCheckCircle,
  FaIdCard, FaShieldAlt, FaLock, FaFingerprint, FaExternalLinkAlt,
  FaCheckDouble, FaSpinner, FaTimesCircle, FaEye, FaEyeSlash,
} from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  AlertCircle, CheckCircle2, Shield, Loader2, Mail, ChevronRight,
} from "lucide-react";

declare global { interface Window { Razorpay: any; } }
const RAZORPAY_KEY_ID = "rzp_test_SNWMyYGGnFaJ0I";
const SESSION_KEY = "parent_reg_progress";
const DIGI_SESSION_KEY = "parent_digilocker_result";

const indianStates = [
  "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
  "Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Ladakh",
  "Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];

type EmailStatus =
  | "idle" | "checking" | "blocked" | "waitlist_verified"
  | "new_email" | "otp_sent" | "verified";

type DigiStatus = "idle" | "initiated" | "completed" | "error";

type ChildDigiData = {
  clientId: string;
  apaarId: string | null;
  fullName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  apaarLocalPdf: string | null;
  noApaarDoc: boolean;
} | null;

const emptyChild = () => ({
  fullName: "", classGrade: "", admissionNumber: "",
  schoolName: "", schoolCity: "",
  hasApaarId: "" as "" | "yes" | "no",
  manualApaarId: "",
  digilockerClientId: "",
  digilockerStatus: "" as "" | "initiated" | "completed" | "failed",
  digilockerVerified: false,
  digilockerFullName: "",
  apaarId: "",
  apaarDocUrl: "",
  apaarLocalPdf: "",
  docGender: "",
  docDob: "",
});

type ChildData = ReturnType<typeof emptyChild>;

type FormData = {
  full_name: string; dob: string; gender: string; phone: string;
  email: string; address: string; state: string; pincode: string;
  panNumber: string;
  numberOfChildren: number;
  children: ChildData[];
  feeAmount: string; feePeriod: string; reasonForSupport: string;
  otherReason: string; description: string; repaymentDuration: string;
};

type ParentDigiData = {
  clientId: string;
  fullName: string | null;
  dob: string | null;
  gender: string | null;
  maskedAadhaar: string | null;
  address: string | null;
  zip: string | null;
  careOf: string | null;
  fatherName: string | null;
  addressDetails: Record<string, string> | null;
  panNumber: string | null;
  panFullName: string | null;
  panDob: string | null;
  panNoPan: boolean;          // true when user has no PAN in DigiLocker
  mobileNumber: string | null;
  aadhaarLocalPdf: string | null;
  panLocalPdf: string | null;
} | null;

type PersistedState = {
  formData: FormData;
  currentStep: number;
  emailStatus: EmailStatus;
  emailBlockReason: string;
  autoFilled: Record<string, boolean>;
  digiStatus: DigiStatus;
};

function saveSession(state: PersistedState) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(state)); } catch {}
}
function loadSession(): PersistedState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch { return null; }
}

function viewPdf(localPath: string | null | undefined, label: string) {
  if (!localPath) { toast.error("No " + label + " PDF available."); return; }
  const url = "/api/public/digilocker/teacher-pdf-proxy?file=" + encodeURIComponent(localPath.replace(/\\/g, "/"));
  window.open(url, "_blank", "noopener,noreferrer");
}

function maskAadhaar(val: string | null | undefined): string {
  if (!val) return "—";
  return val.replace(/\d(?=\d{4})/g, "X");
}

function MaskToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className="ml-1.5 text-slate-400 hover:text-slate-700 transition-colors"
      title={show ? "Hide" : "Show"}>
      {show ? <FaEye className="inline text-xs" /> : <FaEyeSlash className="inline text-xs" />}
    </button>
  );
}

function DigiConnectCard({ digiStatus, isInitiating, onInitiate }: {
  digiStatus: DigiStatus;
  isInitiating: boolean;
  onInitiate: () => void;
}) {
  return (
    <div className="rounded-[10px] border-2 border-blue-200 overflow-hidden mb-5"
      style={{ background: "linear-gradient(135deg,#EEF4FB,#F6F5F1)" }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>
            <FaIdCard className="text-white text-base" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-800 text-sm mb-0.5">Verify with DigiLocker</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Auto-fill your name, DOB, address and more from Aadhaar — no manual typing needed.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["Full Name","Date of Birth","Gender","Address","PIN Code","Mobile"].map(tag => (
                <span key={tag}
                  className="text-[10px] font-bold px-2 py-1 rounded-[5px] bg-blue-100 text-blue-700 border border-blue-200">
                  {tag}
                </span>
              ))}
            </div>
            <button onClick={onInitiate}
              disabled={isInitiating || digiStatus === "initiated"}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>
              {isInitiating || digiStatus === "initiated" ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isInitiating ? "Connecting..." : "Waiting for DigiLocker..."}
                </>
              ) : (
                <><FaIdCard /> Connect DigiLocker</>
              )}
            </button>
            {digiStatus === "initiated" && (
              <p className="text-xs text-amber-600 mt-2 font-medium">
                Complete DigiLocker in the popup/tab, then return here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParentRegistrationPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuthSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [agreed, setAgreed]           = useState(false);
  const [isSubmitting, setIsSubmitting]               = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting]             = useState(false);
  const [redirectStep, setRedirectStep]               = useState(0);

  const [parentDigiData, setParentDigiData] = useState<ParentDigiData>(null);
  const [digiStatus, setDigiStatus]         = useState<DigiStatus>("idle");
  const [isInitiating, setIsInitiating]     = useState(false);
  const [showAadhaarPill, setShowAadhaarPill] = useState(false);
  const loadedRef = useRef(false);

  const [emailStatus,      setEmailStatus]      = useState<EmailStatus>("idle");
  const [emailBlockReason, setEmailBlockReason] = useState("");
  const [otpValue,         setOtpValue]         = useState("");
  const [otpLoading,       setOtpLoading]       = useState(false);
  const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckedEmail = useRef("");

  const [childDigiData,   setChildDigiData]   = useState<(ChildDigiData)[]>(Array(5).fill(null));
  const [childDigiStatus, setChildDigiStatus] = useState<DigiStatus[]>(Array(5).fill("idle") as DigiStatus[]);
  const [childInitiating, setChildInitiating] = useState<boolean[]>(Array(5).fill(false));

  const [autoFilled, setAutoFilled] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<FormData>({
    full_name: "", dob: "", gender: "", phone: "", email: "",
    address: "", state: "", pincode: "", panNumber: "",
    numberOfChildren: 0,
    children: Array.from({ length: 5 }, emptyChild),
    feeAmount: "", feePeriod: "", reasonForSupport: "",
    otherReason: "", description: "", repaymentDuration: "",
  });

  const isEmailVerified = emailStatus === "verified" || emailStatus === "waitlist_verified";

  // Restore session
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setFormData(saved.formData);
      setCurrentStep(saved.currentStep || 1);
      setEmailStatus(saved.emailStatus || "idle");
      setEmailBlockReason(saved.emailBlockReason || "");
      setAutoFilled(saved.autoFilled || {});
      if (saved.digiStatus) setDigiStatus(saved.digiStatus);
    }
    const digiRaw = sessionStorage.getItem(DIGI_SESSION_KEY);
    if (digiRaw) {
      try { setParentDigiData(JSON.parse(digiRaw)); } catch {}
    }
    for (let i = 0; i < 5; i++) {
      const raw = sessionStorage.getItem("parent_child_digi_" + i);
      if (raw) {
        try {
          const d = JSON.parse(raw);
          setChildDigiData(prev => { const n = [...prev]; n[i] = d; return n; });
          setChildDigiStatus(prev => { const n = [...prev]; n[i] = "completed"; return n; });
        } catch {}
      }
    }
  }, []);

  // Persist session
  useEffect(() => {
    saveSession({ formData, currentStep, emailStatus, emailBlockReason, autoFilled, digiStatus });
  }, [formData, currentStep, emailStatus, emailBlockReason, autoFilled, digiStatus]);

  const autofillFromDigi = useCallback((data: NonNullable<ParentDigiData>) => {
    const genderMap: Record<string, string> = { M: "Male", F: "Female", O: "Other" };
    const gender = data.gender ? (genderMap[data.gender] || data.gender) : "";

    let addressStr = data.address || "";
    if (!addressStr && data.addressDetails) {
      const a = data.addressDetails;
      addressStr = [a.house, a.street, a.loc, a.vtc, a.po, a.subdist, a.dist]
        .filter(Boolean).join(", ");
    }

    let detectedState = "";
    if (data.addressDetails?.state) {
      const raw = data.addressDetails.state.trim().toLowerCase();
      detectedState = indianStates.find(s => s.toLowerCase() === raw) ||
        indianStates.find(s => s.toLowerCase().includes(raw)) || "";
    }

    const filled: Record<string, boolean> = {};
    setFormData(prev => {
      const next = { ...prev };
      if (data.fullName)  { next.full_name = data.fullName;          filled.full_name = true; }
      if (data.dob)       { next.dob       = data.dob.split("T")[0]; filled.dob       = true; }
      if (gender)         { next.gender    = gender;                  filled.gender    = true; }
      if (addressStr)     { next.address   = addressStr;              filled.address   = true; }
      if (detectedState)  { next.state     = detectedState;           filled.state     = true; }
      if (data.zip)       { next.pincode   = data.zip;                filled.pincode   = true; }
      if (data.mobileNumber && !prev.phone) {
        next.phone = data.mobileNumber; filled.phone = true;
      }
      if (data.panNumber && !prev.panNumber) {
        next.panNumber = data.panNumber; filled.panNumber = true;
      }
      return next;
    });
    setAutoFilled(filled);
  }, []);

  // Handle DigiLocker callback redirect
  useEffect(() => {
    if (loadedRef.current) return;
    if (searchParams.get("digilocker") !== "done") return;
    const stored = sessionStorage.getItem(DIGI_SESSION_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Detect flow: parent KYC has "dob"+"maskedAadhaar", child APAAR has "noApaarDoc"
        const isParentKyc = "dob" in parsed || "maskedAadhaar" in parsed;
        if (isParentKyc) {
          const parentData: NonNullable<ParentDigiData> = parsed;
          setParentDigiData(parentData);
          setDigiStatus("completed");
          autofillFromDigi(parentData);
          loadedRef.current = true;
          toast.success("DigiLocker verified. Form fields filled from Aadhaar.", { duration: 4000 });
        }
      } catch (e) {
        console.error("[ParentReg] DigiLocker parse failed:", e);
      }
    }

    // Handle child APAAR result
    const childResultStr = sessionStorage.getItem("parent_digilocker_result_for_child");
    if (childResultStr) {
      try {
        const { childIndex, result } = JSON.parse(childResultStr);
        if (typeof childIndex === "number" && result) {
          applyChildDigiResult(childIndex, result);
          sessionStorage.removeItem("parent_digilocker_result_for_child");
          sessionStorage.removeItem("parent_digilocker_pending_child");
          loadedRef.current = true;
          toast.success("APAAR verification complete for Child " + (childIndex + 1) + ".", { duration: 4000 });
        }
      } catch (e) {
        console.error("[ParentReg] Child APAAR parse failed:", e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, autofillFromDigi]);

  useEffect(() => {
    if (parentDigiData && digiStatus === "idle") {
      setDigiStatus("completed");
      autofillFromDigi(parentDigiData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentDigiData]);

  // Tamper guard for DigiLocker-locked fields
  useEffect(() => {
    const DIGI_FIELDS = ["full_name", "dob", "gender", "phone", "address", "state", "pincode"];
    const restoreLocked = () => {
      document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        "[data-digi-locked]"
      ).forEach(el => {
        const name = el.getAttribute("name");
        if (!name || !DIGI_FIELDS.includes(name)) return;
        if ("readOnly" in el && !(el as HTMLInputElement).readOnly) {
          (el as HTMLInputElement).readOnly = true;
        }
        if (digiStatus === "completed" && autoFilled[name]) {
          const canonical = (formData as unknown as Record<string, string>)[name] ?? "";
          if (el.value !== canonical) el.value = canonical;
        }
        if (digiStatus !== "completed" && el.value !== "") el.value = "";
      });
    };
    const observer = new MutationObserver(() => restoreLocked());
    observer.observe(document.body, {
      subtree: true, attributes: true,
      attributeFilter: ["readonly", "data-digi-locked", "disabled", "style"],
      characterData: true, childList: false,
    });
    const interval = window.setInterval(restoreLocked, 500);
    return () => { observer.disconnect(); window.clearInterval(interval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFilled, parentDigiData, digiStatus]);

  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(p => ({ ...p, email: user.email }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, []);

  const runSilentEmailCheck = useCallback(async (email: string) => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return;
    if (email === lastCheckedEmail.current) return;
    lastCheckedEmail.current = email;
    setEmailStatus("checking");
    setEmailBlockReason("");
    try {
      const res = await fetch("/api/public/parent/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.blocked === true) {
        setEmailStatus("blocked");
        setEmailBlockReason(data.error || "This email cannot be used.");
      } else if (data.status === "waitlist_verified") {
        setEmailStatus("waitlist_verified");
      } else if (!res.ok || (!data.success && data.error)) {
        setEmailStatus("blocked");
        setEmailBlockReason(data.error || "Unable to verify email. Please try a different one.");
      } else {
        setEmailStatus("new_email");
      }
    } catch {
      setEmailStatus("new_email");
    }
  }, []);

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await fetch("/api/public/parent/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.error || "Failed to send OTP."); return; }
      setEmailStatus("otp_sent");
      setOtpValue("");
      toast.success("OTP sent to your email.");
    } catch {
      toast.error("Could not send OTP. Please try again.");
    } finally { setOtpLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return;
    setOtpLoading(true);
    try {
      const res = await fetch("/api/public/parent/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.error || "Invalid OTP."); return; }
      setEmailStatus("verified");
      toast.success("Email verified.");
    } catch {
      toast.error("Could not verify OTP. Please try again.");
    } finally { setOtpLoading(false); }
  };

  const handleInitiateDigilocker = async () => {
    setIsInitiating(true);
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const res = await fetch("/api/public/digilocker/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectUrl: appUrl + "/digilocker-parent-callback" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { toast.error(data.error || "Failed to connect to DigiLocker."); return; }
      sessionStorage.removeItem(DIGI_SESSION_KEY);
      sessionStorage.setItem("parent_digilocker_flow", "parent"); // ← tells callback to fetch Aadhaar+PAN
      loadedRef.current = false;
      setDigiStatus("initiated");
      window.location.href = data.digilockerUrl;
    } catch (err: any) {
      toast.error(err.message || "Could not connect to DigiLocker.");
    } finally { setIsInitiating(false); }
  };

  const applyChildDigiResult = (childIndex: number, result: NonNullable<ChildDigiData>) => {
    setChildDigiData(prev => { const n = [...prev]; n[childIndex] = result; return n; });
    setChildDigiStatus(prev => { const n = [...prev]; n[childIndex] = "completed"; return n; });
    sessionStorage.setItem("parent_child_digi_" + childIndex, JSON.stringify(result));
    setFormData(prev => {
      const nc = [...prev.children];
      nc[childIndex] = {
        ...nc[childIndex],
        apaarId:            result.apaarId || "",
        digilockerClientId: result.clientId || "",
        digilockerStatus:   "completed",
        digilockerVerified: true,
        digilockerFullName: result.fullName || "",
        apaarLocalPdf:      result.apaarLocalPdf || "",
        docGender:          result.gender || "",
        docDob:             result.dateOfBirth || "",
      };
      return { ...prev, children: nc };
    });
  };

  const handleInitiateChildDigilocker = async (childIndex: number) => {
    setChildInitiating(prev => { const n = [...prev]; n[childIndex] = true; return n; });
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const res = await fetch("/api/public/digilocker/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectUrl: appUrl + "/digilocker-parent-callback" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { toast.error(data.error || "Failed to connect to DigiLocker."); return; }
      sessionStorage.setItem("parent_digilocker_pending_child", JSON.stringify({ childIndex }));
      sessionStorage.setItem("parent_digilocker_flow", "child"); // ← tells callback to fetch APAAR
      sessionStorage.removeItem("parent_digilocker_result_for_child");
      setChildDigiStatus(prev => { const n = [...prev]; n[childIndex] = "initiated"; return n; });
      setFormData(prev => {
        const nc = [...prev.children];
        nc[childIndex] = { ...nc[childIndex], digilockerClientId: data.clientId, digilockerStatus: "initiated" };
        return { ...prev, children: nc };
      });
      window.location.href = data.digilockerUrl;
    } catch (err: any) {
      toast.error(err.message || "Could not connect to DigiLocker.");
    } finally {
      setChildInitiating(prev => { const n = [...prev]; n[childIndex] = false; return n; });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    childIndex?: number
  ) => {
    const { name, value } = e.target;
    if (childIndex !== undefined) {
      const nc = [...formData.children];
      nc[childIndex] = { ...nc[childIndex], [name]: value };
      setFormData(prev => ({ ...prev, children: nc }));
      if (errors["child" + childIndex + name]) setErrors(prev => ({ ...prev, ["child" + childIndex + name]: "" }));
      return;
    }
    const digiLockedFields = ["full_name", "dob", "gender", "phone", "address", "state", "pincode"];
    if (digiLockedFields.includes(name) && digiStatus !== "completed") {
      e.preventDefault(); e.stopPropagation(); return;
    }
    if (autoFilled[name]) { e.preventDefault(); e.stopPropagation(); return; }
    if (name === "email" && isEmailVerified) { e.preventDefault(); e.stopPropagation(); return; }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    if (name === "email") {
      if (emailStatus !== "idle") {
        setEmailStatus("idle"); setEmailBlockReason(""); setOtpValue("");
        lastCheckedEmail.current = "";
      }
      if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
      const trimmed = value.trim();
      if (trimmed.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        emailDebounceRef.current = setTimeout(() => runSilentEmailCheck(trimmed), 800);
      }
    }
  };

  // Style helpers
  const inp = (err?: string) =>
    "w-full px-3 py-2.5 rounded-[8px] border text-sm font-medium transition-all duration-200 outline-none " +
    (err
      ? "border-red-400 bg-red-50 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-200"
      : "border-slate-300 bg-white text-slate-800 placeholder-slate-400 hover:border-[#00468E]/50 focus:border-[#00468E] focus:ring-2 focus:ring-[#00468E]/10");
  const inpLocked =
    "w-full px-3 py-2.5 rounded-[8px] border text-sm font-medium outline-none border-green-300 bg-green-50 text-slate-700 cursor-not-allowed select-none";
  const inpDisabled =
    "w-full px-3 py-2.5 rounded-[8px] border text-sm font-medium outline-none border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed select-none";

  const lockProps = (isLocked: boolean) => isLocked ? {
    readOnly: true as const, tabIndex: -1 as const,
    "aria-readonly": true as const, "data-digi-locked": true as const,
    onFocus:       (e: React.FocusEvent<HTMLElement>)     => { e.preventDefault(); e.target.blur(); },
    onKeyDown:     (e: React.KeyboardEvent<HTMLElement>)  => { e.preventDefault(); e.stopPropagation(); },
    onKeyPress:    (e: React.KeyboardEvent<HTMLElement>)  => { e.preventDefault(); e.stopPropagation(); },
    onKeyUp:       (e: React.KeyboardEvent<HTMLElement>)  => { e.preventDefault(); e.stopPropagation(); },
    onBeforeInput: (e: React.FormEvent<HTMLElement>)      => { e.preventDefault(); e.stopPropagation(); },
    onInput:       (e: React.FormEvent<HTMLElement>)      => { e.preventDefault(); e.stopPropagation(); },
    onPaste:       (e: React.ClipboardEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); },
    onCut:         (e: React.ClipboardEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); },
    onDrop:        (e: React.DragEvent<HTMLElement>)      => { e.preventDefault(); e.stopPropagation(); },
    onMouseDown:   (e: React.MouseEvent<HTMLElement>)     => { e.preventDefault(); e.currentTarget.blur(); },
    onClick:       (e: React.MouseEvent<HTMLElement>)     => { e.preventDefault(); e.stopPropagation(); },
    onContextMenu: (e: React.MouseEvent<HTMLElement>)     => { e.preventDefault(); e.stopPropagation(); },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      e.preventDefault(); e.stopPropagation();
    },
    style: { pointerEvents: "none" as const, userSelect: "none" as const },
  } : {};

  const lbl = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";

  const fieldLbl = (label: string, locked: boolean, required = true) => (
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
        {label}{required && <span className="text-red-500 normal-case ml-1">*</span>}
      </label>
      {locked && (
        <span className="text-[10px] font-bold text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded-[4px]">
          From DigiLocker
        </span>
      )}
    </div>
  );

  const errMsg = (msg?: string) => msg ? (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
      <AlertCircle className="h-3 w-3 shrink-0" />{msg}
    </p>
  ) : null;

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!formData.full_name.trim())         e.full_name  = "Full name is required";
    if (!formData.dob)                      e.dob        = "Date of birth is required";
    if (!formData.gender)                   e.gender     = "Gender is required";
    if (!formData.phone.match(/^\d{10}$/))  e.phone      = "Valid 10-digit phone required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!formData.address.trim())           e.address    = "Address is required";
    if (!formData.state)                    e.state      = "State is required";
    if (formData.panNumber && !formData.panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      e.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
    } else if (!formData.panNumber && digiStatus !== "completed") {
      e.panNumber = "Valid PAN required (e.g. ABCDE1234F)";
    } else if (!formData.panNumber && digiStatus === "completed" && !parentDigiData?.panNoPan) {
      e.panNumber = "Valid PAN required (e.g. ABCDE1234F)";
    }
    if (!isEmailVerified)                   e.email_verify = "Please verify your email before continuing";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (formData.numberOfChildren === 0) { e.numberOfChildren = "Please select number of children"; setErrors(e); return false; }
    for (let i = 0; i < formData.numberOfChildren; i++) {
      const c = formData.children[i];
      if (!c.fullName.trim())        e["child" + i + "fullName"]        = "Child name is required";
      if (!c.classGrade.trim())      e["child" + i + "classGrade"]      = "Class/Grade is required";
      if (!c.admissionNumber.trim()) e["child" + i + "admissionNumber"] = "Admission number is required";
      if (!c.schoolName.trim())      e["child" + i + "schoolName"]      = "School name is required";
      if (!c.schoolCity.trim())      e["child" + i + "schoolCity"]      = "School city is required";
      if (!c.hasApaarId)             e["child" + i + "hasApaarId"]      = "Please select if child has APAAR ID";
      if (c.hasApaarId === "yes" && !c.digilockerVerified && !c.manualApaarId.trim()) {
        e["child" + i + "apaarId"] = "Please verify APAAR ID via DigiLocker or enter manually";
      }
    }
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!formData.feeAmount || parseFloat(formData.feeAmount) <= 0) e.feeAmount = "Valid fee amount is required";
    if (!formData.feePeriod) e.feePeriod = "Fee period is required";
    if (!formData.reasonForSupport) e.reasonForSupport = "Reason for support is required";
    if (formData.reasonForSupport === "other" && !formData.otherReason.trim()) e.otherReason = "Please specify";
    if (!formData.description.trim()) e.description = "Description is required";
    if (!formData.repaymentDuration) e.repaymentDuration = "Repayment duration is required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    const valid =
      currentStep === 1 ? validateStep1() :
      currentStep === 2 ? validateStep2() :
      currentStep === 3 ? validateStep3() : true;
    if (valid) { setCurrentStep(p => p + 1); setErrors({}); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const handlePrevious = () => {
    setCurrentStep(p => p - 1); setErrors({}); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentAndSubmit = async () => {
    if (!agreed) { toast.error("Please agree to the terms before submitting"); return; }
    setIsPaymentProcessing(true);
    try {
      const orderRes = await fetch("/api/public/razorpay-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, name: formData.full_name }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || "Order creation failed");

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Schoolfee.org",
        description: "Parent Registration Fee — Rs.11",
        image: "/logo.jpg",
        order_id: orderData.order.id,
        prefill: { name: formData.full_name, email: formData.email, contact: formData.phone },
        theme: { color: "#00468E" },
        handler: async (response: any) => {
          setIsPaymentProcessing(false);
          setIsSubmitting(true);
          try {
            const verifyRes = await fetch("/api/public/razorpay-verify", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id:        response.razorpay_order_id,
                razorpay_payment_id:      response.razorpay_payment_id,
                razorpay_signature:       response.razorpay_signature,
                formData,
                publicUserId:             user?.id || null,
                parentDigilockerClientId: parentDigiData?.clientId || null,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.error || "Verification failed");
            sessionStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(DIGI_SESSION_KEY);
            sessionStorage.removeItem("parent_digilocker_client_id");
            for (let i = 0; i < 5; i++) sessionStorage.removeItem("parent_child_digi_" + i);
            toast.success("Registration submitted successfully.");
            setIsRedirecting(true);
            setRedirectStep(0);
            [0, 1, 2, 3].forEach((s, i) => setTimeout(() => setRedirectStep(s), i * 1800));
            setTimeout(() => {
              setIsRedirecting(false);
              setCurrentStep(5);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, 4 * 1800);
          } catch (err: any) {
            toast.error(err.message || "Submission failed. Please contact support.");
          } finally { setIsSubmitting(false); }
        },
        modal: { ondismiss: () => { setIsPaymentProcessing(false); toast.info("Payment cancelled."); } },
      });
      rzp.on("payment.failed", (r: any) => {
        setIsPaymentProcessing(false);
        toast.error("Payment failed: " + r.error.description);
      });
      rzp.open();
    } catch (err: any) {
      setIsPaymentProcessing(false);
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  const steps = [
    { number: 1, title: "Parent Info",      icon: FaUserTie      },
    { number: 2, title: "Children",         icon: FaChild        },
    { number: 3, title: "Support Details",  icon: FaMoneyBillWave },
    { number: 4, title: "Review & Pay",     icon: FaCheckCircle  },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#00305F 0%,#00468E 50%,#0058B4 100%)" }}>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
        <div className="bg-white rounded-[10px] p-10 text-center max-w-md w-full border-2 border-green-200">
          <div className="w-24 h-24 rounded-[10px] bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-white w-12 h-12" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Registration Complete!</h2>
          <p className="text-slate-500 text-sm mb-2 leading-relaxed">
            Payment of <strong>Rs.11</strong> received. Confirmation sent to{" "}
            <strong>{formData.email}</strong>.
          </p>
          <p className="text-xs text-slate-400 mb-8">
            We will review your application within 3 to 5 working days.
          </p>
          <button onClick={() => router.push("/")}
            className="w-full py-3.5 rounded-[10px] font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg,#00305F,#00468E)" }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const redirectMessages = [
    { icon: "✓",  title: "Payment confirmed",     sub: "Your payment of Rs.11 was received"      },
    { icon: "📋", title: "Saving your details",   sub: "Storing your registration securely"       },
    { icon: "📧", title: "Sending confirmation",  sub: "Emailing your confirmation details"       },
    { icon: "🎉", title: "Registration complete!", sub: "Taking you to your confirmation page..." },
  ];

  return (
    <>
      {isRedirecting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#00305F 0%,#00468E 60%,#0058B4 100%)" }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm w-full">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-[#F4951D] border-r-white/40 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">{redirectMessages[redirectStep]?.icon}</span>
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-white mb-2">{redirectMessages[redirectStep]?.title}</h2>
            <p className="text-white/60 text-sm mb-8">{redirectMessages[redirectStep]?.sub}</p>
            <div className="flex items-center gap-2">
              {redirectMessages.map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-500"
                  style={{
                    width: i === redirectStep ? "24px" : "8px", height: "8px",
                    background: i < redirectStep ? "#0cab47" : i === redirectStep ? "#F4951D" : "rgba(255,255,255,0.2)",
                  }} />
              ))}
            </div>
            <p className="text-white/30 text-xs mt-8">Please do not close this window</p>
          </div>
        </div>
      )}

      <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#F6F5F1 0%,#EEF4FB 50%,#F6F5F1 100%)" }}>

        {/* Hero */}
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#00305F 0%,#00468E 60%,#0058B4 100%)" }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-[10px] mb-4 uppercase tracking-widest">
              <FaIdCard className="text-[#F4951D]" /> CarePay Financial Support Program
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">Parent Registration</h1>
            <p className="text-white/60 text-sm md:text-base max-w-xl">
              Apply for 0% interest financial support for your child's school fees.
            </p>
            {user && (
              <div className="inline-flex items-center gap-2 mt-4 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold px-3 py-1.5 rounded-[10px]">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Logged in as {user.fullName}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">

          {/* Mobile step bar */}
          <div className="lg:hidden mb-4">
            <div className="bg-white rounded-[10px] p-5 border border-slate-200">
              <div className="flex items-center justify-between relative mb-4">
                {steps.map((step, i) => {
                  const done = currentStep > step.number;
                  const active = currentStep === step.number;
                  const Icon = step.icon;
                  return (
                    <div key={step.number} className="flex-1 flex flex-col items-center relative">
                      {i < steps.length - 1 && (
                        <div className="absolute top-4 left-[calc(50%+18px)] right-0 h-0.5 transition-all duration-500"
                          style={{ background: done ? "#0cab47" : "#e2e8f0" }} />
                      )}
                      <div className={"relative z-10 w-9 h-9 rounded-[10px] flex items-center justify-center text-xs font-bold transition-all duration-300 " + (done ? "bg-[#0cab47] text-white" : active ? "text-white" : "bg-slate-100 text-slate-400")}
                        style={active ? { background: "linear-gradient(135deg,#00468E,#0058B4)" } : {}}>
                        {done ? <IoMdCheckmark className="text-base" /> : <Icon className="text-sm" />}
                      </div>
                      <span className={"text-[10px] font-bold mt-2 text-center " + (active ? "text-[#00468E]" : done ? "text-[#0cab47]" : "text-slate-400")}>
                        {step.title.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: progress + "%", background: "linear-gradient(90deg,#00468E,#0cab47)" }} />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">

            {/* Desktop sidebar */}
            <div className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">
              <div className="sticky top-6 space-y-4">
                <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden">
                  <div className="p-5 pb-4" style={{ background: "linear-gradient(135deg,#00305F,#00468E)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-[10px] bg-[#F4951D] flex items-center justify-center flex-shrink-0">
                        <FaIdCard className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Application Progress</p>
                        <p className="text-white/60 text-xs">Step {Math.min(currentStep, 4)} of 4</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: progress + "%", background: "linear-gradient(90deg,#F4951D,#0cab47)" }} />
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    {steps.map((step, i) => {
                      const done = currentStep > step.number;
                      const active = currentStep === step.number;
                      const Icon = step.icon;
                      return (
                        <div key={step.number} className="relative">
                          {i < steps.length - 1 && (
                            <div className={"absolute left-[22px] top-[44px] w-0.5 h-8 transition-all " + (done ? "bg-[#0cab47]" : "bg-slate-200")} />
                          )}
                          <div className={"relative z-10 flex items-center gap-3 px-3 py-3 rounded-[10px] " + (active ? "bg-[#00468E]/[0.08] border border-[#00468E]/20" : "")}>
                            <div className={"w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all " + (done ? "bg-[#0cab47] text-white" : active ? "text-white" : "bg-slate-100 text-slate-400")}
                              style={active ? { background: "linear-gradient(135deg,#00468E,#0058B4)" } : {}}>
                              {done ? <IoMdCheckmark className="text-lg" /> : <Icon className="text-base" />}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {step.number}</p>
                              <p className={"text-sm font-bold " + (active ? "text-[#00468E]" : done ? "text-[#0cab47]" : "text-slate-400")}>{step.title}</p>
                              {active && <p className="text-[11px] text-slate-400">In Progress</p>}
                              {done  && <p className="text-[11px] text-[#0cab47]">Completed</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {digiStatus === "completed" && parentDigiData ? (
                  <div className="rounded-[10px] border-2 border-green-300 p-4"
                    style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wide">KYC Verified</p>
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{parentDigiData.fullName}</p>
                    {parentDigiData.maskedAadhaar && (
                      <p className="text-xs text-slate-500 mt-1 font-mono flex items-center">
                        Aadhaar: {showAadhaarPill ? parentDigiData.maskedAadhaar : maskAadhaar(parentDigiData.maskedAadhaar)}
                        <MaskToggle show={showAadhaarPill} onToggle={() => setShowAadhaarPill(v => !v)} />
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-[10px] border border-blue-200 p-4 bg-blue-50">
                    <div className="flex items-center gap-2 mb-1">
                      <FaIdCard className="text-blue-600 text-sm" />
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">DigiLocker KYC</p>
                    </div>
                    <p className="text-xs text-slate-500">Connect in Step 1 to auto-fill from Aadhaar.</p>
                  </div>
                )}

                <div className="rounded-[10px] p-5 border-2 border-amber-300"
                  style={{ background: "linear-gradient(135deg,#FFF8ED,#FFF3DC)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Registration Fee</p>
                  <p className="text-3xl font-extrabold text-slate-800 mb-1">Rs.11</p>
                  <div className="flex items-center gap-1.5 text-amber-700 text-xs">
                    <FaLock className="text-[10px]" /><span>Secured by Razorpay</span>
                  </div>
                </div>

                <div className="bg-white rounded-[10px] border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FaShieldAlt className="text-[#00468E] text-base" />
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Why Trust Us</p>
                  </div>
                  <ul className="space-y-2.5">
                    {["0% interest support","Bank-grade security","Direct school payment","48hr verification","Dignified process"].map(text => (
                      <li key={text} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#0cab47] shrink-0" />{text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Main form card */}
            <div className="flex-1">
              <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden">

                <div className="px-4 sm:px-6 py-3.5 border-b-2 border-slate-200"
                  style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)" }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>
                      {currentStep === 1 && <FaUserTie className="text-white text-lg" />}
                      {currentStep === 2 && <FaChild className="text-white text-lg" />}
                      {currentStep === 3 && <FaMoneyBillWave className="text-white text-lg" />}
                      {currentStep === 4 && <FaCheckCircle className="text-white text-lg" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {currentStep} of 4</p>
                      <h2 className="text-base font-extrabold text-slate-800">
                        {currentStep === 1 && "Parent Information"}
                        {currentStep === 2 && "Children & School Details"}
                        {currentStep === 3 && "Support Request Details"}
                        {currentStep === 4 && "Review & Complete Payment"}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-5">

                  {/* ── STEP 1 ── */}
                  {currentStep === 1 && ((): JSX.Element => {
                    const isDigiLocked = digiStatus !== "completed";
                    const digiClass = isDigiLocked ? inpDisabled : inpLocked;
                    return (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-500">Please provide your details as they appear on official documents.</p>

                        {digiStatus === "completed" && parentDigiData ? (
                          <div className="rounded-[10px] border-2 border-green-300 px-4 py-3 flex items-center gap-3 mb-1"
                            style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                            <div className="w-9 h-9 rounded-[8px] bg-green-500 flex items-center justify-center flex-shrink-0">
                              <Shield className="text-white h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-green-800 text-sm">DigiLocker Verified — Fields Auto-filled</p>
                              <p className="text-green-600 text-xs">Aadhaar details are locked below. You may edit other fields.</p>
                            </div>
                            {parentDigiData.aadhaarLocalPdf && (
                              <button onClick={() => viewPdf(parentDigiData.aadhaarLocalPdf, "Aadhaar")}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-xs font-bold border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100">
                                <FaExternalLinkAlt className="text-[10px]" /> Aadhaar PDF
                              </button>
                            )}
                          </div>
                        ) : (
                          <DigiConnectCard
                            digiStatus={digiStatus}
                            isInitiating={isInitiating}
                            onInitiate={handleInitiateDigilocker}
                          />
                        )}

                        <div>
                          {fieldLbl("Full Name", !isDigiLocked)}
                          <input type="text" name="full_name"
                            placeholder={isDigiLocked ? "Connect DigiLocker to fill" : formData.full_name || "Enter your full name"}
                            value={formData.full_name} onChange={handleInputChange}
                            {...lockProps(true)}
                            className={isDigiLocked ? digiClass : (autoFilled.full_name ? inpLocked : inp(errors.full_name))} />
                          {errMsg(errors.full_name)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            {fieldLbl("Date of Birth", !isDigiLocked)}
                            <input type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                              {...lockProps(true)} max={new Date().toISOString().split("T")[0]}
                              className={isDigiLocked ? digiClass : (autoFilled.dob ? inpLocked : inp(errors.dob))} />
                            {errMsg(errors.dob)}
                          </div>
                          <div>
                            {fieldLbl("Gender", !isDigiLocked)}
                            <select name="gender" value={formData.gender} onChange={handleInputChange}
                              {...lockProps(true)}
                              className={isDigiLocked ? digiClass : (autoFilled.gender ? inpLocked : inp(errors.gender))}>
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            {errMsg(errors.gender)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            {fieldLbl("Phone Number", !isDigiLocked)}
                            <input type="tel" name="phone"
                              placeholder={isDigiLocked ? "Connect DigiLocker to fill" : "10-digit mobile number"}
                              value={formData.phone} onChange={handleInputChange} maxLength={10}
                              {...lockProps(true)}
                              className={isDigiLocked ? digiClass : (autoFilled.phone ? inpLocked : inp(errors.phone))} />
                            {errMsg(errors.phone)}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Email Address <span className="text-red-500 normal-case">*</span>
                              </label>
                              {emailStatus === "checking" && (
                                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                  <Loader2 className="h-3 w-3 animate-spin" /> Checking...
                                </span>
                              )}
                              {isEmailVerified && (
                                <span className="text-[10px] font-bold text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded-[4px]">
                                  Verified
                                </span>
                              )}
                            </div>
                            <input type="email" name="email" placeholder="your.email@example.com"
                              value={formData.email} onChange={handleInputChange}
                              {...lockProps(isEmailVerified)}
                              className={
                                isEmailVerified ? inpLocked :
                                emailStatus === "blocked"
                                  ? "w-full px-3 py-2.5 rounded-[8px] border text-sm font-medium outline-none border-red-400 bg-red-50 text-red-900 placeholder-red-300"
                                  : inp(errors.email)
                              }
                            />
                            {emailStatus === "blocked" && (
                              <div className="mt-2 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 flex items-start gap-2">
                                <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-700 font-medium">{emailBlockReason}</p>
                              </div>
                            )}
                            {emailStatus === "new_email" && (
                              <div className="mt-2 rounded-[8px] border border-blue-200 bg-blue-50 px-3 py-2 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Mail className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                  <p className="text-xs text-blue-800 font-medium truncate">Verify your email via OTP</p>
                                </div>
                                <button type="button" onClick={handleSendOtp} disabled={otpLoading}
                                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                                  style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>
                                  {otpLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Send OTP"}
                                </button>
                              </div>
                            )}
                            {emailStatus === "otp_sent" && (
                              <div className="mt-2 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-3 space-y-2">
                                <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                                  <Mail className="h-3.5 w-3.5" /> OTP sent. Enter the 6-digit code:
                                </p>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <input type="text" placeholder="000000" value={otpValue}
                                      onChange={e => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                      maxLength={6}
                                      className="flex-1 min-w-0 px-3 py-2 rounded-[6px] border border-amber-300 bg-white text-sm font-mono font-bold text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 tracking-[0.3em]" />
                                    <button type="button" onClick={handleVerifyOtp}
                                      disabled={otpLoading || otpValue.length !== 6}
                                      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                                      style={{ background: "linear-gradient(135deg,#0cab47,#08d451)" }}>
                                      {otpLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Verify OTP"}
                                    </button>
                                  </div>
                                  <button type="button" onClick={handleSendOtp} disabled={otpLoading}
                                    className="self-start text-xs text-slate-500 hover:text-[#00468E] font-medium underline disabled:opacity-50 transition-colors">
                                    Did not receive it? Resend OTP
                                  </button>
                                </div>
                              </div>
                            )}
                            {(errors.email || errors.email_verify) && emailStatus !== "blocked" && (
                              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                {errors.email || errors.email_verify}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          {fieldLbl("Residential Address", !isDigiLocked)}
                          <textarea name="address"
                            placeholder={isDigiLocked ? "Connect DigiLocker to fill" : "Enter your complete residential address"}
                            rows={2} value={formData.address} onChange={handleInputChange}
                            {...lockProps(true)}
                            className={(isDigiLocked ? digiClass : (autoFilled.address ? inpLocked : inp(errors.address))) + " resize-none"} />
                          {errMsg(errors.address)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            {fieldLbl("State", !isDigiLocked)}
                            <select name="state" value={formData.state} onChange={handleInputChange}
                              {...lockProps(true)}
                              className={isDigiLocked ? digiClass : (autoFilled.state ? inpLocked : inp(errors.state))}>
                              <option value="">Select State</option>
                              {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errMsg(errors.state)}
                          </div>
                          <div>
                            {fieldLbl("PIN Code", !isDigiLocked, false)}
                            <input type="text" name="pincode"
                              placeholder={isDigiLocked ? "Connect DigiLocker to fill" : "6-digit PIN code"}
                              value={formData.pincode} onChange={handleInputChange} maxLength={6}
                              {...lockProps(true)}
                              className={isDigiLocked ? digiClass : (autoFilled.pincode ? inpLocked : inp())} />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                              PAN Number <span className="text-red-500 normal-case">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                              {parentDigiData?.panLocalPdf && (
                                <button type="button"
                                  onClick={() => viewPdf(parentDigiData.panLocalPdf, "PAN")}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[10px] font-bold border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100">
                                  <FaExternalLinkAlt className="text-[9px]" /> View PAN PDF
                                </button>
                              )}
                              {autoFilled.panNumber && (
                                <span className="text-[10px] font-bold text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded-[4px]">
                                  From DigiLocker
                                </span>
                              )}
                            </div>
                          </div>
                          {digiStatus === "completed" && parentDigiData && !parentDigiData.panNumber && !parentDigiData.panLocalPdf ? (
                            <div className="rounded-[8px] border border-amber-300 bg-amber-50 px-3 py-2.5 space-y-2">
                              <p className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                PAN not found in your DigiLocker. Please enter it manually.
                              </p>
                              <input type="text" name="panNumber" placeholder="ABCDE1234F"
                                value={formData.panNumber}
                                onChange={e => {
                                  const synthetic = { ...e, target: { ...e.target, name: "panNumber", value: e.target.value.toUpperCase() } };
                                  handleInputChange(synthetic as any);
                                }}
                                maxLength={10}
                                className={inp(errors.panNumber) + " uppercase tracking-widest font-mono"} />
                            </div>
                          ) : (
                            <input type="text" name="panNumber" placeholder="ABCDE1234F"
                              value={formData.panNumber}
                              onChange={e => {
                                const synthetic = { ...e, target: { ...e.target, name: "panNumber", value: e.target.value.toUpperCase() } };
                                handleInputChange(synthetic as any);
                              }}
                              maxLength={10}
                              {...(autoFilled.panNumber ? lockProps(true) : {})}
                              className={(autoFilled.panNumber ? inpLocked : inp(errors.panNumber)) + " uppercase tracking-widest font-mono"} />
                          )}
                          {errMsg(errors.panNumber)}
                        </div>

                        {digiStatus === "completed" && parentDigiData?.maskedAadhaar && (
                          <div className="bg-blue-50 rounded-[8px] border border-blue-200 p-3">
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Aadhaar (Verified)</p>
                            <p className="font-mono font-bold text-slate-800 text-sm flex items-center">
                              {showAadhaarPill ? parentDigiData.maskedAadhaar : maskAadhaar(parentDigiData.maskedAadhaar)}
                              <MaskToggle show={showAadhaarPill} onToggle={() => setShowAadhaarPill(v => !v)} />
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Fetched from DigiLocker — Read-only</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* ── STEP 2 ── */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500">
                        Provide school details for each child. Verify APAAR ID via DigiLocker where available.
                      </p>

                      <div>
                        <label className={lbl}>Number of Children <span className="text-red-500 normal-case">*</span></label>
                        <select value={formData.numberOfChildren}
                          onChange={e => { setFormData(p => ({ ...p, numberOfChildren: parseInt(e.target.value) })); setErrors({}); }}
                          className={inp(errors.numberOfChildren)}>
                          <option value={0}>Select Number of Children</option>
                          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n===1?"Child":"Children"}</option>)}
                        </select>
                        {errMsg(errors.numberOfChildren)}
                      </div>

                      {Array.from({ length: formData.numberOfChildren }).map((_, index) => {
                        const child   = formData.children[index];
                        const digiDat = childDigiData[index];
                        const digiSt  = childDigiStatus[index];
                        const initiat = childInitiating[index];

                        return (
                          <div key={index} className="rounded-[10px] border-2 border-slate-200 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200"
                              style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)" }}>
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-[7px] flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0"
                                  style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>{index + 1}</div>
                                <p className="font-extrabold text-slate-800 text-sm">Child {index + 1}</p>
                              </div>
                              {child.digilockerVerified && (
                                <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                                  <FaCheckDouble className="text-[9px]" />APAAR Verified
                                </span>
                              )}
                            </div>

                            <div className="p-4 space-y-4">
                              <div>
                                <label className={lbl}>Full Name <span className="text-red-500 normal-case">*</span></label>
                                <input type="text" name="fullName" placeholder="Child's full name" value={child.fullName}
                                  onChange={e => handleInputChange(e, index)}
                                  className={inp(errors["child" + index + "fullName"])} />
                                {errMsg(errors["child" + index + "fullName"])}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className={lbl}>Class / Grade <span className="text-red-500 normal-case">*</span></label>
                                  <input type="text" name="classGrade" placeholder="e.g., Class 5" value={child.classGrade}
                                    onChange={e => handleInputChange(e, index)}
                                    className={inp(errors["child" + index + "classGrade"])} />
                                  {errMsg(errors["child" + index + "classGrade"])}
                                </div>
                                <div>
                                  <label className={lbl}>Admission Number <span className="text-red-500 normal-case">*</span></label>
                                  <input type="text" name="admissionNumber" placeholder="Roll / Admission no." value={child.admissionNumber}
                                    onChange={e => handleInputChange(e, index)}
                                    className={inp(errors["child" + index + "admissionNumber"])} />
                                  {errMsg(errors["child" + index + "admissionNumber"])}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className={lbl}>School Name <span className="text-red-500 normal-case">*</span></label>
                                  <input type="text" name="schoolName" placeholder="Enter school name" value={child.schoolName}
                                    onChange={e => handleInputChange(e, index)}
                                    className={inp(errors["child" + index + "schoolName"])} />
                                  {errMsg(errors["child" + index + "schoolName"])}
                                </div>
                                <div>
                                  <label className={lbl}>School City <span className="text-red-500 normal-case">*</span></label>
                                  <input type="text" name="schoolCity" placeholder="City where school is" value={child.schoolCity}
                                    onChange={e => handleInputChange(e, index)}
                                    className={inp(errors["child" + index + "schoolCity"])} />
                                  {errMsg(errors["child" + index + "schoolCity"])}
                                </div>
                              </div>

                              {/* APAAR yes/no question */}
                              <div>
                                <label className={lbl}>Does this child have an APAAR ID? <span className="text-red-500 normal-case">*</span></label>
                                <div className="flex gap-3">
                                  {(["yes", "no"] as const).map(val => (
                                    <button key={val} type="button"
                                      onClick={() => {
                                        const nc = [...formData.children];
                                        nc[index] = { ...nc[index], hasApaarId: val };
                                        setFormData(p => ({ ...p, children: nc }));
                                        if (errors["child" + index + "hasApaarId"]) setErrors(p => ({ ...p, ["child" + index + "hasApaarId"]: "" }));
                                      }}
                                      className={"flex-1 py-2.5 rounded-[8px] text-sm font-bold border-2 transition-all " + (
                                        child.hasApaarId === val
                                          ? val === "yes"
                                            ? "bg-green-50 border-green-500 text-green-700"
                                            : "bg-slate-100 border-slate-400 text-slate-700"
                                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                      )}>
                                      {val === "yes" ? "Yes" : "No"}
                                    </button>
                                  ))}
                                </div>
                                {errMsg(errors["child" + index + "hasApaarId"])}
                              </div>

                              {/* APAAR verification block */}
                              {child.hasApaarId === "yes" && (
                                <div className="rounded-[10px] border border-blue-200 bg-blue-50/50 p-4 space-y-3">
                                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">APAAR ID Verification</p>

                                  {!child.digilockerVerified ? (
                                    <>
                                      <div className="rounded-[8px] border border-dashed border-[#00468E]/30 bg-white p-3">
                                        <div className="flex items-start gap-3">
                                          <div className="w-8 h-8 rounded-[7px] flex items-center justify-center flex-shrink-0"
                                            style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>
                                            <FaFingerprint className="text-white text-sm" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="font-bold text-slate-800 text-xs mb-0.5">Verify via DigiLocker</p>
                                            <p className="text-[11px] text-slate-500 mb-2">
                                              Fetch APAAR ID automatically from Academic Bank of Credits. The ID will appear instantly.
                                            </p>
                                            {(digiSt === "idle" || digiSt === "error") && (
                                              <button type="button"
                                                onClick={() => handleInitiateChildDigilocker(index)}
                                                disabled={initiat}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-[7px] text-white text-xs font-bold transition-all active:scale-95 disabled:opacity-60"
                                                style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>
                                                {initiat
                                                  ? <><FaSpinner className="animate-spin" />Connecting...</>
                                                  : <><FaFingerprint />Verify APAAR via DigiLocker</>}
                                              </button>
                                            )}
                                            {digiSt === "initiated" && (
                                              <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1.5">
                                                <FaSpinner className="animate-spin" /> Waiting for DigiLocker...
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="relative">
                                        <div className="absolute inset-0 flex items-center" aria-hidden>
                                          <div className="w-full border-t border-slate-200" />
                                        </div>
                                        <div className="relative flex justify-center">
                                          <span className="bg-blue-50/50 px-2 text-[10px] text-slate-400 font-medium uppercase tracking-widest">or enter manually</span>
                                        </div>
                                      </div>

                                      <div>
                                        <label className={lbl}>APAAR ID (12 digits)</label>
                                        <input type="text" name="manualApaarId"
                                          placeholder="Enter 12-digit APAAR ID"
                                          value={child.manualApaarId}
                                          onChange={e => handleInputChange(e, index)}
                                          maxLength={12}
                                          className={inp(errors["child" + index + "apaarId"]) + " font-mono tracking-widest"} />
                                        {errMsg(errors["child" + index + "apaarId"])}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between rounded-[8px] bg-green-50 border border-green-200 px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                          <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                          <div>
                                            <p className="text-xs font-bold text-green-800">APAAR Verified via DigiLocker</p>
                                            {child.digilockerFullName && (
                                              <p className="text-[11px] text-green-700">Student: <strong>{child.digilockerFullName}</strong></p>
                                            )}
                                          </div>
                                        </div>
                                        <button type="button"
                                          className="text-[10px] text-slate-400 hover:text-slate-600 underline ml-3 flex-shrink-0"
                                          onClick={() => {
                                            const nc = [...formData.children];
                                            nc[index] = { ...nc[index], digilockerVerified: false, digilockerStatus: "", digilockerClientId: "", apaarId: "", apaarLocalPdf: "" };
                                            setFormData(p => ({ ...p, children: nc }));
                                            setChildDigiData(prev => { const n = [...prev]; n[index] = null; return n; });
                                            setChildDigiStatus(prev => { const n = [...prev]; n[index] = "idle"; return n; });
                                            sessionStorage.removeItem("parent_child_digi_" + index);
                                          }}>Re-verify</button>
                                      </div>

                                      {/* APAAR ID display — inline from PDF */}
                                      <div className="rounded-[8px] border-2 border-blue-300 bg-blue-50 p-3">
                                        <div className="flex items-start justify-between gap-3">
                                          <div>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">APAAR ID (from PDF)</p>
                                            {child.apaarId ? (
                                              <p className="font-mono font-extrabold text-[#00468E] text-lg tracking-[0.2em]">
                                                {child.apaarId}
                                              </p>
                                            ) : (
                                              <p className="text-xs text-amber-700 font-medium">
                                                APAAR ID not found in PDF. Enter manually below.
                                              </p>
                                            )}
                                            <p className="text-[10px] text-slate-400 mt-1">Extracted from APAAR document — Read-only</p>
                                          </div>
                                          {child.apaarLocalPdf && (
                                            <button type="button"
                                              onClick={() => viewPdf(child.apaarLocalPdf, "APAAR")}
                                              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-xs font-bold border border-blue-300 text-blue-700 bg-blue-100 hover:bg-blue-200">
                                              <FaExternalLinkAlt className="text-[9px]" /> View PDF
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      {!child.apaarId && (
                                        <div>
                                          <label className={lbl}>Enter APAAR ID Manually</label>
                                          <input type="text" name="manualApaarId"
                                            placeholder="Enter 12-digit APAAR ID"
                                            value={child.manualApaarId}
                                            onChange={e => handleInputChange(e, index)}
                                            maxLength={12}
                                            className={inp() + " font-mono tracking-widest"} />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {child.hasApaarId === "no" && (
                                <div className="rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2.5 flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                  <p className="text-xs text-slate-600">
                                    No APAAR ID noted. Your application will still be reviewed. APAAR ID helps speed up verification.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── STEP 3 ── */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500">Tell us about your financial situation so we can best support your family.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={lbl}>Total Fee Amount (Rs.) <span className="text-red-500 normal-case">*</span></label>
                          <input type="number" name="feeAmount" placeholder="Amount in rupees" value={formData.feeAmount} onChange={handleInputChange} className={inp(errors.feeAmount)} />
                          {errMsg(errors.feeAmount)}
                        </div>
                        <div>
                          <label className={lbl}>Fee Period <span className="text-red-500 normal-case">*</span></label>
                          <select name="feePeriod" value={formData.feePeriod} onChange={handleInputChange} className={inp(errors.feePeriod)}>
                            <option value="">Select Fee Period</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="halfYearly">Half Yearly</option>
                            <option value="annual">Annual</option>
                          </select>
                          {errMsg(errors.feePeriod)}
                        </div>
                      </div>
                      <div>
                        <label className={lbl}>Reason for Support <span className="text-red-500 normal-case">*</span></label>
                        <select name="reasonForSupport" value={formData.reasonForSupport} onChange={handleInputChange} className={inp(errors.reasonForSupport)}>
                          <option value="">Select Reason</option>
                          <option value="jobLoss">Job Loss / Unemployment</option>
                          <option value="medical">Medical Emergency</option>
                          <option value="businessLoan">Business Loan</option>
                          <option value="familyEmergency">Family Emergency</option>
                          <option value="cashflow">Temporary Cash Flow Issue</option>
                          <option value="other">Other</option>
                        </select>
                        {errMsg(errors.reasonForSupport)}
                      </div>
                      {formData.reasonForSupport === "other" && (
                        <div>
                          <label className={lbl}>Specify Other Reason <span className="text-red-500 normal-case">*</span></label>
                          <input type="text" name="otherReason" placeholder="Please specify your reason" value={formData.otherReason} onChange={handleInputChange} className={inp(errors.otherReason)} />
                          {errMsg(errors.otherReason)}
                        </div>
                      )}
                      <div>
                        <label className={lbl}>Brief Description <span className="text-red-500 normal-case">*</span></label>
                        <textarea name="description" placeholder="Describe your situation in detail..." rows={3} value={formData.description} onChange={handleInputChange} className={inp(errors.description) + " resize-none"} />
                        {errMsg(errors.description)}
                      </div>
                      <div>
                        <label className={lbl}>Preferred Repayment Duration <span className="text-red-500 normal-case">*</span></label>
                        <select name="repaymentDuration" value={formData.repaymentDuration} onChange={handleInputChange} className={inp(errors.repaymentDuration)}>
                          <option value="">Select Duration</option>
                          {Array.from({length:12},(_,i)=>(i+1)*3).map(m=>(
                            <option key={m} value={m}>{m} months{m>=12?" ("+Math.floor(m/12)+"yr"+(m%12>0?" "+m%12+"m":"")+")":""}</option>
                          ))}
                        </select>
                        {errMsg(errors.repaymentDuration)}
                      </div>
                    </div>
                  )}

                  {/* ── STEP 4 ── */}
                  {currentStep === 4 && (
                    <div className="space-y-3.5">
                      <p className="text-sm text-slate-500">Review all details carefully before completing your Rs.11 registration payment.</p>

                      {digiStatus === "completed" && parentDigiData && (
                        <div className="rounded-[10px] overflow-hidden border-2 border-green-200">
                          <div className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-green-200"
                            style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                            <Shield className="text-green-600 h-4 w-4" />
                            <span className="font-bold text-green-800 text-sm">DigiLocker KYC Verified</span>
                            <span className="ml-auto text-[10px] font-bold text-green-700 bg-green-100 border border-green-300 px-2 py-0.5 rounded-[5px]">Verified</span>
                          </div>
                          <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {([
                              ["Name",   parentDigiData.fullName],
                              ["DOB",    parentDigiData.dob],
                              ["Mobile", parentDigiData.mobileNumber],
                            ] as [string, string | null][]).filter(([, v]) => v).map(([l, v]) => (
                              <div key={l} className="bg-green-50 rounded-[8px] p-2.5 border border-green-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{l}</p>
                                <p className="font-semibold text-slate-800 text-xs break-all">{v}</p>
                              </div>
                            ))}
                            {parentDigiData.maskedAadhaar && (
                              <div className="bg-green-50 rounded-[8px] p-2.5 border border-green-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Aadhaar</p>
                                <p className="font-semibold text-slate-800 text-xs font-mono flex items-center">
                                  {showAadhaarPill ? parentDigiData.maskedAadhaar : maskAadhaar(parentDigiData.maskedAadhaar)}
                                  <MaskToggle show={showAadhaarPill} onToggle={() => setShowAadhaarPill(v => !v)} />
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="rounded-[10px] overflow-hidden border-2 border-slate-200">
                        <div className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-slate-200"
                          style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)" }}>
                          <FaUserTie className="text-[#00468E] text-sm" />
                          <span className="font-bold text-slate-700 text-sm">Parent Information</span>
                        </div>
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {([
                            ["Name",   formData.full_name],
                            ["DOB",    formData.dob],
                            ["Gender", formData.gender],
                            ["Phone",  formData.phone],
                            ["Email",  formData.email],
                            ["PAN",    formData.panNumber],
                            ["State",  formData.state],
                            ["PIN",    formData.pincode],
                          ] as [string, string][]).filter(([, v]) => v).map(([l, v]) => (
                            <div key={l} className="bg-slate-50 rounded-[8px] p-2.5 border border-slate-100">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{l}</p>
                              <p className="font-semibold text-slate-800 text-xs break-all">{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[10px] overflow-hidden border-2 border-slate-200">
                        <div className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-slate-200"
                          style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                          <FaChild className="text-[#0cab47] text-sm" />
                          <span className="font-bold text-slate-700 text-sm">{formData.numberOfChildren} {formData.numberOfChildren===1?"Child":"Children"}</span>
                        </div>
                        <div className="p-3 space-y-2">
                          {Array.from({length:formData.numberOfChildren}).map((_,i) => {
                            const c = formData.children[i];
                            const effectiveApaarId = c.apaarId || c.manualApaarId || null;
                            return (
                              <div key={i} className="bg-slate-50 rounded-[10px] p-3 border border-slate-200">
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-[5px] flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0"
                                      style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>{i+1}</span>
                                    <span className="font-bold text-slate-800 text-sm">{c.fullName}</span>
                                  </div>
                                  {c.digilockerVerified && (
                                    <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                                      <FaCheckDouble className="text-[9px]" />APAAR Verified
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 mt-1">
                                  <span><span className="text-slate-400">Class:</span> <strong>{c.classGrade}</strong></span>
                                  <span><span className="text-slate-400">School:</span> <strong>{c.schoolName}</strong></span>
                                  {effectiveApaarId ? (
                                    <span className="flex items-center gap-1">
                                      <span className="text-slate-400">APAAR:</span>
                                      <strong className="text-[#00468E] font-mono">{effectiveApaarId}</strong>
                                    </span>
                                  ) : c.hasApaarId === "no" ? (
                                    <span className="text-slate-400 italic">No APAAR ID</span>
                                  ) : (
                                    <span className="text-amber-600 italic text-[11px]">APAAR not verified</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-[10px] p-5 text-white"
                        style={{ background: "linear-gradient(135deg,#00305F,#00468E)" }}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Registration Fee</p>
                            <p className="text-4xl font-extrabold">Rs.11</p>
                            <p className="text-blue-200 text-xs mt-1 flex items-center gap-1">
                              <FaLock className="text-[10px]" /> One-time — Secured by Razorpay
                            </p>
                          </div>
                          <div className="bg-white/10 border border-white/20 rounded-[10px] px-4 py-3">
                            <p className="text-blue-200 text-[11px] font-semibold mb-1">What you get:</p>
                            <ul className="space-y-1">
                              {["Application review in 3 to 5 days","0% interest fee support","Direct school disbursement","Dedicated support team"].map(item => (
                                <li key={item} className="flex items-center gap-1.5 text-[11px] text-white/80">
                                  <CheckCircle2 className="h-3 w-3 text-green-400 shrink-0" />{item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <label className="flex items-start gap-3.5 cursor-pointer p-4 rounded-[10px] border-2 transition-all duration-200"
                        style={{ borderColor: agreed ? "#00468E" : "#cbd5e1", background: agreed ? "#00468E08" : "#f8fafc" }}>
                        <div className={"w-5 h-5 rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all " + (agreed ? "border-[#00468E] bg-[#00468E]" : "border-slate-300 bg-white")}>
                          {agreed && <IoMdCheckmark className="text-white text-xs" />}
                        </div>
                        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="sr-only" />
                        <span className="text-sm text-slate-600 leading-relaxed">
                          I confirm all information is accurate. I agree to the{" "}
                          <a href="/terms" className="text-[#00468E] font-semibold hover:underline">Terms &amp; Conditions</a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-[#00468E] font-semibold hover:underline">Privacy Policy</a>{" "}
                          of Schoolfee.org.
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Nav */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mt-5 pt-4 border-t-2 border-slate-200">
                    <button onClick={handlePrevious} disabled={currentStep === 1}
                      className={"px-6 py-3 rounded-[10px] font-bold text-sm transition-all flex items-center gap-2 " + (currentStep === 1 ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200" : "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 border border-slate-300")}>
                      Previous
                    </button>
                    {currentStep < 4 ? (
                      <button onClick={handleNext}
                        className="px-8 py-3 rounded-[10px] font-bold text-sm text-white transition-all active:scale-95 flex items-center gap-2"
                        style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>
                        Continue <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button onClick={handlePaymentAndSubmit}
                        disabled={!agreed || isPaymentProcessing || isSubmitting}
                        className={"px-8 py-3 rounded-[10px] font-bold text-sm transition-all flex items-center gap-2 " + (agreed && !isPaymentProcessing && !isSubmitting ? "text-white active:scale-95" : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300")}
                        style={agreed && !isPaymentProcessing && !isSubmitting ? { background: "linear-gradient(135deg,#0cab47,#08d451)" } : {}}>
                        {isPaymentProcessing ? (
                          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
                        ) : isSubmitting ? (
                          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                        ) : (
                          <><FaLock className="text-xs" />Pay Rs.11 and Submit</>
                        )}
                      </button>
                    )}
                  </div>

                </div>
              </div>

              <div className="lg:hidden mt-4 bg-white rounded-[10px] border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  {["0% Interest","Bank-grade Security","Direct School Payment","48hr Verification"].map(item => (
                    <span key={item} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0cab47] shrink-0" />{item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}