"use client";

import {
  Users, BookOpen, IndianRupee, Calendar, ArrowUpRight, CheckCircle2,
  Clock, TrendingUp, Star, AlertCircle, ChevronRight, Zap,
  GraduationCap, Activity, Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar,
} from "recharts";
import Link from "next/link";
import { useAdminAuth } from "../Adminauthcontext";

const attendanceData = [
  { month: "Jan", present: 22, absent: 4 },
  { month: "Feb", present: 24, absent: 2 },
  { month: "Mar", present: 26, absent: 0 },
  { month: "Apr", present: 25, absent: 1 },
  { month: "May", present: 23, absent: 3 },
  { month: "Jun", present: 27, absent: 1 },
];

const salaryData = [
  { month: "Jan", salary: 45000 },
  { month: "Feb", salary: 45000 },
  { month: "Mar", salary: 48000 },
  { month: "Apr", salary: 45000 },
  { month: "May", salary: 52000 },
  { month: "Jun", salary: 45000 },
];

const myClasses = [
  { name: "Class IX-A", subject: "Mathematics", students: 42, feesPaid: 38, pending: 4, room: "Room 204", next: "Mon 9:00 AM" },
  { name: "Class X-B", subject: "Mathematics", students: 38, feesPaid: 35, pending: 3, room: "Room 301", next: "Tue 10:30 AM" },
  { name: "Class VIII-C", subject: "Mathematics", students: 45, feesPaid: 40, pending: 5, room: "Room 105", next: "Mon 11:00 AM" },
];

const pendingStudents = [
  { name: "Rahul Verma", class: "IX-A", amount: "Rs. 16,800", due: "May 2025", days: 12 },
  { name: "Deepa Mishra", class: "VIII-C", amount: "Rs. 14,200", due: "May 2025", days: 12 },
  { name: "Arjun Nair", class: "X-B", amount: "Rs. 16,800", due: "May 2025", days: 8 },
];

const todaySchedule = [
  { time: "9:00 AM", class: "IX-A", subject: "Algebra", room: "Room 204", status: "done" },
  { time: "10:30 AM", class: "X-B", subject: "Trigonometry", room: "Room 301", status: "ongoing" },
  { time: "11:00 AM", class: "VIII-C", subject: "Basic Geometry", room: "Room 105", status: "upcoming" },
  { time: "2:00 PM", class: "IX-A", subject: "Problem Solving", room: "Room 204", status: "upcoming" },
];

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function TeacherDashboardPage() {
  const { user } = useAdminAuth();
  const firstName = user?.name?.split(" ")[0] || "Teacher";

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const today = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">

      {/* ── Hero greeting banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0a0a2e] via-[#1a1060] to-[#2d1b8e] p-6 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-32 w-32 h-32 bg-[#F4951D]/10 rounded-full pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-white/30 shrink-0">
              <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                {user?.name?.split(" ").map(n => n[0]).slice(0, 2).join("") || "T"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white/60 text-sm">{greeting}, Teacher</p>
              <h1 className="text-2xl font-bold">{user?.name || "Teacher"}</h1>
              <p className="text-white/50 text-xs mt-0.5">{today}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-[#F4951D]">3</p>
              <p className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">Classes Today</p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">125</p>
              <p className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">Students</p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">94%</p>
              <p className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">Attendance</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: "My Classes", value: "3", sub: "125 total students",
            icon: BookOpen, bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20",
            color: "text-[#00468E] dark:text-blue-400", href: "/dashboard/admin/teacher/classes",
          },
          {
            title: "Fee Pending", value: "12", sub: "Students overdue",
            icon: AlertCircle, bg: "bg-amber-100 dark:bg-amber-900/25",
            color: "text-amber-600", href: "/dashboard/admin/teacher/students",
          },
          {
            title: "Monthly Salary", value: "Rs. 45,000", sub: "Credited on 1st",
            icon: IndianRupee, bg: "bg-emerald-100 dark:bg-emerald-900/25",
            color: "text-emerald-600", href: "/dashboard/admin/teacher/payments",
          },
          {
            title: "Attendance Rate", value: "94.8%", sub: "This academic year",
            icon: Activity, bg: "bg-purple-100 dark:bg-purple-900/25",
            color: "text-purple-600", href: "#",
          },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.title} href={kpi.href}>
              <Card className={`${cardClass} hover:shadow-md transition-shadow cursor-pointer`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 leading-tight">{kpi.value}</p>
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

      {/* ── Today's schedule + pending fees ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Today's schedule */}
        <Card className={`${cardClass} lg:col-span-3`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#00468E]" /> Today's Schedule
              </CardTitle>
              <Badge className="bg-[#00468E]/10 text-[#00468E] border-0 text-xs">
                {today.split(",")[0]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3.5 rounded-xl transition-colors ${
                    s.status === "ongoing"
                      ? "bg-[#00468E]/8 dark:bg-[#00468E]/15 border border-[#00468E]/20"
                      : "hover:bg-gray-50 dark:hover:bg-[#00468E]/5"
                  }`}
                >
                  {/* Time */}
                  <div className="w-16 shrink-0 text-center">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300">{s.time}</p>
                  </div>

                  {/* Divider dot */}
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    s.status === "done" ? "bg-emerald-500" :
                    s.status === "ongoing" ? "bg-[#00468E] ring-2 ring-[#00468E]/30" :
                    "bg-gray-300 dark:bg-gray-600"
                  }`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{s.class} — {s.subject}</p>
                      {s.status === "ongoing" && (
                        <Badge className="bg-[#00468E] text-white border-0 text-[10px] animate-pulse">Live</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{s.room}</p>
                  </div>

                  <Badge className={`text-[10px] border-0 font-semibold shrink-0 ${
                    s.status === "done" ? "bg-emerald-100 text-emerald-700" :
                    s.status === "ongoing" ? "bg-[#00468E]/15 text-[#00468E] dark:text-blue-300" :
                    "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}>
                    {s.status === "done" ? "Done" : s.status === "ongoing" ? "In Progress" : "Upcoming"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending fee students */}
        <Card className={`${cardClass} lg:col-span-2`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" /> Fee Pending
              </CardTitle>
              <Link href="/dashboard/admin/teacher/students">
                <Button variant="ghost" size="sm" className="text-xs text-[#00468E] h-7 px-2 hover:bg-[#00468E]/10">
                  View all <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingStudents.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700">
                      {s.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-white">{s.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{s.class} · Due {s.due}</p>
                    <p className="text-xs font-semibold text-amber-600 mt-0.5">{s.amount}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-0 text-[10px] shrink-0">
                    {s.days}d late
                  </Badge>
                </div>
              ))}
              <div className="pt-1">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
                  + 9 more students with pending dues
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Student Attendance — Monthly</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={attendanceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }}
                />
                <Bar dataKey="present" fill="#00468E" radius={[5, 5, 0, 0]} name="Present" maxBarSize={28} />
                <Bar dataKey="absent" fill="#F4951D" radius={[5, 5, 0, 0]} name="Absent" maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-3 h-2 rounded bg-[#00468E]" /> Present
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-3 h-2 rounded bg-[#F4951D]" /> Absent
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Salary Credits — 6 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salaryData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid rgba(139,92,246,0.15)", fontSize: "12px" }}
                  formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, "Salary"]}
                />
                <Area type="monotone" dataKey="salary" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#salaryGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── My Classes ── */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#00468E]" /> My Classes — Fee Status
            </CardTitle>
            <Link href="/dashboard/admin/teacher/classes">
              <Button variant="ghost" size="sm" className="text-xs text-[#00468E] h-7 hover:bg-[#00468E]/10">
                View all <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {myClasses.map(cls => {
              const paidPct = (cls.feesPaid / cls.students) * 100;
              const color = paidPct >= 90 ? "bg-emerald-500" : paidPct >= 80 ? "bg-[#00468E]" : "bg-amber-500";
              return (
                <div key={cls.name} className="p-4 rounded-xl bg-gray-50 dark:bg-[#00468E]/5 border border-gray-100 dark:border-[#00468E]/15 hover:border-[#00468E]/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{cls.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cls.room} · {cls.next}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#00468E]/10 dark:bg-[#00468E]/20 flex items-center justify-center shrink-0">
                      <BookOpen className="h-4 w-4 text-[#00468E]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                      <CheckCircle2 className="h-3 w-3 mr-1" />{cls.feesPaid} paid
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
                      <Clock className="h-3 w-3 mr-1" />{cls.pending} due
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Collection rate</span>
                      <span className="font-bold text-gray-800 dark:text-white">{paidPct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-[#00468E]/20 rounded-full h-1.5">
                      <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${paidPct}%` }} />
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{cls.students} total students</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Recent Salary ── */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-emerald-600" /> Recent Salary Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#00468E]/15">
                  {["Month", "Amount", "Credited On", "Bank", "Status"].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { month: "June 2025", amount: 45000, date: "01 Jun 2025", bank: "SBI ••4321" },
                  { month: "May 2025",  amount: 52000, date: "01 May 2025", bank: "SBI ••4321" },
                  { month: "April 2025", amount: 45000, date: "01 Apr 2025", bank: "SBI ••4321" },
                  { month: "March 2025", amount: 48000, date: "01 Mar 2025", bank: "SBI ••4321" },
                ].map((sal, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-[#00468E]/10 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-800 dark:text-gray-200">{sal.month}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600 text-base">Rs. {sal.amount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{sal.date}</td>
                    <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{sal.bank}</td>
                    <td className="py-3 px-3">
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] font-semibold">
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

    </div>
  );
}
