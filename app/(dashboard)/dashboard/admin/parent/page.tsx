"use client";

import {
  CreditCard, School, Wallet, ArrowUpRight, ArrowDownRight,
  CheckCircle2, AlertCircle, IndianRupee, Clock, TrendingUp,
  CalendarDays, ShieldCheck, Zap, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import Link from "next/link";
import { useAdminAuth } from "../Adminauthcontext";

const monthlyData = [
  { month: "Oct", schoolfee_paid: 8500, you_repaid: 5000 },
  { month: "Nov", schoolfee_paid: 12000, you_repaid: 8500 },
  { month: "Dec", schoolfee_paid: 9500, you_repaid: 7200 },
  { month: "Jan", schoolfee_paid: 14200, you_repaid: 9100 },
  { month: "Feb", schoolfee_paid: 11000, you_repaid: 6800 },
  { month: "Mar", schoolfee_paid: 16800, you_repaid: 11000 },
  { month: "Apr", schoolfee_paid: 13500, you_repaid: 8500 },
  { month: "May", schoolfee_paid: 18200, you_repaid: 13000 },
];

const feeBreakdown = [
  { name: "Tuition", value: 62000, color: "#00468E" },
  { name: "Transport", value: 18000, color: "#F4951D" },
  { name: "Activity", value: 8000, color: "#10b981" },
  { name: "Lab & Library", value: 5500, color: "#8b5cf6" },
];

const recentActivity = [
  { id: "A1", desc: "Schoolfee paid May Tuition to DPS New Delhi", amount: 16800, date: "15 May 2025", dir: "out", status: "done" },
  { id: "A2", desc: "You repaid Schoolfee via UPI", amount: 11000, date: "10 May 2025", dir: "in", status: "done" },
  { id: "A3", desc: "Schoolfee paid Apr Transport to DPS New Delhi", amount: 4500, date: "01 Apr 2025", dir: "out", status: "done" },
  { id: "A4", desc: "You repaid Schoolfee via Net Banking", amount: 8500, date: "05 Apr 2025", dir: "in", status: "done" },
  { id: "A5", desc: "Repayment due to Schoolfee", amount: 5200, date: "10 Jun 2025", dir: "pending", status: "pending" },
];

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function ParentDashboardPage() {
  const { user } = useAdminAuth();
  const firstName = user?.name?.split(" ")[0] || "Parent";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Schoolfee is managing your child's school fees — here's your full picture.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/admin/parent/program">
            <Button size="sm" variant="outline" className="border-[#00468E] text-[#00468E] hover:bg-[#00468E]/5 rounded-xl">
              <Wallet className="h-4 w-4 mr-1.5" /> CarePay Program
            </Button>
          </Link>
          <Link href="/dashboard/admin/parent/repayment">
            <Button size="sm" className="bg-[#00468E] hover:bg-[#003570] text-white rounded-xl">
              <CreditCard className="h-4 w-4 mr-1.5" /> Repay Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Program status banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#001f4d] via-[#00468E] to-[#0058b4] p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-white/60 font-medium uppercase tracking-wider">CarePay Program — Active</p>
            <p className="font-bold text-base mt-0.5">Schoolfee is covering your child's monthly fees</p>
            <p className="text-white/60 text-xs mt-0.5">
              Next payment to school: <span className="text-[#F4951D] font-semibold">Rs. 16,800 on 15 Jun 2025</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <p className="text-xl font-bold">Rs. 5,200</p>
            <p className="text-white/60 text-[10px] uppercase tracking-wide mt-0.5">Your next repayment</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Paid to School (via Schoolfee)", value: "Rs. 1,03,500", change: "This year", positive: true, icon: IndianRupee, bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20", color: "text-[#00468E] dark:text-blue-400" },
          { title: "Your Repayments to Schoolfee", value: "Rs. 98,300", change: "On time", positive: true, icon: Wallet, bg: "bg-emerald-100 dark:bg-emerald-900/25", color: "text-emerald-600" },
          { title: "Outstanding to Schoolfee", value: "Rs. 5,200", change: "Due Jun 10", positive: false, icon: AlertCircle, bg: "bg-amber-100 dark:bg-amber-900/25", color: "text-amber-600" },
          { title: "Active Enrolled Schools", value: "1 School", change: "DPS New Delhi", positive: true, icon: School, bg: "bg-purple-100 dark:bg-purple-900/25", color: "text-purple-600" },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className={cardClass}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">{kpi.title}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
                    <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${kpi.positive ? "text-emerald-600" : "text-amber-600"}`}>
                      {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {kpi.change}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className={`${cardClass} lg:col-span-2`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">
              Schoolfee → School Payments vs Your Repayments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00468E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00468E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="repayGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }}
                  formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="schoolfee_paid" stroke="#00468E" strokeWidth={2.5} fill="url(#sfGrad)" name="Schoolfee → School" />
                <Area type="monotone" dataKey="you_repaid" stroke="#10b981" strokeWidth={2} fill="url(#repayGrad)" name="You → Schoolfee" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-3 h-0.5 bg-[#00468E]" /> Schoolfee paid to school
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-3 h-0.5 bg-emerald-500" /> Your repayment to Schoolfee
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Fee Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={feeBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
                  {feeBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {feeBreakdown.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white">Rs. {item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it works + School Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* How CarePay works */}
        <Card className={cardClass}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">How Your CarePay Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { step: "1", title: "Fee Due at School", desc: "Every month, your child's school raises a fee demand.", color: "bg-[#00468E]" },
                { step: "2", title: "Schoolfee Pays School", desc: "Schoolfee.in pays the school directly on your behalf via CarePay. Your child's education continues without interruption.", color: "bg-[#F4951D]" },
                { step: "3", title: "You Repay Schoolfee", desc: "When you have funds available — at 3, 6, or 12 months — you repay Schoolfee with zero interest, zero stress.", color: "bg-emerald-600" },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full ${s.color} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{s.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> 0% Interest · No hidden charges · Flexible repayment
              </p>
            </div>
          </CardContent>
        </Card>

        {/* School + Repayment options */}
        <div className="space-y-4">
          {/* Enrolled School */}
          <Card className={cardClass}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00468E]/10 dark:bg-[#00468E]/20 flex items-center justify-center shrink-0">
                  <School className="h-5 w-5 text-[#00468E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Delhi Public School, New Delhi</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Class IX-A · CBSE · Roll No. 24</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Active</Badge>
                    <span className="text-xs text-gray-400">Annual: Rs. 1,24,000</span>
                  </div>
                </div>
                <Link href="/dashboard/admin/parent/schools">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00468E]">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Repayment Options */}
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-800 dark:text-white">Repayment Options Available</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Pay in 3 months", desc: "Rs. 1,733/month", badge: "Popular", badgeColor: "bg-[#00468E]/10 text-[#00468E]" },
                { label: "Pay in 6 months", desc: "Rs. 867/month", badge: "Flexible", badgeColor: "bg-emerald-100 text-emerald-700" },
                { label: "Pay in 12 months", desc: "Rs. 433/month", badge: "Easy", badgeColor: "bg-purple-100 text-purple-700" },
              ].map(opt => (
                <div key={opt.label} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#00468E]/5 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-[#00468E]/20 transition-all">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{opt.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{opt.desc} · 0% interest</p>
                  </div>
                  <Badge className={`${opt.badgeColor} border-0 text-[10px] font-semibold`}>{opt.badge}</Badge>
                </div>
              ))}
              <Link href="/dashboard/admin/parent/repayment" className="block mt-2">
                <Button size="sm" className="w-full bg-[#00468E] hover:bg-[#003570] text-white rounded-xl">
                  Choose Repayment Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">
              Recent Activity — Money Flow
            </CardTitle>
            <Link href="/dashboard/admin/parent/transactions">
              <Button variant="ghost" size="sm" className="text-xs text-[#00468E] h-7 hover:bg-[#00468E]/10">
                View all <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.dir === "out" ? "bg-[#00468E]/10" : a.dir === "in" ? "bg-emerald-100 dark:bg-emerald-900/20" : "bg-amber-100 dark:bg-amber-900/20"}`}>
                  {a.dir === "out"
                    ? <School className="h-4 w-4 text-[#00468E]" />
                    : a.dir === "in"
                    ? <Wallet className="h-4 w-4 text-emerald-600" />
                    : <Clock className="h-4 w-4 text-amber-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{a.desc}</p>
                  <p className="text-xs text-gray-400">{a.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${a.dir === "out" ? "text-[#00468E] dark:text-blue-400" : a.dir === "in" ? "text-emerald-600" : "text-amber-600"}`}>
                    {a.dir === "in" ? "+" : ""}Rs. {a.amount.toLocaleString()}
                  </p>
                  <Badge className={`text-[10px] border-0 font-semibold ${a.status === "done" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {a.status === "done" ? "Done" : "Due"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}