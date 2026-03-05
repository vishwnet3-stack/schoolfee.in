"use client";

import { useState } from "react";
import { Download, TrendingUp, Users, CreditCard, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { PageHeader } from "../components/PageHeader";
import { monthlyData } from "../components/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";
const inputClass = "bg-white dark:bg-[#0a1628] border-gray-200 dark:border-[#00468E]/30 text-gray-700 dark:text-gray-300";

// Type-safe recharts Tooltip formatter — value can be number | undefined per recharts types
const rupeesFormatter = (v: number | string | Array<number | string> | undefined): [string, string] => {
  const num = typeof v === "number" ? v : 0;
  return [`Rs.${num.toLocaleString()}`, "Revenue"];
};

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("this_year");

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" description="Platform-wide insights and data exports">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className={`w-[140px] h-9 text-sm ${inputClass}`}><SelectValue /></SelectTrigger>
          <SelectContent className={`bg-white dark:bg-[#0d1f3c] border-gray-200 dark:border-[#00468E]/30`}>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_3_months">Last 3 Months</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem value="all_time">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9 gap-2 border-gray-200 dark:border-[#00468E]/30 text-gray-700 dark:text-gray-300 hover:border-[#00468E] hover:text-[#00468E]">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </PageHeader>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "3,513", change: "+12.5%", icon: Users, bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20", color: "text-[#00468E] dark:text-blue-400" },
          { label: "Revenue YTD", value: "Rs.21.6L", change: "+18.3%", icon: CreditCard, bg: "bg-emerald-100 dark:bg-emerald-900/25", color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Avg Growth", value: "24.5%", change: "+4.2%", icon: TrendingUp, bg: "bg-[#F4951D]/10 dark:bg-[#F4951D]/20", color: "text-[#F4951D]" },
          { label: "Active Schools", value: "127", change: "+16 new", icon: BarChart2, bg: "bg-purple-100 dark:bg-purple-900/25", color: "text-purple-600 dark:text-purple-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={`${cardClass} p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">{s.change}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="users">
        <TabsList className="bg-gray-100 dark:bg-[#0d1f3c] border border-gray-200 dark:border-[#00468E]/20 p-1 rounded-xl h-auto flex-wrap gap-1">
          <TabsTrigger value="users" className="rounded-lg text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#00468E]/30 data-[state=active]:text-[#00468E] dark:data-[state=active]:text-blue-300">User Growth</TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-lg text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#00468E]/30 data-[state=active]:text-[#00468E] dark:data-[state=active]:text-blue-300">Revenue</TabsTrigger>
          <TabsTrigger value="schools" className="rounded-lg text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#00468E]/30 data-[state=active]:text-[#00468E] dark:data-[state=active]:text-blue-300">School Registrations</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00468E" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00468E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="users" stroke="#00468E" strokeWidth={2.5} fill="url(#userGrad)" name="New Users" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly Revenue (Rs.)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }} formatter={rupeesFormatter} />
                  <Bar dataKey="payments" fill="#F4951D" radius={[4, 4, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schools" className="mt-4">
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">New School Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="schools" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} name="Schools" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export buttons */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["User Report", "Payment Report", "School Report", "Activity Log"].map((r) => (
              <Button key={r} variant="outline" className="h-10 gap-2 text-sm justify-start border-gray-200 dark:border-[#00468E]/30 text-gray-700 dark:text-gray-300 hover:border-[#00468E] hover:text-[#00468E] dark:hover:border-[#00468E]/60 dark:hover:text-blue-300">
                <Download className="h-4 w-4" /> {r}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}