"use client";

import { useState } from "react";
import { Search, Download, TrendingUp, TrendingDown, Clock, CheckCircle, Heart, Eye, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { mockPayments, monthlyData } from "../components/mock-data";

const rupeesFormatter = (v: number | string | Array<number | string> | undefined): [string, string] => {
  const num = typeof v === "number" ? v : 0;
  return [`₹${num.toLocaleString()}`, "Revenue"];
};

const carepayData = [
  { parent: "Sunita Verma", school: "Kendriya Vidyalaya", total: 12000, paid: 8000, remaining: 4000, installments: 3, nextDue: "2024-06-01" },
  { parent: "Manoj Tiwari", school: "St. Xavier's School", total: 18000, paid: 6000, remaining: 12000, installments: 6, nextDue: "2024-05-28" },
  { parent: "Arun Sharma", school: "Delhi Public School", total: 9500, paid: 2700, remaining: 6800, installments: 4, nextDue: "2024-06-05" },
];

// ── Mock donation data — replace with real API call in production ─────────────
type DonationStatus = "success" | "pending" | "failed" | "confirmed";

interface Donation {
  id: number;
  receiptNumber: string;
  donorName: string;
  email: string;
  phone: string;
  panNumber: string;
  amount: number;
  paymentId: string;
  orderId: string;
  status: DonationStatus;
  financialYear: string;
  city: string;
  state: string;
  organizationName: string;
  isAnonymous: boolean;
  createdAt: string;
}

const mockDonations: Donation[] = [
  { id: 1, receiptNumber: "SCH/DON/2024/0001", donorName: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", panNumber: "ABCDE1234F", amount: 5000, paymentId: "pay_NxK2abc123def", orderId: "order_NxK1xyz456", status: "success", financialYear: "2024-25", city: "Delhi", state: "Delhi", organizationName: "", isAnonymous: false, createdAt: "2025-03-20 10:30:00" },
  { id: 2, receiptNumber: "SCH/DON/2024/0002", donorName: "Priya Mehta", email: "priya@example.com", phone: "9123456789", panNumber: "FGHIJ5678K", amount: 10000, paymentId: "pay_NxK3bcd234efg", orderId: "order_NxK2abc789", status: "confirmed", financialYear: "2024-25", city: "Mumbai", state: "Maharashtra", organizationName: "Mehta Foundation", isAnonymous: false, createdAt: "2025-03-19 14:15:00" },
  { id: 3, receiptNumber: "SCH/DON/2024/0003", donorName: "Anonymous Donor", email: "anon@example.com", phone: "9988776655", panNumber: "", amount: 2000, paymentId: "pay_NxK4cde345fgh", orderId: "order_NxK3bcd890", status: "pending", financialYear: "2024-25", city: "Bangalore", state: "Karnataka", organizationName: "", isAnonymous: true, createdAt: "2025-03-18 09:00:00" },
  { id: 4, receiptNumber: "SCH/DON/2024/0004", donorName: "Suresh Kumar", email: "suresh@example.com", phone: "9654321098", panNumber: "LMNOP9012Q", amount: 25000, paymentId: "pay_NxK5def456ghi", orderId: "order_NxK4cde123", status: "success", financialYear: "2024-25", city: "Chennai", state: "Tamil Nadu", organizationName: "Kumar CSR Fund", isAnonymous: false, createdAt: "2025-03-17 16:45:00" },
  { id: 5, receiptNumber: "SCH/DON/2024/0005", donorName: "Anjali Singh", email: "anjali@example.com", phone: "9543210987", panNumber: "RSTUV3456W", amount: 1000, paymentId: "", orderId: "order_NxK5def456", status: "failed", financialYear: "2024-25", city: "Lucknow", state: "Uttar Pradesh", organizationName: "", isAnonymous: false, createdAt: "2025-03-16 11:20:00" },
  { id: 6, receiptNumber: "SCH/DON/2024/0006", donorName: "Vikram Patel", email: "vikram@example.com", phone: "9432109876", panNumber: "XYZAB7890C", amount: 50000, paymentId: "pay_NxK6efg567hij", orderId: "order_NxK6efg789", status: "confirmed", financialYear: "2024-25", city: "Ahmedabad", state: "Gujarat", organizationName: "Patel Industries CSR", isAnonymous: false, createdAt: "2025-03-15 13:00:00" },
];

function DonationStatusBadge({ status }: { status: DonationStatus }) {
  const map: Record<DonationStatus, { label: string; cls: string }> = {
    success: { label: "Paid", cls: "bg-green-100 text-green-700" },
    confirmed: { label: "Confirmed", cls: "bg-blue-100 text-blue-700" },
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
    failed: { label: "Failed", cls: "bg-red-100 text-red-700" },
  };
  const { label, cls } = map[status] || { label: status, cls: "bg-gray-100 text-gray-700" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

function DonationDetailModal({ donation, onClose, onConfirm }: { donation: Donation; onClose: () => void; onConfirm: (id: number) => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#00468E] to-[#0B4C8A] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">Donation Details</h2>
            <p className="text-white/60 text-xs">{donation.receiptNumber}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Amount */}
          <div className="bg-[#f0f6ff] rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">Amount</div>
              <div className="text-2xl font-bold text-[#00468E]">₹{donation.amount.toLocaleString("en-IN")}</div>
            </div>
            <DonationStatusBadge status={donation.status} />
          </div>
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Donor Name", donation.isAnonymous ? "Anonymous" : donation.donorName],
              ["Email", donation.email],
              ["Phone", donation.phone],
              ["City / State", `${donation.city}, ${donation.state}`],
              ["PAN", donation.panNumber || "—"],
              ["Financial Year", donation.financialYear],
              ["Payment ID", donation.paymentId || "—"],
              ["Date", donation.createdAt],
              ...(donation.organizationName ? [["Organisation", donation.organizationName]] : []),
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
                <div className="font-medium text-gray-800 dark:text-white break-words text-xs leading-relaxed">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          {(donation.status === "success" || donation.status === "pending") && (
            <button onClick={() => { onConfirm(donation.id); onClose(); }}
              className="flex-1 bg-[#00468E] text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition">
              <Check className="h-4 w-4" /> Confirm Payment
            </button>
          )}
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DONATIONS TAB ─────────────────────────────────────────────────────────────
function DonationsTab() {
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const filtered = donations.filter((d) => {
    const name = d.isAnonymous ? "anonymous" : d.donorName.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()) || d.receiptNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCollected = donations.filter(d => d.status === "success" || d.status === "confirmed").reduce((s, d) => s + d.amount, 0);
  const pendingCount = donations.filter(d => d.status === "pending").length;
  const confirmedCount = donations.filter(d => d.status === "confirmed").length;
  const successCount = donations.filter(d => d.status === "success").length;

  const handleConfirm = (id: number) => {
    setDonations(prev => prev.map(d => d.id === id ? { ...d, status: "confirmed" } : d));
  };

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Collected", value: `₹${(totalCollected / 1000).toFixed(1)}K`, icon: Heart, color: "text-[#00468E]", bg: "bg-blue-50" },
          { label: "Paid (Unconfirmed)", value: successCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Confirmed", value: confirmedCount, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending / Failed", value: pendingCount + donations.filter(d => d.status === "failed").length, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#F4951D]" /> Donation Payments
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by name, email, receipt..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="success">Paid</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 gap-2 whitespace-nowrap"><Download className="h-4 w-4" /> Export CSV</Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Receipt No.</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Donor</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">PAN</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">City</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-500">{d.receiptNumber}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-800 dark:text-white text-sm">{d.isAnonymous ? "Anonymous" : d.donorName}</div>
                    <div className="text-xs text-gray-400">{d.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-500 hidden md:table-cell">{d.panNumber || "—"}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">₹{d.amount.toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs hidden sm:table-cell">{d.city}</td>
                  <td className="py-3.5 px-4"><DonationStatusBadge status={d.status} /></td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs hidden lg:table-cell">{d.createdAt.split(" ")[0]}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setSelectedDonation(d)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="View Details">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {(d.status === "success" || d.status === "pending") && (
                        <button onClick={() => handleConfirm(d.id)}
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition" title="Confirm Payment">
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400 text-sm">No donations found matching your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedDonation && (
        <DonationDetailModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

// ── MAIN PAYMENTS PAGE ────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"payments" | "donations">("payments");

  const filtered = mockPayments.filter((p) => {
    const matchSearch = p.parent.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = mockPayments.reduce((s, p) => s + (p.status === "Completed" ? p.amount : 0), 0);
  const pending = mockPayments.reduce((s, p) => s + (p.status === "Pending" ? p.amount : 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Payments & Donations" description="Track all financial transactions and website donations">
        <Button variant="outline" size="sm" className="h-9 gap-2"><Download className="h-4 w-4" /> Export</Button>
      </PageHeader>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {(["payments", "donations"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? "bg-white dark:bg-gray-900 text-[#00468E] shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {tab === "donations" ? "🤝 Donations" : "💳 School Payments"}
          </button>
        ))}
      </div>

      {/* ── SCHOOL PAYMENTS TAB ── */}
      {activeTab === "payments" && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: `₹${(total / 1000).toFixed(1)}K`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Pending Amount", value: `₹${(pending / 1000).toFixed(1)}K`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Completed", value: mockPayments.filter((p) => p.status === "Completed").length, icon: CheckCircle, color: "text-[#00468E]", bg: "bg-blue-50" },
              { label: "Failed / Overdue", value: mockPayments.filter((p) => p.status === "Failed").length, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.label} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
                      <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                      <Icon className={`h-4 w-4 ${kpi.color}`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Monthly Revenue</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} formatter={rupeesFormatter} />
                    <Bar dataKey="payments" fill="#00468E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Payment Status</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={[
                      { name: "Completed", value: mockPayments.filter((p) => p.status === "Completed").length },
                      { name: "Pending", value: mockPayments.filter((p) => p.status === "Pending").length },
                      { name: "Failed", value: mockPayments.filter((p) => p.status === "Failed").length },
                    ]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      <Cell fill="#10b981" /><Cell fill="#F4951D" /><Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {[{ label: "Completed", color: "#10b981" }, { label: "Pending", color: "#F4951D" }, { label: "Failed", color: "#ef4444" }].map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-gray-600 dark:text-gray-400">{s.label}</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-white">{mockPayments.filter((p) => p.status === s.label).length}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carepay */}
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                <span className="text-[#F4951D]">Care</span><span className="text-[#00468E]">pay</span> Installment Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {carepayData.map((cp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white text-sm">{cp.parent}</p>
                        <p className="text-xs text-gray-500">{cp.school} • {cp.installments} installments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">₹{cp.paid.toLocaleString()} / ₹{cp.total.toLocaleString()}</p>
                        <p className="text-xs text-amber-600">Next due: {cp.nextDue}</p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#00468E] to-[#F4951D]" style={{ width: `${(cp.paid / cp.total) * 100}%` }} />
                    </div>
                    <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                      <span>{Math.round((cp.paid / cp.total) * 100)}% paid</span>
                      <span>₹{cp.remaining.toLocaleString()} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px] h-9 text-sm"><SelectValue placeholder="All Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Txn ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Parent</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">School</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Method</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-500">{p.id}</td>
                      <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-white">{p.parent}</td>
                      <td className="py-3.5 px-4 text-gray-500 text-xs hidden md:table-cell">{p.school}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">₹{p.amount.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-gray-500 hidden sm:table-cell">{p.method}</td>
                      <td className="py-3.5 px-4"><StatusBadge status={p.status} /></td>
                      <td className="py-3.5 px-4 text-gray-500 text-xs hidden lg:table-cell">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ── DONATIONS TAB ── */}
      {activeTab === "donations" && <DonationsTab />}
    </div>
  );
} 