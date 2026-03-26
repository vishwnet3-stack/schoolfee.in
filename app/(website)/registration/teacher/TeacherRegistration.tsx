"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  FaIdCard, FaShieldAlt, FaLock, FaExternalLinkAlt, FaEye, FaEyeSlash,
} from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  User, GraduationCap, Briefcase, ClipboardCheck,
  AlertCircle, CheckCircle2, ChevronRight, Shield,
  Loader2, Mail, Save, Send, PartyPopper,
} from "lucide-react";

declare global { interface Window { Razorpay: any; } }
// ── Key loaded from .env — change only NEXT_PUBLIC_RAZORPAY_KEY_ID in .env
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
const SESSION_KEY = "teacher_reg_progress";
const DIGI_SESSION_KEY = "teacher_digilocker_result";

const indianStates = [
  "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
  "Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Ladakh",
  "Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];
const qualifications = [
  "High School","Intermediate","Bachelor's Degree","Master's Degree",
  "B.Ed","M.Ed","Ph.D","Diploma in Education","Other",
];
const subjects = [
  "Mathematics","Science","Physics","Chemistry","Biology","English","Hindi",
  "Social Studies","History","Geography","Computer Science","Physical Education",
  "Art & Craft","Music","Commerce","Economics","Political Science","Other",
];
const experienceYears = [
  "Fresher (0 years)","Less than 1 year","1-2 years","2-5 years",
  "5-10 years","10-15 years","15-20 years","20+ years",
];

type FormData = {
  full_name: string; dob: string; gender: string; phone: string;
  email: string; address: string; state: string; pincode: string;
  father_name: string;
  qualification: string; otherQualification: string;
  subject: string; otherSubject: string; experience: string;
  school_name: string; employee_id: string; salary_monthly: string;
  joining_date: string; employment_type: string;
};

type DigiData = {
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
  mobileNumber: string | null;
  aadhaarLocalPdf: string | null;
  panLocalPdf: string | null;
  apaarLocalPdf: string | null;
  documents: Array<{ doc_type: string; doc_name: string; local_pdf_path: string | null }>;
} | null;

// Email status — silent async check + OTP flow
type EmailStatus =
  | "idle"
  | "checking"
  | "blocked"
  | "waitlist_verified"
  | "new_email"
  | "otp_sent"
  | "verified";

// Session-persisted state shape
type PersistedState = {
  formData: FormData;
  currentStep: number;
  emailStatus: EmailStatus;
  emailBlockReason: string;
  autoFilled: Record<string, boolean>;
  digiStatus: "idle" | "initiated" | "completed" | "error";
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
  if (!localPath) { toast.error(`No ${label} PDF available.`); return; }
  const url = `/api/public/digilocker/teacher-pdf-proxy?file=${encodeURIComponent(localPath.replace(/\\/g, "/"))}`;
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
  digiStatus: "idle" | "initiated" | "completed" | "error";
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
              Auto-fill your name, DOB, address and more — no manual typing needed.
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
                <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isInitiating ? "Connecting..." : "Waiting for DigiLocker..."}</>
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

// ── Main Registration Component ────────────────────────────────────────────────
export default function TeacherRegistrationPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuthSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [agreed, setAgreed]           = useState(false);
  const [isSubmitting, setIsSubmitting]               = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting]             = useState(false);
  const [redirectStep,  setRedirectStep]              = useState(0);

  const [digiData,   setDigiData]   = useState<DigiData>(null);
  const [digiStatus, setDigiStatus] = useState<"idle" | "initiated" | "completed" | "error">("idle");
  const [isInitiating, setIsInitiating] = useState(false);
  const loadedRef = useRef(false);

  const [showAadhaarPill, setShowAadhaarPill] = useState(false);

  // Email verification state
  const [emailStatus,      setEmailStatus]      = useState<EmailStatus>("idle");
  const [emailBlockReason, setEmailBlockReason] = useState("");
  const [otpValue,         setOtpValue]         = useState("");
  const [otpLoading,       setOtpLoading]       = useState(false);

  // Debounce ref for silent email check
  const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckedEmail = useRef("");

  const [formData, setFormData] = useState<FormData>({
    full_name: "", dob: "", gender: "", phone: "", email: "",
    address: "", state: "", pincode: "", father_name: "",
    qualification: "", otherQualification: "",
    subject: "", otherSubject: "", experience: "",
    school_name: "", employee_id: "", salary_monthly: "",
    joining_date: "", employment_type: "",
  });

  const [autoFilled, setAutoFilled] = useState<Record<string, boolean>>({});

  const isEmailVerified = emailStatus === "verified" || emailStatus === "waitlist_verified";

  // ── Restore from session on mount ──────────────────────────────────────────
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
    // Also restore DigiLocker data from its own key
    const digiRaw = sessionStorage.getItem(DIGI_SESSION_KEY);
    if (digiRaw) {
      try { setDigiData(JSON.parse(digiRaw)); } catch {}
    }
  }, []);

  // ── Persist to session whenever key state changes ────────────────────────
  useEffect(() => {
    saveSession({
      formData,
      currentStep,
      emailStatus,
      emailBlockReason,
      autoFilled,
      digiStatus,
    });
  }, [formData, currentStep, emailStatus, emailBlockReason, autoFilled, digiStatus]);

  // ── Auto-fill form from DigiLocker data ─────────────────────────────────
  const autofillFromDigi = useCallback((data: NonNullable<DigiData>) => {
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
      if (data.fullName)    { next.full_name   = data.fullName;           filled.full_name = true; }
      if (data.dob)         { next.dob         = data.dob.split("T")[0];  filled.dob       = true; }
      if (gender)           { next.gender      = gender;                  filled.gender    = true; }
      if (addressStr)       { next.address     = addressStr;              filled.address   = true; }
      if (detectedState)    { next.state       = detectedState;           filled.state     = true; }
      if (data.zip)         { next.pincode     = data.zip;                filled.pincode   = true; }
      if (data.mobileNumber && !prev.phone) {
        next.phone = data.mobileNumber; filled.phone = true;
      }
      return next;
    });
    setAutoFilled(filled);
  }, []);

  // ── Load DigiLocker result after callback redirect ────────────────────────
  useEffect(() => {
    if (loadedRef.current) return;
    if (searchParams.get("digilocker") !== "done") return;
    const stored = sessionStorage.getItem(DIGI_SESSION_KEY);
    if (!stored) return;
    try {
      const parsed: NonNullable<DigiData> = JSON.parse(stored);
      setDigiData(parsed);
      setDigiStatus("completed");
      autofillFromDigi(parsed);
      loadedRef.current = true;
      toast.success("DigiLocker verified. Form fields filled from Aadhaar.", { duration: 4000 });
    } catch (e) {
      console.error("[TeacherReg] DigiLocker parse failed:", e);
    }
  }, [searchParams, autofillFromDigi]);

  // Also set digiStatus to completed if we already have digiData from session
  useEffect(() => {
    if (digiData && digiStatus === "idle") {
      setDigiStatus("completed");
      autofillFromDigi(digiData);
    }
  }, [digiData]);

  // ── Tamper Guard ─────────────────────────────────────────────────────────
  // Uses MutationObserver to detect if a user removes readOnly / data-digi-locked
  // attributes via DevTools. All Step 1 DigiLocker fields are permanently locked —
  // empty before verification, autofilled and locked after.
  useEffect(() => {
    const DIGI_FIELDS = ["full_name", "dob", "gender", "phone", "address", "state", "pincode"];

    const restoreLockedFields = () => {
      document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        "[data-digi-locked]"
      ).forEach(el => {
        const name = el.getAttribute("name");
        if (!name || !DIGI_FIELDS.includes(name)) return;

        // Re-apply readOnly in case DevTools removed it
        if ("readOnly" in el && !(el as HTMLInputElement).readOnly) {
          (el as HTMLInputElement).readOnly = true;
        }

        // If DigiLocker is completed, also restore the canonical value if tampered
        if (digiStatus === "completed" && autoFilled[name]) {
          const canonical = (formData as Record<string, string>)[name] ?? "";
          if (el.value !== canonical) {
            el.value = canonical;
          }
        }

        // If DigiLocker is NOT completed, keep field empty
        if (digiStatus !== "completed" && el.value !== "") {
          el.value = "";
        }
      });
    };

    const observer = new MutationObserver(() => {
      restoreLockedFields();
    });

    observer.observe(document.body, {
      subtree:         true,
      attributes:      true,
      attributeFilter: ["readonly", "data-digi-locked", "disabled", "style"],
      characterData:   true,
      childList:       false,
    });

    const interval = window.setInterval(restoreLockedFields, 500);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFilled, digiData, digiStatus]);

  // Pre-fill email from auth session
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(p => ({ ...p, email: user.email }));
    }
  }, [user]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, []);

  // ── Silent email check (debounced, fires after user stops typing) ────────
  const runSilentEmailCheck = useCallback(async (email: string) => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return;
    if (email === lastCheckedEmail.current) return;
    lastCheckedEmail.current = email;
    setEmailStatus("checking");
    setEmailBlockReason("");
    try {
      const res = await fetch("/api/public/teacher/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      // Always resolve to a concrete state — never leave spinner hanging
      if (data.blocked === true) {
        setEmailStatus("blocked");
        setEmailBlockReason(data.error || "This email cannot be used.");
      } else if (data.status === "waitlist_verified") {
        setEmailStatus("waitlist_verified");
      } else if (data.status === "new_email") {
        setEmailStatus("new_email");
      } else if (!res.ok || (!data.success && data.error)) {
        // Server error or unexpected failure — show as blocked with message
        setEmailStatus("blocked");
        setEmailBlockReason(data.error || "Unable to verify email. Please try a different one.");
      } else {
        // Unknown shape — default to new_email so user can proceed with OTP
        setEmailStatus("new_email");
      }
    } catch {
      // Network failure — default to new_email so form isn't stuck
      setEmailStatus("new_email");
    }
  }, []);

  // ── Send OTP ─────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await fetch("/api/public/teacher/send-otp", {
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

  // ── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return;
    setOtpLoading(true);
    try {
      const res = await fetch("/api/public/teacher/verify-otp", {
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

  // ── Initiate DigiLocker ──────────────────────────────────────────────────
  const handleInitiateDigilocker = async () => {
    setIsInitiating(true);
    try {
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/+$/, "");
      const res = await fetch("/api/public/digilocker/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectUrl: `${appUrl}/digilocker-teacher-callback` }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { toast.error(data.error || "Failed to connect to DigiLocker."); return; }
      sessionStorage.removeItem(DIGI_SESSION_KEY);
      loadedRef.current = false;
      setDigiStatus("initiated");
      window.location.href = data.digilockerUrl;
    } catch (err: any) {
      toast.error(err.message || "Could not connect to DigiLocker.");
    } finally { setIsInitiating(false); }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // JS security: all DigiLocker fields are locked on Step 1 until DigiLocker is completed.
    // This catches programmatic DOM mutations, DevTools edits, and browser autofill
    // that bypass the lockProps event handlers.
    const digiLockedFields = ["full_name", "dob", "gender", "phone", "address", "state", "pincode"];
    if (digiLockedFields.includes(name) && digiStatus !== "completed") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // After DigiLocker completes, autofilled fields remain locked permanently.
    if (autoFilled[name]) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Email-verified field is also locked — prevent changes after OTP verification.
    if (name === "email" && isEmailVerified) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));

    if (name === "email") {
      // Reset verification state immediately when email changes
      if (emailStatus !== "idle") {
        setEmailStatus("idle");
        setEmailBlockReason("");
        setOtpValue("");
        lastCheckedEmail.current = "";
      }
      // Debounce: fire silent check 800ms after user stops typing
      if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
      const trimmed = value.trim();
      if (trimmed.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        emailDebounceRef.current = setTimeout(() => {
          runSilentEmailCheck(trimmed);
        }, 800);
      }
    }
  };

  // Input class helpers
  const inp = (err?: string) =>
    "w-full px-3 py-2.5 rounded-[8px] border text-sm font-medium transition-all duration-200 outline-none " +
    (err
      ? "border-red-400 bg-red-50 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-200"
      : "border-slate-300 bg-white text-slate-800 placeholder-slate-400 hover:border-[#00468E]/50 focus:border-[#00468E] focus:ring-2 focus:ring-[#00468E]/10");

  // DigiLocker-filled fields are disabled and styled green
  const inpLocked =
    "w-full px-3 py-2.5 rounded-[8px] border text-sm font-medium outline-none border-green-300 bg-green-50 text-slate-700 cursor-not-allowed select-none";

  // JS-based field locking — multi-layer protection against user tampering.
  // Layer 1: readOnly blocks native browser editing.
  // Layer 2: tabIndex=-1 removes keyboard focus path.
  // Layer 3: All edit-related events are intercepted and killed.
  // Layer 4: pointerEvents:none + userSelect:none blocks mouse interaction.
  // Layer 5: onBeforeInput and onInput kill IME / voice input pathways.
  // Layer 6: onContextMenu blocks right-click inspect-and-edit shortcuts.
  // Layer 7: handleInputChange rejects state updates for autofilled field names.
  // Layer 8: tamperGuard useEffect (below) restores DigiLocker values if DOM is mutated.
  const lockProps = (isLocked: boolean) => isLocked ? {
    readOnly:           true as const,
    tabIndex:           -1 as const,
    "aria-readonly":    true as const,
    "data-digi-locked": true as const,
    onFocus:       (e: React.FocusEvent<HTMLElement>)        => { e.preventDefault(); e.target.blur(); },
    onKeyDown:     (e: React.KeyboardEvent<HTMLElement>)     => { e.preventDefault(); e.stopPropagation(); },
    onKeyPress:    (e: React.KeyboardEvent<HTMLElement>)     => { e.preventDefault(); e.stopPropagation(); },
    onKeyUp:       (e: React.KeyboardEvent<HTMLElement>)     => { e.preventDefault(); e.stopPropagation(); },
    onBeforeInput: (e: React.FormEvent<HTMLElement>)         => { e.preventDefault(); e.stopPropagation(); },
    onInput:       (e: React.FormEvent<HTMLElement>)         => { e.preventDefault(); e.stopPropagation(); },
    onPaste:       (e: React.ClipboardEvent<HTMLElement>)    => { e.preventDefault(); e.stopPropagation(); },
    onCut:         (e: React.ClipboardEvent<HTMLElement>)    => { e.preventDefault(); e.stopPropagation(); },
    onCopy:        (e: React.ClipboardEvent<HTMLElement>)    => { e.stopPropagation(); },
    onDrop:        (e: React.DragEvent<HTMLElement>)         => { e.preventDefault(); e.stopPropagation(); },
    onDragOver:    (e: React.DragEvent<HTMLElement>)         => { e.preventDefault(); e.stopPropagation(); },
    onMouseDown:   (e: React.MouseEvent<HTMLElement>)        => { e.preventDefault(); e.currentTarget.blur(); },
    onClick:       (e: React.MouseEvent<HTMLElement>)        => { e.preventDefault(); e.stopPropagation(); },
    onContextMenu: (e: React.MouseEvent<HTMLElement>)        => { e.preventDefault(); e.stopPropagation(); },
    onChange:      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      e.preventDefault();
      e.stopPropagation();
    },
    style: {
      pointerEvents:    "none" as const,
      userSelect:       "none" as const,
      WebkitUserSelect: "none" as const,
    },
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

  // Step validators
  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!formData.full_name.trim())        e.full_name = "Full name is required";
    if (!formData.dob)                     e.dob       = "Date of birth is required";
    if (!formData.gender)                  e.gender    = "Gender is required";
    if (!formData.phone.match(/^\d{10}$/)) e.phone     = "Valid 10-digit phone required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!formData.address.trim())          e.address   = "Address is required";
    if (!formData.state)                   e.state     = "State is required";
    if (!isEmailVerified)                  e.email_verify = "Please verify your email before continuing";
    setErrors(e); return Object.keys(e).length === 0;
  };
  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!formData.qualification) e.qualification = "Qualification is required";
    if (formData.qualification === "Other" && !formData.otherQualification.trim())
      e.otherQualification = "Please specify";
    if (!formData.subject) e.subject = "Subject is required";
    if (formData.subject === "Other" && !formData.otherSubject.trim())
      e.otherSubject = "Please specify";
    if (!formData.experience) e.experience = "Experience is required";
    setErrors(e); return Object.keys(e).length === 0;
  };
  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!formData.school_name.trim())   e.school_name    = "School name is required";
    if (!formData.employee_id.trim())   e.employee_id    = "Employee ID is required";
    if (!formData.salary_monthly || parseFloat(formData.salary_monthly) <= 0)
                                        e.salary_monthly = "Valid monthly salary required";
    if (!formData.joining_date)         e.joining_date   = "Joining date is required";
    if (!formData.employment_type)      e.employment_type= "Employment type is required";
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
      const orderRes = await fetch("/api/public/razorpay-teacher-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, name: formData.full_name }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || "Order creation failed");

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Schoolfee.org",
        description: "Teacher Registration Fee — Rs.111",
        image: "/logo.jpg",
        order_id: orderData.order.id,
        prefill: { name: formData.full_name, email: formData.email, contact: formData.phone },
        theme: { color: "#00468E" },
        handler: async (response: any) => {
          setIsPaymentProcessing(false);
          setIsSubmitting(true);
          try {
            const verifyRes = await fetch("/api/public/razorpay-teacher-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                formData,
                publicUserId:       user?.id || null,
                digilockerClientId: digiData?.clientId || null,
                maskedAadhaar:      digiData?.maskedAadhaar || null,
                panNumber:          digiData?.panNumber || null,
                aadhaarLocalPdf:    digiData?.aadhaarLocalPdf || null,
                panLocalPdf:        digiData?.panLocalPdf || null,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.error || "Verification failed");
            // Clear session on success
            sessionStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(DIGI_SESSION_KEY);
            sessionStorage.removeItem("teacher_digilocker_client_id");
            toast.success("Registration submitted. Check your email for dashboard access.");
            // Show animated redirect overlay — steps cycle every 1.8s before moving to step 5
            setIsRedirecting(true);
            setRedirectStep(0);
            const steps = [0, 1, 2, 3];
            steps.forEach((s, i) => {
              setTimeout(() => setRedirectStep(s), i * 1800);
            });
            setTimeout(() => {
              setIsRedirecting(false);
              setCurrentStep(5);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, steps.length * 1800);
          } catch (err: any) {
            toast.error(err.message || "Submission failed. Please contact support.");
          } finally { setIsSubmitting(false); }
        },
        modal: {
          ondismiss: () => { setIsPaymentProcessing(false); toast.info("Payment cancelled."); },
        },
      });
      rzp.on("payment.failed", (r: any) => {
        setIsPaymentProcessing(false);
        toast.error(`Payment failed: ${r.error.description}`);
      });
      rzp.open();
    } catch (err: any) {
      setIsPaymentProcessing(false);
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  const steps = [
    { number: 1, title: "Personal Info",   icon: User          },
    { number: 2, title: "Professional",    icon: GraduationCap },
    { number: 3, title: "Employment",      icon: Briefcase     },
    { number: 4, title: "Review & Pay",    icon: ClipboardCheck},
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
            Payment of <strong>Rs.111</strong> received. Confirmation and dashboard access link sent to{" "}
            <strong>{formData.email}</strong>.
          </p>
          <p className="text-xs text-slate-400 mb-8">
            Our team will review your application within 3 to 5 working days.
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
    { icon: <CheckCircle2 className="w-8 h-8 text-white" />,  title: "Payment confirmed",       sub: "Your payment of Rs.111 was received"          },
    { icon: <Save        className="w-8 h-8 text-white" />,   title: "Saving your details",     sub: "Storing your registration securely"            },
    { icon: <Send        className="w-8 h-8 text-white" />,   title: "Sending confirmation",    sub: "Emailing your dashboard access link"           },
    { icon: <PartyPopper className="w-8 h-8 text-white" />,   title: "Registration complete!",  sub: "Taking you to your confirmation page..."       },
  ];

  return (
    <>
      {/* ── Redirect loading overlay ── */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#00305F 0%,#00468E 60%,#0058B4 100%)" }}>
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm w-full">
            {/* Spinning ring */}
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-[#F4951D] border-r-white/40 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center justify-center">{redirectMessages[redirectStep]?.icon}</span>
              </div>
            </div>

            {/* Step message */}
            <h2 className="text-xl font-extrabold text-white mb-2 transition-all duration-500">
              {redirectMessages[redirectStep]?.title}
            </h2>
            <p className="text-white/60 text-sm mb-8 transition-all duration-500">
              {redirectMessages[redirectStep]?.sub}
            </p>

            {/* Step dots */}
            <div className="flex items-center gap-2">
              {redirectMessages.map((_, i) => (
                <div key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width:      i === redirectStep ? "24px" : "8px",
                    height:     "8px",
                    background: i < redirectStep  ? "#0cab47"
                               : i === redirectStep ? "#F4951D"
                               : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            <p className="text-white/30 text-xs mt-8">Please do not close this window</p>
          </div>
        </div>
      )}

    <div className="min-h-screen"
      style={{ background: "linear-gradient(160deg,#F6F5F1 0%,#EEF4FB 50%,#F6F5F1 100%)" }}>

      {/* Hero */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#00305F 0%,#00468E 60%,#0058B4 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-[10px] mb-4 uppercase tracking-widest">
            <FaIdCard className="text-[#F4951D]" /> Teacher Registration
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
            Join Schoolfee as a Teacher
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl">
            Apply for Schoolfee Teacher Membership and connect with schools across India.
          </p>
          {user && (
            <div className="inline-flex items-center gap-2 mt-4 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold px-3 py-1.5 rounded-[10px]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Logged in as {user.fullName}
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
                    <div className={`relative z-10 w-9 h-9 rounded-[10px] flex items-center justify-center text-xs font-bold transition-all duration-300 ${done ? "bg-[#0cab47] text-white" : active ? "text-white" : "bg-slate-100 text-slate-400"}`}
                      style={active ? { background: "linear-gradient(135deg,#00468E,#0058B4)" } : {}}>
                      {done ? <IoMdCheckmark className="text-base" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 text-center ${active ? "text-[#00468E]" : done ? "text-[#0cab47]" : "text-slate-400"}`}>
                      {step.title.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg,#00468E,#0cab47)" }} />
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
                      style={{ width: `${progress}%`, background: "linear-gradient(90deg,#F4951D,#0cab47)" }} />
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
                          <div className={`absolute left-[22px] top-[44px] w-0.5 h-8 transition-all ${done ? "bg-[#0cab47]" : "bg-slate-200"}`} />
                        )}
                        <div className={`relative z-10 flex items-center gap-3 px-3 py-3 rounded-[10px] ${active ? "bg-[#00468E]/[0.08] border border-[#00468E]/20" : ""}`}>
                          <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all ${done ? "bg-[#0cab47] text-white" : active ? "text-white" : "bg-slate-100 text-slate-400"}`}
                            style={active ? { background: "linear-gradient(135deg,#00468E,#0058B4)" } : {}}>
                            {done ? <IoMdCheckmark className="text-lg" /> : <Icon className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {step.number}</p>
                            <p className={`text-sm font-bold ${active ? "text-[#00468E]" : done ? "text-[#0cab47]" : "text-slate-400"}`}>{step.title}</p>
                            {active && <p className="text-[11px] text-slate-400">In Progress</p>}
                            {done  && <p className="text-[11px] text-[#0cab47]">Completed</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KYC status */}
              {digiStatus === "completed" && digiData ? (
                <div className="rounded-[10px] border-2 border-green-300 p-4"
                  style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wide">KYC Verified</p>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{digiData.fullName}</p>
                  {digiData.maskedAadhaar && (
                    <p className="text-xs text-slate-500 mt-1 font-mono flex items-center">
                      Aadhaar: {showAadhaarPill ? digiData.maskedAadhaar : maskAadhaar(digiData.maskedAadhaar)}
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
                <p className="text-3xl font-extrabold text-slate-800 mb-1">Rs.111</p>
                <div className="flex items-center gap-1.5 text-amber-700 text-xs">
                  <FaLock className="text-[10px]" /><span>Secured by Razorpay</span>
                </div>
              </div>

              <div className="bg-white rounded-[10px] border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FaShieldAlt className="text-[#00468E] text-base" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Why Join Us</p>
                </div>
                <ul className="space-y-2.5">
                  {["Verified teacher profile","School network access","Salary tracking tools","Dedicated support team"].map(text => (
                    <li key={text} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0cab47] shrink-0" />{text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="flex-1">
            <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden">

              {/* Form header */}
              <div className="px-4 sm:px-6 py-3.5 border-b-2 border-slate-200"
                style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>
                    {currentStep === 1 && <User className="text-white h-5 w-5" />}
                    {currentStep === 2 && <GraduationCap className="text-white h-5 w-5" />}
                    {currentStep === 3 && <Briefcase className="text-white h-5 w-5" />}
                    {currentStep === 4 && <ClipboardCheck className="text-white h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Step {currentStep} of 4
                    </p>
                    <h2 className="text-base font-extrabold text-slate-800">
                      {currentStep === 1 && "Personal Information"}
                      {currentStep === 2 && "Professional Details"}
                      {currentStep === 3 && "Employment Details"}
                      {currentStep === 4 && "Review & Pay"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-5">

                {/* ── STEP 1 ── */}
                {currentStep === 1 && (
                  <div className="space-y-4">

                    {/* DigiLocker connect / verified banner */}
                    {digiStatus === "completed" && digiData ? (
                      <div className="rounded-[10px] border-2 border-green-300 px-4 py-3 flex items-center gap-3 mb-1"
                        style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                        <div className="w-9 h-9 rounded-[8px] bg-green-500 flex items-center justify-center flex-shrink-0">
                          <Shield className="text-white h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-green-800 text-sm">DigiLocker Verified — Fields Auto-filled</p>
                          <p className="text-green-600 text-xs">Aadhaar details are locked below. You may edit unlocked fields.</p>
                        </div>
                        {digiData.panLocalPdf && (
                          <button onClick={() => viewPdf(digiData.panLocalPdf, "PAN")}
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-xs font-bold border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100">
                            <FaExternalLinkAlt className="text-[10px]" /> PAN PDF
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

                    {/* All DigiLocker fields are locked until DigiLocker is completed.
                        isDigiLocked = true  → field is read-only (pre-verify or post-verify with value)
                        isDigiLocked = false → only possible after digiStatus === "completed"         */}
                    {(() => {
                      const isDigiLocked = digiStatus !== "completed";
                      const digiClass    = isDigiLocked
                        ? "w-full px-3 py-2.5 rounded-[8px] border text-sm font-medium outline-none border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed select-none"
                        : inpLocked;
                      return (
                        <>

                    {/* Full Name */}
                    <div>
                      {fieldLbl("Full Name", !isDigiLocked)}
                      <input type="text" name="full_name" placeholder={isDigiLocked ? "Connect DigiLocker to fill" : "Enter your full name"}
                        value={formData.full_name} onChange={handleInputChange}
                        {...lockProps(true)}
                        className={isDigiLocked ? digiClass : (autoFilled.full_name ? inpLocked : inp(errors.full_name))} />
                      {errMsg(errors.full_name)}
                    </div>

                    {/* DOB + Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        {fieldLbl("Date of Birth", !isDigiLocked)}
                        <input type="date" name="dob" value={formData.dob}
                          onChange={handleInputChange}
                          {...lockProps(true)}
                          max={new Date().toISOString().split("T")[0]}
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

                    {/* Phone + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        {fieldLbl("Phone Number", !isDigiLocked)}
                        <input type="tel" name="phone" placeholder={isDigiLocked ? "Connect DigiLocker to fill" : "10-digit mobile number"}
                          value={formData.phone} onChange={handleInputChange} maxLength={10}
                          {...lockProps(true)}
                          className={isDigiLocked ? digiClass : (autoFilled.phone ? inpLocked : inp(errors.phone))} />
                        {errMsg(errors.phone)}
                      </div>

                      {/* Email with silent async check + OTP */}
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
                            isEmailVerified
                              ? inpLocked
                              : emailStatus === "blocked"
                              ? "w-full px-3 py-2.5 rounded-[8px] border text-sm font-medium outline-none border-red-400 bg-red-50 text-red-900 placeholder-red-300"
                              : inp(errors.email)
                          }
                        />

                        {/* Blocked */}
                        {emailStatus === "blocked" && (
                          <div className="mt-2 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 flex items-start gap-2">
                            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700 font-medium">{emailBlockReason}</p>
                          </div>
                        )}

                        {/* Waitlist pre-verified — label badge handles this */}

                        {/* New email — send OTP */}
                        {emailStatus === "new_email" && (
                          <div className="mt-2 rounded-[8px] border border-blue-200 bg-blue-50 px-3 py-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <Mail className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                              <p className="text-xs text-blue-800 font-medium truncate">
                                Verify your email via OTP
                              </p>
                            </div>
                            <button type="button" onClick={handleSendOtp} disabled={otpLoading}
                              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                              style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>
                              {otpLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Send OTP"}
                            </button>
                          </div>
                        )}

                        {/* OTP input */}
                        {emailStatus === "otp_sent" && (
                          <div className="mt-2 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-3 space-y-2">
                            <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5" />
                              OTP sent. Enter the 6-digit code:
                            </p>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <input type="text" placeholder="000000"
                                  value={otpValue}
                                  onChange={e => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                  maxLength={6}
                                  className="flex-1 min-w-0 px-3 py-2 rounded-[6px] border border-amber-300 bg-white text-sm font-mono font-bold text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 tracking-[0.3em]"
                                />
                                <button type="button" onClick={handleVerifyOtp}
                                  disabled={otpLoading || otpValue.length !== 6}
                                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                                  style={{ background: "linear-gradient(135deg,#0cab47,#08d451)" }}>
                                  {otpLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Verify OTP"}
                                </button>
                              </div>
                              <button type="button" onClick={handleSendOtp} disabled={otpLoading}
                                className="self-start text-xs text-slate-500 hover:text-[#00468E] font-medium underline disabled:opacity-50 transition-colors">
                                Didn&apos;t receive it? Resend OTP
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Verified — no extra banner; the "Verified" badge on the label is sufficient */}

                        {(errors.email || errors.email_verify) && emailStatus !== "blocked" && (
                          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            {errors.email || errors.email_verify}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      {fieldLbl("Residential Address", !isDigiLocked)}
                      <textarea name="address" placeholder={isDigiLocked ? "Connect DigiLocker to fill" : "Enter your complete residential address"}
                        rows={2} value={formData.address} onChange={handleInputChange}
                        {...lockProps(true)}
                        className={`${isDigiLocked ? digiClass : (autoFilled.address ? inpLocked : inp(errors.address))} resize-none`} />
                      {errMsg(errors.address)}
                    </div>

                    {/* State + PIN */}
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
                        <input type="text" name="pincode" placeholder={isDigiLocked ? "Connect DigiLocker to fill" : "6-digit PIN code"}
                          value={formData.pincode} onChange={handleInputChange} maxLength={6}
                          {...lockProps(true)}
                          className={isDigiLocked ? digiClass : (autoFilled.pincode ? inpLocked : inp())} />
                      </div>
                    </div>

                        </>
                      );
                    })()}

                    {/* Aadhaar display */}
                    {digiStatus === "completed" && digiData?.maskedAadhaar && (
                      <div className="bg-blue-50 rounded-[8px] border border-blue-200 p-3">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Aadhaar (Verified)</p>
                        <p className="font-mono font-bold text-slate-800 text-sm flex items-center">
                          {showAadhaarPill ? digiData.maskedAadhaar : maskAadhaar(digiData.maskedAadhaar)}
                          <MaskToggle show={showAadhaarPill} onToggle={() => setShowAadhaarPill(v => !v)} />
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Fetched from DigiLocker · Read-only</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 2 ── */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">Your educational qualifications and teaching expertise.</p>
                    <div>
                      <label className={lbl}>Highest Qualification <span className="text-red-500 normal-case">*</span></label>
                      <select name="qualification" value={formData.qualification} onChange={handleInputChange} className={inp(errors.qualification)}>
                        <option value="">Select Qualification</option>
                        {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>{errMsg(errors.qualification)}
                    </div>
                    {formData.qualification === "Other" && (
                      <div>
                        <label className={lbl}>Specify Qualification <span className="text-red-500 normal-case">*</span></label>
                        <input type="text" name="otherQualification" placeholder="Please specify"
                          value={formData.otherQualification} onChange={handleInputChange}
                          className={inp(errors.otherQualification)} />
                        {errMsg(errors.otherQualification)}
                      </div>
                    )}
                    <div>
                      <label className={lbl}>Subject Specialization <span className="text-red-500 normal-case">*</span></label>
                      <select name="subject" value={formData.subject} onChange={handleInputChange} className={inp(errors.subject)}>
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>{errMsg(errors.subject)}
                    </div>
                    {formData.subject === "Other" && (
                      <div>
                        <label className={lbl}>Specify Subject <span className="text-red-500 normal-case">*</span></label>
                        <input type="text" name="otherSubject" placeholder="Please specify"
                          value={formData.otherSubject} onChange={handleInputChange}
                          className={inp(errors.otherSubject)} />
                        {errMsg(errors.otherSubject)}
                      </div>
                    )}
                    <div>
                      <label className={lbl}>Teaching Experience <span className="text-red-500 normal-case">*</span></label>
                      <select name="experience" value={formData.experience} onChange={handleInputChange} className={inp(errors.experience)}>
                        <option value="">Select Experience</option>
                        {experienceYears.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>{errMsg(errors.experience)}
                    </div>
                    <div className="rounded-[10px] border border-blue-200 bg-blue-50 p-3.5 flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600">
                        <strong className="text-blue-700">Note:</strong> Your professional details help us match you with the right school opportunities.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── STEP 3 ── */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">Current or most recent employment details.</p>
                    <div>
                      <label className={lbl}>School Name <span className="text-red-500 normal-case">*</span></label>
                      <input type="text" name="school_name" placeholder="Enter your school name"
                        value={formData.school_name} onChange={handleInputChange}
                        className={inp(errors.school_name)} />{errMsg(errors.school_name)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className={lbl}>Employee ID <span className="text-red-500 normal-case">*</span></label>
                        <input type="text" name="employee_id" placeholder="Your employee ID"
                          value={formData.employee_id} onChange={handleInputChange}
                          className={inp(errors.employee_id)} />{errMsg(errors.employee_id)}
                      </div>
                      <div>
                        <label className={lbl}>Employment Type <span className="text-red-500 normal-case">*</span></label>
                        <select name="employment_type" value={formData.employment_type} onChange={handleInputChange} className={inp(errors.employment_type)}>
                          <option value="">Select Type</option>
                          <option value="Permanent">Permanent</option>
                          <option value="Contract">Contract</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Guest Faculty">Guest Faculty</option>
                        </select>{errMsg(errors.employment_type)}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className={lbl}>Monthly Salary (Rs.) <span className="text-red-500 normal-case">*</span></label>
                        <input type="number" name="salary_monthly" placeholder="Monthly salary in rupees"
                          value={formData.salary_monthly} onChange={handleInputChange}
                          className={inp(errors.salary_monthly)} />{errMsg(errors.salary_monthly)}
                      </div>
                      <div>
                        <label className={lbl}>Joining Date <span className="text-red-500 normal-case">*</span></label>
                        <input type="date" name="joining_date" value={formData.joining_date}
                          onChange={handleInputChange}
                          max={new Date().toISOString().split("T")[0]}
                          className={inp(errors.joining_date)} />{errMsg(errors.joining_date)}
                      </div>
                    </div>
                    <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-3.5 flex items-start gap-2.5">
                      <FaLock className="text-amber-500 text-xs shrink-0 mt-1" />
                      <p className="text-xs text-slate-600">
                        <strong className="text-amber-700">Privacy:</strong> Employment and salary info is kept strictly confidential.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Review ── */}
                {currentStep === 4 && (
                  <div className="space-y-3.5">
                    <p className="text-sm text-slate-500">
                      Review all details carefully before completing your Rs.111 registration payment.
                    </p>

                    {/* KYC summary */}
                    {digiStatus === "completed" && digiData && (
                      <div className="rounded-[10px] overflow-hidden border-2 border-green-200">
                        <div className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-green-200"
                          style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                          <Shield className="text-green-600 h-4 w-4" />
                          <span className="font-bold text-green-800 text-sm">DigiLocker KYC Verified</span>
                          <span className="ml-auto text-[10px] font-bold text-green-700 bg-green-100 border border-green-300 px-2 py-0.5 rounded-[5px]">Verified</span>
                        </div>
                        <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {([
                            ["Name",   digiData.fullName],
                            ["DOB",    digiData.dob],
                            ["Mobile", digiData.mobileNumber],
                            ["Gender", digiData.gender === "M" ? "Male" : digiData.gender === "F" ? "Female" : digiData.gender],
                          ] as [string, string | null][]).filter(([, v]) => v).map(([l, v]) => (
                            <div key={l} className="bg-green-50 rounded-[8px] p-2.5 border border-green-100">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{l}</p>
                              <p className="font-semibold text-slate-800 text-xs break-all">{v}</p>
                            </div>
                          ))}
                          {digiData.maskedAadhaar && (
                            <div className="bg-green-50 rounded-[8px] p-2.5 border border-green-100">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Aadhaar</p>
                              <p className="font-semibold text-slate-800 text-xs font-mono flex items-center">
                                {showAadhaarPill ? digiData.maskedAadhaar : maskAadhaar(digiData.maskedAadhaar)}
                                <MaskToggle show={showAadhaarPill} onToggle={() => setShowAadhaarPill(v => !v)} />
                              </p>
                            </div>
                          )}
                        </div>
                        {digiData.panLocalPdf && (
                          <div className="px-3 pb-3">
                            <button onClick={() => viewPdf(digiData.panLocalPdf, "PAN")}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-xs font-bold border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100">
                              <FaExternalLinkAlt className="text-[10px]" /> View PAN PDF
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Personal info */}
                    <div className="rounded-[10px] overflow-hidden border-2 border-slate-200">
                      <div className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-slate-200"
                        style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)" }}>
                        <User className="text-[#00468E] h-4 w-4" />
                        <span className="font-bold text-slate-700 text-sm">Personal Information</span>
                      </div>
                      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {([
                          ["Name",     formData.full_name],
                          ["DOB",      formData.dob],
                          ["Gender",   formData.gender],
                          ["Phone",    formData.phone],
                          ["Email",    formData.email],
                          ["State",    formData.state],
                          ["PIN Code", formData.pincode],
                        ] as [string, string][]).filter(([, v]) => v).map(([l, v]) => (
                          <div key={l} className="bg-slate-50 rounded-[8px] p-2.5 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{l}</p>
                            <p className="font-semibold text-slate-800 text-xs break-all">{v}</p>
                          </div>
                        ))}
                        {formData.address && (
                          <div className="col-span-2 sm:col-span-3 bg-slate-50 rounded-[8px] p-2.5 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Address</p>
                            <p className="font-semibold text-slate-800 text-xs">{formData.address}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Professional */}
                    <div className="rounded-[10px] overflow-hidden border-2 border-slate-200">
                      <div className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-slate-200"
                        style={{ background: "linear-gradient(135deg,#f0f4ff,#e8eeff)" }}>
                        <GraduationCap className="text-[#00468E] h-4 w-4" />
                        <span className="font-bold text-slate-700 text-sm">Professional Details</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {([
                          ["Qualification", formData.qualification === "Other" ? formData.otherQualification : formData.qualification],
                          ["Subject",       formData.subject === "Other" ? formData.otherSubject : formData.subject],
                          ["Experience",    formData.experience],
                        ] as [string, string][]).filter(([, v]) => v).map(([l, v]) => (
                          <div key={l} className="bg-slate-50 rounded-[8px] p-2.5 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{l}</p>
                            <p className="font-semibold text-slate-800 text-xs">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Employment */}
                    <div className="rounded-[10px] overflow-hidden border-2 border-slate-200">
                      <div className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-slate-200"
                        style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                        <Briefcase className="text-[#0cab47] h-4 w-4" />
                        <span className="font-bold text-slate-700 text-sm">Employment Details</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {([
                          ["School",       formData.school_name],
                          ["Employee ID",  formData.employee_id],
                          ["Type",         formData.employment_type],
                          ["Salary/Month", formData.salary_monthly ? `Rs.${Number(formData.salary_monthly).toLocaleString()}` : ""],
                          ["Joining Date", formData.joining_date],
                        ] as [string, string][]).filter(([, v]) => v).map(([l, v]) => (
                          <div key={l} className="bg-slate-50 rounded-[8px] p-2.5 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{l}</p>
                            <p className="font-semibold text-slate-800 text-xs">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-[10px] p-5 text-white"
                      style={{ background: "linear-gradient(135deg,#00305F,#00468E)" }}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Registration Fee</p>
                          <p className="text-4xl font-extrabold">Rs.111</p>
                          <p className="text-blue-200 text-xs mt-1 flex items-center gap-1">
                            <FaLock className="text-[10px]" /> One-time · Secured by Razorpay
                          </p>
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-[10px] px-4 py-3">
                          <p className="text-blue-200 text-[11px] font-semibold mb-1">What you get:</p>
                          <ul className="space-y-1">
                            {["Verified teacher profile","School network access","Review 3-5 days","Dedicated support"].map(item => (
                              <li key={item} className="flex items-center gap-1.5 text-[11px] text-white/80">
                                <CheckCircle2 className="h-3 w-3 text-green-400 shrink-0" />{item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3.5 cursor-pointer p-4 rounded-[10px] border-2 transition-all duration-200"
                      style={{ borderColor: agreed ? "#00468E" : "#cbd5e1", background: agreed ? "#00468E08" : "#f8fafc" }}>
                      <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreed ? "border-[#00468E] bg-[#00468E]" : "border-slate-300 bg-white"}`}>
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

                {/* Navigation buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-5 pt-4 border-t-2 border-slate-200">
                  <button onClick={handlePrevious} disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-[10px] font-bold text-sm transition-all flex items-center gap-2 ${currentStep === 1 ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200" : "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 border border-slate-300"}`}>
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
                      className={`px-8 py-3 rounded-[10px] font-bold text-sm transition-all flex items-center gap-2 ${agreed && !isPaymentProcessing && !isSubmitting ? "text-white active:scale-95" : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"}`}
                      style={agreed && !isPaymentProcessing && !isSubmitting ? { background: "linear-gradient(135deg,#0cab47,#08d451)" } : {}}>
                      {isPaymentProcessing ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
                      ) : isSubmitting ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                      ) : (
                        <><FaLock className="text-xs" />Pay Rs.111 &amp; Submit</>
                      )}
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Mobile trust bar */}
            <div className="lg:hidden mt-4 bg-white rounded-[10px] border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {["Verified Profile","School Network","Salary Tracking","Support Team"].map(item => (
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