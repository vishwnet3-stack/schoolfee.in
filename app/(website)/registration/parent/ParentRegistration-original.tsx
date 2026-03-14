"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaUserTie, FaChild, FaMoneyBillWave, FaCheckCircle, FaIdCard, FaShieldAlt, FaLock } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { useAuthSession } from "@/hooks/useAuthSession";

declare global {
  interface Window { Razorpay: any; }
}

const RAZORPAY_KEY_ID = "rzp_test_SNWMyYGGnFaJ0I";

const indianStates = [
  "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
  "Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Ladakh",
  "Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];

const emptyChild = () => ({
  fullName: "", classGrade: "", admissionNumber: "",
  schoolName: "", schoolCity: "", apaarId: "", hasApaarId: "",
});

type FormData = {
  firstName: string; lastName: string; email: string; phone: string;
  panNumber: string; address: string; city: string; state: string;
  numberOfChildren: number;
  children: ReturnType<typeof emptyChild>[];
  feeAmount: string; feePeriod: string; reasonForSupport: string;
  otherReason: string; description: string; repaymentDuration: string;
};

export default function ParentRegistrationPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "", panNumber: "",
    address: "", city: "", state: "",
    numberOfChildren: 0,
    children: Array.from({ length: 5 }, emptyChild),
    feeAmount: "", feePeriod: "", reasonForSupport: "",
    otherReason: "", description: "", repaymentDuration: "",
  });

  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00305F 0%, #00468E 50%, #0058B4 100%)" }}>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-sm font-medium tracking-wide">Loading…</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    childIndex?: number
  ) => {
    const { name, value } = e.target;
    if (childIndex !== undefined) {
      const newChildren = [...formData.children];
      newChildren[childIndex] = { ...newChildren[childIndex], [name]: value };
      setFormData(prev => ({ ...prev, children: newChildren }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email is required";
    if (!formData.phone.match(/^\d{10}$/)) e.phone = "Valid 10-digit phone number is required";
    if (!validatePAN(formData.panNumber)) e.panNumber = "Valid PAN required (e.g. ABCDE1234F)";
    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.city.trim()) e.city = "City is required";
    if (!formData.state) e.state = "State is required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (formData.numberOfChildren === 0) { e.numberOfChildren = "Please select number of children"; setErrors(e); return false; }
    for (let i = 0; i < formData.numberOfChildren; i++) {
      const c = formData.children[i];
      if (!c.fullName.trim()) e[`child${i}Name`] = "Child name is required";
      if (!c.classGrade.trim()) e[`child${i}Grade`] = "Class/Grade is required";
      if (!c.admissionNumber.trim()) e[`child${i}Admission`] = "Admission number is required";
      if (!c.schoolName.trim()) e[`child${i}School`] = "School name is required";
      if (!c.schoolCity.trim()) e[`child${i}City`] = "School city is required";
      if (!c.hasApaarId) e[`child${i}HasApaar`] = "Please select Apaar ID option";
      if (c.hasApaarId === "yes" && !c.apaarId.trim()) e[`child${i}ApaarId`] = "Apaar ID is required";
    }
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!formData.feeAmount || parseFloat(formData.feeAmount) <= 0) e.feeAmount = "Valid fee amount is required";
    if (!formData.feePeriod) e.feePeriod = "Fee period is required";
    if (!formData.reasonForSupport) e.reasonForSupport = "Reason for support is required";
    if (formData.reasonForSupport === "other" && !formData.otherReason.trim()) e.otherReason = "Please specify other reason";
    if (!formData.description.trim()) e.description = "Description is required";
    if (!formData.repaymentDuration) e.repaymentDuration = "Repayment duration is required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    let valid = false;
    if (currentStep === 1) valid = validateStep1();
    if (currentStep === 2) valid = validateStep2();
    if (currentStep === 3) valid = validateStep3();
    if (valid) { setCurrentStep(p => p + 1); setErrors({}); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const handlePrevious = () => {
    setCurrentStep(p => p - 1); setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentAndSubmit = async () => {
    if (!agreed) { toast.error("Please agree to the terms before submitting"); return; }
    setIsPaymentProcessing(true);
    try {
      const orderRes = await fetch("/api/public/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, name: `${formData.firstName} ${formData.lastName}` }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || "Order creation failed");
      const { order } = orderData;
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Schoolfee.org",
        description: "Parent Registration Fee — ₹11",
        order_id: order.id,
        prefill: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, contact: formData.phone },
        theme: { color: "#00468E" },
        handler: async (response: any) => {
          setIsPaymentProcessing(false);
          setIsSubmitting(true);
          try {
            const verifyRes = await fetch("/api/public/razorpay-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, formData, publicUserId: user?.id || null }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.error || "Verification failed");
            toast.success("Application submitted! Check your email for confirmation.");
            setCurrentStep(5);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (err: any) {
            toast.error(err.message || "Submission failed after payment. Contact support.");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: { ondismiss: () => { setIsPaymentProcessing(false); toast.info("Payment cancelled. Your form data is saved."); } },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => { setIsPaymentProcessing(false); toast.error(`Payment failed: ${response.error.description}`); });
      rzp.open();
    } catch (err: any) {
      setIsPaymentProcessing(false);
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  const steps = [
    { number: 1, title: "Parent Info", shortTitle: "Parent", icon: FaUserTie },
    { number: 2, title: "Children", shortTitle: "Children", icon: FaChild },
    { number: 3, title: "Support Details", shortTitle: "Support", icon: FaMoneyBillWave },
    { number: 4, title: "Review & Pay", shortTitle: "Pay", icon: FaCheckCircle },
  ];

  // Input styling helpers — no shadows, consistent radius, clear borders
  const inp = (err?: string) =>
    `w-full px-4 py-3 text-sm font-medium transition-all duration-200 outline-none`
    + ` rounded-[10px] border`
    + (err
      ? " border-red-400 bg-red-50 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-200"
      : " border-slate-300 bg-white text-slate-800 placeholder-slate-400 hover:border-[#00468E]/50 focus:border-[#00468E] focus:ring-2 focus:ring-[#00468E]/10"
    );
  const lbl = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";
  const errMsg = (msg?: string) => msg ? (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5">
      <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[9px] flex-shrink-0">!</span>
      {msg}
    </p>
  ) : null;

  // ── Success Screen ────────────────────────────────────────────────────────
  if (currentStep === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #d1fae5 100%)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative bg-white rounded-[10px] p-10 text-center max-w-md w-full border-2 border-green-200">
          <div className="w-24 h-24 rounded-[10px] bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <IoMdCheckmark className="text-white text-4xl" />
          </div>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-[10px] mb-4 uppercase tracking-wide">
            Application Submitted
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-3">You're all set!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-2">
            Payment of <strong className="text-slate-700">₹11</strong> received. Confirmation sent to{" "}
            <strong className="text-[#00468E]">{formData.email}</strong>.
          </p>
          <p className="text-xs text-slate-400 mb-8">We'll review your application within 3–5 working days and contact you shortly.</p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3.5 rounded-[10px] font-bold text-sm text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #00305F, #00468E)" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #F6F5F1 0%, #EEF4FB 50%, #F6F5F1 100%)" }}>

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #00305F 0%, #00468E 60%, #0058B4 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #F4951D, transparent)" }} />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #ffffff, transparent)" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white/80 text-xs font-semibold px-3 py-1.5 rounded-[10px] mb-4 uppercase tracking-widest">
                <FaIdCard className="text-[#F4951D]" />
                CarePay® Financial Support Program
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                Parent Registration
              </h1>
              <p className="text-white/65 text-sm md:text-base leading-relaxed">
                Apply for 0% interest financial support for your child's school fees - reviewed within 3–5 working days.
              </p>
              {user && (
                <div className="inline-flex items-center gap-2 mt-4 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold px-3 py-1.5 rounded-[10px]">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Logged in as {user.fullName}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Mobile Step Bar ──────────────────────────────────────────── */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-[10px] p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
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
                      {done ? <IoMdCheckmark className="text-base" /> : <Icon className="text-sm" />}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 text-center ${active ? "text-[#00468E]" : done ? "text-[#0cab47]" : "text-slate-400"}`}>{step.shortTitle}</span>
                  </div>
                );
              })}
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #00468E, #0cab47)" }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-400 font-medium">Step {currentStep} of 4</span>
              <span className="text-xs font-bold text-[#00468E]">{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Desktop Sidebar ──────────────────────────────────────────── */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-6 space-y-4">

              {/* Steps card */}
              <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden">
                {/* Sidebar header */}
                <div className="p-5 pb-4" style={{ background: "linear-gradient(135deg, #00305F, #00468E)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-[10px] bg-[#F4951D] flex items-center justify-center flex-shrink-0">
                      <FaIdCard className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Application Progress</p>
                      <p className="text-white/60 text-xs">Step {Math.min(currentStep, 4)} of 4</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F4951D] rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-white/50 text-[11px]">Progress</span>
                    <span className="text-[#F4951D] text-[11px] font-bold">{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Steps list */}
                <div className="p-4 space-y-1">
                  {steps.map((step, i) => {
                    const done = currentStep > step.number;
                    const active = currentStep === step.number;
                    const Icon = step.icon;
                    return (
                      <div key={step.number} className="relative">
                        {i < steps.length - 1 && (
                          <div className={`absolute left-[22px] top-[44px] w-0.5 h-8 transition-all duration-500 ${done ? "bg-[#0cab47]" : "bg-slate-200"}`} />
                        )}
                        <div className={`relative z-10 flex items-center gap-3 px-3 py-3 rounded-[10px] transition-all duration-200 ${active ? "bg-[#00468E]/8 border border-[#00468E]/20" : ""}`}>
                          <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                            ${done ? "bg-[#0cab47] text-white border border-green-600"
                              : active ? "text-white border border-[#00305F]"
                              : "bg-slate-100 text-slate-400 border border-slate-200"}`}
                            style={active ? { background: "linear-gradient(135deg,#00468E,#0058B4)" } : {}}>
                            {done ? <IoMdCheckmark className="text-lg" /> : <Icon className="text-base" />}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {step.number}</p>
                            <p className={`text-sm font-bold ${active ? "text-[#00468E]" : done ? "text-[#0cab47]" : "text-slate-400"}`}>{step.title}</p>
                            {active && <p className="text-[11px] text-[#00468E]/60 font-medium">In Progress</p>}
                            {done && <p className="text-[11px] text-[#0cab47] font-medium">✓ Complete</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fee card */}
              <div className="rounded-[10px] p-5 border-2 border-amber-300" style={{ background: "linear-gradient(135deg, #FFF8ED, #FFF3DC)" }}>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Registration Fee</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-extrabold text-amber-800">₹11</span>
                  <span className="text-amber-600 text-sm mb-1">one-time</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 text-xs">
                  <FaLock className="text-[10px]" />
                  <span>Secured by Razorpay</span>
                </div>
              </div>

              {/* Trust card */}
              <div className="bg-white rounded-[10px] border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FaShieldAlt className="text-[#00468E] text-base" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Why Trust Us</p>
                </div>
                <ul className="space-y-2.5">
                  {["0% interest support", "Bank-grade data security", "Direct school payment", "48hr verification", "Dignified process"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="w-4 h-4 rounded-[4px] bg-green-100 text-green-600 flex items-center justify-center text-[9px] flex-shrink-0 font-bold border border-green-200">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* ── Main Form Card ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden">

              {/* Step Header bar */}
              <div className="px-6 sm:px-8 py-5 border-b-2 border-slate-200" style={{ background: "linear-gradient(135deg, #f8fafc, #f1f5f9)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-[#00305F]"
                    style={{ background: "linear-gradient(135deg, #00468E, #0058B4)" }}>
                    {currentStep === 1 && <FaUserTie className="text-white text-lg" />}
                    {currentStep === 2 && <FaChild className="text-white text-lg" />}
                    {currentStep === 3 && <FaMoneyBillWave className="text-white text-lg" />}
                    {currentStep === 4 && <FaCheckCircle className="text-white text-lg" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {currentStep} of 4</p>
                    <h2 className="text-lg font-extrabold text-slate-800">
                      {currentStep === 1 && "Parent Information"}
                      {currentStep === 2 && "Children & School Details"}
                      {currentStep === 3 && "Support Request Details"}
                      {currentStep === 4 && "Review & Complete Payment"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-7">

                {/* ── STEP 1: Parent Info ─────────────────────────────── */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <p className="text-sm text-slate-500">Please provide your personal details exactly as they appear on official documents.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={lbl}>First Name <span className="text-red-500 normal-case">*</span></label>
                        <input type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleInputChange} className={inp(errors.firstName)} />
                        {errMsg(errors.firstName)}
                      </div>
                      <div>
                        <label className={lbl}>Last Name <span className="text-red-500 normal-case">*</span></label>
                        <input type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleInputChange} className={inp(errors.lastName)} />
                        {errMsg(errors.lastName)}
                      </div>
                    </div>

                    <div>
                      <label className={lbl}>Email Address <span className="text-red-500 normal-case">*</span></label>
                      <input type="email" name="email" placeholder="your.email@example.com" value={formData.email} onChange={handleInputChange} className={inp(errors.email)} />
                      {errMsg(errors.email)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={lbl}>Phone Number <span className="text-red-500 normal-case">*</span></label>
                        <input type="tel" name="phone" placeholder="10-digit mobile number" value={formData.phone} onChange={handleInputChange} maxLength={10} className={inp(errors.phone)} />
                        {errMsg(errors.phone)}
                      </div>
                      <div>
                        <label className={lbl}>PAN Number <span className="text-red-500 normal-case">*</span></label>
                        <input type="text" name="panNumber" placeholder="ABCDE1234F"
                          value={formData.panNumber}
                          onChange={e => { e.target.value = e.target.value.toUpperCase(); handleInputChange(e); }}
                          maxLength={10} className={`${inp(errors.panNumber)} uppercase tracking-widest font-mono`} />
                        {errMsg(errors.panNumber)}
                      </div>
                    </div>

                    <div>
                      <label className={lbl}>Residential Address <span className="text-red-500 normal-case">*</span></label>
                      <textarea name="address" placeholder="Enter your complete address (house no., street, locality)" rows={3} value={formData.address} onChange={handleInputChange} className={`${inp(errors.address)} resize-none`} />
                      {errMsg(errors.address)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={lbl}>City <span className="text-red-500 normal-case">*</span></label>
                        <input type="text" name="city" placeholder="Enter city" value={formData.city} onChange={handleInputChange} className={inp(errors.city)} />
                        {errMsg(errors.city)}
                      </div>
                      <div>
                        <label className={lbl}>State <span className="text-red-500 normal-case">*</span></label>
                        <select name="state" value={formData.state} onChange={handleInputChange} className={inp(errors.state)}>
                          <option value="">Select State</option>
                          {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errMsg(errors.state)}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Children ─────────────────────────────────── */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <p className="text-sm text-slate-500">Provide details for each child you are applying support for (up to 5 children).</p>

                    <div>
                      <label className={lbl}>Number of Children <span className="text-red-500 normal-case">*</span></label>
                      <select name="numberOfChildren" value={formData.numberOfChildren}
                        onChange={e => { setFormData(p => ({ ...p, numberOfChildren: parseInt(e.target.value) })); setErrors({}); }}
                        className={inp(errors.numberOfChildren)}>
                        <option value={0}>Select Number of Children</option>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n===1?"Child":"Children"}</option>)}
                      </select>
                      {errMsg(errors.numberOfChildren)}
                    </div>

                    {Array.from({ length: formData.numberOfChildren }).map((_, index) => (
                      <div key={index} className="rounded-[10px] border-2 border-slate-200 overflow-hidden">
                        {/* Child card header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b-2 border-slate-200"
                          style={{ background: "linear-gradient(135deg, #f8fafc, #f1f5f9)" }}>
                          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 border border-[#00305F]"
                            style={{ background: "linear-gradient(135deg, #00468E, #0058B4)" }}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-sm">Child {index + 1}</p>
                            <p className="text-[11px] text-slate-400">School enrollment details</p>
                          </div>
                        </div>

                        <div className="p-5 space-y-4">
                          <div>
                            <label className={lbl}>Full Name <span className="text-red-500 normal-case">*</span></label>
                            <input type="text" name="fullName" placeholder="Child's full name" value={formData.children[index].fullName} onChange={e => handleInputChange(e, index)} className={inp(errors[`child${index}Name`])} />
                            {errMsg(errors[`child${index}Name`])}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={lbl}>Class / Grade <span className="text-red-500 normal-case">*</span></label>
                              <input type="text" name="classGrade" placeholder="e.g., Class 5" value={formData.children[index].classGrade} onChange={e => handleInputChange(e, index)} className={inp(errors[`child${index}Grade`])} />
                              {errMsg(errors[`child${index}Grade`])}
                            </div>
                            <div>
                              <label className={lbl}>Admission Number <span className="text-red-500 normal-case">*</span></label>
                              <input type="text" name="admissionNumber" placeholder="Roll / Admission no." value={formData.children[index].admissionNumber} onChange={e => handleInputChange(e, index)} className={inp(errors[`child${index}Admission`])} />
                              {errMsg(errors[`child${index}Admission`])}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={lbl}>School Name <span className="text-red-500 normal-case">*</span></label>
                              <input type="text" name="schoolName" placeholder="Enter school name" value={formData.children[index].schoolName} onChange={e => handleInputChange(e, index)} className={inp(errors[`child${index}School`])} />
                              {errMsg(errors[`child${index}School`])}
                            </div>
                            <div>
                              <label className={lbl}>School City <span className="text-red-500 normal-case">*</span></label>
                              <input type="text" name="schoolCity" placeholder="City where school is located" value={formData.children[index].schoolCity} onChange={e => handleInputChange(e, index)} className={inp(errors[`child${index}City`])} />
                              {errMsg(errors[`child${index}City`])}
                            </div>
                          </div>

                          {/* Apaar ID */}
                          <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-4">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">
                              Does this child have an Apaar ID?
                              <span className="text-red-500 ml-1 normal-case">*</span>
                              <a href="https://apaar.education.gov.in" target="_blank" rel="noopener noreferrer"
                                className="ml-2 text-[10px] font-semibold text-[#00468E] hover:underline normal-case tracking-normal">
                                (What is Apaar ID?)
                              </a>
                            </label>
                            <div className="flex gap-3">
                              {["yes","no"].map(opt => (
                                <label key={opt} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[10px] border-2 cursor-pointer font-bold text-sm transition-all duration-200
                                  ${formData.children[index].hasApaarId === opt
                                    ? opt === "yes"
                                      ? "border-[#00468E] bg-[#00468E]/5 text-[#00468E]"
                                      : "border-slate-400 bg-slate-100 text-slate-700"
                                    : "border-slate-300 text-slate-400 hover:border-slate-400 bg-white"}`}>
                                  <input type="radio" name="hasApaarId" value={opt} checked={formData.children[index].hasApaarId === opt} onChange={e => handleInputChange(e, index)} className="sr-only" />
                                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${formData.children[index].hasApaarId === opt ? "border-current" : "border-slate-300"}`}>
                                    {formData.children[index].hasApaarId === opt && <span className="w-2 h-2 rounded-full bg-current" />}
                                  </span>
                                  {opt === "yes" ? "Yes, I have it" : "No, I don't"}
                                </label>
                              ))}
                            </div>
                            {errMsg(errors[`child${index}HasApaar`])}
                            {formData.children[index].hasApaarId === "yes" && (
                              <div className="mt-4">
                                <label className={lbl}>Apaar ID Number <span className="text-red-500 normal-case">*</span></label>
                                <input type="text" name="apaarId" placeholder="Enter Apaar ID number" value={formData.children[index].apaarId} onChange={e => handleInputChange(e, index)} maxLength={20} className={inp(errors[`child${index}ApaarId`])} />
                                {errMsg(errors[`child${index}ApaarId`])}
                              </div>
                            )}
                            {formData.children[index].hasApaarId === "no" && (
                              <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-[10px]">
                                <p className="text-xs text-amber-700 leading-relaxed">
                                  <strong>No problem!</strong> You can register at{" "}
                                  <a href="https://apaar.education.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold">apaar.education.gov.in</a>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── STEP 3: Support Details ──────────────────────────── */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <p className="text-sm text-slate-500">Tell us about your financial situation so we can best support your family.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={lbl}>Total Fee Amount (₹) <span className="text-red-500 normal-case">*</span></label>
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
                      <textarea name="description" placeholder="Describe your situation in detail — the more context you provide, the faster we can help…" rows={5} value={formData.description} onChange={handleInputChange} className={`${inp(errors.description)} resize-none`} />
                      {errMsg(errors.description)}
                    </div>

                    <div>
                      <label className={lbl}>Preferred Repayment Duration <span className="text-red-500 normal-case">*</span></label>
                      <select name="repaymentDuration" value={formData.repaymentDuration} onChange={handleInputChange} className={inp(errors.repaymentDuration)}>
                        <option value="">Select Duration</option>
                        {Array.from({length:12},(_,i)=>(i+1)*3).map(m=>(
                          <option key={m} value={m}>{m} months{m>=12?` (${Math.floor(m/12)}yr${m%12>0?` ${m%12}m`:""})`:""}</option>
                        ))}
                      </select>
                      {errMsg(errors.repaymentDuration)}
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Review & Pay ─────────────────────────────── */}
                {currentStep === 4 && (
                  <div className="space-y-5">
                    <p className="text-sm text-slate-500">Please review all details carefully before completing your ₹11 registration payment.</p>

                    {/* Parent info summary */}
                    <div className="rounded-[10px] overflow-hidden border-2 border-slate-200">
                      <div className="flex items-center gap-3 px-5 py-3.5 border-b-2 border-slate-200"
                        style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)" }}>
                        <FaUserTie className="text-[#00468E] text-sm" />
                        <span className="font-bold text-slate-700 text-sm">Parent Information</span>
                      </div>
                      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          ["Name", `${formData.firstName} ${formData.lastName}`],
                          ["Email", formData.email],
                          ["Phone", formData.phone],
                          ["PAN", formData.panNumber],
                          ["City", formData.city],
                          ["State", formData.state],
                        ].map(([label, value]) => (
                          <div key={label} className="bg-slate-50 rounded-[10px] p-3 border border-slate-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                            <p className="font-bold text-slate-800 text-xs break-all">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Children summary */}
                    <div className="rounded-[10px] overflow-hidden border-2 border-slate-200">
                      <div className="flex items-center gap-3 px-5 py-3.5 border-b-2 border-slate-200"
                        style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                        <FaChild className="text-[#0cab47] text-sm" />
                        <span className="font-bold text-slate-700 text-sm">{formData.numberOfChildren} {formData.numberOfChildren===1?"Child":"Children"}</span>
                      </div>
                      <div className="p-4 space-y-2">
                        {Array.from({length:formData.numberOfChildren}).map((_,i) => {
                          const c = formData.children[i];
                          return (
                            <div key={i} className="bg-slate-50 rounded-[10px] p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="w-5 h-5 rounded-[5px] flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0 border border-[#00305F]"
                                  style={{ background: "linear-gradient(135deg,#00468E,#0058B4)" }}>{i+1}</span>
                                <span className="font-bold text-slate-800 text-sm">{c.fullName}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs pl-7 text-slate-600">
                                <span><span className="text-slate-400">Class:</span> <strong>{c.classGrade}</strong></span>
                                <span><span className="text-slate-400">School:</span> <strong>{c.schoolName}</strong></span>
                                <span><span className="text-slate-400">Apaar:</span> <strong>{c.hasApaarId==="yes"?c.apaarId:"N/A"}</strong></span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Payment banner */}
                    <div className="rounded-[10px] p-5 text-white overflow-hidden relative border border-[#00305F]"
                      style={{ background: "linear-gradient(135deg, #00305F 0%, #00468E 100%)" }}>
                      <div className="absolute top-0 right-0 w-48 h-48 opacity-10 rounded-full -translate-y-12 translate-x-12"
                        style={{ background: "radial-gradient(circle, #F4951D, transparent)" }} />
                      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Registration Fee</p>
                          <p className="text-4xl font-extrabold">₹11</p>
                          <p className="text-blue-200 text-xs mt-1 flex items-center gap-1">
                            <FaLock className="text-[10px]" /> One-time · Secured by Razorpay
                          </p>
                        </div>
                        <div className="bg-white/10 border border-white/30 rounded-[10px] px-4 py-3 text-center backdrop-blur-sm">
                          <p className="text-white text-xs font-extrabold uppercase tracking-wide mb-1">Test Mode</p>
                          <p className="text-blue-200 text-[10px]">Use test card:</p>
                          <p className="text-white font-mono text-xs font-bold mt-0.5">4111 1111 1111 1111</p>
                          <p className="text-blue-200 text-[10px] mt-0.5">CVV: any · Expiry: any future date</p>
                        </div>
                      </div>
                    </div>

                    {/* Terms checkbox */}
                    <label className="flex items-start gap-3.5 cursor-pointer p-4 rounded-[10px] border-2 transition-all duration-200 hover:border-[#00468E]/40"
                      style={{ borderColor: agreed ? "#00468E" : "#cbd5e1", background: agreed ? "#00468E08" : "#f8fafc" }}>
                      <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreed ? "border-[#00468E] bg-[#00468E]" : "border-slate-300 bg-white"}`}>
                        {agreed && <IoMdCheckmark className="text-white text-xs" />}
                      </div>
                      <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="sr-only" />
                      <span className="text-sm text-slate-600 leading-relaxed">
                        I confirm all information provided is accurate and complete. I agree to the{" "}
                        <a href="/terms" className="text-[#00468E] font-semibold hover:underline">Terms & Conditions</a> and{" "}
                        <a href="/privacy" className="text-[#00468E] font-semibold hover:underline">Privacy Policy</a> of Schoolfee.org.
                      </span>
                    </label>
                  </div>
                )}

                {/* ── Navigation Buttons ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t-2 border-slate-200">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-[10px] font-bold text-sm transition-all duration-200 flex items-center gap-2
                      ${currentStep === 1
                        ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 border border-slate-300"}`}>
                    ← Previous
                  </button>

                  {currentStep < 4 ? (
                    <button
                      onClick={handleNext}
                      className="px-8 py-3 rounded-[10px] font-bold text-sm text-white transition-all active:scale-95 border border-[#00305F] flex items-center gap-2"
                      style={{ background: "linear-gradient(135deg, #00468E, #0058B4)" }}>
                      Continue →
                    </button>
                  ) : (
                    <button
                      onClick={handlePaymentAndSubmit}
                      disabled={!agreed || isPaymentProcessing || isSubmitting}
                      className={`px-8 py-3 rounded-[10px] font-bold text-sm transition-all flex items-center gap-2
                        ${agreed && !isPaymentProcessing && !isSubmitting
                          ? "text-white active:scale-95 border border-green-700"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"}`}
                      style={agreed && !isPaymentProcessing && !isSubmitting
                        ? { background: "linear-gradient(135deg, #0cab47, #08d451)" }
                        : {}}>
                      {isPaymentProcessing ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing Payment…</>
                      ) : isSubmitting ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving Application…</>
                      ) : (
                        <><FaLock className="text-xs" /> Pay ₹11 & Submit Application</>
                      )}
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* ── Mobile Trust Strip ─────────────────────────────────── */}
            <div className="lg:hidden mt-4 bg-white rounded-[10px] border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {["0% Interest", "Bank-grade Security", "Direct School Payment", "48hr Verification"].map(item => (
                  <span key={item} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="w-4 h-4 rounded-[4px] bg-green-100 text-green-600 flex items-center justify-center text-[9px] font-bold border border-green-200">✓</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}