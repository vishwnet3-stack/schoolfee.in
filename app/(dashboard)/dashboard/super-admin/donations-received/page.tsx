"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Search, Download, RefreshCw, Filter, Eye, ChevronLeft, ChevronRight,
    TrendingUp, IndianRupee, CheckCircle2, Clock, XCircle, Users,
    Monitor, MapPin, Mail, Phone, Building2, CreditCard, Receipt,
    Calendar, Globe, FileText, ChevronDown, ChevronUp, AlertCircle,
    ShieldCheck, BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "../components/PageHeader";

// ── Types ─────────────────────────────────────────────────────────────────────
type DonationStatus = "success" | "pending" | "failed" | "refunded" | "processing";

interface Donation {
    id: number;
    receipt_number: string;
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    org_name: string;
    org_type: string | null;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    address_line1: string | null;
    address_city: string | null;
    address_state: string | null;
    address_pincode: string | null;
    amount: number;
    donation_purpose: string | null;
    donation_note: string | null;
    pan_number: string | null;
    consent_80g: number;
    status: DonationStatus;
    error_code: string | null;
    error_description: string | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    paid_at: string | null;
    updated_at: string;
}

interface Stats {
    total_records: number;
    success_count: number;
    pending_count: number;
    failed_count: number;
    total_amount: number;
    today_amount: number;
    month_amount: number;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtINR(n: number | string | null) {
    return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function fmtDate(d: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function parseUA(ua: string | null): string {
    if (!ua) return "Unknown";
    if (/mobile/i.test(ua)) return "Mobile";
    if (/tablet/i.test(ua)) return "Tablet";
    return "Desktop";
}

function parseBrowser(ua: string | null): string {
    if (!ua) return "Unknown";
    if (/edg/i.test(ua)) return "Edge";
    if (/chrome/i.test(ua) && !/chromium/i.test(ua)) return "Chrome";
    if (/firefox/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
    if (/opr|opera/i.test(ua)) return "Opera";
    return "Unknown";
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: DonationStatus }) {
    const map: Record<DonationStatus, { label: string; cls: string; icon: React.ReactNode }> = {
        success: { label: "Success", cls: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle2 className="h-3 w-3" /> },
        pending: { label: "Pending", cls: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: <Clock className="h-3 w-3" /> },
        failed: { label: "Failed", cls: "bg-red-100 text-red-700 border-red-200", icon: <XCircle className="h-3 w-3" /> },
        refunded: { label: "Refunded", cls: "bg-purple-100 text-purple-700 border-purple-200", icon: <RefreshCw className="h-3 w-3" /> },
        processing: { label: "Processing", cls: "bg-blue-100 text-blue-700 border-blue-200", icon: <Clock className="h-3 w-3" /> },
    };
    const cfg = map[status] ?? map.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────
function DetailDrawer({ donation, onClose, onStatusChange }: {
    donation: Donation;
    onClose: () => void;
    onStatusChange: (id: number, status: DonationStatus) => Promise<void>;
}) {
    const [updating, setUpdating] = useState(false);

    const handleStatus = async (s: DonationStatus) => {
        setUpdating(true);
        await onStatusChange(donation.id, s);
        setUpdating(false);
    };

    const rows: { icon: React.ReactNode; label: string; value: React.ReactNode }[] = [
        { icon: <Receipt className="h-4 w-4" />, label: "Receipt Number", value: <span className="font-mono font-semibold text-green-700">{donation.receipt_number}</span> },
        { icon: <IndianRupee className="h-4 w-4" />, label: "Amount", value: <span className="font-bold text-lg text-[#00468E]">{fmtINR(donation.amount)}</span> },
        { icon: <CreditCard className="h-4 w-4" />, label: "Payment ID", value: <span className="font-mono text-xs">{donation.razorpay_payment_id || "—"}</span> },
        { icon: <FileText className="h-4 w-4" />, label: "Order ID", value: <span className="font-mono text-xs">{donation.razorpay_order_id || "—"}</span> },
        { icon: <Users className="h-4 w-4" />, label: "Donor Name", value: donation.contact_name },
        { icon: <Mail className="h-4 w-4" />, label: "Email", value: <a href={`mailto:${donation.contact_email}`} className="text-[#00468E] hover:underline">{donation.contact_email}</a> },
        { icon: <Phone className="h-4 w-4" />, label: "Phone", value: donation.contact_phone },
        { icon: <Building2 className="h-4 w-4" />, label: "Organisation", value: donation.org_name || "—" },
        { icon: <BadgeCheck className="h-4 w-4" />, label: "PAN Number", value: donation.pan_number || "—" },
        { icon: <ShieldCheck className="h-4 w-4" />, label: "80G Consent", value: donation.consent_80g ? "Yes" : "No" },
        { icon: <MapPin className="h-4 w-4" />, label: "Address", value: [donation.address_line1, donation.address_city, donation.address_state, donation.address_pincode].filter(Boolean).join(", ") || "—" },
        { icon: <Globe className="h-4 w-4" />, label: "IP Address", value: <span className="font-mono">{donation.ip_address || "—"}</span> },
        { icon: <Monitor className="h-4 w-4" />, label: "Device / Browser", value: `${parseUA(donation.user_agent)} · ${parseBrowser(donation.user_agent)}` },
        { icon: <Calendar className="h-4 w-4" />, label: "Created At", value: fmtDate(donation.created_at) },
        { icon: <Calendar className="h-4 w-4" />, label: "Paid At", value: fmtDate(donation.paid_at) },
        ...(donation.donation_purpose ? [{ icon: <FileText className="h-4 w-4" />, label: "Purpose", value: donation.donation_purpose }] : []),
        ...(donation.donation_note ? [{ icon: <FileText className="h-4 w-4" />, label: "Note", value: donation.donation_note }] : []),
        ...(donation.error_description ? [{ icon: <AlertCircle className="h-4 w-4 text-red-500" />, label: "Error", value: <span className="text-red-600 text-xs">{donation.error_description}</span> }] : []),
    ];

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            {/* Panel */}
            <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-[#00468E] text-white px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <div className="font-semibold text-base">Donation Details</div>
                        <div className="text-white/70 text-xs">{donation.receipt_number}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={donation.status} />
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8">
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* User Agent full string */}
                {donation.user_agent && (
                    <div className="mx-6 mt-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">User Agent</div>
                        <div className="text-xs text-gray-600 break-all leading-relaxed">{donation.user_agent}</div>
                    </div>
                )}

                {/* Detail rows */}
                <div className="flex-1 divide-y divide-gray-50 mt-4">
                    {rows.map(({ icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3 px-6 py-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500 mt-0.5">
                                {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">{label}</div>
                                <div className="text-sm text-gray-800 break-words">{value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status override */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Change Status</div>
                    <div className="flex gap-2 flex-wrap">
                        {(["success", "pending", "failed", "refunded"] as DonationStatus[]).map((s) => (
                            <Button key={s} size="sm" variant={donation.status === s ? "default" : "outline"}
                                className={donation.status === s ? "bg-[#00468E]" : ""}
                                disabled={updating || donation.status === s}
                                onClick={() => handleStatus(s)}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DonationsReceivedPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 25, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [selected, setSelected] = useState<Donation | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

    const fetchDonations = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "25",
                status: statusFilter,
                search: search.trim(),
                ...(fromDate ? { from: fromDate } : {}),
                ...(toDate ? { to: toDate } : {}),
            });
            const res = await fetch(`/api/super-admin/donations?${params}`);
            const json = await res.json();
            if (!json.success) throw new Error(json.message || "Failed to load");
            setDonations(json.data);
            setStats(json.stats);
            setPagination(json.pagination);
            setCurrentPage(json.pagination.page);
        } catch (e: any) {
            setError(e.message || "Could not fetch donations.");
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, fromDate, toDate]);

    // Initial load + auto-refresh every 30s
    useEffect(() => {
        fetchDonations(1);
        autoRefreshRef.current = setInterval(() => fetchDonations(currentPage), 30_000);
        return () => { if (autoRefreshRef.current) clearInterval(autoRefreshRef.current); };
    }, [fetchDonations]);

    const handleStatusChange = async (id: number, status: DonationStatus) => {
        const res = await fetch("/api/super-admin/donations", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
        const json = await res.json();
        if (json.success) {
            setDonations(prev => prev.map(d => d.id === id ? { ...d, status } : d));
            if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev);
        }
    };

    const exportCSV = () => {
        const headers = [
            "ID", "Receipt", "Status", "Amount", "Donor Name", "Email", "Phone",
            "PAN", "80G", "Org Name", "City", "State", "Pincode",
            "IP Address", "Device", "Browser", "Order ID", "Payment ID",
            "Created At", "Paid At",
        ];
        const rows = donations.map(d => [
            d.id, d.receipt_number, d.status, d.amount, d.contact_name,
            d.contact_email, d.contact_phone, d.pan_number || "",
            d.consent_80g ? "Yes" : "No", d.org_name,
            d.address_city || "", d.address_state || "", d.address_pincode || "",
            d.ip_address || "", parseUA(d.user_agent), parseBrowser(d.user_agent),
            d.razorpay_order_id || "", d.razorpay_payment_id || "",
            fmtDate(d.created_at), fmtDate(d.paid_at),
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── KPI Cards ──────────────────────────────────────────────────────────────
    const kpis = stats ? [
        {
            label: "Total Received",
            value: fmtINR(stats.total_amount),
            sub: `${stats.success_count} successful`,
            icon: <IndianRupee className="h-5 w-5" />,
            color: "bg-[#00468E]",
        },
        {
            label: "Today",
            value: fmtINR(stats.today_amount),
            sub: "collected today",
            icon: <TrendingUp className="h-5 w-5" />,
            color: "bg-green-600",
        },
        {
            label: "This Month",
            value: fmtINR(stats.month_amount),
            sub: "current month",
            icon: <Calendar className="h-5 w-5" />,
            color: "bg-amber-500",
        },
        {
            label: "Pending",
            value: stats.pending_count,
            sub: "awaiting payment",
            icon: <Clock className="h-5 w-5" />,
            color: "bg-yellow-500",
        },
        {
            label: "Failed",
            value: stats.failed_count,
            sub: "payment failed",
            icon: <XCircle className="h-5 w-5" />,
            color: "bg-red-500",
        },
        {
            label: "Total Records",
            value: stats.total_records,
            sub: "all time",
            icon: <Users className="h-5 w-5" />,
            color: "bg-purple-600",
        },
    ] : [];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <PageHeader
                    title="Donations Received"
                    description="Real-time tracking of all donation payments with full donor details and IP information."
                />
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchDonations(currentPage)}
                        className="gap-1.5" disabled={loading}>
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpis.map(({ label, value, sub, icon, color }) => (
                    <Card key={label} className="border border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <div className={`w-9 h-9 rounded-lg ${color} text-white flex items-center justify-center mb-3`}>
                                {icon}
                            </div>
                            <div className="text-xl font-bold text-gray-900">{value}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                            <div className="text-xs text-gray-400">{sub}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input placeholder="Search name, email, phone, IP, receipt, PAN..."
                                    className="pl-9 h-9 text-sm"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && fetchDonations(1)} />
                            </div>
                            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); }}>
                                <SelectTrigger className="w-36 h-9 text-sm">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button size="sm" className="h-9 bg-[#00468E] hover:bg-[#003070] gap-1.5"
                                onClick={() => fetchDonations(1)}>
                                <Filter className="h-3.5 w-3.5" /> Apply
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-gray-500"
                                onClick={() => setShowFilters(v => !v)}>
                                <Calendar className="h-3.5 w-3.5" />
                                Date Range
                                {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </Button>
                        </div>
                        {showFilters && (
                            <div className="flex flex-wrap gap-3 pt-1">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-500 font-medium whitespace-nowrap">From</label>
                                    <Input type="date" className="h-9 text-sm w-40"
                                        value={fromDate} onChange={e => setFromDate(e.target.value)} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-500 font-medium whitespace-nowrap">To</label>
                                    <Input type="date" className="h-9 text-sm w-40"
                                        value={toDate} onChange={e => setToDate(e.target.value)} />
                                </div>
                                <Button variant="ghost" size="sm" className="h-9 text-gray-400 text-xs"
                                    onClick={() => { setFromDate(""); setToDate(""); }}>
                                    Clear Dates
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Table */}
            <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="px-6 py-4 border-b border-gray-50">
                    <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        All Donation Records
                        <Badge variant="secondary" className="ml-auto text-xs">
                            {pagination.total} total
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {[
                                        "Receipt", "Donor", "Contact", "Amount", "Status",
                                        "IP Address", "Device", "80G", "PAN", "Date", "Actions",
                                    ].map(h => (
                                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {Array.from({ length: 11 }).map((_, j) => (
                                                <td key={j} className="px-4 py-3">
                                                    <div className="h-4 bg-gray-100 rounded w-full" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : donations.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="text-center py-16 text-gray-400">
                                            <Receipt className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                            No donations found
                                        </td>
                                    </tr>
                                ) : (
                                    donations.map(d => (
                                        <tr key={d.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs text-green-700 font-semibold">{d.receipt_number}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800 whitespace-nowrap">{d.contact_name}</div>
                                                {d.org_name && d.org_name !== d.contact_name && (
                                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" />{d.org_name}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs text-gray-600 flex items-center gap-1">
                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                    <a href={`mailto:${d.contact_email}`} className="hover:text-[#00468E] hover:underline">
                                                        {d.contact_email}
                                                    </a>
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Phone className="h-3 w-3 text-gray-400" />
                                                    {d.contact_phone}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-semibold text-[#00468E]">{fmtINR(d.amount)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={d.status} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                                    {d.ip_address || "—"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Monitor className="h-3 w-3" />
                                                    {parseUA(d.user_agent)}
                                                </div>
                                                <div className="text-xs text-gray-400">{parseBrowser(d.user_agent)}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {d.consent_80g ? (
                                                    <ShieldCheck className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <span className="text-gray-300">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs">
                                                    {d.pan_number || <span className="text-gray-300">—</span>}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs text-gray-500 whitespace-nowrap">
                                                    {fmtDate(d.created_at)}
                                                </div>
                                                {d.paid_at && (
                                                    <div className="text-xs text-green-600 whitespace-nowrap">
                                                        Paid: {fmtDate(d.paid_at)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Button variant="ghost" size="icon"
                                                    className="h-7 w-7 text-gray-400 hover:text-[#00468E] hover:bg-[#00468E]/5"
                                                    onClick={() => setSelected(d)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                            <div className="text-xs text-gray-500">
                                Showing {((pagination.page - 1) * pagination.limit) + 1}–
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" className="h-7 w-7"
                                    disabled={pagination.page <= 1}
                                    onClick={() => fetchDonations(pagination.page - 1)}>
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                </Button>
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const p = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4)) + i;
                                    return (
                                        <Button key={p} variant={p === pagination.page ? "default" : "outline"}
                                            size="icon" className={`h-7 w-7 text-xs ${p === pagination.page ? "bg-[#00468E]" : ""}`}
                                            onClick={() => fetchDonations(p)}>
                                            {p}
                                        </Button>
                                    );
                                })}
                                <Button variant="outline" size="icon" className="h-7 w-7"
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => fetchDonations(pagination.page + 1)}>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Drawer */}
            {selected && (
                <DetailDrawer
                    donation={selected}
                    onClose={() => setSelected(null)}
                    onStatusChange={handleStatusChange}
                />
            )}

            {/* Auto-refresh indicator */}
            <div className="text-xs text-gray-400 text-right">
                Auto-refreshing every 30 seconds
            </div>
        </div>
    );
}