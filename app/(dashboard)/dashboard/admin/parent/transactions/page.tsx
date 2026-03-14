"use client";

import { useState } from "react";
import { CreditCard, Download, Search, Filter, CheckCircle2, Clock, XCircle, ArrowUpRight, IndianRupee, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const allTransactions = [
  { id: "TXN001", school: "DPS New Delhi", type: "Tuition Fee", amount: 16800, date: "15 May 2025", time: "10:24 AM", status: "success", method: "CarePay", quarter: "Q1 2025-26" },
  { id: "TXN002", school: "DPS New Delhi", type: "Transport Fee", amount: 4500, date: "02 Apr 2025", time: "02:15 PM", status: "success", method: "CarePay", quarter: "Q1 2025-26" },
  { id: "TXN003", school: "DPS New Delhi", type: "Tuition Fee", amount: 14200, date: "15 Mar 2025", time: "09:42 AM", status: "success", method: "UPI", quarter: "Q4 2024-25" },
  { id: "TXN004", school: "DPS New Delhi", type: "Activity Fee", amount: 2000, date: "10 Feb 2025", time: "11:30 AM", status: "pending", method: "CarePay", quarter: "Q3 2024-25" },
  { id: "TXN005", school: "DPS New Delhi", type: "Tuition Fee", amount: 11000, date: "15 Feb 2025", time: "10:00 AM", status: "success", method: "CarePay", quarter: "Q3 2024-25" },
  { id: "TXN006", school: "DPS New Delhi", type: "Lab Fee", amount: 1800, date: "20 Jan 2025", time: "03:10 PM", status: "success", method: "UPI", quarter: "Q3 2024-25" },
  { id: "TXN007", school: "DPS New Delhi", type: "Tuition Fee", amount: 14200, date: "15 Dec 2024", time: "09:55 AM", status: "success", method: "CarePay", quarter: "Q2 2024-25" },
  { id: "TXN008", school: "DPS New Delhi", type: "Annual Sports Fee", amount: 3500, date: "05 Nov 2024", time: "01:22 PM", status: "failed", method: "Net Banking", quarter: "Q2 2024-25" },
  { id: "TXN009", school: "DPS New Delhi", type: "Tuition Fee", amount: 14200, date: "15 Oct 2024", time: "10:10 AM", status: "success", method: "CarePay", quarter: "Q2 2024-25" },
  { id: "TXN010", school: "DPS New Delhi", type: "Transport Fee", amount: 4500, date: "01 Oct 2024", time: "02:05 PM", status: "success", method: "UPI", quarter: "Q2 2024-25" },
];

const monthlyBar = [
  { month: "Oct", paid: 18700 }, { month: "Nov", paid: 14200 },
  { month: "Dec", paid: 14200 }, { month: "Jan", paid: 1800 },
  { month: "Feb", paid: 13000 }, { month: "Mar", paid: 14200 },
  { month: "Apr", paid: 4500 }, { month: "May", paid: 16800 },
];

const statusIcon: Record<string, React.ElementType> = {
  success: CheckCircle2, pending: Clock, failed: XCircle,
};
const statusStyle: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-600",
};

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function ParentTransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = allTransactions.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      t.school.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPaid = allTransactions.filter(t => t.status === "success").reduce((s, t) => s + t.amount, 0);
  const totalPending = allTransactions.filter(t => t.status === "pending").reduce((s, t) => s + t.amount, 0);
  const carepayTxns = allTransactions.filter(t => t.method === "CarePay").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">All your school fee payments and CarePay activity</p>
        </div>
        <Button size="sm" variant="outline" className="border-[#00468E] text-[#00468E] rounded-xl">
          <Download className="h-4 w-4 mr-1.5" /> Export PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Paid", value: `Rs. ${totalPaid.toLocaleString()}`, icon: IndianRupee, bg: "bg-[#00468E]/10", color: "text-[#00468E]" },
          { label: "Pending", value: `Rs. ${totalPending.toLocaleString()}`, icon: Clock, bg: "bg-amber-100", color: "text-amber-600" },
          { label: "Via CarePay", value: `${carepayTxns} txns`, icon: CreditCard, bg: "bg-emerald-100", color: "text-emerald-600" },
          { label: "Total Transactions", value: allTransactions.length.toString(), icon: TrendingUp, bg: "bg-purple-100", color: "text-purple-600" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={cardClass}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg} dark:opacity-80`}>
                    <Icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bar Chart */}
      <Card className={cardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyBar} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, "Paid"]} />
              <Bar dataKey="paid" fill="#00468E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">All Transactions</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm border-gray-200 dark:border-[#00468E]/30" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-[110px] text-xs border-gray-200 dark:border-[#00468E]/30">
                  <Filter className="h-3 w-3 mr-1" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#00468E]/15">
                  {["Txn ID", "Type", "School", "Date & Time", "Method", "Amount", "Status"].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(txn => {
                  const Icon = statusIcon[txn.status];
                  return (
                    <tr key={txn.id} className="border-b border-gray-50 dark:border-[#00468E]/10 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs text-gray-500">{txn.id}</td>
                      <td className="py-3 px-3 font-medium text-gray-800 dark:text-gray-200">{txn.type}</td>
                      <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400 max-w-[120px] truncate">{txn.school}</td>
                      <td className="py-3 px-3">
                        <p className="text-xs text-gray-700 dark:text-gray-200">{txn.date}</p>
                        <p className="text-[10px] text-gray-400">{txn.time}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-medium text-[#00468E] dark:text-blue-400">{txn.method}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">Rs. {txn.amount.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <Badge className={`text-[10px] font-semibold border-0 ${statusStyle[txn.status]}`}>
                          <Icon className="h-3 w-3 mr-1" />
                          {txn.status === "success" ? "Paid" : txn.status === "pending" ? "Pending" : "Failed"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {!filtered.length && (
                  <tr><td colSpan={7} className="text-center py-10 text-sm text-gray-400">No transactions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
