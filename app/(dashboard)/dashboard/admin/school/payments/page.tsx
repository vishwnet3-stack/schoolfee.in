"use client";

import { useState } from "react";
import {
  Search, CheckCircle2, Clock, RefreshCw, Download, IndianRupee,
  CreditCard, Filter, ArrowUpRight, Calendar,
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

const monthlyChart = [
  { month: "Jan", amount: 325000 }, { month: "Feb", amount: 318000 },
  { month: "Mar", amount: 352000 }, { month: "Apr", amount: 338000 },
  { month: "May", amount: 372000 }, { month: "Jun", amount: 312000 },
];

const payments = [
  { id: "TXN-5501", student: "Arjun Mehta", class: "VIII-C", type: "Tuition Q1", amount: 14200, date: "15 May 2025", txnDate: "15 May 2025 10:32 AM", mode: "Schoolfee CarePay", status: "completed" },
  { id: "TXN-5500", student: "Dev Sharma", class: "X-A", type: "Tuition Q1", amount: 16800, date: "15 May 2025", txnDate: "15 May 2025 10:31 AM", mode: "Schoolfee CarePay", status: "completed" },
  { id: "TXN-5499", student: "Meera Joshi", class: "X-B", type: "Tuition Q1", amount: 16800, date: "01 May 2025", txnDate: "01 May 2025 09:14 AM", mode: "Schoolfee CarePay", status: "completed" },
  { id: "TXN-5498", student: "Kavya Nair", class: "IX-A", type: "Transport", amount: 4500, date: "01 May 2025", txnDate: "01 May 2025 09:12 AM", mode: "Schoolfee CarePay", status: "completed" },
  { id: "TXN-5497", student: "Ravi Kumar", class: "IX-A", type: "Tuition Q1", amount: 16800, date: "—", txnDate: "—", mode: "Schoolfee CarePay", status: "processing" },
  { id: "TXN-5496", student: "Priya Singh", class: "IX-B", type: "Tuition Q1", amount: 16800, date: "—", txnDate: "—", mode: "Schoolfee CarePay", status: "pending" },
  { id: "TXN-5495", student: "Nisha Patel", class: "X-B", type: "Tuition Q1", amount: 16800, date: "15 Apr 2025", txnDate: "15 Apr 2025 10:05 AM", mode: "Schoolfee CarePay", status: "completed" },
  { id: "TXN-5494", student: "Akash Verma", class: "VIII-C", type: "Activity", amount: 2000, date: "10 Apr 2025", txnDate: "10 Apr 2025 11:22 AM", mode: "Schoolfee CarePay", status: "completed" },
];

const statusStyle: Record<string, string> = {
  completed:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  pending:    "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
};

export default function SchoolPaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.student.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalReceived = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status !== "completed").reduce((s, p) => s + p.amount, 0);
  const completedCount = payments.filter(p => p.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Payment Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            All fee payments made by Schoolfee to your school on behalf of parents
          </p>
        </div>
        <Button size="sm" variant="outline" className="border-[#00468E] text-[#00468E] hover:bg-[#00468E]/5 rounded-xl self-start sm:self-auto"
          onClick={() => toast.success("Payment report exported!")}>
          <Download className="h-4 w-4 mr-1.5" /> Download Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Received (This Year)", value: `Rs. ${(totalReceived + 8900000).toLocaleString()}`, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
          { label: "This Month", value: "Rs. 3,72,000", icon: Calendar, color: "text-[#00468E] dark:text-blue-400", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
          { label: "In Progress", value: `Rs. ${totalPending.toLocaleString()}`, icon: RefreshCw, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
          { label: "Transactions", value: `${completedCount + 840}`, icon: CreditCard, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className={cardClass}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{kpi.value}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card className={cardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly Payments Received from Schoolfee</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyChart} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }}
                formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, "Received"]} />
              <Bar dataKey="amount" fill="#00468E" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input placeholder="Search by student or transaction ID..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm dark:bg-[#0d1f3c] dark:border-[#00468E]/30" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[140px] text-xs dark:bg-[#0d1f3c] dark:border-[#00468E]/30"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#00468E]/15">
                  {["Txn ID", "Student", "Class", "Fee Type", "Amount", "Payment Date", "Mode", "Status", ""].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 dark:border-[#00468E]/10 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs text-gray-400">{p.id}</td>
                    <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200">{p.student}</td>
                    <td className="py-3 px-3"><Badge className="bg-gray-100 dark:bg-[#00468E]/10 text-gray-600 dark:text-gray-300 border-0 text-xs">{p.class}</Badge></td>
                    <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{p.type}</td>
                    <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">Rs. {p.amount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{p.date}</td>
                    <td className="py-3 px-3"><Badge className="bg-[#00468E]/10 text-[#00468E] dark:text-blue-300 border-0 text-[10px]">CarePay</Badge></td>
                    <td className="py-3 px-3">
                      <Badge className={`text-[10px] border-0 font-semibold ${statusStyle[p.status]}`}>
                        {p.status === "completed" ? <><CheckCircle2 className="h-3 w-3 mr-1" />Received</> :
                         p.status === "processing" ? <><RefreshCw className="h-3 w-3 mr-1" />Processing</> :
                         <><Clock className="h-3 w-3 mr-1" />Pending</>}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      {p.status === "completed" && (
                        <button
                          className="text-[10px] text-[#00468E] hover:underline font-semibold"
                          onClick={() => toast.success(`Receipt for ${p.id} downloading...`)}
                        >
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
