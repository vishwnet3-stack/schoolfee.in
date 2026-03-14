"use client"

import { useState } from "react"
import {
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaBuilding,
  FaLock,
  FaFileInvoice,
  FaChartLine,
  FaPlus,
} from "react-icons/fa"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  panNumber: string
  organizationName: string
  organizationType: string
  gstin: string
  address: string
  city: string
  state: string
  pincode: string
  isAnonymous: boolean
  message: string
}

interface FormErrors {
  [key: string]: string
}

interface DonationResult {
  donationId: number
  receiptNumber: string
  financialYear: string
  paymentId: string
  amount: number
}

const presetAmounts = [1000, 2500, 5000, 10000, 25000, 50000]

const impactExamples = [
  { amount: "₹5,000",  impact: "Covers one month of school fees for a child",      icon: FaGraduationCap, color: "#0B4C8A" },
  { amount: "₹15,000", impact: "Supports a family through a full school term",      icon: FaUsers,         color: "#F9A11B" },
  { amount: "₹50,000", impact: "Creates a revolving fund supporting 5+ families",  icon: FaHeart,         color: "#0B4C8A" },
]

const trustPoints = [
  { icon: FaLock,        text: "Payments secured by Razorpay" },
  { icon: FaFileInvoice, text: "80G tax receipt within 24 hrs" },
  { icon: FaChartLine,   text: "Quarterly impact reports sent" },
  { icon: FaShieldAlt,   text: "100% funds reach families" },
]

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
]

const RAZORPAY_KEY = "rzp_test_SNWMyYGGnFaJ0I"

function validateForm(form: FormData, amount: number): FormErrors {
  const errors: FormErrors = {}
  if (!form.firstName.trim())                      errors.firstName = "First name is required."
  else if (!/^[A-Za-z\s]{2,50}$/.test(form.firstName.trim())) errors.firstName = "2–50 letters only."
  if (!form.lastName.trim())                       errors.lastName  = "Last name is required."
  else if (!/^[A-Za-z\s]{2,50}$/.test(form.lastName.trim()))  errors.lastName  = "2–50 letters only."
  if (!form.email.trim())                          errors.email     = "Email is required."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))    errors.email     = "Enter a valid email address."
  if (!form.phone.trim())                          errors.phone     = "Phone number is required."
  else if (!/^[6-9]\d{9}$/.test(form.phone.trim()))           errors.phone     = "Enter a valid 10-digit mobile number."
  if (!form.panNumber.trim())                      errors.panNumber = "PAN is required for 80G receipt."
  else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber.trim().toUpperCase()))
                                                   errors.panNumber = "Enter a valid PAN (e.g. ABCDE1234F)."
  if (!form.address.trim())                        errors.address   = "Address is required."
  else if (form.address.trim().length < 10)        errors.address   = "Please enter your full address."
  if (!form.city.trim())                           errors.city      = "City is required."
  if (!form.state)                                 errors.state     = "Please select your state."
  if (!form.pincode.trim())                        errors.pincode   = "Pincode is required."
  else if (!/^\d{6}$/.test(form.pincode.trim()))   errors.pincode   = "Enter a valid 6-digit pincode."
  if (form.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstin.toUpperCase()))
                                                   errors.gstin     = "Enter a valid 15-digit GSTIN."
  if (amount < 100)     errors.amount = "Minimum donation is ₹100."
  if (amount > 1000000) errors.amount = "Maximum is ₹10,00,000 per transaction."
  return errors
}

function numberToWords(n: number): string {
  if (n === 0) return "Zero"
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
                 "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
  const bH = (x: number): string => x < 20 ? ones[x] : tens[Math.floor(x/10)] + (x%10 ? " "+ones[x%10] : "")
  const bT = (x: number): string => x < 100 ? bH(x) : ones[Math.floor(x/100)]+" Hundred"+(x%100?" "+bH(x%100):"")
  let r = ""
  if (n >= 10000000) { r += bT(Math.floor(n/10000000))+" Crore "; n %= 10000000 }
  if (n >= 100000)   { r += bT(Math.floor(n/100000))+" Lakh ";    n %= 100000   }
  if (n >= 1000)     { r += bT(Math.floor(n/1000))+" Thousand ";  n %= 1000     }
  if (n > 0)         { r += bT(n) }
  return r.trim()
}

function printReceipt(result: DonationResult, form: FormData) {
  const now     = new Date()
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
  const words   = numberToWords(result.amount)
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Donation Receipt ${result.receiptNumber}</title>
<style>
@page{margin:15mm;size:A4}*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Times New Roman',Times,serif;color:#000;font-size:12pt}
.page{max-width:750px;margin:0 auto;padding:20px}
.org-header{text-align:center;border-bottom:3px double #0B4C8A;padding-bottom:14px;margin-bottom:14px}
.org-name{font-size:22pt;font-weight:bold;color:#0B4C8A;letter-spacing:1px}
.org-sub,.org-reg,.reg-details{font-size:9pt;color:#555;margin-top:3px}
.receipt-title{text-align:center;margin:12px 0}
.receipt-title h2{font-size:14pt;font-weight:bold;text-decoration:underline;text-transform:uppercase}
.receipt-title p{font-size:9pt;color:#333;margin-top:3px}
.meta-row{display:flex;justify-content:space-between;margin:10px 0;font-size:10pt}
hr{border:none;border-top:1px solid #999;margin:10px 0}.bold-hr{border-top:2px solid #000}
.section-title{font-weight:bold;font-size:10pt;text-decoration:underline;margin:12px 0 6px}
.detail-row{display:flex;margin:4px 0;font-size:10pt}
.detail-label{width:220px;font-weight:bold;color:#111;flex-shrink:0}.detail-value{flex:1;color:#222}
.amount-box{border:2px solid #0B4C8A;border-radius:6px;padding:14px 18px;margin:14px 0;background:#f0f6ff}
.amount-big{font-size:20pt;font-weight:bold;color:#0B4C8A}.amount-words{font-size:10pt;color:#333;margin-top:4px}
.certification{margin:14px 0;font-size:10pt;line-height:1.7;border:1px solid #ccc;padding:12px;background:#fafafa}
.tax-note{background:#fffbe6;border:1px solid #f0c040;border-radius:4px;padding:10px 14px;margin:12px 0;font-size:9.5pt;line-height:1.6}
.sig-row{display:flex;justify-content:space-between;margin-top:30px;font-size:10pt}
.sig-block{text-align:center}.sig-line{border-top:1px solid #333;width:160px;margin:30px auto 4px}
.footer-bar{border-top:3px double #0B4C8A;padding-top:8px;margin-top:20px;text-align:center;font-size:8.5pt;color:#555}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.no-print{display:none}}
</style></head><body><div class="page">
<div class="org-header"><div class="org-name">SCHOOLFEE.ORG</div>
<div class="org-sub">An Initiative of CHM (Community Health Mission)</div>
<div class="org-reg">Registered under Section 12A &amp; 80G of the Income Tax Act, 1961</div>
<div class="reg-details">PAN: AABCC1234D | 80G Reg. No.: CHM/80G/2024/001 | 12A Reg. No.: CHM/12A/2024/001</div>
<div class="reg-details">Registered Office: 123, Education Lane, New Delhi – 110001 | Email: donations@schoolfee.org</div></div>
<div class="receipt-title"><h2>Official Donation Receipt</h2><p>(Valid for Income Tax Deduction under Section 80G of the Income Tax Act, 1961)</p></div>
<div class="meta-row"><span><strong>Receipt No.:</strong> ${result.receiptNumber}</span><span><strong>Date:</strong> ${dateStr}</span></div>
<div class="meta-row"><span><strong>Payment Ref.:</strong> ${result.paymentId}</span><span><strong>Financial Year:</strong> ${result.financialYear}</span></div>
<hr class="bold-hr">
<div class="section-title">Donor Information</div>
<div class="detail-row"><span class="detail-label">Donor Name:</span><span class="detail-value">${form.isAnonymous?"Anonymous Donor":`${form.firstName} ${form.lastName}`}</span></div>
${form.organizationName?`<div class="detail-row"><span class="detail-label">Organization:</span><span class="detail-value">${form.organizationName} (${form.organizationType})</span></div>`:""}
${!form.isAnonymous?`<div class="detail-row"><span class="detail-label">PAN Number:</span><span class="detail-value">${form.panNumber.toUpperCase()}</span></div>
${form.gstin?`<div class="detail-row"><span class="detail-label">GSTIN:</span><span class="detail-value">${form.gstin.toUpperCase()}</span></div>`:""}
<div class="detail-row"><span class="detail-label">Address:</span><span class="detail-value">${form.address}, ${form.city}, ${form.state} – ${form.pincode}</span></div>
<div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${form.email}</span></div>
<div class="detail-row"><span class="detail-label">Phone:</span><span class="detail-value">${form.phone}</span></div>`:""}
<hr>
<div class="section-title">Donation Details</div>
<div class="amount-box"><div class="amount-big">₹${result.amount.toLocaleString("en-IN")}</div><div class="amount-words">Rupees ${words} Only</div></div>
<div class="detail-row"><span class="detail-label">Mode of Payment:</span><span class="detail-value">Online (Razorpay Payment Gateway)</span></div>
<div class="detail-row"><span class="detail-label">Purpose:</span><span class="detail-value">General Fund — Schoolfee.org / CHM Initiative</span></div>
<div class="detail-row"><span class="detail-label">Transaction ID:</span><span class="detail-value">${result.paymentId}</span></div>
<hr>
<div class="certification"><strong>CERTIFICATION:</strong><br><br>
This is to certify that <strong>${form.isAnonymous?"the donor (Anonymous)":`${form.firstName} ${form.lastName}`}</strong>
has made a voluntary donation of <strong>₹${result.amount.toLocaleString("en-IN")} (Rupees ${words} Only)</strong>
to <strong>Schoolfee.org / Community Health Mission (CHM)</strong> on <strong>${dateStr}</strong>
via online payment (Transaction Reference: <strong>${result.paymentId}</strong>).</div>
<div class="tax-note"><strong>Tax Deduction Note (Section 80G):</strong><br>
This receipt is eligible for income tax deduction under Section 80G. Financial year: <strong>${result.financialYear}</strong>.</div>
<div class="sig-row">
<div class="sig-block"><div class="sig-line"></div><div><strong>Authorised Signatory</strong></div><div style="font-size:9pt;color:#555;">Schoolfee.org / CHM</div></div>
<div class="sig-block" style="text-align:center;"><div style="border:2px solid #0B4C8A;padding:6px 12px;font-size:9pt;color:#0B4C8A;font-weight:bold;">PAID ✓<br><span style="font-size:8pt;">${dateStr}</span></div></div>
<div class="sig-block"><div class="sig-line"></div><div><strong>Donor Acknowledgement</strong></div><div style="font-size:9pt;color:#555;">${form.isAnonymous?"Anonymous":form.firstName+" "+form.lastName}</div></div>
</div>
<div class="footer-bar">System-generated receipt · Schoolfee.org · donations@schoolfee.org · Generated on ${dateStr}</div>
<div class="no-print" style="text-align:center;margin-top:20px;">
<button onclick="window.print()" style="background:#0B4C8A;color:white;padding:10px 24px;border:none;border-radius:6px;font-size:13px;cursor:pointer;">Print / Save as PDF</button>
</div>
</div></body></html>`
  const w = window.open("","_blank")
  if (w) { w.document.write(html); w.document.close() }
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

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000)
  const [customAmount,   setCustomAmount]   = useState("")
  const [form,           setForm]           = useState<FormData>({
    firstName:"",lastName:"",email:"",phone:"",panNumber:"",
    organizationName:"",organizationType:"individual",gstin:"",
    address:"",city:"",state:"",pincode:"",isAnonymous:false,message:"",
  })
  const [errors,        setErrors]          = useState<FormErrors>({})
  const [isLoading,     setIsLoading]       = useState(false)
  const [showOrgFields, setShowOrgFields]   = useState(false)
  const [modal, setModal] = useState<null | { type:"success"; result:DonationResult } | { type:"failure"; reason:string }>(null)

  const currentAmount = customAmount ? parseInt(customAmount)||0 : selectedAmount||0

  const handleAmountSelect = (amount: number) => { setSelectedAmount(amount); setCustomAmount(""); setErrors(e=>({...e,amount:""})) }
  const handleCustomAmount = (value: string)  => { setCustomAmount(value); setSelectedAmount(null); setErrors(e=>({...e,amount:""})) }
  const updateForm = (field: keyof FormData, value: string|boolean) => {
    setForm(p=>({...p,[field]:value})); setErrors(p=>({...p,[field]:""}))
  }

  const handleDonate = async () => {
    const errs = validateForm(form, currentAmount)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      document.getElementById(Object.keys(errs)[0])?.scrollIntoView({ behavior:"smooth", block:"center" })
      return
    }
    setIsLoading(true)
    try {
      const orderRes  = await fetch("/api/public/razorpay-donation-order", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ amount:currentAmount, email:form.email, name:`${form.firstName} ${form.lastName}` }),
      })
      const orderData = await orderRes.json()
      if (!orderData.success) { setErrors({ amount: orderData.error||"Could not initiate payment." }); setIsLoading(false); return }

      const rzp = new (window as any).Razorpay({
        key: RAZORPAY_KEY, order_id: orderData.order.id, amount: orderData.order.amount, currency:"INR",
        name:"Schoolfee.org / CHM", description:"Donation — Schoolfee Education Initiative",
        prefill:{ name:`${form.firstName} ${form.lastName}`, email:form.email, contact:form.phone },
        theme:{ color:"#0B4C8A" },
        handler: async (response: any) => {
          try {
            const verRes  = await fetch("/api/public/razorpay-donation-verify", {
              method:"POST", headers:{"Content-Type":"application/json"},
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                formData:{ ...form, panNumber:form.panNumber.toUpperCase(), donationAmount:currentAmount },
              }),
            })
            const verData = await verRes.json()
            if (verData.success) {
              setModal({ type:"success", result:{ donationId:verData.donationId, receiptNumber:verData.receiptNumber, financialYear:verData.financialYear, paymentId:response.razorpay_payment_id, amount:currentAmount }})
            } else {
              setModal({ type:"failure", reason: verData.error||"Verification failed." })
            }
          } catch { setModal({ type:"failure", reason:"Network error during verification." }) }
          finally  { setIsLoading(false) }
        },
        modal:{ ondismiss:()=>{ setIsLoading(false) } },
      })
      rzp.on("payment.failed", async (resp: any) => {
        await fetch("/api/public/razorpay-donation-verify",{ method:"PUT", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({ razorpay_order_id:orderData.order.id, error_description:resp.error?.description, amount_paise:orderData.order.amount }) }).catch(()=>{})
        setModal({ type:"failure", reason: resp.error?.description||"Payment failed. Please try again." })
        setIsLoading(false)
      })
      rzp.open()
    } catch { setErrors({ amount:"Unexpected error. Please try again." }); setIsLoading(false) }
  }

  const inp = (field: string) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors ${errors[field]?"border-red-400 bg-red-50 focus:border-red-500":"border-gray-200 bg-white focus:border-[#0B4C8A]"}`

  const resetForm = () => {
    setModal(null)
    setForm({ firstName:"",lastName:"",email:"",phone:"",panNumber:"",organizationName:"",organizationType:"individual",gstin:"",address:"",city:"",state:"",pincode:"",isAnonymous:false,message:"" })
    setSelectedAmount(5000); setCustomAmount("")
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <main className="bg-[#F6F5F1] min-h-screen">

        {/* HERO */}
        <section className="pt-24 pb-8 md:pt-12 md:pb-10">
          <div className="max-w-8xl mx-auto px-5 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-[#0B4C8A]/10 text-[#0B4C8A] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              <FaHeart className="text-[#F9A11B]" />
              Make a Difference Today
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B4C8A] mb-4 leading-tight">
              Donate to Schoolfee.org
              <span className="block text-xl md:text-2xl font-normal text-gray-500 mt-1">An initiative of CHM — Community Health Mission</span>
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

              {/* ────────────────────────────────────────
                  LEFT — DONATION FORM
              ──────────────────────────────────────── */}
              <div className="w-full lg:flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Form header */}
                <div className="bg-[#0B4C8A] px-6 py-4 flex items-center gap-3">
                  {/* <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <FaHeart className="text-white text-sm" />
                  </div> */}
                  <div>
                    <div className="text-white font-semibold">Make a Donation</div>
                    <div className="text-white/70 text-xs">All fields marked * are required</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-white/80 text-xs">
                    <FaLock className="text-xs" /> Secure Payment
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-7">

                  {/* STEP 1: Amount */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-[#0B4C8A] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <h3 className="font-semibold text-gray-800">Choose Your Donation Amount</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                            selectedAmount===amount
                              ? "bg-[#0B4C8A] text-white border-[#0B4C8A] shadow-md"
                              : "border-gray-200 text-gray-700 hover:border-[#0B4C8A] hover:text-[#0B4C8A] bg-gray-50"
                          }`}
                        >
                          ₹{amount.toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-500 whitespace-nowrap">Custom amount:</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                        <input
                          id="amount"
                          type="number"
                          value={customAmount}
                          onChange={(e) => handleCustomAmount(e.target.value)}
                          placeholder="Enter amount"
                          className={`border rounded-lg pl-7 pr-3 py-2.5 text-sm w-44 focus:outline-none transition-colors ${errors.amount?"border-red-400 bg-red-50":"border-gray-200 focus:border-[#0B4C8A]"}`}
                        />
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

                  {/* STEP 2: Personal Details */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-[#0B4C8A] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <h3 className="font-semibold text-gray-800">Your Personal Details</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="First Name *" error={errors.firstName}>
                          <input id="firstName" placeholder="e.g. Rahul" value={form.firstName}
                            onChange={(e)=>updateForm("firstName",e.target.value)} className={inp("firstName")} />
                        </Field>
                        <Field label="Last Name *" error={errors.lastName}>
                          <input id="lastName" placeholder="e.g. Sharma" value={form.lastName}
                            onChange={(e)=>updateForm("lastName",e.target.value)} className={inp("lastName")} />
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Email Address *" error={errors.email}>
                          <input id="email" type="email" placeholder="you@example.com" value={form.email}
                            onChange={(e)=>updateForm("email",e.target.value)} className={inp("email")} />
                        </Field>
                        <Field label="Phone Number *" error={errors.phone}>
                          <input id="phone" type="tel" placeholder="10-digit mobile" value={form.phone}
                            onChange={(e)=>updateForm("phone",e.target.value)} className={inp("phone")} />
                        </Field>
                      </div>

                      <Field label="PAN Number * (required for 80G tax receipt)" error={errors.panNumber}>
                        <input id="panNumber" placeholder="e.g. ABCDE1234F" value={form.panNumber}
                          onChange={(e)=>updateForm("panNumber",e.target.value.toUpperCase())} maxLength={10} className={inp("panNumber")} />
                      </Field>

                      <Field label="Full Address * (for 80G receipt)" error={errors.address}>
                        <textarea id="address" placeholder="House/Flat No., Street, Area..." value={form.address}
                          onChange={(e)=>updateForm("address",e.target.value)} rows={2}
                          className={`${inp("address")} resize-none`} />
                      </Field>

                      <div className="grid grid-cols-3 gap-3">
                        <Field label="City *" error={errors.city}>
                          <input id="city" placeholder="City" value={form.city}
                            onChange={(e)=>updateForm("city",e.target.value)} className={inp("city")} />
                        </Field>
                        <Field label="State *" error={errors.state}>
                          <select id="state" value={form.state}
                            onChange={(e)=>updateForm("state",e.target.value)}
                            className={`${inp("state")} bg-white`}>
                            <option value="">Select</option>
                            {INDIAN_STATES.map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                        </Field>
                        <Field label="Pincode *" error={errors.pincode}>
                          <input id="pincode" placeholder="6 digits" value={form.pincode}
                            onChange={(e)=>updateForm("pincode",e.target.value)} maxLength={6} className={inp("pincode")} />
                        </Field>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-200" />

                  {/* STEP 3: Optional */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-bold flex-shrink-0">3</div>
                      <h3 className="font-semibold text-gray-800">Additional Options <span className="text-gray-400 font-normal text-sm">(optional)</span></h3>
                    </div>

                    <button
                      type="button"
                      onClick={()=>setShowOrgFields(v=>!v)}
                      className="flex items-center gap-2 text-sm text-[#0B4C8A] font-medium border border-[#0B4C8A]/30 rounded-lg px-4 py-2 hover:bg-[#0B4C8A]/5 transition mb-3"
                    >
                      <FaPlus className="text-xs" />
                      {showOrgFields ? "Remove" : "Add"} Organisation / CSR Details
                    </button>

                    {showOrgFields && (
                      <div className="space-y-3 bg-[#F6F5F1] rounded-xl p-4 border border-gray-200 mb-3">
                        <Field>
                          <input placeholder="Organisation Name" value={form.organizationName}
                            onChange={(e)=>updateForm("organizationName",e.target.value)} className={inp("organizationName")} />
                        </Field>
                        <Field>
                          <select value={form.organizationType} onChange={(e)=>updateForm("organizationType",e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#0B4C8A]">
                            <option value="individual">Individual</option>
                            <option value="ngo">NGO / Trust</option>
                            <option value="corporate">Corporate / CSR</option>
                            <option value="government">Government Body</option>
                            <option value="other">Other</option>
                          </select>
                        </Field>
                        <Field error={errors.gstin}>
                          <input placeholder="GSTIN (optional, 15 digits)" value={form.gstin}
                            onChange={(e)=>updateForm("gstin",e.target.value.toUpperCase())} maxLength={15} className={inp("gstin")} />
                        </Field>
                      </div>
                    )}

                    <Field>
                      <textarea placeholder="Leave a message or dedication (optional)" value={form.message}
                        onChange={(e)=>updateForm("message",e.target.value)} rows={2}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0B4C8A] resize-none" />
                    </Field>

                    <label className="flex items-center gap-3 cursor-pointer mt-3 p-3 rounded-lg hover:bg-gray-50 transition">
                      <input type="checkbox" checked={form.isAnonymous}
                        onChange={(e)=>updateForm("isAnonymous",e.target.checked)} className="w-4 h-4 accent-[#0B4C8A]" />
                      <span className="text-sm text-gray-600">
                        Donate anonymously <span className="text-gray-400">(your name won't appear publicly)</span>
                      </span>
                    </label>
                  </div>

                  {/* SUBMIT */}
                  <div className="pt-1">
                    <button
                      onClick={handleDonate}
                      disabled={isLoading || currentAmount < 1}
                      className="w-full bg-[#F9A11B] text-white py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#e8920a] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Processing…
                        </span>
                      ) : (
                        <><FaHeart /> Donate ₹{currentAmount.toLocaleString("en-IN")} Now</>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                      <FaLock className="text-[10px]" />
                      Secured by Razorpay — India's most trusted payment gateway
                    </p>
                  </div>

                </div>
              </div>

              {/* ────────────────────────────────────────
                  RIGHT — STICKY SIDEBAR
              ──────────────────────────────────────── */}
              <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-24 space-y-4">

                {/* Amount Summary */}
                <div className="bg-[#0B4C8A] text-white rounded-2xl p-5">
                  <div className="text-white/70 text-xs uppercase tracking-widest mb-1">Your Donation</div>
                  <div className="text-4xl font-bold mb-0.5">
                    ₹{currentAmount > 0 ? currentAmount.toLocaleString("en-IN") : "—"}
                  </div>
                  <div className="text-white/60 text-xs">Tax-deductible under Section 80G</div>
                  <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-center">
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="text-lg font-bold">50%</div>
                      <div className="text-white/60 text-xs">Tax Benefit</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="text-lg font-bold">24h</div>
                      <div className="text-white/60 text-xs">Receipt Delivery</div>
                    </div>
                  </div>
                </div>

                {/* Impact */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">What Your Donation Does</h3>
                  <div className="space-y-4">
                    {impactExamples.map((ex) => (
                      <div key={ex.amount} className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background:`${ex.color}15` }}>
                          <ex.icon className="text-sm" style={{ color:ex.color }} />
                        </div>
                        <div>
                          <div className="font-semibold text-[#0B4C8A] text-sm">{ex.amount}</div>
                          <div className="text-gray-500 text-xs leading-relaxed">{ex.impact}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust signals */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Why Trust Us</h3>
                  <div className="space-y-3">
                    {trustPoints.map((tp, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                          <tp.icon className="text-green-600 text-xs" />
                        </div>
                        <span className="text-sm text-gray-600">{tp.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 80G badge */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                  {/* <div className="text-2xl mb-1">📋</div> */}
                  <div className="text-xs font-semibold text-amber-800">Registered under</div>
                  <div className="text-sm font-bold text-amber-900">Section 80G & 12A</div>
                  <div className="text-xs text-amber-700 mt-1">Income Tax Act, 1961</div>
                </div>

              </div>
            </div>
          </div>
        </section>

      </main>

      {/* SUCCESS MODAL */}
      {modal?.type === "success" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-green-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B4C8A]">Donation Successful!</h2>
              <p className="text-gray-500 text-sm mt-1">Thank you for your generous contribution.</p>
            </div>
            <div className="bg-[#F6F5F1] rounded-xl p-4 space-y-2.5 text-sm mb-6">
              {[
                ["Amount",         `₹${modal.result.amount.toLocaleString("en-IN")}`],
                ["Donation ID",    `#${modal.result.donationId}`],
                ["Receipt No.",    modal.result.receiptNumber],
                ["Financial Year", modal.result.financialYear],
                ["Payment Ref.",   modal.result.paymentId],
              ].map(([k,v])=>(
                <div key={k} className="flex justify-between items-center">
                  <span className="text-gray-500">{k}</span>
                  <span className={`font-medium ${k==="Receipt No."?"text-green-700":k==="Payment Ref."?"font-mono text-xs":"text-[#0B4C8A]"}`}>{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mb-4">
              An 80G tax receipt has been emailed to <strong>{form.email}</strong>.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={()=>printReceipt(modal.result, form)}
                className="w-full bg-[#0B4C8A] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition">
                <FaDownload /> Download / Print 80G Receipt
              </button>
              <button onClick={resetForm}
                className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAILURE MODAL */}
      {modal?.type === "failure" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaTimesCircle className="text-red-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
              <p className="text-gray-500 text-sm mt-2">{modal.reason}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
              No amount has been deducted. Please try again or contact <strong>support@schoolfee.org</strong>.
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={()=>setModal(null)}
                className="w-full bg-[#F9A11B] text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
                Try Again
              </button>
              <button onClick={()=>setModal(null)}
                className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}