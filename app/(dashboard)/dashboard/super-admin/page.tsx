"use client";

import { useState } from "react";
import {
  Users, School, UserCheck, Briefcase, UsersRound,
  FileText, CreditCard, TrendingUp, ArrowUpRight,
  Building2, Activity,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "./components/KpiCard";
import { PageHeader } from "./components/PageHeader";
import { StatusBadge } from "./components/StatusBadge";
import { kpiData, monthlyData, roleDistribution, recentActivity, mockPayments } from "./components/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const activityIconMap: Record<string, { icon: typeof Building2; bg: string; color: string }> = {
  school:   { icon: Building2,  bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20",  color: "text-[#00468E] dark:text-blue-400" },
  payment:  { icon: CreditCard, bg: "bg-emerald-100 dark:bg-emerald-900/25", color: "text-emerald-600 dark:text-emerald-400" },
  user:     { icon: Users,      bg: "bg-[#F4951D]/10 dark:bg-[#F4951D]/20",  color: "text-[#F4951D]" },
  employee: { icon: Briefcase,  bg: "bg-purple-100 dark:bg-purple-900/25",   color: "text-purple-600 dark:text-purple-400" },
  form:     { icon: FileText,   bg: "bg-amber-100 dark:bg-amber-900/25",     color: "text-amber-600 dark:text-amber-400" },
};

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("this_month");
  const [roleFilter, setRoleFilter] = useState("all");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        description="Welcome back, Arjun! Here's what's happening at Schoolfee."
      >
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] h-9 text-sm bg-white dark:bg-[#0d1f3c] border-gray-200 dark:border-[#00468E]/30 text-gray-700 dark:text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#0d1f3c] border-gray-200 dark:border-[#00468E]/30">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[130px] h-9 text-sm bg-white dark:bg-[#0d1f3c] border-gray-200 dark:border-[#00468E]/30 text-gray-700 dark:text-gray-200">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#0d1f3c] border-gray-200 dark:border-[#00468E]/30">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="user">Normal User</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <KpiCard title="Total Users" value={kpiData.totalUsers.toLocaleString()} change="+12.5%" changePositive icon={Users} iconBg="bg-[#00468E]/10 dark:bg-[#00468E]/20" iconColor="text-[#00468E] dark:text-blue-400" />
        <KpiCard title="Total Schools" value={kpiData.totalSchools} change="+3 new" changePositive icon={School} iconBg="bg-[#F4951D]/10 dark:bg-[#F4951D]/20" iconColor="text-[#F4951D]" />
        <KpiCard title="Total Parents" value={kpiData.totalParents.toLocaleString()} change="+8.2%" changePositive icon={UserCheck} iconBg="bg-emerald-100 dark:bg-emerald-900/25" iconColor="text-emerald-600 dark:text-emerald-400" />
        <KpiCard title="Employees" value={kpiData.totalEmployees} change="+5 hired" changePositive icon={Briefcase} iconBg="bg-purple-100 dark:bg-purple-900/25" iconColor="text-purple-600 dark:text-purple-400" />
        <KpiCard title="Managers" value={kpiData.totalManagers} change="+2 added" changePositive icon={UsersRound} iconBg="bg-indigo-100 dark:bg-indigo-900/25" iconColor="text-indigo-600 dark:text-indigo-400" />
        <KpiCard title="Applications" value={kpiData.totalApplications} change="+24.8%" changePositive icon={FileText} iconBg="bg-amber-100 dark:bg-amber-900/25" iconColor="text-amber-600 dark:text-amber-400" />
        <KpiCard title="Total Revenue" value={`Rs.${(kpiData.totalPayments / 100000).toFixed(1)}L`} change="+18.3%" changePositive icon={CreditCard} iconBg="bg-green-100 dark:bg-green-900/25" iconColor="text-green-600 dark:text-green-400" />
        <KpiCard title="Growth Rate" value="24.5%" change="+4.2%" changePositive icon={TrendingUp} iconBg="bg-rose-100 dark:bg-rose-900/25" iconColor="text-rose-600 dark:text-rose-400" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className={`${cardClass} lg:col-span-2`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00468E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00468E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="schoolsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F4951D" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F4951D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(0,70,142,0.15)",
                    background: "var(--tooltip-bg, white)",
                    fontSize: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.12)"
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="#00468E" strokeWidth={2.5} fill="url(#usersGrad)" name="Users" />
                <Area type="monotone" dataKey="schools" stroke="#F4951D" strokeWidth={2.5} fill="url(#schoolsGrad)" name="Schools" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="count">
                  {roleDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {roleDistribution.map((item) => (
                <div key={item.role} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 dark:text-gray-400">{item.role}</span>
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className={cardClass}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Recent Activity</CardTitle>
              <Link href="/schoolfee-admin/analytics">
                <Button variant="ghost" size="sm" className="text-xs text-[#00468E] dark:text-blue-400 font-medium h-7 hover:bg-[#00468E]/10">
                  View all <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => {
              const cfg = activityIconMap[activity.type] || activityIconMap.form;
              const Icon = cfg.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 whitespace-nowrap">{activity.time}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Recent Transactions</CardTitle>
              <Link href="/schoolfee-admin/payments">
                <Button variant="ghost" size="sm" className="text-xs text-[#00468E] dark:text-blue-400 font-medium h-7 hover:bg-[#00468E]/10">
                  View all <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPayments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs font-bold bg-[#00468E]/10 dark:bg-[#00468E]/25 text-[#00468E] dark:text-blue-400">
                    {payment.parent.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{payment.parent}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{payment.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Rs.{payment.amount.toLocaleString()}</p>
                  <StatusBadge status={payment.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Avg. Payment / School", value: "Rs.16,982", change: "+5.2%", positive: true, icon: Building2, bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20", color: "text-[#00468E] dark:text-blue-400" },
          { label: "Collection Rate", value: "78.4%", change: "+2.1%", positive: true, icon: Activity, bg: "bg-emerald-100 dark:bg-emerald-900/25", color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Pending Dues", value: "Rs.3.2L", change: "-8.5%", positive: false, icon: CreditCard, bg: "bg-amber-100 dark:bg-amber-900/25", color: "text-amber-600 dark:text-amber-400" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`${cardClass} p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${stat.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                    <TrendingUp className={`h-3 w-3 ${!stat.positive && "rotate-180"}`} />
                    {stat.change}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Form Submissions */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Recent Form Submissions</CardTitle>
            <Link href="/schoolfee-admin/forms">
              <Button variant="ghost" size="sm" className="text-xs text-[#00468E] dark:text-blue-400 font-medium h-7 hover:bg-[#00468E]/10">
                View all <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#00468E]/15">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">ID</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Type</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "FORM001", name: "Ravi Shankar", type: "School Registration", date: "2024-05-22", status: "Pending" },
                  { id: "FORM002", name: "Lakshmi Devi", type: "Parent Enrollment", date: "2024-05-21", status: "Reviewed" },
                  { id: "FORM003", name: "Mohan Lal", type: "Scholarship Application", date: "2024-05-20", status: "Approved" },
                  { id: "FORM004", name: "Seema Jain", type: "School Registration", date: "2024-05-19", status: "Rejected" },
                ].map((form) => (
                  <tr key={form.id} className="border-b border-gray-50 dark:border-[#00468E]/10 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs text-gray-500 dark:text-gray-500">{form.id}</td>
                    <td className="py-3 px-3 font-medium text-gray-800 dark:text-gray-200">{form.name}</td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-400 text-xs">{form.type}</td>
                    <td className="py-3 px-3 text-gray-500 dark:text-gray-500 text-xs">{form.date}</td>
                    <td className="py-3 px-3"><StatusBadge status={form.status} /></td>
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