"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, KeyRound, Shield, ArrowRight } from "lucide-react";

type LoginStep = "email" | "otp";

export default function AdminLoginPage() {
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  const sendOTP = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin-auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep("otp");
        toast.success("OTP sent to your email");
      } else if (res.status === 404) {
        toast.error("No account found with this email");
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
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }
    setOtpError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin-auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const role = data.user?.role || "parent";
        toast.success(`Welcome, ${data.user?.name || "User"}!`, { duration: 1500 });

        // Determine destination
        let dest = "/dashboard/admin/parent";
        if (role === "teacher") dest = "/dashboard/admin/teacher";
        else if (role === "school") dest = "/dashboard/admin/school";

        // Use window.location.href for a hard navigation so the page fully
        // re-loads with the fresh session cookie — this guarantees the
        // AdminAuthContext picks up the user without needing a manual refresh.
        setTimeout(() => {
          window.location.href = dest;
        }, 300);
      } else {
        setOtpError(data.error || "Invalid OTP");
        toast.error(data.error || "Invalid OTP");
        setIsLoading(false);
      }
    } catch {
      toast.error("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  const features = [
    { title: "Track Fee Payments", desc: "Monitor all school fee transactions powered by Schoolfee CarePay in real-time." },
    { title: "CarePay Credit", desc: "Access interest-free school fee credit — pay when you're ready, stress-free." },
    { title: "School Coordination", desc: "View school communications, fee structures, and enrollment details anytime." },
    { title: "Secure & Private", desc: "Your data is protected with bank-grade encryption and OTP-only access." },
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#060f1e]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col bg-gradient-to-br from-[#001f4d] via-[#00468E] to-[#0058b4]">
        {/* Background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/3 -right-20 w-64 h-64 bg-[#F4951D]/10 rounded-full" />
          <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-white/5 rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="bg-white rounded-xl px-4 py-2 w-fit">
            <img
              src="https://schoolfee.in/logo/schoolfee%20logo.webp"
              alt="Schoolfee"
              className="h-9 w-auto object-contain"
            />
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center mt-16">
            <p className="text-[#F4951D] text-sm font-semibold tracking-wider uppercase mb-3">
              Dashboard Access
            </p>
            <h1 className="text-4xl xl:text-4xl font-bold text-white leading-tight">
              Manage your school fee journey
            </h1>
            <p className="text-white/65 text-lg mt-5 leading-relaxed max-w-md">
              Access your personalized dashboard to track payments, monitor CarePay credit, and stay on top of your child's education fees.
            </p>

            {/* Feature list */}
            <div className="grid grid-cols-1 gap-4 mt-10">
              {features.map(f => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F4951D] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{f.title}</p>
                    <p className="text-white/55 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-white/30 text-xs mt-8">
            © 2025 Schoolfee.in — Initiative of Community Health Mission
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 bg-white dark:bg-[#060f1e]">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <div className="bg-white dark:bg-[#0d1f3c] border border-gray-200 dark:border-[#00468E]/30 rounded-xl px-4 py-2 shadow-sm">
            <img
              src="https://schoolfee.in/logo/schoolfee%20logo.webp"
              alt="Schoolfee"
              className="h-9 w-auto object-contain"
            />
          </div>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {step === "email" ? "Sign in to your account" : "Verify your email"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
              {step === "email"
                ? "Enter your registered email address to continue"
                : `We've sent a 6-digit code to ${email}`}
            </p>
          </div>

          {step === "email" ? (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                    onKeyDown={e => e.key === "Enter" && sendOTP()}
                    disabled={isLoading}
                    className={`pl-10 h-11 ${emailError ? "border-red-500" : "border-gray-200 dark:border-[#00468E]/40"} focus:border-[#00468E] dark:bg-[#0d1f3c] dark:text-white`}
                    autoFocus
                  />
                </div>
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>

              <Button
                onClick={sendOTP}
                disabled={isLoading || !email}
                className="w-full h-11 bg-[#00468E] hover:bg-[#003570] text-white font-semibold rounded-xl gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending code...
                  </>
                ) : (
                  <>Continue <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Don't have an account?{" "}
                  <a href="https://schoolfee.in" className="text-[#00468E] font-medium hover:underline">
                    Visit Schoolfee.in
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Email display */}
              <div className="bg-blue-50 dark:bg-[#00468E]/10 border border-blue-100 dark:border-[#00468E]/20 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00468E]/10 dark:bg-[#00468E]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#00468E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Code sent to</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{email}</p>
                </div>
                <button
                  onClick={() => { setStep("email"); setOtp(""); setOtpError(""); }}
                  className="text-xs text-[#00468E] font-semibold hover:underline shrink-0"
                >
                  Change
                </button>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Verification Code
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                    onKeyDown={e => e.key === "Enter" && verifyOTP()}
                    disabled={isLoading}
                    className={`pl-10 h-11 text-xl tracking-[0.4em] font-bold ${otpError ? "border-red-500" : "border-gray-200 dark:border-[#00468E]/40"} focus:border-[#00468E] dark:bg-[#0d1f3c] dark:text-white`}
                    autoFocus
                  />
                </div>
                {otpError
                  ? <p className="text-xs text-red-500">{otpError}</p>
                  : <p className="text-xs text-gray-400">Code is valid for 10 minutes</p>
                }
              </div>

              <Button
                onClick={verifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full h-11 bg-[#00468E] hover:bg-[#003570] text-white font-semibold rounded-xl gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <><Shield className="h-4 w-4" /> Sign in securely</>
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={sendOTP}
                  disabled={isLoading}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#00468E] disabled:opacity-50"
                >
                  Didn't receive a code?{" "}
                  <span className="text-[#00468E] font-semibold">Resend</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-[#00468E]/10 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              For support contact{" "}
              <a href="mailto:support@schoolfee.in" className="text-[#00468E] hover:underline">
                support@schoolfee.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}   