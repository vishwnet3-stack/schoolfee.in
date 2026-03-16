"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaIdCard, FaShieldAlt, FaLock } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  School, MapPin, UserCog, ClipboardCheck,
  AlertCircle, CheckCircle2, ChevronRight, Globe, Phone, Mail,
} from "lucide-react";

declare global { interface Window { Razorpay: any; } }
// ── Key loaded from .env — change only NEXT_PUBLIC_RAZORPAY_KEY_ID in .env
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;

const indianStates = [
  "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
  "Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Ladakh",
  "Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];

const schoolTypes = ["Government","Government Aided","Private Unaided","Central Government","International","Other"];

const affiliationBoards = [
  "CBSE (Central Board of Secondary Education)",
  "ICSE (Indian Certificate of Secondary Education)",
  "State Board",
  "IB (International Baccalaureate)",
  "IGCSE (Cambridge)",
  "NIOS (National Institute of Open Schooling)",
  "Other",
];

type FormData = {
  school_name: string; school_type: string; established_year: string;
  affiliation_board: string; otherAffiliationBoard: string; affiliation_id: string;
  school_address: string; city: string; state: string; pincode: string;
  contact_number: string; alternate_contact: string;
  official_email: string; website_url: string;
  principal_name: string; principal_email: string; principal_contact: string;
  total_students: string; total_teachers: string; infrastructure_details: string;
};

export default function SchoolRegistrationPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    school_name: "", school_type: "", established_year: "",
    affiliation_board: "", otherAffiliationBoard: "", affiliation_id: "",
    school_address: "", city: "", state: "", pincode: "",
    contact_number: "", alternate_contact: "",
    official_email: "", website_url: "",
    principal_name: "", principal_email: "", principal_contact: "",
    total_students: "", total_teachers: "", infrastructure_details: "",
  });

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
          <p className="text-white/70 text-sm font-medium tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const inp = (err?: string) =>
    `w-full px-3 py-2 rounded-[8px] border text-sm font-medium transition-all duration-200 outline-none` +
    (err
      ? " border-red-400 bg-red-50 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-200"
      : " border-slate-300 bg-white text-slate-800 placeholder-slate-400 hover:border-[#00468E]/50 focus:border-[#00468E] focus:ring-2 focus:ring-[#00468E]/10"
    );

  const lbl = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";

  const errMsg = (msg?: string) => msg ? (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
      <AlertCircle className="h-3 w-3 shrink-0" />{msg}
    </p>
  ) : null;

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!formData.school_name.trim()) e.school_name = "School name is required";
    if (!formData.school_type) e.school_type = "School type is required";
    if (!formData.established_year) e.established_year = "Established year is required";
    const yr = parseInt(formData.established_year);
    if (formData.established_year && (yr < 1800 || yr > new Date().getFullYear())) e.established_year = `Year must be between 1800 and ${new Date().getFullYear()}`;
    if (!formData.affiliation_board) e.affiliation_board = "Affiliation board is required";
    if (formData.affiliation_board === "Other" && !formData.otherAffiliationBoard.trim()) e.otherAffiliationBoard = "Please specify affiliation board";
    if (!formData.affiliation_id.trim()) e.affiliation_id = "Affiliation ID is required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!formData.school_address.trim()) e.school_address = "School address is required";
    if (!formData.city.trim()) e.city = "City is required";
    if (!formData.state) e.state = "State is required";
    if (!formData.pincode.match(/^\d{6}$/)) e.pincode = "Valid 6-digit pincode is required";
    if (!formData.contact_number.match(/^\d{10}$/)) e.contact_number = "Valid 10-digit contact number is required";
    if (formData.alternate_contact && !formData.alternate_contact.match(/^\d{10}$/)) e.alternate_contact = "Valid 10-digit alternate contact required";
    if (!formData.official_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.official_email = "Valid email is required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!formData.principal_name.trim()) e.principal_name = "Principal name is required";
    if (!formData.principal_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.principal_email = "Valid principal email is required";
    if (!formData.principal_contact.match(/^\d{10}$/)) e.principal_contact = "Valid 10-digit contact number is required";
    if (!formData.total_students || parseInt(formData.total_students) <= 0) e.total_students = "Valid number of students is required";
    if (!formData.total_teachers || parseInt(formData.total_teachers) <= 0) e.total_teachers = "Valid number of teachers is required";
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
      const orderRes = await fetch("/api/public/razorpay-school-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.official_email, name: formData.school_name }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || "Order creation failed");
      const { order } = orderData;
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Schoolfee.org",
        description: "School Registration Fee — Rs.1111",
        image: "/logo.jpg",
        order_id: order.id,
        prefill: { name: formData.principal_name, email: formData.official_email, contact: formData.contact_number },
        theme: { color: "#00468E" },
        handler: async (response: any) => {
          setIsPaymentProcessing(false);
          setIsSubmitting(true);
          try {
            const verifyRes = await fetch("/api/public/razorpay-school-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                formData,
                publicUserId: user?.id || null,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.error || "Verification failed");
            toast.success("School registration submitted! Check your email for confirmation.");
            setCurrentStep(5);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (err: any) {
            toast.error(err.message || "Submission failed after payment. Contact support.");
          } finally { setIsSubmitting(false); }
        },
        modal: {
          ondismiss: () => { setIsPaymentProcessing(false); toast.info("Payment cancelled. Your form data is saved."); },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setIsPaymentProcessing(false);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err: any) {
      setIsPaymentProcessing(false);
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  const steps = [
    { number: 1, title: "School Info",    shortTitle: "School",  icon: School },
    { number: 2, title: "Contact",        shortTitle: "Contact", icon: MapPin },
    { number: 3, title: "Admin Details",  shortTitle: "Admin",   icon: UserCog },
    { number: 4, title: "Review & Pay",   shortTitle: "Review",  icon: ClipboardCheck },
  ];

  if (currentStep === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #d1fae5 100%)" }}>
        <div className="bg-white rounded-[10px] p-10 text-center max-w-md w-full border-2 border-green-200">
          <div className="w-24 h-24 rounded-[10px] bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-white w-12 h-12" />
          </div>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-[10px] mb-4 uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" />Registration Submitted
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">School Registration Complete!</h2>
          <p className="text-slate-500 text-sm mb-2 leading-relaxed">
            Payment of <strong>Rs.1111</strong> received. Confirmation sent to <strong>{formData.official_email}</strong>.
          </p>
          <p className="text-xs text-slate-400 mb-8">We will review your application within 3-5 working days and contact you.</p>
          <button onClick={() => router.push("/")} className="w-full py-3.5 rounded-[10px] font-bold text-sm text-white transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #00305F, #00468E)" }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #F6F5F1 0%, #EEF4FB 50%, #F6F5F1 100%)" }}>

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #00305F 0%, #00468E 60%, #0058B4 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-[10px] mb-4 uppercase tracking-widest">
            <FaIdCard className="text-[#F4951D]" />School Registration
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
            Register Your School with Schoolfee
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl">Ensure timely student fee collection and connect with thousands of families across India.</p>
          {user && (
            <div className="inline-flex items-center gap-2 mt-4 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold px-3 py-1.5 rounded-[10px]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />Logged in as {user.fullName}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">

        {/* Mobile Step Bar */}
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
                      <div className="absolute top-4 left-[calc(50%+18px)] right-0 h-0.5 transition-all duration-500" style={{ background: done ? "#0cab47" : "#e2e8f0" }} />
                    )}
                    <div className={`relative z-10 w-9 h-9 rounded-[10px] flex items-center justify-center text-xs font-bold transition-all duration-300 ${done ? "bg-[#0cab47] text-white" : active ? "text-white" : "bg-slate-100 text-slate-400"}`} style={active ? { background: "linear-gradient(135deg,#00468E,#0058B4)" } : {}}>
                      {done ? <IoMdCheckmark className="text-base" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 text-center ${active ? "text-[#00468E]" : done ? "text-[#0cab47]" : "text-slate-400"}`}>{step.shortTitle}</span>
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #00468E, #0cab47)" }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">

          {/* Desktop Sidebar */}
          <div className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">
            <div className="sticky top-6 space-y-4">

              <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden">
                <div className="p-5 pb-4" style={{ background: "linear-gradient(135deg, #00305F, #00468E)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-[10px] bg-[#F4951D] flex items-center justify-center flex-shrink-0">
                      <FaIdCard className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Registration Progress</p>
                      <p className="text-white/60 text-xs">Step {Math.min(currentStep, 4)} of 4</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #F4951D, #0cab47)" }} />
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
                          <div className={`absolute left-[22px] top-[44px] w-0.5 h-8 transition-all duration-500 ${done ? "bg-[#0cab47]" : "bg-slate-200"}`} />
                        )}
                        <div className={`relative z-10 flex items-center gap-3 px-3 py-3 rounded-[10px] transition-all duration-200 ${active ? "bg-[#00468E]/[0.08] border border-[#00468E]/20" : ""}`}>
                          <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all duration-300 ${done ? "bg-[#0cab47] text-white border border-green-600" : active ? "text-white border border-[#00305F]" : "bg-slate-100 text-slate-400 border border-slate-200"}`} style={active ? { background: "linear-gradient(135deg,#00468E,#0058B4)" } : {}}>
                            {done ? <IoMdCheckmark className="text-lg" /> : <Icon className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {step.number}</p>
                            <p className={`text-sm font-bold ${active ? "text-[#00468E]" : done ? "text-[#0cab47]" : "text-slate-400"}`}>{step.title}</p>
                            {active && <p className="text-[11px] text-slate-400">In Progress</p>}
                            {done && <p className="text-[11px] text-[#0cab47]">Completed</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[10px] p-5 border-2 border-amber-300" style={{ background: "linear-gradient(135deg, #FFF8ED, #FFF3DC)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Registration Fee</p>
                <p className="text-3xl font-extrabold text-slate-800 mb-1">Rs.1111</p>
                <div className="flex items-center gap-1.5 text-amber-700 text-xs"><FaLock className="text-[10px]" /><span>Secured by Razorpay</span></div>
              </div>

              <div className="bg-white rounded-[10px] border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FaShieldAlt className="text-[#00468E] text-base" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Why Register</p>
                </div>
                <ul className="space-y-2.5">
                  {["Verified school listing","Direct fee collection","Parent-school connect","Dedicated support team"].map(text => (
                    <li key={text} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0cab47] shrink-0" />{text}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Form Panel */}
          <div className="flex-1">
            <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden">

              {/* Form header */}
              <div className="px-4 sm:px-6 py-3.5 border-b-2 border-slate-200" style={{ background: "linear-gradient(135deg, #f8fafc, #f1f5f9)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-[#00305F]" style={{ background: "linear-gradient(135deg, #00468E, #0058B4)" }}>
                    {currentStep === 1 && <School className="text-white h-5 w-5" />}
                    {currentStep === 2 && <MapPin className="text-white h-5 w-5" />}
                    {currentStep === 3 && <UserCog className="text-white h-5 w-5" />}
                    {currentStep === 4 && <ClipboardCheck className="text-white h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {currentStep} of 4</p>
                    <h2 className="text-base font-extrabold text-slate-800">
                      {currentStep === 1 && "School Basic Information"}
                      {currentStep === 2 && "Contact & Location Details"}
                      {currentStep === 3 && "Administrative Details"}
                      {currentStep === 4 && "Review & Pay"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-5">

                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">Please provide your school's basic details and affiliation information.</p>

                    <div><label className={lbl}>School Name <span className="text-red-500 normal-case">*</span></label><input type="text" name="school_name" placeholder="Enter school name" value={formData.school_name} onChange={handleInputChange} className={inp(errors.school_name)} />{errMsg(errors.school_name)}</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className={lbl}>School Type <span className="text-red-500 normal-case">*</span></label>
                        <select name="school_type" value={formData.school_type} onChange={handleInputChange} className={inp(errors.school_type)}>
                          <option value="">Select School Type</option>
                          {schoolTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {errMsg(errors.school_type)}
                      </div>
                      <div><label className={lbl}>Established Year <span className="text-red-500 normal-case">*</span></label><input type="number" name="established_year" placeholder="e.g., 1995" value={formData.established_year} onChange={handleInputChange} min="1800" max={new Date().getFullYear()} className={inp(errors.established_year)} />{errMsg(errors.established_year)}</div>
                    </div>

                    <div>
                      <label className={lbl}>Affiliation Board <span className="text-red-500 normal-case">*</span></label>
                      <select name="affiliation_board" value={formData.affiliation_board} onChange={handleInputChange} className={inp(errors.affiliation_board)}>
                        <option value="">Select Affiliation Board</option>
                        {affiliationBoards.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      {errMsg(errors.affiliation_board)}
                    </div>

                    {formData.affiliation_board === "Other" && (
                      <div><label className={lbl}>Specify Affiliation Board <span className="text-red-500 normal-case">*</span></label><input type="text" name="otherAffiliationBoard" placeholder="Please specify affiliation board" value={formData.otherAffiliationBoard} onChange={handleInputChange} className={inp(errors.otherAffiliationBoard)} />{errMsg(errors.otherAffiliationBoard)}</div>
                    )}

                    <div><label className={lbl}>Affiliation ID / Registration Number <span className="text-red-500 normal-case">*</span></label><input type="text" name="affiliation_id" placeholder="Enter affiliation or registration number" value={formData.affiliation_id} onChange={handleInputChange} className={inp(errors.affiliation_id)} />{errMsg(errors.affiliation_id)}</div>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">School address and official contact information.</p>

                    <div><label className={lbl}>School Address <span className="text-red-500 normal-case">*</span></label><textarea name="school_address" placeholder="Enter complete school address" rows={2} value={formData.school_address} onChange={handleInputChange} className={`${inp(errors.school_address)} resize-none`} />{errMsg(errors.school_address)}</div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div><label className={lbl}>City <span className="text-red-500 normal-case">*</span></label><input type="text" name="city" placeholder="Enter city" value={formData.city} onChange={handleInputChange} className={inp(errors.city)} />{errMsg(errors.city)}</div>
                      <div><label className={lbl}>State <span className="text-red-500 normal-case">*</span></label><select name="state" value={formData.state} onChange={handleInputChange} className={inp(errors.state)}><option value="">Select State</option>{indianStates.map(s => <option key={s} value={s}>{s}</option>)}</select>{errMsg(errors.state)}</div>
                      <div><label className={lbl}>Pincode <span className="text-red-500 normal-case">*</span></label><input type="text" name="pincode" placeholder="6-digit pincode" value={formData.pincode} onChange={handleInputChange} maxLength={6} className={inp(errors.pincode)} />{errMsg(errors.pincode)}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div><label className={lbl}>Contact Number <span className="text-red-500 normal-case">*</span></label><input type="tel" name="contact_number" placeholder="10-digit contact number" value={formData.contact_number} onChange={handleInputChange} maxLength={10} className={inp(errors.contact_number)} />{errMsg(errors.contact_number)}</div>
                      <div><label className={lbl}>Alternate Contact</label><input type="tel" name="alternate_contact" placeholder="10-digit alternate number" value={formData.alternate_contact} onChange={handleInputChange} maxLength={10} className={inp(errors.alternate_contact)} />{errMsg(errors.alternate_contact)}</div>
                    </div>

                    <div><label className={lbl}>Official Email Address <span className="text-red-500 normal-case">*</span></label><input type="email" name="official_email" placeholder="school@example.com" value={formData.official_email} onChange={handleInputChange} className={inp(errors.official_email)} />{errMsg(errors.official_email)}</div>

                    <div><label className={lbl}>Website URL <span className="text-slate-400 normal-case font-normal">(optional)</span></label><input type="url" name="website_url" placeholder="https://www.yourschool.com" value={formData.website_url} onChange={handleInputChange} className={inp(errors.website_url)} />{errMsg(errors.website_url)}</div>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">Principal information and school statistics.</p>

                    <div><label className={lbl}>Principal Name <span className="text-red-500 normal-case">*</span></label><input type="text" name="principal_name" placeholder="Enter principal's full name" value={formData.principal_name} onChange={handleInputChange} className={inp(errors.principal_name)} />{errMsg(errors.principal_name)}</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div><label className={lbl}>Principal Email <span className="text-red-500 normal-case">*</span></label><input type="email" name="principal_email" placeholder="principal@example.com" value={formData.principal_email} onChange={handleInputChange} className={inp(errors.principal_email)} />{errMsg(errors.principal_email)}</div>
                      <div><label className={lbl}>Principal Contact <span className="text-red-500 normal-case">*</span></label><input type="tel" name="principal_contact" placeholder="10-digit mobile number" value={formData.principal_contact} onChange={handleInputChange} maxLength={10} className={inp(errors.principal_contact)} />{errMsg(errors.principal_contact)}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div><label className={lbl}>Total Students <span className="text-red-500 normal-case">*</span></label><input type="number" name="total_students" placeholder="Enter total students" value={formData.total_students} onChange={handleInputChange} min="1" className={inp(errors.total_students)} />{errMsg(errors.total_students)}</div>
                      <div><label className={lbl}>Total Teachers <span className="text-red-500 normal-case">*</span></label><input type="number" name="total_teachers" placeholder="Enter total teachers" value={formData.total_teachers} onChange={handleInputChange} min="1" className={inp(errors.total_teachers)} />{errMsg(errors.total_teachers)}</div>
                    </div>

                    <div><label className={lbl}>Infrastructure & Facilities <span className="text-slate-400 normal-case font-normal">(optional)</span></label><textarea name="infrastructure_details" placeholder="Describe your school's infrastructure, facilities, and amenities..." rows={3} value={formData.infrastructure_details} onChange={handleInputChange} className={`${inp()} resize-none`} /></div>

                    <div className="rounded-[10px] border border-blue-200 bg-blue-50 p-3.5 flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed"><strong className="text-blue-700">Note:</strong> All information will be verified during the onboarding process. Please ensure accuracy.</p>
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && (
                  <div className="space-y-3.5">
                    <p className="text-sm text-slate-500">Please review all details carefully before completing your Rs.1111 registration payment.</p>

                    <div className="rounded-[10px] overflow-hidden border-2 border-slate-200">
                      <div className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-slate-200" style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)" }}>
                        <School className="text-[#00468E] h-4 w-4" /><span className="font-bold text-slate-700 text-sm">School Basic Information</span>
                      </div>
                      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          ["School Name", formData.school_name],
                          ["Type", formData.school_type],
                          ["Established", formData.established_year],
                          ["Board", formData.affiliation_board === "Other" ? formData.otherAffiliationBoard : formData.affiliation_board],
                          ["Affiliation ID", formData.affiliation_id],
                        ].map(([l,v]) => v ? (
                          <div key={l} className="bg-slate-50 rounded-[8px] p-2.5 border border-slate-100"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{l}</p><p className="font-semibold text-slate-800 text-xs break-all">{v}</p></div>
                        ) : null)}
                      </div>
                    </div>

                    <div className="rounded-[10px] overflow-hidden border-2 border-slate-200">
                      <div className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-slate-200" style={{ background: "linear-gradient(135deg,#f0f4ff,#e8eeff)" }}>
                        <MapPin className="text-[#00468E] h-4 w-4" /><span className="font-bold text-slate-700 text-sm">Contact & Location</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          ["City", formData.city],
                          ["State", formData.state],
                          ["Pincode", formData.pincode],
                          ["Contact", formData.contact_number],
                          ["Email", formData.official_email],
                          ...(formData.website_url ? [["Website", formData.website_url]] : []),
                        ].map(([l,v]) => v ? (
                          <div key={l} className="bg-slate-50 rounded-[8px] p-2.5 border border-slate-100"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{l}</p><p className="font-semibold text-slate-800 text-xs break-all">{v}</p></div>
                        ) : null)}
                      </div>
                    </div>

                    <div className="rounded-[10px] overflow-hidden border-2 border-slate-200">
                      <div className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-slate-200" style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                        <UserCog className="text-[#0cab47] h-4 w-4" /><span className="font-bold text-slate-700 text-sm">Administrative Details</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          ["Principal", formData.principal_name],
                          ["Principal Email", formData.principal_email],
                          ["Principal Contact", formData.principal_contact],
                          ["Total Students", formData.total_students],
                          ["Total Teachers", formData.total_teachers],
                        ].map(([l,v]) => v ? (
                          <div key={l} className="bg-slate-50 rounded-[8px] p-2.5 border border-slate-100"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{l}</p><p className="font-semibold text-slate-800 text-xs break-all">{v}</p></div>
                        ) : null)}
                      </div>
                    </div>

                    <div className="rounded-[10px] p-5 text-white relative border border-[#00305F]" style={{ background: "linear-gradient(135deg, #00305F 0%, #00468E 100%)" }}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Registration Fee</p>
                          <p className="text-4xl font-extrabold">Rs.1111</p>
                          <p className="text-blue-200 text-xs mt-1 flex items-center gap-1"><FaLock className="text-[10px]" />One-time · Secured by Razorpay</p>
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-[10px] px-4 py-3">
                          <p className="text-blue-200 text-[11px] font-semibold mb-1">What you get:</p>
                          <ul className="space-y-1">
                            {["Verified school listing","Direct fee collection","Parent-school connect","Application review 3-5 days"].map(item => (
                              <li key={item} className="flex items-center gap-1.5 text-[11px] text-white/80">
                                <CheckCircle2 className="h-3 w-3 text-green-400 shrink-0" />{item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start gap-3.5 cursor-pointer p-4 rounded-[10px] border-2 transition-all duration-200 hover:border-[#00468E]/40" style={{ borderColor: agreed ? "#00468E" : "#cbd5e1", background: agreed ? "#00468E08" : "#f8fafc" }}>
                      <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreed ? "border-[#00468E] bg-[#00468E]" : "border-slate-300 bg-white"}`}>
                        {agreed && <IoMdCheckmark className="text-white text-xs" />}
                      </div>
                      <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="sr-only" />
                      <span className="text-sm text-slate-600 leading-relaxed">I confirm that all information provided is accurate and complete. I agree to the <a href="/terms" className="text-[#00468E] font-semibold hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-[#00468E] font-semibold hover:underline">Privacy Policy</a> of Schoolfee.org.</span>
                    </label>
                  </div>
                )}

                {/* Nav Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-5 pt-4 border-t-2 border-slate-200">
                  <button onClick={handlePrevious} disabled={currentStep === 1} className={`px-6 py-3 rounded-[10px] font-bold text-sm transition-all duration-200 flex items-center gap-2 ${currentStep === 1 ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200" : "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 border border-slate-300"}`}>
                    &larr; Previous
                  </button>
                  {currentStep < 4 ? (
                    <button onClick={handleNext} className="px-8 py-3 rounded-[10px] font-bold text-sm text-white transition-all active:scale-95 border border-[#00305F] flex items-center gap-2" style={{ background: "linear-gradient(135deg, #00468E, #0058B4)" }}>
                      Continue <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button onClick={handlePaymentAndSubmit} disabled={!agreed || isPaymentProcessing || isSubmitting}
                      className={`px-8 py-3 rounded-[10px] font-bold text-sm transition-all flex items-center gap-2 ${agreed && !isPaymentProcessing && !isSubmitting ? "text-white active:scale-95 border border-green-700" : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"}`}
                      style={agreed && !isPaymentProcessing && !isSubmitting ? { background: "linear-gradient(135deg, #0cab47, #08d451)" } : {}}>
                      {isPaymentProcessing ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</> :
                       isSubmitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> :
                       <><FaLock className="text-xs" />Pay Rs.1111 &amp; Submit Registration</>}
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Mobile trust bar */}
            <div className="lg:hidden mt-4 bg-white rounded-[10px] border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {["Verified Listing","Fee Collection","Parent Connect","Dedicated Support"].map(item => (
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
  );
}