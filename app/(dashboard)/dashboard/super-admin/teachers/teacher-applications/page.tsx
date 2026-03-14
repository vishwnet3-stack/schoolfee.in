"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, RefreshCw, Users, CreditCard, Clock, CheckCircle2,
  XCircle, AlertCircle, ChevronLeft, ChevronRight,
  Mail, Phone, MapPin, Calendar, Eye, ChevronUp,
  GraduationCap, BookOpen, Shield, FileText, ExternalLink,
  CreditCard as CardIcon,
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";

interface Registration {
  id: number; public_user_id: number | null;
  full_name: string; dob: string; gender: string;
  phone: string; email: string; state: string; address?: string; pincode?: string;
  father_name?: string;
  qualification: string; other_qualification: string | null;
  subject: string; other_subject: string | null; experience: string;
  school_name: string; employee_id: string;
  salary_monthly: string; joining_date: string; employment_type: string;
  razorpay_payment_id: string | null;
  payment_status: "pending" | "paid" | "failed";
  payment_amount: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  admin_notes: string | null;
  submitted_at: string; updated_at: string;
  user_full_name: string | null; user_email: string | null;
  // DigiLocker KYC fields
  digilocker_client_id?: string | null;
  masked_aadhaar?: string | null;
  pan_number?: string | null;
  aadhaar_local_pdf?: string | null;
  pan_local_pdf?: string | null;
  apaar_local_pdf?: string | null;
  pan_full_name?: string | null;
  pan_dob?: string | null;
  kyc_verified?: number;
}

interface Stats { total: number; paid: number; pending_review: number; approved: number; }

const STATUS_COLORS: Record<string, string> = {
  pending:      "bg-amber-100 text-amber-700 border-amber-200",
  under_review: "bg-blue-100 text-blue-700 border-blue-200",
  approved:     "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected:     "bg-red-100 text-red-700 border-red-200",
};
const PAYMENT_COLORS: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
};

const AVATAR_COLORS = [
  "bg-violet-600","bg-[#00468E]","bg-emerald-600","bg-amber-500","bg-rose-500","bg-cyan-600",
];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];
const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
const formatDate  = (d: string)    => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

function maskAadhaar(val: string | null | undefined): string {
  if (!val) return "—";
  return val.replace(/\d(?=\d{4})/g, "X");
}
function maskPan(val: string | null | undefined): string {
  if (!val) return "—";
  return val.slice(0, 2) + "XXXXX" + val.slice(7);
}

function viewPdf(localPath: string | null | undefined, label: string) {
  if (!localPath) {
    alert(`No ${label} document is available.`);
    return;
  }
  const safePath = localPath.replace(/\\/g, "/");
  const url = `/api/public/digilocker/teacher-pdf-proxy?file=${encodeURIComponent(safePath)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// KYC Detail panel shown in expanded row
function KycDetailPanel({ reg }: { reg: Registration }) {
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showPan,     setShowPan]     = useState(false);

  if (!reg.digilocker_client_id && !reg.masked_aadhaar && !reg.pan_number) {
    return (
      <div className="bg-white dark:bg-[#0d1f3c] rounded-xl p-4 border border-gray-100 dark:border-[#00468E]/20">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">KYC / DigiLocker</p>
        <p className="text-sm text-gray-400 italic">No DigiLocker KYC data available for this application.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0d1f3c] rounded-xl p-4 border border-green-200 dark:border-green-700/30">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-green-600" />
        <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">DigiLocker KYC Verified</p>
        {reg.kyc_verified ? (
          <span className="ml-auto text-[10px] font-bold bg-green-100 text-green-700 border border-green-300 px-2 py-0.5 rounded-full">✓ Verified</span>
        ) : null}
      </div>

      {/* Aadhaar section */}
      <div className="mb-3">
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">Aadhaar Details</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-100">
            <p className="text-[10px] text-gray-400 uppercase mb-0.5">Aadhaar (Masked)</p>
            <p className="font-mono font-bold text-sm text-gray-800 dark:text-gray-100 flex items-center gap-1">
              {showAadhaar ? (reg.masked_aadhaar || "—") : maskAadhaar(reg.masked_aadhaar)}
              <button onClick={() => setShowAadhaar(v => !v)}
                className="text-gray-400 hover:text-gray-700 ml-1 transition-colors" title={showAadhaar ? "Hide" : "Show"}>
                {showAadhaar
                  ? <Eye className="h-3 w-3 inline" />
                  : <Eye className="h-3 w-3 inline opacity-40" />}
              </button>
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-100">
            <p className="text-[10px] text-gray-400 uppercase mb-0.5">DigiLocker Client</p>
            <p className="font-mono text-xs text-gray-600 dark:text-gray-300 truncate">
              {reg.digilocker_client_id || "—"}
            </p>
          </div>
        </div>

        {reg.aadhaar_local_pdf && (
          <button
            onClick={() => viewPdf(reg.aadhaar_local_pdf, "Aadhaar")}
            className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300 transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> View Aadhaar Document
          </button>
        )}
      </div>

      {/* PAN section */}
      <div>
        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">PAN Details</p>
        {reg.pan_number || reg.pan_full_name ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 border border-amber-100">
              <p className="text-[10px] text-gray-400 uppercase mb-0.5">PAN Number</p>
              <p className="font-mono font-bold text-sm text-gray-800 dark:text-gray-100 flex items-center gap-1">
                {showPan ? (reg.pan_number || "—") : maskPan(reg.pan_number)}
                <button onClick={() => setShowPan(v => !v)}
                  className="text-gray-400 hover:text-gray-700 ml-1 transition-colors" title={showPan ? "Hide" : "Show"}>
                  {showPan
                    ? <Eye className="h-3 w-3 inline" />
                    : <Eye className="h-3 w-3 inline opacity-40" />}
                </button>
              </p>
            </div>
            {reg.pan_full_name && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 border border-amber-100">
                <p className="text-[10px] text-gray-400 uppercase mb-0.5">Name on PAN</p>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{reg.pan_full_name}</p>
              </div>
            )}
            {reg.pan_dob && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 border border-amber-100">
                <p className="text-[10px] text-gray-400 uppercase mb-0.5">DOB on PAN</p>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{reg.pan_dob}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">PAN data not found in DigiLocker</p>
        )}

        {reg.pan_local_pdf && (
          <button
            onClick={() => viewPdf(reg.pan_local_pdf, "PAN")}
            className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300 transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> View PAN Document
          </button>
        )}
      </div>

      {/* APAAR */}
      {reg.apaar_local_pdf && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#00468E]/15">
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1.5">APAAR / ABC ID</p>
          <button
            onClick={() => viewPdf(reg.apaar_local_pdf, "APAAR")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300 transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> View APAAR Document
          </button>
        </div>
      )}
    </div>
  );
}

export default function TeacherApplicationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats]       = useState<Stats>({ total: 0, paid: 0, pending_review: 0, approved: 0 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [search,          setSearch]          = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter,    setStatusFilter]    = useState("all");
  const [paymentFilter,   setPaymentFilter]   = useState("all");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch, status: statusFilter,
        payment_status: paymentFilter, page: String(page), limit: "20",
      });
      const res  = await fetch(`/api/dashboard/teacher-registrations?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to load");
      setRegistrations(data.registrations);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, paymentFilter]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const updateStatus = async (id: number, status: string, notes?: string) => {
    try {
      await fetch("/api/dashboard/teacher-registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, admin_notes: notes }),
      });
      fetchData(pagination.page);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Teacher Applications" description="All teacher registration applications with payment status and KYC verification">
        <button
          onClick={() => fetchData(pagination.page)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#00468E]/30 bg-white dark:bg-[#0d1f3c] rounded-xl hover:border-[#00468E] hover:text-[#00468E] transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: stats.total,          icon: Users,        bg: "bg-violet-50 dark:bg-violet-900/20",  color: "text-violet-600" },
          { label: "Payments Received",  value: stats.paid,           icon: CreditCard,   bg: "bg-emerald-50 dark:bg-emerald-900/25",color: "text-emerald-600" },
          { label: "Pending Review",     value: stats.pending_review, icon: Clock,        bg: "bg-amber-50 dark:bg-amber-900/25",    color: "text-amber-600" },
          { label: "Approved",           value: stats.approved,       icon: CheckCircle2, bg: "bg-green-50 dark:bg-green-900/25",    color: "text-green-600" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 rounded-2xl shadow-sm overflow-hidden">

        {/* Filters */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-[#00468E]/15 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone, school…" className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-[#001833] border border-gray-200 dark:border-[#00468E]/25 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00468E]/25 focus:border-[#00468E] transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm bg-gray-50 dark:bg-[#001833] border border-gray-200 dark:border-[#00468E]/25 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00468E]/25">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="px-3 py-2 text-sm bg-gray-50 dark:bg-[#001833] border border-gray-200 dark:border-[#00468E]/25 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00468E]/25">
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Unpaid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 my-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-4">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div><p className="text-sm font-semibold text-red-700 dark:text-red-300">Failed to load applications</p><p className="text-xs text-red-500 mt-0.5">{error}</p></div>
          </div>
        )}

        {/* Skeleton */}
        {loading && !error && (
          <div className="divide-y divide-gray-100 dark:divide-[#00468E]/10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#001833] shrink-0" />
                <div className="flex-1 space-y-2"><div className="h-3.5 bg-gray-100 dark:bg-[#001833] rounded w-40" /><div className="h-3 bg-gray-100 dark:bg-[#001833] rounded w-56" /></div>
                <div className="h-6 bg-gray-100 dark:bg-[#001833] rounded-full w-20" />
                <div className="h-6 bg-gray-100 dark:bg-[#001833] rounded-full w-16" />
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            {registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#001833] flex items-center justify-center mb-4">
                  <GraduationCap className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-200">No applications found</p>
                <p className="text-sm text-gray-400 mt-1">{search ? "Try a different search" : "Teacher applications will appear here"}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-[#00468E]/15 bg-gray-50/70 dark:bg-[#001833]/50">
                      {["Teacher","Contact","School","Subject","KYC","Payment","Status","Submitted",""].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#00468E]/10">
                    {registrations.map(reg => (
                      <>
                        <tr key={reg.id} className="hover:bg-gray-50/70 dark:hover:bg-[#001833]/40 transition-colors">

                          {/* Teacher */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColor(reg.id)}`}>
                                {getInitials(reg.full_name)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{reg.full_name}</p>
                                <p className="text-xs text-gray-400 truncate">{reg.email}</p>
                                {reg.user_full_name && <p className="text-[10px] text-violet-500 font-medium mt-0.5">Linked: {reg.user_full_name}</p>}
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-4 py-3.5">
                            <p className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300"><Phone className="h-3 w-3" />{reg.phone}</p>
                            <p className="flex items-center gap-1 text-xs text-gray-500 mt-1"><MapPin className="h-3 w-3" />{reg.state}</p>
                          </td>

                          {/* School */}
                          <td className="px-4 py-3.5">
                            <p className="font-medium text-gray-800 dark:text-gray-100 text-xs max-w-[150px] truncate">{reg.school_name}</p>
                            <p className="text-xs text-gray-400 capitalize">{reg.employment_type}</p>
                          </td>

                          {/* Subject */}
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                              <BookOpen className="h-3 w-3" />
                              {reg.subject === "Other" ? reg.other_subject : reg.subject}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">{reg.experience}</p>
                          </td>

                          {/* KYC badge */}
                          <td className="px-4 py-3.5">
                            {reg.masked_aadhaar || reg.digilocker_client_id ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                                <Shield className="h-3 w-3" /> KYC ✓
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-gray-50 text-gray-400 border border-gray-200">
                                No KYC
                              </span>
                            )}
                          </td>

                          {/* Payment */}
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${PAYMENT_COLORS[reg.payment_status]}`}>
                              {reg.payment_status === "paid" ? <CheckCircle2 className="h-3 w-3" /> : reg.payment_status === "failed" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                              {reg.payment_status === "paid" ? "₹111 Paid" : reg.payment_status === "failed" ? "Failed" : "Unpaid"}
                            </span>
                          </td>

                          {/* Status dropdown */}
                          <td className="px-4 py-3.5">
                            <select
                              value={reg.status}
                              onChange={e => updateStatus(reg.id, e.target.value, reg.admin_notes || undefined)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer outline-none ${STATUS_COLORS[reg.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="under_review">Under Review</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="h-3.5 w-3.5" />{formatDate(reg.submitted_at)}</div>
                          </td>

                          {/* Expand */}
                          <td className="px-4 py-3.5">
                            <button onClick={() => setExpandedRow(expandedRow === reg.id ? null : reg.id)} className="p-1.5 rounded-lg border border-gray-200 dark:border-[#00468E]/25 text-gray-500 hover:border-violet-500 hover:text-violet-600 transition-colors">
                              {expandedRow === reg.id ? <ChevronUp className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded row */}
                        {expandedRow === reg.id && (
                          <tr key={`${reg.id}-exp`} className="bg-violet-50/40 dark:bg-[#001833]/60">
                            <td colSpan={9} className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                {/* Application Details */}
                                <div className="bg-white dark:bg-[#0d1f3c] rounded-xl p-4 border border-gray-100 dark:border-[#00468E]/20">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Application Details</p>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">DOB</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatDate(reg.dob)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Gender</span><span className="font-semibold text-gray-800 dark:text-gray-100">{reg.gender}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Qualification</span><span className="font-semibold text-gray-800 dark:text-gray-100">{reg.qualification === "Other" ? reg.other_qualification : reg.qualification}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Salary</span><span className="font-semibold text-gray-800 dark:text-gray-100">₹{parseFloat(reg.salary_monthly).toLocaleString()}/mo</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Employee ID</span><span className="font-semibold text-gray-800 dark:text-gray-100">{reg.employee_id}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Joined</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatDate(reg.joining_date)}</span></div>
                                    {reg.razorpay_payment_id && <div className="flex justify-between"><span className="text-gray-500">Payment ID</span><span className="font-mono text-xs text-gray-700 dark:text-gray-300">{reg.razorpay_payment_id}</span></div>}
                                    {reg.address && (
                                      <div className="pt-1 border-t border-gray-100 dark:border-[#00468E]/15">
                                        <span className="text-gray-500 block mb-0.5">Address</span>
                                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{reg.address}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* KYC Panel */}
                                <KycDetailPanel reg={reg} />

                                {/* Linked Account + Admin Notes */}
                                <div className="space-y-4">
                                  <div className="bg-white dark:bg-[#0d1f3c] rounded-xl p-4 border border-gray-100 dark:border-[#00468E]/20">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Linked Account</p>
                                    {reg.user_full_name ? (
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold ${avatarColor(reg.public_user_id || 0)}`}>{getInitials(reg.user_full_name)}</div>
                                          <span className="font-semibold text-gray-800 dark:text-gray-100">{reg.user_full_name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500"><Mail className="h-3 w-3" />{reg.user_email}</div>
                                      </div>
                                    ) : <p className="text-sm text-gray-400">No linked account</p>}
                                  </div>

                                  <div className="bg-white dark:bg-[#0d1f3c] rounded-xl p-4 border border-gray-100 dark:border-[#00468E]/20">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Admin Notes</p>
                                    <textarea
                                      defaultValue={reg.admin_notes || ""}
                                      placeholder="Add notes about this application…"
                                      rows={3}
                                      onBlur={e => updateStatus(reg.id, reg.status, e.target.value)}
                                      className="w-full text-xs bg-gray-50 dark:bg-[#001833] border border-gray-200 dark:border-[#00468E]/20 rounded-lg p-2 text-gray-700 dark:text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                                    />
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 dark:border-[#00468E]/15 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{(pagination.page-1)*pagination.limit+1}–{Math.min(pagination.page*pagination.limit, pagination.total)}</span> of <span className="font-semibold">{pagination.total}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => fetchData(pagination.page-1)} disabled={pagination.page<=1} className="p-1.5 rounded-lg border border-gray-200 dark:border-[#00468E]/25 text-gray-500 hover:border-violet-500 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="h-4 w-4" /></button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_,i) => i+1).map(p => (
                <button key={p} onClick={() => fetchData(p)} className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold border transition-colors ${pagination.page===p ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 dark:border-[#00468E]/25 text-gray-600 dark:text-gray-300 hover:border-violet-500 hover:text-violet-600"}`}>{p}</button>
              ))}
              <button onClick={() => fetchData(pagination.page+1)} disabled={pagination.page>=pagination.totalPages} className="p-1.5 rounded-lg border border-gray-200 dark:border-[#00468E]/25 text-gray-500 hover:border-violet-500 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}