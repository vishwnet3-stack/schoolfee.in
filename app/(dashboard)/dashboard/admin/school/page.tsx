"use client";

import {
  Users, CreditCard, CheckCircle2, Clock, AlertCircle, IndianRupee,
  ArrowUpRight, FileText, TrendingUp, Building2, ClipboardList,
  UserCheck, RefreshCw, Zap, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import Link from "next/link";
import { useAdminAuth } from "../AdminAuthContext";

const monthlyData = [
  { month: "Nov", received: 285000, pending: 35000 },
  { month: "Dec", received: 310000, pending: 28000 },
  { month: "Jan", received: 298000, pending: 42000 },
  { month: "Feb", received: 325000, pending: 19000 },
  { month: "Mar", received: 352000, pending: 8000 },
  { month: "Apr", received: 338000, pending: 22000 },
  { month: "May", received: 372000, pending: 48000 },
  { month: "Jun", received: 312000, pending: 60000 },
];

const requestStatusData = [
  { name: "Approved", value: 892, color: "#10b981" },
  { name: "Pending", value: 124, color: "#F4951D" },
  { name: "Verified", value: 68, color: "#00468E" },
  { name: "Rejected", value: 42, color: "#ef4444" },
];

const recentRequests = [
  { id: "REQ-1024", student: "Ravi Kumar", class: "IX-A", parent: "Suresh Kumar", amount: 16800, date: "Today", status: "pending" },
  { id: "REQ-1023", student: "Nisha Patel", class: "X-B", parent: "Anil Patel", amount: 16800, date: "Today", status: "verified" },
  { id: "REQ-1022", student: "Arjun Mehta", class: "VIII-C", parent: "Vikas Mehta", amount: 14200, date: "Yesterday", status: "approved" },
  { id: "REQ-1021", student: "Priya Singh", class: "IX-B", parent: "Ramesh Singh", amount: 16800, date: "Yesterday", status: "pending" },
  { id: "REQ-1020", student: "Dev Sharma", class: "X-A", parent: "Mohan Sharma", amount: 16800, date: "2 Jun", status: "approved" },
];

const recentPayments = [
  { id: "TXN-5501", student: "Arjun Mehta", amount: 14200, date: "15 May 2025", mode: "CarePay", status: "completed" },
  { id: "TXN-5500", student: "Dev Sharma", amount: 16800, date: "15 May 2025", mode: "CarePay", status: "completed" },
  { id: "TXN-5499", student: "Meera Joshi", amount: 16800, date: "01 May 2025", mode: "CarePay", status: "completed" },
];

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const statusStyle: Record<string, string> = {
  pending:  "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  verified: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  completed:"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
};

export default function SchoolDashboardPage() {
  const { user } = useAdminAuth();

  return (
    <div className="space-y-6">

      {/* ── Hero banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#001a3d] via-[#00468E] to-[#0061c3] p-6 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-[#F4951D]/10 rounded-full pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Schoolfee Partner School</p>
              <h1 className="text-2xl font-bold">Delhi Public School</h1>
              <p className="text-white/50 text-xs mt-0.5">New Delhi · CBSE · Est. 1949</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Total Students", value: "1,240" },
              { label: "Via CarePay", value: "892" },
              { label: "This Month", value: "Rs. 3.72L" },
            ].map(s => (
              <div key={s.label} className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-white/55 text-[10px] uppercase tracking-wide mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Requests",       value: "1,126", sub: "+18 this week",     icon: ClipboardList, bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20",      color: "text-[#00468E] dark:text-blue-400",  href: "/dashboard/admin/school/requests" },
          { title: "Pending Verification", value: "124",   sub: "Needs your action", icon: Clock,         bg: "bg-amber-100 dark:bg-amber-900/25",          color: "text-amber-600",                     href: "/dashboard/admin/school/requests" },
          { title: "Approved Cases",       value: "892",   sub: "All time",          icon: CheckCircle2,  bg: "bg-emerald-100 dark:bg-emerald-900/25",      color: "text-emerald-600",                   href: "/dashboard/admin/school/students" },
          { title: "Total Received",       value: "Rs. 1.12 Cr", sub: "via Schoolfee CarePay", icon: IndianRupee, bg: "bg-purple-100 dark:bg-purple-900/25", color: "text-purple-600",                   href: "/dashboard/admin/school/payments" },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.title} href={kpi.href}>
              <Card className={`${cardClass} hover:shadow-md transition-shadow cursor-pointer`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">{kpi.title}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 leading-tight">{kpi.value}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{kpi.sub}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`}>
                      <Icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <Card className={`${cardClass} lg:col-span-2`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly Schoolfee Payments to Your School</CardTitle>
              <Badge className="bg-[#00468E]/10 text-[#00468E] border-0 text-xs">2025</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rcvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00468E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00468E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F4951D" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F4951D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }}
                  formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, ""]} />
                <Area type="monotone" dataKey="received" stroke="#00468E" strokeWidth={2.5} fill="url(#rcvGrad)" name="Received" />
                <Area type="monotone" dataKey="pending" stroke="#F4951D" strokeWidth={2} fill="url(#pendGrad)" name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"><div className="w-3 h-0.5 bg-[#00468E]" /> Received</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"><div className="w-3 h-0.5 bg-[#F4951D]" /> Pending</div>
            </div>
          </CardContent>
        </Card>

        {/* Donut */}
        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={requestStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="value">
                  {requestStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {requestStatusData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent requests + recent payments ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent requests */}
        <Card className={`${cardClass} lg:col-span-2`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-[#00468E]" /> Recent Fee Support Requests
              </CardTitle>
              <Link href="/dashboard/admin/school/requests">
                <Button variant="ghost" size="sm" className="text-xs text-[#00468E] h-7 hover:bg-[#00468E]/10">
                  View all <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentRequests.map(r => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs font-bold bg-[#00468E]/10 dark:bg-[#00468E]/20 text-[#00468E]">
                      {r.student.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{r.student}</p>
                    <p className="text-xs text-gray-400">{r.class} · Parent: {r.parent} · {r.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Rs. {r.amount.toLocaleString()}</p>
                    <Badge className={`text-[10px] border-0 font-semibold mt-0.5 ${statusStyle[r.status]}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions + recent payments */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className={cardClass}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#F4951D]" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Verify Student Application", href: "/dashboard/admin/school/requests", icon: UserCheck, color: "text-[#00468E]", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
                { label: "View Payment Records", href: "/dashboard/admin/school/payments", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
                { label: "Referral Verifications", href: "/dashboard/admin/school/referrals", icon: UserCheck, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
                { label: "Download Reports", href: "/dashboard/admin/school/reports", icon: FileText, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <Link key={a.label} href={a.href}>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#00468E]/5 cursor-pointer transition-colors group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.bg}`}>
                        <Icon className={`h-4 w-4 ${a.color}`} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 flex-1">{a.label}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#00468E] transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent payments */}
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-600" /> Latest Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPayments.map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{p.student}</p>
                      <p className="text-[10px] text-gray-400">{p.date} · {p.mode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">Rs. {p.amount.toLocaleString()}</p>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Done</Badge>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/admin/school/payments">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-[#00468E] hover:bg-[#00468E]/10 h-8 mt-1">
                    See all payments <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
