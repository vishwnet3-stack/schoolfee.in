"use client";

import { useState } from "react";
import {
  CreditCard, CheckCircle2, Clock, IndianRupee, Download,
  TrendingUp, Filter, Search, Wallet, ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const monthlyCollection = [
  { month: "Jan", collected: 87500, pending: 12500 },
  { month: "Feb", collected: 76200, pending: 23800 },
  { month: "Mar", collected: 95000, pending: 5000 },
  { month: "Apr", collected: 84600, pending: 15400 },
  { month: "May", collected: 79200, pending: 20800 },
  { month: "Jun", collected: 91000, pending: 9000 },
];

const salaryHistory = [
  { id: "SAL001", month: "June 2025", amount: 45000, date: "01 Jun 2025", bank: "SBI ••4321", mode: "NEFT", status: "credited" },
  { id: "SAL002", month: "May 2025",  amount: 52000, date: "01 May 2025", bank: "SBI ••4321", mode: "NEFT", status: "credited" },
  { id: "SAL003", month: "April 2025", amount: 45000, date: "01 Apr 2025", bank: "SBI ••4321", mode: "NEFT", status: "credited" },
  { id: "SAL004", month: "March 2025", amount: 48000, date: "01 Mar 2025", bank: "SBI ••4321", mode: "NEFT", status: "credited" },
  { id: "SAL005", month: "Feb 2025",  amount: 45000, date: "01 Feb 2025", bank: "SBI ••4321", mode: "NEFT", status: "credited" },
  { id: "SAL006", month: "Jan 2025",  amount: 45000, date: "01 Jan 2025", bank: "SBI ••4321", mode: "NEFT", status: "credited" },
];

const feeRecords = [
  { id: "FEE001", student: "Aryan Sharma", class: "IX-A", type: "Tuition Q1", amount: 16800, date: "15 May 2025", method: "CarePay", status: "paid" },
  { id: "FEE002", student: "Priya Gupta", class: "IX-A", type: "Tuition Q1", amount: 16800, date: "15 May 2025", method: "UPI", status: "paid" },
  { id: "FEE003", student: "Rahul Verma", class: "IX-A", type: "Tuition Q1", amount: 16800, date: "—", method: "—", status: "pending" },
  { id: "FEE004", student: "Anita Singh", class: "X-B", type: "Tuition Q1", amount: 16800, date: "14 May 2025", method: "CarePay", status: "paid" },
  { id: "FEE005", student: "Vikram Patel", class: "X-B", type: "Tuition Q1", amount: 16800, date: "15 May 2025", method: "Net Banking", status: "paid" },
  { id: "FEE006", student: "Meera Joshi", class: "X-B", type: "Tuition Q1", amount: 16800, date: "—", method: "—", status: "pending" },
  { id: "FEE007", student: "Deepa Mishra", class: "VIII-C", type: "Tuition Q1", amount: 14200, date: "—", method: "—", status: "pending" },
  { id: "FEE008", student: "Amit Kumar", class: "VIII-C", type: "Tuition Q1", amount: 14200, date: "13 May 2025", method: "CarePay", status: "paid" },
];

export default function TeacherPaymentsPage() {
  const [tab, setTab] = useState<"fee" | "salary">("fee");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredFee = feeRecords.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.student.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    const matchClass = classFilter === "all" || r.class === classFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchClass && matchStatus;
  });

  const totalCollected = feeRecords.filter(r => r.status === "paid").reduce((s, r) => s + r.amount, 0);
  const totalPending = feeRecords.filter(r => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const totalSalary = salaryHistory.reduce((s, r) => s + r.amount, 0);
  const carepayCount = feeRecords.filter(r => r.method === "CarePay").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Tracking & Salary</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Monitor student fee collection and your salary credits</p>
        </div>
        <Button size="sm" variant="outline" className="border-[#00468E] text-[#00468E] hover:bg-[#00468E]/5 rounded-xl self-start sm:self-auto"
          onClick={() => toast.success("Report exported!")}>
          <Download className="h-4 w-4 mr-1.5" /> Export Report
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Fee Collected (May)", value: `Rs. ${totalCollected.toLocaleString()}`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
          { label: "Fee Pending (May)", value: `Rs. ${totalPending.toLocaleString()}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
          { label: "Via CarePay", value: `${carepayCount} payments`, icon: Wallet, color: "text-[#00468E] dark:text-blue-400", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
          { label: "Total Salary YTD", value: `Rs. ${totalSalary.toLocaleString()}`, icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className={cardClass}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card className={cardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly Fee Collection vs Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyCollection} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }}
                formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, ""]}
              />
              <Bar dataKey="collected" fill="#00468E" radius={[4, 4, 0, 0]} name="Collected" maxBarSize={28} />
              <Bar dataKey="pending" fill="#F4951D" radius={[4, 4, 0, 0]} name="Pending" maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"><div className="w-3 h-2 rounded bg-[#00468E]" /> Collected</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"><div className="w-3 h-2 rounded bg-[#F4951D]" /> Pending</div>
          </div>
        </CardContent>
      </Card>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-[#00468E]/10 rounded-xl w-fit">
        {(["fee", "salary"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t
                ? "bg-white dark:bg-[#0d1f3c] text-[#00468E] shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {t === "fee" ? "Student Fee Records" : "Salary History"}
          </button>
        ))}
      </div>

      {/* Fee records table */}
      {tab === "fee" && (
        <Card className={cardClass}>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input placeholder="Search by student or fee ID..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm dark:bg-[#0d1f3c] dark:border-[#00468E]/30" />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="h-9 w-[130px] text-xs dark:bg-[#0d1f3c] dark:border-[#00468E]/30"><SelectValue placeholder="All Classes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="IX-A">IX-A</SelectItem>
                  <SelectItem value="X-B">X-B</SelectItem>
                  <SelectItem value="VIII-C">VIII-C</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[120px] text-xs dark:bg-[#0d1f3c] dark:border-[#00468E]/30"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#00468E]/15">
                    {["Fee ID", "Student", "Class", "Fee Type", "Amount", "Date", "Method", "Status"].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFee.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 dark:border-[#00468E]/10 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs text-gray-400">{r.id}</td>
                      <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200">{r.student}</td>
                      <td className="py-3 px-3"><Badge className="bg-gray-100 dark:bg-[#00468E]/10 text-gray-600 dark:text-gray-300 border-0 text-xs">{r.class}</Badge></td>
                      <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{r.type}</td>
                      <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">Rs. {r.amount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{r.date}</td>
                      <td className="py-3 px-3">
                        {r.method !== "—" && (
                          <Badge className={`text-[10px] border-0 ${r.method === "CarePay" ? "bg-[#00468E]/10 text-[#00468E] dark:text-blue-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                            {r.method}
                          </Badge>
                        )}
                        {r.method === "—" && <span className="text-xs text-gray-300 dark:text-gray-600">—</span>}
                      </td>
                      <td className="py-3 px-3">
                        <Badge className={`text-[10px] border-0 font-semibold ${r.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"}`}>
                          {r.status === "paid" ? <><CheckCircle2 className="h-3 w-3 mr-1" />Paid</> : <><Clock className="h-3 w-3 mr-1" />Pending</>}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Salary history table */}
      {tab === "salary" && (
        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800 dark:text-white">Salary Credit History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#00468E]/15">
                    {["Salary ID", "Month", "Amount", "Credited On", "Bank Account", "Mode", "Status"].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salaryHistory.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 dark:border-[#00468E]/10 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs text-gray-400">{r.id}</td>
                      <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200">{r.month}</td>
                      <td className="py-3 px-3 font-bold text-emerald-600 text-base">Rs. {r.amount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{r.date}</td>
                      <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{r.bank}</td>
                      <td className="py-3 px-3"><Badge className="bg-gray-100 dark:bg-[#00468E]/10 text-gray-600 dark:text-gray-300 border-0 text-xs">{r.mode}</Badge></td>
                      <td className="py-3 px-3">
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-0 text-[10px] font-semibold">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Credited
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
