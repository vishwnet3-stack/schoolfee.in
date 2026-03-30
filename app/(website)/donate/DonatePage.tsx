"use client"

import { useState } from "react"
import {
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaLock,
  FaFileInvoice,
  FaChartLine,
  FaPlus,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaReceipt,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa"

interface FormData {
  firstName: string; lastName: string; email: string; phone: string; panNumber: string
  organizationName: string; organizationType: string; gstin: string
  address: string; city: string; state: string; pincode: string; isAnonymous: boolean; message: string
}
interface FormErrors { [key: string]: string }
interface DonationResult { donationId: number; receiptNumber: string; financialYear: string; paymentId: string; amount: number }

const presetAmounts = [1000, 2000, 5000, 10000, 25000, 50000]
const impactExamples = [
  { amount: "₹5,000", impact: "Covers one month of school fees for a child", icon: FaGraduationCap, color: "#0B4C8A" },
  { amount: "₹15,000", impact: "Supports a family through a full school term", icon: FaUsers, color: "#F9A11B" },
  { amount: "₹50,000", impact: "Creates a revolving fund supporting 5+ families", icon: FaHeart, color: "#0B4C8A" },
]
const trustPoints = [
  { icon: FaLock, text: "Payments secured by Razorpay" },
  { icon: FaFileInvoice, text: "80G tax receipt within 24 hrs" },
  { icon: FaChartLine, text: "Quarterly impact reports sent" },
  { icon: FaShieldAlt, text: "100% funds reach families" },
]
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
]

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!
const PAN_REQUIRED_THRESHOLD = 2001 // PAN required for amount STRICTLY > 2000 (i.e. >= 2001)

function validateForm(form: FormData, amount: number): FormErrors {
  const e: FormErrors = {}
  if (!form.firstName.trim()) e.firstName = "First name is required."
  else if (!/^[A-Za-z\s]{2,50}$/.test(form.firstName.trim())) e.firstName = "2–50 letters only."
  if (!form.lastName.trim()) e.lastName = "Last name is required."
  else if (!/^[A-Za-z\s]{2,50}$/.test(form.lastName.trim())) e.lastName = "2–50 letters only."
  if (!form.email.trim()) e.email = "Email is required."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address."
  if (!form.phone.trim()) e.phone = "Phone number is required."
  else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit mobile number."
  if (amount >= PAN_REQUIRED_THRESHOLD) {
    if (!form.panNumber.trim()) e.panNumber = "PAN is required for donations above ₹2,000 (Section 80G)."
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber.trim().toUpperCase())) e.panNumber = "Enter a valid PAN (e.g. ABCDE1234F)."
  } else if (form.panNumber.trim()) {
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber.trim().toUpperCase())) e.panNumber = "Enter a valid PAN (e.g. ABCDE1234F)."
  }
  if (!form.address.trim()) e.address = "Address is required."
  else if (form.address.trim().length < 10) e.address = "Please enter your full address."
  if (!form.city.trim()) e.city = "City is required."
  if (!form.state) e.state = "Please select your state."
  if (!form.pincode.trim()) e.pincode = "Pincode is required."
  else if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode."
  if (form.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstin.toUpperCase())) e.gstin = "Enter a valid 15-digit GSTIN."
  if (amount < 100) e.amount = "Minimum donation is ₹100."
  if (amount > 1000000) e.amount = "Maximum is ₹10,00,000 per transaction."
  return e
}

function Field({ label, error, children }: { label?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      {children}
      {error && <p className="text-red-500 text-xs flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  )
}

// ── SUCCESS SCREEN — replaces old modal + 80G print section ──────────────────
function SuccessScreen({ result, form, onReset }: { result: DonationResult; form: FormData; onReset: () => void }) {
  const donorName = form.isAnonymous ? "Anonymous Donor" : `${form.firstName} ${form.lastName}`
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })

  const details: { icon: any; label: string; value: string; highlight?: boolean; mono?: boolean }[] = [
    { icon: FaReceipt, label: "Receipt Number", value: result.receiptNumber, highlight: true },
    { icon: FaCalendarAlt, label: "Payment Date", value: `${dateStr} at ${timeStr}` },
    { icon: FaIdCard, label: "Payment Reference", value: result.paymentId, mono: true },
    { icon: FaCalendarAlt, label: "Financial Year", value: result.financialYear },
    ...(form.panNumber ? [{ icon: FaIdCard, label: "PAN Number", value: form.panNumber.toUpperCase() }] : []),
    { icon: FaEnvelope, label: "Email", value: form.email },
    { icon: FaPhone, label: "Phone", value: form.phone },
    { icon: FaMapMarkerAlt, label: "Address", value: `${form.address}, ${form.city}, ${form.state} – ${form.pincode}` },
    ...(form.organizationName ? [{ icon: FaBuilding, label: "Organisation", value: `${form.organizationName} (${form.organizationType})` }] : []),
    ...(form.message ? [{ icon: FaHeart, label: "Your Message", value: form.message }] : []),
  ]

  return (
    <main className="bg-[#F6F5F1] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Top success banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-br from-[#0B4C8A] to-[#083a6b] px-6 pt-8 pb-6 text-center">
            <div className="w-16 h-16 bg-green-400/20 border-2 border-green-400/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-300 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Donation Successful!</h1>
            <p className="text-white/70 text-sm">
              Thank you for your generous contribution, {form.isAnonymous ? "dear donor" : form.firstName}.
            </p>
          </div>

          {/* Amount highlight */}
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-center sm:text-left">
              <div className="text-xs text-amber-700 font-semibold uppercase tracking-widest mb-0.5">Amount Donated</div>
              <div className="text-3xl font-bold text-[#0B4C8A]">₹{result.amount.toLocaleString("en-IN")}</div>
            </div>
            {/* <div className="text-center sm:text-right">
              <div className="text-xs text-amber-700 font-semibold uppercase tracking-widest mb-0.5">Donation ID</div>
              <div className="text-lg font-bold text-amber-800">#{result.donationId}</div>
            </div> */}
          </div>

          {/* Email notice */}
          <div className="bg-green-50 border-b border-green-100 px-6 py-3 flex items-start gap-3">
            <FaEnvelope className="text-green-600 text-sm mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-800">
              All payment details have been sent to <strong>{form.email}</strong>.
              An 80G tax receipt will be delivered within 24 hours.
            </p>
          </div>
        </div>

        {/* Donor & payment details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-base">Your Payment Summary</h2>
            <p className="text-xs text-gray-500 mt-0.5">A copy of all details has been mailed to your registered email address.</p>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="px-6 py-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#0B4C8A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaHeart className="text-[#0B4C8A] text-xs" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">Donor Name</div>
                <div className="text-sm font-medium text-gray-800 break-words">{donorName}</div>
              </div>
            </div>
            {details.map(({ icon: Icon, label, value, highlight, mono }) => (
              <div key={label} className="px-6 py-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="text-gray-500 text-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">{label}</div>
                  <div className={`text-sm break-words ${highlight ? "font-bold text-green-700" : mono ? "font-mono text-xs text-gray-600" : "font-medium text-gray-800"}`}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What happens next */}
        {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-base">What Happens Next?</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { step: "01", title: "Email Confirmation Sent", desc: "A detailed receipt has been sent to your email right now." },
              { step: "02", title: "80G Receipt in 24 Hours", desc: "Your official 80G tax exemption certificate will arrive via email." },
              { step: "03", title: "Admin Verification", desc: "Our team will verify and confirm your donation in the dashboard." },
              { step: "04", title: "Quarterly Impact Report", desc: "You'll receive an impact report showing how your donation helped." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="px-6 py-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0B4C8A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/"
            className="flex-1 bg-[#0B4C8A] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#083a6b] transition-all shadow-md hover:shadow-lg">
            <FaArrowRight className="text-xs" />
            Explore Schoolfee.org
          </a>
          <button onClick={onReset}
            className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition">
            Make Another Donation
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Questions? Contact us at{" "}
          <a href="mailto:donations@schoolfee.org" className="text-[#0B4C8A] hover:underline">donations@schoolfee.org</a>
        </p>
      </div>
    </main>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000)
  const [customAmount, setCustomAmount] = useState("")
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "", panNumber: "",
    organizationName: "", organizationType: "individual", gstin: "",
    address: "", city: "", state: "", pincode: "", isAnonymous: false, message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showOrgFields, setShowOrgFields] = useState(false)
  const [successResult, setSuccessResult] = useState<DonationResult | null>(null)
  const [failureModal, setFailureModal] = useState<string | null>(null)

  const currentAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount || 0

  const handleAmountSelect = (amount: number) => { setSelectedAmount(amount); setCustomAmount(""); setErrors(e => ({ ...e, amount: "" })) }
  const handleCustomAmount = (value: string) => { setCustomAmount(value); setSelectedAmount(null); setErrors(e => ({ ...e, amount: "" })) }
  const updateForm = (field: keyof FormData, value: string | boolean) => {
    setForm(p => ({ ...p, [field]: value })); setErrors(p => ({ ...p, [field]: "" }))
  }

  const handleDonate = async () => {
    const errs = validateForm(form, currentAmount)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      document.getElementById(Object.keys(errs)[0])?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setIsLoading(true)
    try {
      const orderRes = await fetch("/api/donate/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: currentAmount,
          org_name: form.organizationName?.trim() || `${form.firstName} ${form.lastName}`,
          org_type: form.organizationType || "individual",
          contact_name: `${form.firstName} ${form.lastName}`,
          contact_email: form.email,
          contact_phone: form.phone,
          address_line1: form.address,
          address_city: form.city,
          address_state: form.state,
          address_pincode: form.pincode,
          pan_number: form.panNumber ? form.panNumber.toUpperCase() : "",
          consent_80g: !!form.panNumber,
          donation_purpose: "Education Support",
          donation_note: form.message || "",
        }),
      })
      const orderData = await orderRes.json()
      if (!orderData.success) { setErrors({ amount: orderData.message || "Could not initiate payment." }); setIsLoading(false); return }

      const rzp = new (window as any).Razorpay({
        key: RAZORPAY_KEY, order_id: orderData.order_id, amount: orderData.amount, currency: "INR",
        name: "Schoolfee.org / CHM", description: "Donation — Schoolfee Education Initiative",
        prefill: { name: `${form.firstName} ${form.lastName}`, email: form.email, contact: form.phone },
        theme: { color: "#0B4C8A" },
        handler: async (response: any) => {
          try {
            const verRes = await fetch("/api/donate/verify-payment", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                db_order_id: orderData.db_order_id,
              }),
            })
            const verData = await verRes.json()
            if (verData.success) {
              setSuccessResult({
                donationId: orderData.db_order_id,
                receiptNumber: orderData.receipt_number,
                financialYear: (() => {
                  const now = new Date();
                  const fy = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
                  return `${fy}-${String(fy + 1).slice(-2)}`;
                })(),
                paymentId: response.razorpay_payment_id,
                amount: currentAmount,
              })
              window.scrollTo({ top: 0, behavior: "smooth" })
            } else {
              setFailureModal(verData.error || "Verification failed.")
            }
          } catch { setFailureModal("Network error during verification.") }
          finally { setIsLoading(false) }
        },
        modal: { ondismiss: () => { setIsLoading(false) } },
      })
      rzp.on("payment.failed", async (resp: any) => {
        await fetch("/api/donate/verify-payment", {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ razorpay_order_id: orderData.order_id, db_order_id: orderData.db_order_id, error_description: resp.error?.description, amount_paise: orderData.amount })
        }).catch(() => { })
        setFailureModal(resp.error?.description || "Payment failed. Please try again.")
        setIsLoading(false)
      })
      rzp.open()
    } catch { setErrors({ amount: "Unexpected error. Please try again." }); setIsLoading(false) }
  }

  const inp = (field: string) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors ${errors[field] ? "border-red-400 bg-red-50 focus:border-red-500" : "border-gray-200 bg-white focus:border-[#0B4C8A]"}`

  const resetForm = () => {
    setSuccessResult(null)
    setForm({ firstName: "", lastName: "", email: "", phone: "", panNumber: "", organizationName: "", organizationType: "individual", gstin: "", address: "", city: "", state: "", pincode: "", isAnonymous: false, message: "" })
    setSelectedAmount(5000); setCustomAmount("")
  }

  // Switch to full-page success screen after payment
  if (successResult) {
    return <SuccessScreen result={successResult} form={form} onReset={resetForm} />
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <main className="bg-[#F6F5F1] min-h-screen">

        {/* HERO */}
        <section className="pt-24 pb-8 md:pt-12 md:pb-10">
          <div className="max-w-8xl mx-auto px-5 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-[#0B4C8A]/10 text-[#0B4C8A] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              <FaHeart className="text-[#F9A11B]" /> Make a Difference Today
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B4C8A] mb-4 leading-tight">
              Donate to Schoolfee.org
              <span className="block text-xl md:text-2xl font-normal text-gray-500 mt-1">An initiative of CHM - Community Health Mission</span>
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto text-base leading-relaxed">
              Help children continue their education despite financial hardship.
              Your donation is <span className="font-semibold text-[#0B4C8A]">tax-deductible under Section 80G</span>.
            </p>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="pb-16 md:pb-24">
          <div className="max-w-8xl mx-auto px-5 md:px-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* LEFT — DONATION FORM */}
              <div className="w-full lg:flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#0B4C8A] px-6 py-4 flex items-center gap-3">
                  <div>
                    <div className="text-white font-semibold">Make a Donation</div>
                    <div className="text-white/70 text-xs">All fields marked * are required</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-white/80 text-xs">
                    <FaLock className="text-xs" /> Secure Payment
                  </div>
                </div>
                <div className="p-6 md:p-8 space-y-7">

                  {/* STEP 1 */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-[#0B4C8A] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <h3 className="font-semibold text-gray-800">Choose Your Donation Amount</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {presetAmounts.map((amount) => (
                        <button key={amount} onClick={() => handleAmountSelect(amount)}
                          className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${selectedAmount === amount ? "bg-[#0B4C8A] text-white border-[#0B4C8A] shadow-md" : "border-gray-200 text-gray-700 hover:border-[#0B4C8A] hover:text-[#0B4C8A] bg-gray-50"}`}>
                          ₹{amount.toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-500 whitespace-nowrap">Custom amount:</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                        <input id="amount" type="number" value={customAmount} onChange={(e) => handleCustomAmount(e.target.value)}
                          placeholder="Enter amount"
                          className={`border rounded-lg pl-7 pr-3 py-2.5 text-sm w-44 focus:outline-none transition-colors ${errors.amount ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#0B4C8A]"}`} />
                      </div>
                    </div>
                    {errors.amount && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.amount}</p>}
                    {currentAmount >= 100 && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2">
                        <FaCheckCircle className="text-green-500 text-sm flex-shrink-0" />
                        <span className="text-sm text-green-700">You are donating <strong>₹{currentAmount.toLocaleString("en-IN")}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-dashed border-gray-200" />

                  {/* STEP 2 */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-[#0B4C8A] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <h3 className="font-semibold text-gray-800">Your Personal Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="First Name *" error={errors.firstName}>
                          <input id="firstName" placeholder="e.g. Rahul" value={form.firstName} onChange={(e) => updateForm("firstName", e.target.value)} className={inp("firstName")} />
                        </Field>
                        <Field label="Last Name *" error={errors.lastName}>
                          <input id="lastName" placeholder="e.g. Sharma" value={form.lastName} onChange={(e) => updateForm("lastName", e.target.value)} className={inp("lastName")} />
                        </Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Email Address *" error={errors.email}>
                          <input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className={inp("email")} />
                        </Field>
                        <Field label="Phone Number *" error={errors.phone}>
                          <input id="phone" type="tel" placeholder="10-digit mobile" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className={inp("phone")} />
                        </Field>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          PAN Number
                          {currentAmount > 2000 ? <span className="text-red-500"> * (mandatory for donations above ₹2,000)</span> : <span className="text-gray-400"> (optional — needed for 80G receipt)</span>}
                        </label>
                        <input id="panNumber" placeholder="e.g. ABCDE1234F" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} maxLength={10} className={inp("panNumber")} />
                        {errors.panNumber && <p className="text-red-500 text-xs flex items-center gap-1"><span>⚠</span>{errors.panNumber}</p>}
                        {currentAmount <= 2000 && !errors.panNumber && <p className="text-xs text-amber-600 mt-1">PAN is optional for ₹2,000 or less. Providing it enables an 80G tax deduction receipt.</p>}
                        {currentAmount > 2000 && !errors.panNumber && <p className="text-xs text-blue-600 mt-1">PAN is required for donations above ₹2,000 (Income Tax Section 80G).</p>}
                      </div>
                      <Field label="Full Address * (for 80G receipt)" error={errors.address}>
                        <textarea id="address" placeholder="House/Flat No., Street, Area..." value={form.address} onChange={(e) => updateForm("address", e.target.value)} rows={2} className={`${inp("address")} resize-none`} />
                      </Field>
                      <div className="grid grid-cols-3 gap-3">
                        <Field label="City *" error={errors.city}>
                          <input id="city" placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} className={inp("city")} />
                        </Field>
                        <Field label="State *" error={errors.state}>
                          <select id="state" value={form.state} onChange={(e) => updateForm("state", e.target.value)} className={`${inp("state")} bg-white`}>
                            <option value="">Select</option>
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </Field>
                        <Field label="Pincode *" error={errors.pincode}>
                          <input id="pincode" placeholder="6 digits" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} maxLength={6} className={inp("pincode")} />
                        </Field>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-200" />

                  {/* STEP 3 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-bold flex-shrink-0">3</div>
                      <h3 className="font-semibold text-gray-800">Additional Options <span className="text-gray-400 font-normal text-sm">(optional)</span></h3>
                    </div>
                    <button type="button" onClick={() => setShowOrgFields(v => !v)}
                      className="flex items-center gap-2 text-sm text-[#0B4C8A] font-medium border border-[#0B4C8A]/30 rounded-lg px-4 py-2 hover:bg-[#0B4C8A]/5 transition mb-3">
                      <FaPlus className="text-xs" />
                      {showOrgFields ? "Remove" : "Add"} Organisation / CSR Details
                    </button>
                    {showOrgFields && (
                      <div className="space-y-3 bg-[#F6F5F1] rounded-xl p-4 border border-gray-200 mb-3">
                        <Field><input placeholder="Organisation Name" value={form.organizationName} onChange={(e) => updateForm("organizationName", e.target.value)} className={inp("organizationName")} /></Field>
                        <Field>
                          <select value={form.organizationType} onChange={(e) => updateForm("organizationType", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#0B4C8A]">
                            <option value="individual">Individual</option>
                            <option value="ngo">NGO / Trust</option>
                            <option value="corporate">Corporate / CSR</option>
                            <option value="government">Government Body</option>
                            <option value="other">Other</option>
                          </select>
                        </Field>
                        <Field error={errors.gstin}>
                          <input placeholder="GSTIN (optional, 15 digits)" value={form.gstin} onChange={(e) => updateForm("gstin", e.target.value.toUpperCase())} maxLength={15} className={inp("gstin")} />
                        </Field>
                      </div>
                    )}
                    <Field>
                      <textarea placeholder="Leave a message or dedication (optional)" value={form.message} onChange={(e) => updateForm("message", e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0B4C8A] resize-none" />
                    </Field>
                    <label className="flex items-center gap-3 cursor-pointer mt-3 p-3 rounded-lg hover:bg-gray-50 transition">
                      <input type="checkbox" checked={form.isAnonymous} onChange={(e) => updateForm("isAnonymous", e.target.checked)} className="w-4 h-4 accent-[#0B4C8A]" />
                      <span className="text-sm text-gray-600">Donate anonymously <span className="text-gray-400">(your name won't appear publicly)</span></span>
                    </label>
                  </div>

                  {/* SUBMIT */}
                  <div className="pt-1">
                    <button onClick={handleDonate} disabled={isLoading || currentAmount < 1}
                      className="w-full bg-[#F9A11B] text-white py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#e8920a] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]">
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Processing…
                        </span>
                      ) : (
                        <><FaHeart /> Donate ₹{currentAmount.toLocaleString("en-IN")} Now</>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                      <FaLock className="text-[10px]" /> Secured by Razorpay — India's most trusted payment gateway
                    </p>
                  </div>

                </div>
              </div>

              {/* RIGHT — STICKY SIDEBAR */}
              <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-24 space-y-4">
                <div className="bg-[#0B4C8A] text-white rounded-2xl p-5">
                  <div className="text-white/70 text-xs uppercase tracking-widest mb-1">Your Donation</div>
                  <div className="text-4xl font-bold mb-0.5">₹{currentAmount > 0 ? currentAmount.toLocaleString("en-IN") : "—"}</div>
                  <div className="text-white/60 text-xs">Tax-deductible under Section 80G</div>
                  <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-center">
                    <div className="bg-white/10 rounded-xl p-3"><div className="text-lg font-bold">50%</div><div className="text-white/60 text-xs">Tax Benefit</div></div>
                    <div className="bg-white/10 rounded-xl p-3"><div className="text-lg font-bold">24h</div><div className="text-white/60 text-xs">Receipt Delivery</div></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">What Your Donation Does</h3>
                  <div className="space-y-4">
                    {impactExamples.map((ex) => (
                      <div key={ex.amount} className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${ex.color}15` }}>
                          <ex.icon className="text-sm" style={{ color: ex.color }} />
                        </div>
                        <div>
                          <div className="font-semibold text-[#0B4C8A] text-sm">{ex.amount}</div>
                          <div className="text-gray-500 text-xs leading-relaxed">{ex.impact}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Why Trust Us</h3>
                  <div className="space-y-3">
                    {trustPoints.map((tp, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0"><tp.icon className="text-green-600 text-xs" /></div>
                        <span className="text-sm text-gray-600">{tp.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                  <div className="text-xs font-semibold text-amber-800">Registered under</div>
                  <div className="text-sm font-bold text-amber-900">Section 80G & 12A</div>
                  <div className="text-xs text-amber-700 mt-1">Income Tax Act, 1961</div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FAILURE MODAL */}
      {failureModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaTimesCircle className="text-red-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
              <p className="text-gray-500 text-sm mt-2">{failureModal}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
              No amount has been deducted. Please try again or contact <strong>support@schoolfee.org</strong>.
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => setFailureModal(null)} className="w-full bg-[#F9A11B] text-white py-3 rounded-xl font-medium hover:opacity-90 transition">Try Again</button>
              <button onClick={() => setFailureModal(null)} className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}