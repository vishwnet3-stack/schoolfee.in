"use client";

import { useState } from "react";
import { Search, Download, TrendingUp, TrendingDown, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { mockPayments, monthlyData } from "../components/mock-data";

// Type-safe recharts Tooltip formatter — value can be number | undefined per recharts types
const rupeesFormatter = (v: number | string | Array<number | string> | undefined): [string, string] => {
  const num = typeof v === "number" ? v : 0;
  return [`₹${num.toLocaleString()}`, "Revenue"];
};

const carepayData = [
  { parent: "Sunita Verma", school: "Kendriya Vidyalaya", total: 12000, paid: 8000, remaining: 4000, installments: 3, nextDue: "2024-06-01" },
  { parent: "Manoj Tiwari", school: "St. Xavier's School", total: 18000, paid: 6000, remaining: 12000, installments: 6, nextDue: "2024-05-28" },
  { parent: "Arun Sharma", school: "Delhi Public School", total: 9500, paid: 2700, remaining: 6800, installments: 4, nextDue: "2024-06-05" },
];

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockPayments.filter((p) => {
    const matchSearch = p.parent.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = mockPayments.reduce((s, p) => s + (p.status === "Completed" ? p.amount : 0), 0);
  const pending = mockPayments.reduce((s, p) => s + (p.status === "Pending" ? p.amount : 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" description="Track and manage all financial transactions">
        <Button variant="outline" size="sm" className="h-9 gap-2"><Download className="h-4 w-4" /> Export</Button>
      </PageHeader>

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
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Monthly Revenue</CardTitle>
          </CardHeader>
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
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Completed", value: mockPayments.filter((p) => p.status === "Completed").length },
                    { name: "Pending", value: mockPayments.filter((p) => p.status === "Pending").length },
                    { name: "Failed", value: mockPayments.filter((p) => p.status === "Failed").length },
                  ]}
                  cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#F4951D" />
                  <Cell fill="#ef4444" />
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
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {mockPayments.filter((p) => p.status === s.label).length}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carepay Tracking */}
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
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00468E] to-[#F4951D]"
                    style={{ width: `${(cp.paid / cp.total) * 100}%` }}
                  />
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
    </div>
  );
}