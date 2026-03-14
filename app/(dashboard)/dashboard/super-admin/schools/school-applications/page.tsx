"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, RefreshCw, Users, CreditCard, Clock, CheckCircle2,
  XCircle, AlertCircle, ChevronLeft, ChevronRight,
  Mail, Phone, MapPin, Calendar, Eye, ChevronUp,
  School, Building2,
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";

interface Registration {
  id: number; public_user_id: number | null;
  school_name: string; school_type: string; established_year: number;
  affiliation_board: string; other_affiliation_board: string | null; affiliation_id: string;
  city: string; state: string; pincode: string;
  contact_number: string; alternate_contact: string | null;
  official_email: string; website_url: string | null;
  principal_name: string; principal_email: string; principal_contact: string;
  total_students: number; total_teachers: number;
  razorpay_payment_id: string | null;
  payment_status: "pending" | "paid" | "failed";
  payment_amount: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  admin_notes: string | null;
  submitted_at: string; updated_at: string;
  user_full_name: string | null; user_email: string | null;
}

interface Stats { total: number; paid: number; pending_review: number; approved: number; }

const STATUS_COLORS: Record<string, string> = {
  pending:      "bg-amber-100 text-amber-700 border-amber-200",
  under_review: "bg-blue-100 text-blue-700 border-blue-200",
  approved:     "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected:     "bg-red-100 text-red-700 border-red-200",
};
const PAYMENT_COLORS: Record<string, string> = {
  paid:    "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed:  "bg-red-100 text-red-700",
};

const AVATAR_COLORS = [
  "bg-[#00468E]","bg-emerald-600","bg-amber-500","bg-rose-500","bg-cyan-600","bg-violet-600",
];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];
const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
const formatDate  = (d: string)    => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function SchoolApplicationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats]         = useState<Stats>({ total: 0, paid: 0, pending_review: 0, approved: 0 });
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
      const res  = await fetch(`/api/dashboard/school-registrations?${params}`);
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
      await fetch("/api/dashboard/school-registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, admin_notes: notes }),
      });
      fetchData(pagination.page);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <PageHeader title="School Applications" description="All school registration applications with payment status">
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
          { label: "Total Applications", value: stats.total,          icon: Users,        bg: "bg-blue-50 dark:bg-blue-900/20",     color: "text-[#00468E]" },
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
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by school name, email, principal…" className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-[#001833] border border-gray-200 dark:border-[#00468E]/25 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00468E]/25 focus:border-[#00468E] transition-all" />
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
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 my-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#00468E]/15">
                {["School", "Type / Board", "Location", "Principal", "Payment", "Status", "Submitted", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-[#00468E]/10">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-[#00468E]/10 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <School className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No school registrations found</p>
                  </td>
                </tr>
              ) : (
                registrations.map(reg => (
                  <>
                    <tr key={reg.id} className="hover:bg-gray-50/50 dark:hover:bg-[#00468E]/5 transition-colors">
                      {/* School */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarColor(reg.id)}`}>
                            {getInitials(reg.school_name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white max-w-[180px] truncate">{reg.school_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">#{reg.id}</p>
                          </div>
                        </div>
                      </td>
                      {/* Type / Board */}
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{reg.school_type}</p>
                        <p className="text-xs text-gray-400 max-w-[140px] truncate">
                          {reg.affiliation_board === "Other" ? reg.other_affiliation_board : reg.affiliation_board}
                        </p>
                      </td>
                      {/* Location */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span>{reg.city}, {reg.state}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{reg.pincode}</p>
                      </td>
                      {/* Principal */}
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{reg.principal_name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Phone className="h-3 w-3" />{reg.contact_number}
                        </div>
                      </td>
                      {/* Payment */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${PAYMENT_COLORS[reg.payment_status]}`}>
                          {reg.payment_status === "paid" ? "✓" : reg.payment_status === "failed" ? "✗" : "·"} ₹{parseFloat(reg.payment_amount).toLocaleString("en-IN")}
                        </span>
                        {reg.razorpay_payment_id && (
                          <p className="text-[10px] text-gray-400 mt-1 max-w-[100px] truncate font-mono">{reg.razorpay_payment_id}</p>
                        )}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_COLORS[reg.status]}`}>
                          {reg.status.replace("_", " ")}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />{formatDate(reg.submitted_at)}
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setExpandedRow(expandedRow === reg.id ? null : reg.id)}
                            className="p-1.5 text-gray-400 hover:text-[#00468E] hover:bg-blue-50 dark:hover:bg-[#00468E]/10 rounded-lg transition-colors"
                            title="View details"
                          >
                            {expandedRow === reg.id ? <ChevronUp className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          {reg.status === "pending" && (
                            <button
                              onClick={() => updateStatus(reg.id, "under_review")}
                              className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Mark Under Review"
                            >
                              <AlertCircle className="h-4 w-4" />
                            </button>
                          )}
                          {(reg.status === "pending" || reg.status === "under_review") && (
                            <button
                              onClick={() => updateStatus(reg.id, "approved")}
                              className="p-1.5 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          {reg.status !== "rejected" && (
                            <button
                              onClick={() => {
                                const note = window.prompt("Rejection reason (optional):");
                                if (note !== null) updateStatus(reg.id, "rejected", note);
                              }}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expandedRow === reg.id && (
                      <tr key={`${reg.id}-expanded`} className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-[#001833] dark:to-[#00468E]/5">
                        <td colSpan={8} className="px-6 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            {/* School Details */}
                            <div>
                              <p className="text-xs font-bold text-[#00468E] uppercase tracking-wide mb-2 flex items-center gap-1.5"><School className="h-3.5 w-3.5" /> School Details</p>
                              <div className="space-y-1.5">
                                <div><span className="text-gray-500 text-xs">Year Est.:</span> <span className="font-semibold text-gray-800 dark:text-gray-200">{reg.established_year}</span></div>
                                <div><span className="text-gray-500 text-xs">Affiliation ID:</span> <span className="font-semibold text-gray-800 dark:text-gray-200">{reg.affiliation_id}</span></div>
                                <div><span className="text-gray-500 text-xs">Students:</span> <span className="font-bold text-gray-800 dark:text-gray-200">{reg.total_students?.toLocaleString("en-IN")}</span></div>
                                <div><span className="text-gray-500 text-xs">Teachers:</span> <span className="font-bold text-gray-800 dark:text-gray-200">{reg.total_teachers?.toLocaleString("en-IN")}</span></div>
                              </div>
                            </div>
                            {/* Contact */}
                            <div>
                              <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Contact</p>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-gray-400" /><span className="text-gray-700 dark:text-gray-300 text-xs break-all">{reg.official_email}</span></div>
                                <div className="flex items-center gap-1"><Phone className="h-3 w-3 text-gray-400" /><span className="text-gray-700 dark:text-gray-300 text-xs">{reg.contact_number}</span></div>
                                {reg.alternate_contact && <div className="flex items-center gap-1"><Phone className="h-3 w-3 text-gray-400" /><span className="text-gray-700 dark:text-gray-300 text-xs">{reg.alternate_contact} (alt)</span></div>}
                                {reg.website_url && <a href={reg.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00468E] hover:underline break-all">{reg.website_url}</a>}
                              </div>
                            </div>
                            {/* Principal */}
                            <div>
                              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Principal</p>
                              <div className="space-y-1.5">
                                <div><span className="font-semibold text-gray-800 dark:text-gray-200">{reg.principal_name}</span></div>
                                <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-gray-400" /><span className="text-gray-700 dark:text-gray-300 text-xs break-all">{reg.principal_email}</span></div>
                                <div className="flex items-center gap-1"><Phone className="h-3 w-3 text-gray-400" /><span className="text-gray-700 dark:text-gray-300 text-xs">{reg.principal_contact}</span></div>
                              </div>
                            </div>
                            {/* Payment / Admin */}
                            <div>
                              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2 flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Payment & Admin</p>
                              <div className="space-y-1.5">
                                <div><span className="text-gray-500 text-xs">Amount:</span> <span className="font-bold text-gray-800 dark:text-gray-200">₹{parseFloat(reg.payment_amount).toLocaleString("en-IN")}</span></div>
                                {reg.razorpay_payment_id && <div><span className="text-gray-500 text-xs">Payment ID:</span> <span className="font-mono text-[10px] text-gray-600 dark:text-gray-400">{reg.razorpay_payment_id}</span></div>}
                                <div><span className="text-gray-500 text-xs">Updated:</span> <span className="text-gray-700 dark:text-gray-300 text-xs">{formatDate(reg.updated_at)}</span></div>
                                {reg.admin_notes && <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg"><p className="text-xs text-amber-700 dark:text-amber-400">{reg.admin_notes}</p></div>}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 dark:border-[#00468E]/15 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => fetchData(pagination.page - 1)} disabled={pagination.page === 1} className="p-2 rounded-lg border border-gray-200 dark:border-[#00468E]/25 disabled:opacity-40 hover:border-[#00468E] transition-colors">
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button onClick={() => fetchData(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="p-2 rounded-lg border border-gray-200 dark:border-[#00468E]/25 disabled:opacity-40 hover:border-[#00468E] transition-colors">
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}