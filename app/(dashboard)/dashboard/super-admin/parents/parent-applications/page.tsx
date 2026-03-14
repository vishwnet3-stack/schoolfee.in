"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, RefreshCw, Users, CreditCard, Clock, CheckCircle2,
  XCircle, AlertCircle, ChevronLeft, ChevronRight,
  Mail, Phone, MapPin, Calendar, Eye, ChevronDown, ChevronUp,
  FileText, ShieldCheck, GraduationCap, School, Hash, UserCheck,
  BadgeCheck, ExternalLink, Building2, IndianRupee,
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";

interface Child {
  id: number;
  registration_id: number;
  child_index: number;
  full_name: string;
  class_grade: string;
  admission_number: string;
  school_name: string;
  school_city: string;
  apaar_id: string | null;
  digilocker_client_id: string | null;
  digilocker_verified: number;
  digilocker_full_name: string | null;
  doc_gender: string | null;
  doc_dob: string | null;
  apaar_doc_path: string | null;
  apaar_doc_url: string | null;
  admin_doc_url: string | null;
}

interface Registration {
  id: number; public_user_id: number | null;
  first_name: string; last_name: string; email: string; phone: string;
  pan_number: string; city: string; state: string;
  fee_amount: string; fee_period: string; reason_for_support: string;
  repayment_duration: number;
  razorpay_payment_id: string | null;
  payment_status: "pending" | "paid" | "failed";
  payment_amount: string; status: string; admin_notes: string | null;
  submitted_at: string; updated_at: string;
  user_full_name: string | null; user_email: string | null;
  children_count: number;
  children: Child[];
}

interface Stats {
  total: number; paid: number; pending_review: number; approved: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  under_review: "bg-blue-100 text-blue-700 border-blue-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};
const PAYMENT_COLORS: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
};

const REASON_LABELS: Record<string, string> = {
  jobLoss: "Job Loss / Unemployment",
  medical: "Medical Emergency",
  businessLoan: "Business Loan",
  familyEmergency: "Family Emergency",
  cashflow: "Cash Flow Issue",
  other: "Other",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-[#00468E]", "bg-violet-600", "bg-emerald-600", "bg-amber-500", "bg-rose-500", "bg-cyan-600",
];
function avatarColor(id: number) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }

function ChildCard({ child }: { child: Child }) {
  const verified = Boolean(child.digilocker_verified);
  return (
    <div className="bg-white dark:bg-[#0a1628] border border-gray-100 dark:border-[#00468E]/20 rounded-xl overflow-hidden">
      {/* Child header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-[#00468E]/15"
        style={{ background: "linear-gradient(135deg, #f8fafc, #f1f5f9)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
            style={{ background: "linear-gradient(135deg, #00468E, #0058B4)" }}>{child.child_index}</div>
          <span className="font-bold text-gray-800 text-sm">{child.full_name}</span>
        </div>
        {verified ? (
          <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">
            <BadgeCheck className="h-3 w-3" />APAAR Verified
          </span>
        ) : (
          <span className="text-[10px] text-gray-400 font-medium px-2 py-1 bg-gray-100 rounded-full">Not Verified</span>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* School info grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <GraduationCap className="h-3.5 w-3.5 text-[#00468E] shrink-0" />
            <span className="font-medium">{child.class_grade}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <Hash className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="font-mono">{child.admission_number}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 col-span-2">
            <School className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span>{child.school_name}, {child.school_city}</span>
          </div>
        </div>

        {/* APAAR ID box */}
        {verified && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/40 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">APAAR ID Document</p>
                {child.apaar_id && (
                  <p className="text-xs font-mono font-bold text-blue-900 dark:text-blue-200 mb-1">
                    ID: {child.apaar_id}
                  </p>
                )}
                {child.digilocker_full_name && (
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <span className="text-blue-400">Name:</span> {child.digilocker_full_name}
                  </p>
                )}
                {child.doc_dob && (
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <span className="text-blue-400">DOB:</span> {child.doc_dob}
                  </p>
                )}
                {child.doc_gender && (
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <span className="text-blue-400">Gender:</span> {child.doc_gender}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                {/* Server-stored doc (permanent) */}
                {child.admin_doc_url && (
                  <a
                    href={child.admin_doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white text-[10px] font-bold bg-[#00468E] hover:bg-[#003070] transition-colors whitespace-nowrap"
                  >
                    <FileText className="h-3 w-3" />View PDF
                  </a>
                )}
                {/* Fallback: original S3 URL if no local copy yet */}
                {!child.admin_doc_url && child.apaar_doc_url && (
                  <a
                    href={child.apaar_doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white text-[10px] font-bold bg-blue-500 hover:bg-blue-600 transition-colors whitespace-nowrap"
                    title="Temporary link — may expire"
                  >
                    <ExternalLink className="h-3 w-3" />View Doc
                  </a>
                )}
              </div>
            </div>
            {/* DigiLocker session ID */}
            {child.digilocker_client_id && (
              <p className="mt-2 text-[9px] font-mono text-blue-400 border-t border-blue-200 pt-2 truncate">
                Session: {child.digilocker_client_id}
              </p>
            )}
          </div>
        )}

        {/* Not verified state */}
        {!verified && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/10 p-2.5 flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">APAAR ID not verified via DigiLocker</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ParentApplicationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, paid: 0, pending_review: 0, approved: 0 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      const res = await fetch(`/api/dashboard/parent-registrations?${params}`);
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
      const res = await fetch("/api/dashboard/parent-registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, admin_notes: notes }),
      });
      const data = await res.json();
      if (data.success) fetchData(pagination.page);
    } catch {}
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Parent Applications" description="All parent registration applications with payment status">
        <button
          onClick={() => fetchData(pagination.page)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#00468E]/30 bg-white dark:bg-[#0d1f3c] rounded-xl hover:border-[#00468E] hover:text-[#00468E] transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Applications", value: stats.total, icon: Users, bg: "bg-blue-50 dark:bg-[#00468E]/20", color: "text-[#00468E] dark:text-blue-400" },
          { label: "Payments Received", value: stats.paid, icon: CreditCard, bg: "bg-emerald-50 dark:bg-emerald-900/25", color: "text-emerald-600" },
          { label: "Pending Review", value: stats.pending_review, icon: Clock, bg: "bg-amber-50 dark:bg-amber-900/25", color: "text-amber-600" },
          { label: "Approved", value: stats.approved, icon: CheckCircle2, bg: "bg-green-50 dark:bg-green-900/25", color: "text-green-600" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}>
              <card.icon className={`h-4.5 w-4.5 ${card.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Table */}
      <div className="bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 rounded-2xl shadow-sm overflow-hidden">

        {/* Filter bar */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-[#00468E]/15 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone…"
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-[#001833] border border-gray-200 dark:border-[#00468E]/25 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00468E]/25 focus:border-[#00468E] transition-all" />
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-50 dark:bg-[#001833] border border-gray-200 dark:border-[#00468E]/25 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00468E]/25">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-50 dark:bg-[#001833] border border-gray-200 dark:border-[#00468E]/25 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00468E]/25">
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Unpaid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 my-3 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-3">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">Failed to load applications</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="divide-y divide-gray-100 dark:divide-[#00468E]/10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#001833] shrink-0" />
                <div className="flex-1 space-y-1.5"><div className="h-3 bg-gray-100 dark:bg-[#001833] rounded w-40" /><div className="h-2.5 bg-gray-100 dark:bg-[#001833] rounded w-52" /></div>
                <div className="h-5 bg-gray-100 dark:bg-[#001833] rounded-full w-16" />
                <div className="h-5 bg-gray-100 dark:bg-[#001833] rounded-full w-14" />
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            {registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#001833] flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">No applications found</p>
                <p className="text-xs text-gray-400 mt-1">{debouncedSearch ? "Try a different search" : "Parent applications will appear here"}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-[#00468E]/15 bg-gray-50/70 dark:bg-[#001833]/50">
                      {["Applicant", "Contact", "Children", "Fee Request", "Payment", "App Status", "Submitted", ""].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#00468E]/10">
                    {registrations.map(reg => (
                      <>
                        <tr key={reg.id} className="hover:bg-gray-50/70 dark:hover:bg-[#001833]/40 transition-colors">
                          {/* Applicant */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColor(reg.id)}`}>
                                {getInitials(`${reg.first_name} ${reg.last_name}`)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{reg.first_name} {reg.last_name}</p>
                                <p className="text-xs text-gray-400 truncate">{reg.email}</p>
                                {reg.user_full_name && (
                                  <p className="text-[10px] text-blue-500 font-medium mt-0.5">Linked: {reg.user_full_name}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-4 py-3">
                            <div className="space-y-0.5">
                              <p className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300"><Phone className="h-3 w-3 shrink-0" />{reg.phone}</p>
                              <p className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="h-3 w-3 shrink-0" />{reg.city}, {reg.state}</p>
                            </div>
                          </td>

                          {/* Children */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              {reg.children_count} {reg.children_count === 1 ? "Child" : "Children"}
                            </span>
                          </td>

                          {/* Fee */}
                          <td className="px-4 py-3">
                            <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">₹{parseFloat(reg.fee_amount).toLocaleString()}</p>
                            <p className="text-xs text-gray-400 capitalize">{reg.fee_period}</p>
                          </td>

                          {/* Payment */}
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${PAYMENT_COLORS[reg.payment_status]}`}>
                              {reg.payment_status === "paid" ? <CheckCircle2 className="h-3 w-3" /> : reg.payment_status === "failed" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                              {reg.payment_status === "paid" ? "₹11 Paid" : reg.payment_status === "failed" ? "Failed" : "Unpaid"}
                            </span>
                          </td>

                          {/* App Status */}
                          <td className="px-4 py-3">
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
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="h-3 w-3 shrink-0" />{formatDate(reg.submitted_at)}</div>
                          </td>

                          {/* Expand */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setExpandedRow(expandedRow === reg.id ? null : reg.id)}
                              className={`p-1.5 rounded-lg border transition-colors ${expandedRow === reg.id ? "bg-[#00468E] border-[#00468E] text-white" : "border-gray-200 dark:border-[#00468E]/25 text-gray-500 hover:border-[#00468E] hover:text-[#00468E]"}`}
                            >
                              {expandedRow === reg.id ? <ChevronUp className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                          </td>
                        </tr>

                        {/* ══ Expanded detail row ══ */}
                        {expandedRow === reg.id && (
                          <tr key={`${reg.id}-expanded`} className="bg-slate-50/80 dark:bg-[#001833]/50">
                            <td colSpan={8} className="px-4 py-4">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

                                {/* Col 1: Parent & Financial details */}
                                <div className="space-y-3">
                                  {/* Parent details */}
                                  <div className="bg-white dark:bg-[#0d1f3c] rounded-xl p-3.5 border border-gray-100 dark:border-[#00468E]/20">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                                      <UserCheck className="h-3 w-3" />Parent Details
                                    </p>
                                    <div className="space-y-1.5 text-xs">
                                      {[
                                        ["PAN", reg.pan_number, "font-mono font-bold"],
                                        ["Address", `${reg.city}, ${reg.state}`, ""],
                                        ["Reason", REASON_LABELS[reg.reason_for_support] || reg.reason_for_support, ""],
                                        ["Repayment", `${reg.repayment_duration} months`, ""],
                                      ].map(([label, value, extra]) => value ? (
                                        <div key={label} className="flex justify-between gap-2">
                                          <span className="text-gray-400 shrink-0">{label}</span>
                                          <span className={`font-semibold text-gray-800 dark:text-gray-100 text-right ${extra}`}>{value}</span>
                                        </div>
                                      ) : null)}
                                    </div>
                                  </div>

                                  {/* Payment details */}
                                  <div className="bg-white dark:bg-[#0d1f3c] rounded-xl p-3.5 border border-gray-100 dark:border-[#00468E]/20">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                                      <IndianRupee className="h-3 w-3" />Payment & Account
                                    </p>
                                    <div className="space-y-1.5 text-xs">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Fee Amount</span>
                                        <span className="font-bold text-gray-800 dark:text-gray-100">₹{parseFloat(reg.fee_amount).toLocaleString()} / {reg.fee_period}</span>
                                      </div>
                                      {reg.razorpay_payment_id && (
                                        <div className="flex justify-between gap-2">
                                          <span className="text-gray-400 shrink-0">Payment ID</span>
                                          <span className="font-mono text-[10px] text-gray-600 dark:text-gray-400 truncate">{reg.razorpay_payment_id}</span>
                                        </div>
                                      )}
                                      {reg.user_full_name && (
                                        <div className="flex justify-between gap-2">
                                          <span className="text-gray-400">Linked User</span>
                                          <span className="font-semibold text-blue-600">{reg.user_full_name}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Submitted</span>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">{formatDate(reg.submitted_at)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Col 2+3: Children with APAAR docs */}
                                <div className="lg:col-span-2 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                      <GraduationCap className="h-3 w-3" />Children & APAAR Documents
                                    </p>
                                    {reg.children && reg.children.filter(c => c.digilocker_verified).length > 0 && (
                                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                        {reg.children.filter(c => c.digilocker_verified).length} Verified
                                      </span>
                                    )}
                                  </div>

                                  {reg.children && reg.children.length > 0 ? (
                                    <div className={`grid gap-3 ${reg.children.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                                      {reg.children.map(child => (
                                        <ChildCard key={child.id} child={child} />
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="bg-white dark:bg-[#0d1f3c] rounded-xl p-4 border border-gray-100 dark:border-[#00468E]/20 text-center">
                                      <p className="text-xs text-gray-400">No children data available</p>
                                    </div>
                                  )}

                                  {/* Admin notes */}
                                  <div className="bg-white dark:bg-[#0d1f3c] rounded-xl p-3.5 border border-gray-100 dark:border-[#00468E]/20">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Admin Notes</p>
                                    <textarea
                                      defaultValue={reg.admin_notes || ""}
                                      placeholder="Add notes about this application…"
                                      rows={2}
                                      onBlur={e => updateStatus(reg.id, reg.status, e.target.value)}
                                      className="w-full text-xs bg-gray-50 dark:bg-[#001833] border border-gray-200 dark:border-[#00468E]/20 rounded-lg p-2 text-gray-700 dark:text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-[#00468E]/30"
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
          <div className="px-4 py-3 border-t border-gray-100 dark:border-[#00468E]/15 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-semibold">{pagination.total}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => fetchData(pagination.page - 1)} disabled={pagination.page <= 1} className="p-1.5 rounded-lg border border-gray-200 dark:border-[#00468E]/25 text-gray-500 hover:border-[#00468E] hover:text-[#00468E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="h-4 w-4" /></button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => fetchData(p)} className={`min-w-[30px] h-7 rounded-lg text-xs font-semibold border transition-colors ${pagination.page === p ? "bg-[#00468E] text-white border-[#00468E]" : "border-gray-200 dark:border-[#00468E]/25 text-gray-600 dark:text-gray-300 hover:border-[#00468E] hover:text-[#00468E]"}`}>{p}</button>
              ))}
              <button onClick={() => fetchData(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="p-1.5 rounded-lg border border-gray-200 dark:border-[#00468E]/25 text-gray-500 hover:border-[#00468E] hover:text-[#00468E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}