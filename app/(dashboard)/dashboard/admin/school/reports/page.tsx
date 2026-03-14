"use client";

import {
  BarChart3, Download, TrendingUp, CheckCircle2, XCircle, Clock,
  IndianRupee, FileText, Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const monthlyRequests = [
  { month: "Jan", approved: 92, rejected: 8, pending: 12 },
  { month: "Feb", approved: 85, rejected: 6, pending: 9 },
  { month: "Mar", approved: 110, rejected: 5, pending: 7 },
  { month: "Apr", approved: 98, rejected: 9, pending: 15 },
  { month: "May", approved: 125, rejected: 7, pending: 18 },
  { month: "Jun", approved: 78, rejected: 4, pending: 22 },
];

const monthlyPayments = [
  { month: "Jan", amount: 325000 },
  { month: "Feb", amount: 318000 },
  { month: "Mar", amount: 352000 },
  { month: "Apr", amount: 338000 },
  { month: "May", amount: 372000 },
  { month: "Jun", amount: 312000 },
];

const categoryBreakdown = [
  { name: "Tuition Fee", value: 840000, color: "#00468E" },
  { name: "Transport", value: 145000, color: "#F4951D" },
  { name: "Activity", value: 65000, color: "#10b981" },
  { name: "Lab & Library", value: 42000, color: "#8b5cf6" },
];

const summaryStats = [
  { label: "Total Requests", value: "1,126", icon: FileText, color: "text-[#00468E]", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
  { label: "Approved", value: "892", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
  { label: "Rejected", value: "42", icon: XCircle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/20" },
  { label: "Total Received", value: "Rs. 1.12 Cr", icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
];

export default function SchoolReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Fee support activity and payment insights for your school</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-[#00468E] text-[#00468E] hover:bg-[#00468E]/5 rounded-xl"
            onClick={() => toast.success("CSV downloaded!")}>
            <Download className="h-4 w-4 mr-1.5" /> CSV
          </Button>
          <Button size="sm" className="bg-[#00468E] hover:bg-[#003570] text-white rounded-xl"
            onClick={() => toast.success("PDF report downloaded!")}>
            <Download className="h-4 w-4 mr-1.5" /> PDF Report
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryStats.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={cardClass}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Request status chart */}
        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly Request Summary</CardTitle>
              <Badge className="bg-[#00468E]/10 text-[#00468E] border-0 text-xs">2025</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyRequests} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }} />
                <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} name="Approved" maxBarSize={16} />
                <Bar dataKey="pending" fill="#F4951D" radius={[4, 4, 0, 0]} name="Pending" maxBarSize={16} />
                <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {[["#10b981","Approved"],["#F4951D","Pending"],["#ef4444","Rejected"]].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: c }} /> {l}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment line chart */}
        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly Payment Received</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyPayments} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="pmtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00468E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00468E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }}
                  formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, "Received"]} />
                <Line type="monotone" dataKey="amount" stroke="#00468E" strokeWidth={2.5} dot={{ fill: "#00468E", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category breakdown donut */}
        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Payment Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="value">
                    {categoryBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }}
                    formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {categoryBreakdown.map(item => (
                  <div key={item.name} className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-800 dark:text-white">Rs. {(item.value / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <Card className={cardClass}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Key Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Application Approval Rate", value: 87.3, color: "bg-emerald-500" },
                { label: "Payments Received on Time", value: 94.2, color: "bg-[#00468E]" },
                { label: "Average Processing Time", value: 68, suffix: "% within 48hr", color: "bg-purple-500" },
                { label: "CarePay Utilization Rate", value: 91.5, color: "bg-[#F4951D]" },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{m.label}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{m.value}{m.suffix || "%"}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#00468E]/15 rounded-full h-2">
                    <div className={`${m.color} h-2 rounded-full transition-all`} style={{ width: `${Math.min(m.value, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly summary table */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly Payment Summary — 2025</CardTitle>
            <Button size="sm" variant="outline" className="border-gray-200 dark:border-[#00468E]/30 rounded-xl text-xs"
              onClick={() => toast.success("Table exported!")}>
              <Download className="h-3.5 w-3.5 mr-1" /> Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#00468E]/15">
                  {["Month", "Approved", "Pending", "Rejected", "Payments Received", "Collection Rate"].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyRequests.map((row, i) => {
                  const pmt = monthlyPayments[i];
                  const rate = ((row.approved / (row.approved + row.rejected + row.pending)) * 100).toFixed(0);
                  return (
                    <tr key={row.month} className="border-b border-gray-50 dark:border-[#00468E]/10 hover:bg-gray-50 dark:hover:bg-[#00468E]/5">
                      <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200">{row.month} 2025</td>
                      <td className="py-3 px-3"><Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">{row.approved}</Badge></td>
                      <td className="py-3 px-3"><Badge className="bg-amber-100 text-amber-700 border-0 text-xs">{row.pending}</Badge></td>
                      <td className="py-3 px-3"><Badge className="bg-red-100 text-red-600 border-0 text-xs">{row.rejected}</Badge></td>
                      <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">Rs. {pmt.amount.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-[#00468E]/20 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
