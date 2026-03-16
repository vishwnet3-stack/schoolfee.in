"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft, LayoutDashboard, Mail, User, Phone, ChevronDown } from "lucide-react";
import Link from "next/link";

const ROLES = [
  { value: "parent", label: "Parent" },
  { value: "teacher", label: "Teacher" },
  { value: "school", label: "School / Institution" },
];

type Step = "form" | "otp" | "success";

export default function JoinWaitlistPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    otp: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
    if (field === "email") {
      setEmailVerified(false);
      setOtpSent(false);
      setOtpValue("");
    }
  };

  const validate = () => {
    const e = { fullName: "", email: "", phone: "", role: "", otp: "" };
    let ok = true;
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      e.fullName = "Full name must be at least 2 characters"; ok = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = "Please enter a valid email address"; ok = false;
    }
    if (!emailVerified) {
      e.email = "Please verify your email with OTP"; ok = false;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      e.phone = "Enter a valid 10-digit phone number"; ok = false;
    }
    if (!formData.role) {
      e.role = "Please select how you are joining"; ok = false;
    }
    setErrors(e);
    return ok;
  };

  const sendOTP = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((p) => ({ ...p, email: "Please enter a valid email first" }));
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/waitlist/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setStep("otp");
        toast.success("OTP sent!", { description: `Check your inbox at ${formData.email}` });
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpValue || otpValue.length !== 6) {
      setErrors((p) => ({ ...p, otp: "Please enter the 6-digit OTP" }));
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/waitlist/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailVerified(true);
        setStep("form");
        toast.success("Email verified!", { description: "Your email has been confirmed." });
      } else {
        setErrors((p) => ({ ...p, otp: data.error || "Invalid OTP" }));
        toast.error(data.error || "Invalid OTP");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before continuing");
      return;
    }
    setIsLoading(true);
    const loadId = toast.loading("Joining waitlist...", { description: "Please wait a moment." });
    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      toast.dismiss(loadId);
      if (res.ok && data.success) {
        setStep("success");
        toast.success("Welcome to the waitlist! 🎉", { description: "Check your email for confirmation.", duration: 5000 });
      } else if (res.status === 409) {
        toast.error("Already on waitlist", { description: "This email is already registered." });
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.dismiss(loadId);
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── SUCCESS SCREEN ───────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="flex items-center justify-center lg:py-6 p-2 sm:p-3 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] min-h-[60vh]">
        <Card className="w-full max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-2xl p-0 overflow-hidden">
          <div className="grid grid-cols-1">
            <div className="flex flex-col items-center p-8 sm:p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <img src="https://schoolfee.in/logo/schoolfee%20logo.webp" alt="Schoolfee Logo" className="h-9 object-contain mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">You're on the Waitlist!</h2>
              <p className="text-slate-500 text-sm mb-2">
                Thank you, <span className="font-semibold text-slate-700">{formData.fullName}</span>! Your registration as a{" "}
                <span className="capitalize font-semibold text-[#00468E]">{formData.role}</span> has been confirmed.
              </p>
              <p className="text-slate-400 text-xs mb-6">
                A confirmation email has been sent to <span className="text-[#00468E] font-medium">{formData.email}</span> with your dashboard link.
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 w-full mb-6 text-left">
                <p className="text-[#00468E] font-semibold text-sm mb-1 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Your Dashboard
                </p>
                <p className="text-xs text-slate-500">
                  Once approved, you can log in at:{" "}
                  <a href="/dashboard/admin/login" className="text-[#00468E] font-medium underline underline-offset-2">
                    schoolfee.in/dashboard/admin/login
                  </a>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full border-slate-300 text-slate-600 rounded-full">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                  </Button>
                </Link>
                <Link href="/dashboard/admin/login" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-[#00468E] to-[#0056b3] text-white rounded-full">
                    <LayoutDashboard className="w-4 h-4 mr-1" /> Go to Dashboard
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-slate-400 mt-6">Initiative of Community Health Mission</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ── OTP VERIFICATION SCREEN ──────────────────────────────────────────────
  if (step === "otp") {
    return (
      <div className="flex items-end justify-center lg:py-6 p-2 sm:p-3 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <Card className="w-full max-w-6xl bg-white rounded-xl sm:rounded-2xl shadow-2xl py-0 lg:px-2 lg:pt-4 overflow-hidden relative z-10 border-1 border-gray overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="hidden md:flex bg-gradient-to-br from-slate-50 to-blue-50 items-center justify-center p-2 lg:p-0 relative overflow-hidden" style={{ marginBottom: "-25px !important" }}>
              <img src="/landing-page/education-continuity.jpg" alt="Education" className="rounded-xl object-contain" style={{ marginBottom: "-25px !important" }} />
            </div>
            <div className="flex flex-col p-4 sm:p-5 md:p-7">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <img src="https://schoolfee.in/logo/schoolfee%20logo.webp" alt="Schoolfee Logo" className="h-10 object-contain" />
                <button onClick={() => setStep("form")} className="text-xs sm:text-sm font-semibold text-[#00468E] border border-[#00468E]/30 hover:border-[#00468E] hover:bg-[#00468E]/5 px-2.5 sm:px-3 py-1.5 rounded-lg transition">
                  ← Back
                </button>
              </div>
              <div className="mb-3 sm:mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <Mail className="w-6 h-6 text-[#00468E]" />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-1">Verify Your Email</h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  We sent a 6-digit OTP to <span className="font-semibold text-slate-700">{formData.email}</span>
                </p>
              </div>
              <div className="space-y-4 mb-4">
                <div>
                  <Label htmlFor="otp" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => { setOtpValue(e.target.value.replace(/\D/g, "")); setErrors((p) => ({ ...p, otp: "" })); }}
                    placeholder="000000"
                    disabled={isLoading}
                    className={`text-2xl tracking-[0.5em] text-center font-bold ${errors.otp ? "border-red-500" : ""}`}
                  />
                  {errors.otp && <p className="text-xs text-red-500 mt-1">{errors.otp}</p>}
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Didn't receive it?{" "}
                  <button type="button" onClick={sendOTP} disabled={isLoading} className="text-[#00468E] font-semibold hover:underline disabled:opacity-50">
                    Resend OTP
                  </button>
                </p>
              </div>
              <Button
                onClick={verifyOTP}
                disabled={isLoading || otpValue.length !== 6}
                className="w-full bg-gradient-to-r from-[#00468E] to-[#0056b3] hover:from-[#003870] hover:to-[#00468E] text-white font-semibold py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 mb-4 text-sm sm:text-base disabled:opacity-60"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
              <div className="mt-auto">
                <p className="text-xs text-center text-slate-500">Initiative of Community Health Mission</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ── MAIN FORM ────────────────────────────────────────────────────────────
  return (
    <div className="flex items-end justify-center lg:py-6 p-2 sm:p-3 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <Card className="w-full max-w-6xl bg-white rounded-xl sm:rounded-2xl shadow-2xl py-0 lg:px-2 lg:pt-4 overflow-hidden relative z-10 border-1 border-gray overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:flex bg-gradient-to-br from-slate-50 to-blue-50 items-center justify-center p-2 lg:p-0 relative overflow-hidden" style={{ marginBottom: "-25px !important" }}>
            <img src="/landing-page/education-continuity.jpg" alt="Education" className="rounded-xl object-contain" style={{ marginBottom: "-25px !important" }} />
          </div>

          <div className="flex flex-col p-4 sm:p-5 md:p-7">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <img src="https://schoolfee.in/logo/schoolfee%20logo.webp" alt="Schoolfee Logo" className="h-10 object-contain" />
              <Link href="/" className="text-xs sm:text-sm font-semibold text-[#00468E] border border-[#00468E]/30 hover:border-[#00468E] hover:bg-[#00468E]/5 px-2.5 sm:px-3 py-1.5 rounded-lg transition">
                ← Home
              </Link>
            </div>

            <div className="mb-3 sm:mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-1">Join the Waitlist</h1>
              <p className="text-xs sm:text-sm text-slate-500">Be the first to access your personalized Schoolfee dashboard</p>
            </div>

            <div className="space-y-3 mb-4">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  <User className="inline w-3.5 h-3.5 mr-1 text-slate-400" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  className={errors.fullName ? "border-red-500 focus-visible:ring-red-300" : ""}
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Email + OTP */}
              <div>
                <Label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  <Mail className="inline w-3.5 h-3.5 mr-1 text-slate-400" />
                  Email Address
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    disabled={isLoading || emailVerified}
                    className={`flex-1 ${errors.email ? "border-red-500 focus-visible:ring-red-300" : emailVerified ? "border-green-500" : ""}`}
                  />
                  <Button
                    type="button"
                    onClick={sendOTP}
                    disabled={isLoading || emailVerified || !formData.email}
                    variant="outline"
                    className={`shrink-0 text-xs px-3 ${emailVerified ? "border-green-500 text-green-600" : "border-[#00468E] text-[#00468E]"}`}
                  >
                    {emailVerified ? "✓ Verified" : otpSent ? "Resend" : "Send OTP"}
                  </Button>
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                {emailVerified && <p className="text-xs text-green-600 mt-1">✓ Email verified successfully</p>}
                {otpSent && !emailVerified && (
                  <button type="button" onClick={() => setStep("otp")} className="text-xs text-[#00468E] font-semibold mt-1 hover:underline">
                    Enter OTP →
                  </button>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  <Phone className="inline w-3.5 h-3.5 mr-1 text-slate-400" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                  disabled={isLoading}
                  className={errors.phone ? "border-red-500 focus-visible:ring-red-300" : ""}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Join As
                </Label>
                <div className="relative">
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    disabled={isLoading}
                    className={`w-full h-10 px-3 pr-10 rounded-md border bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#00468E]/30 focus:border-[#00468E] ${errors.role ? "border-red-500" : "border-input"}`}
                  >
                    <option value="">Select your role</option>
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#00468E] to-[#0056b3] hover:from-[#003870] hover:to-[#00468E] text-white font-semibold py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 mb-4 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Join Waitlist"}
            </Button>

            <div className="mt-auto">
              <p className="text-xs text-center text-slate-500">Initiative of Community Health Mission</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}