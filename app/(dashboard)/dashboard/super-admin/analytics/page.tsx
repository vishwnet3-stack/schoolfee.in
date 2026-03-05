"use client";

import { useState } from "react";
import { Download, TrendingUp, TrendingDown, Users, CreditCard, School, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter,
} from "recharts";
import { PageHeader } from "../components/PageHeader";
import { monthlyData, weeklyData, stateData, roleDistribution } from "../components/mock-data";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const employeePerformance = [
  { subject: "Collections", A: 92, fullMark: 100 },
  { subject: "School Visits", A: 85, fullMark: 100 },
  { subject: "Parent Contact", A: 78, fullMark: 100 },
  { subject: "Documentation", A: 95, fullMark: 100 },
  { subject: "Reporting", A: 88, fullMark: 100 },
];

const conversionData = [
  { stage: "Website Visits", count: 12400 },
  { stage: "Form Submissions", count: 3200 },
  { stage: "Reviewed", count: 1840 },
  { stage: "Enrolled", count: 980 },
  { stage: "Active Payers", count: 720 },
];

// Type-safe recharts Tooltip formatter — value can be number | undefined per recharts types
const rupeesFormatter = (v: number | string | Array<number | string> | undefined): [string, string] => {
  const num = typeof v === "number" ? v : 0;
  return [`Rs.${num.toLocaleString()}`, "Revenue"];
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("this_year");

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Deep dive into platform performance metrics">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[150px] h-9 text-sm bg-white dark:bg-[#0d1f3c] border-gray-200 dark:border-[#00468E]/30 text-gray-700 dark:text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#0d1f3c] border-gray-200 dark:border-[#00468E]/30">
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_3_months">Last 3 Months</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem value="all_time">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9 gap-2 border-gray-200 dark:border-[#00468E]/30 text-gray-700 dark:text-gray-300 hover:border-[#00468E] hover:text-[#00468E]">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PageHeader>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sessions", value: "1,276", change: "+18.4%", positive: true, icon: Users, bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20", color: "text-[#00468E] dark:text-blue-400" },
          { label: "New Registrations", value: "590", change: "+24.8%", positive: true, icon: TrendingUp, bg: "bg-emerald-100 dark:bg-emerald-900/25", color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Revenue YTD", value: "Rs.21.6L", change: "+18.3%", positive: true, icon: CreditCard, bg: "bg-[#F4951D]/10 dark:bg-[#F4951D]/20", color: "text-[#F4951D]" },
          { label: "Churn Rate", value: "3.2%", change: "-1.1%", positive: true, icon: TrendingDown, bg: "bg-purple-100 dark:bg-purple-900/25", color: "text-purple-600 dark:text-purple-400" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className={`${cardClass} p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
                  <p className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${kpi.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                    <TrendingUp className={`h-3 w-3 ${!kpi.positive && "rotate-180"}`} />
                    {kpi.change}
                  </p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`}>
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="growth">
        <TabsList className="bg-gray-100 dark:bg-[#0d1f3c] border border-gray-200 dark:border-[#00468E]/20 p-1 rounded-xl h-auto flex-wrap gap-1">
          <TabsTrigger value="growth" className="rounded-lg text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#00468E]/30 data-[state=active]:text-[#00468E] dark:data-[state=active]:text-blue-300">User Growth</TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-lg text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#00468E]/30 data-[state=active]:text-[#00468E] dark:data-[state=active]:text-blue-300">Revenue</TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-lg text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#00468E]/30 data-[state=active]:text-[#00468E] dark:data-[state=active]:text-blue-300">Weekly Activity</TabsTrigger>
          <TabsTrigger value="geo" className="rounded-lg text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#00468E]/30 data-[state=active]:text-[#00468E] dark:data-[state=active]:text-blue-300">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="mt-4">
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Monthly User & Parent Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00468E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00468E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gParents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F4951D" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F4951D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="users" stroke="#00468E" strokeWidth={2.5} fill="url(#gUsers)" name="Users" />
                  <Area type="monotone" dataKey="parents" stroke="#F4951D" strokeWidth={2.5} fill="url(#gParents)" name="Parents" />
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
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }} formatter={rupeesFormatter} />
                  <Bar dataKey="payments" fill="#00468E" radius={[6, 6, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className={cardClass}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Daily Sessions This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }} />
                    <Bar dataKey="sessions" fill="#F4951D" radius={[6, 6, 0, 0]} name="Sessions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className={cardClass}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Employee Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={employeePerformance}>
                    <PolarGrid stroke="rgba(0,70,142,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#9ca3af" }} />
                    <Radar name="Performance" dataKey="A" stroke="#00468E" fill="#00468E" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geo" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className={cardClass}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Revenue by State</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stateData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                    <YAxis type="category" dataKey="state" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,70,142,0.15)", fontSize: "12px" }} formatter={rupeesFormatter} />
                    <Bar dataKey="revenue" fill="#00468E" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className={cardClass}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">State-wise Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mt-2">
                  {stateData.map((s, i) => (
                    <div key={s.state}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.state}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{s.schools} schools</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">Rs.{(s.revenue / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-[#00468E]/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#00468E] to-[#F4951D]"
                          style={{ width: `${(s.revenue / stateData[0].revenue) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Conversion Funnel */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Enrollment Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {conversionData.map((stage, i) => {
              const pct = Math.round((stage.count / conversionData[0].count) * 100);
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{stage.count.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-[#00468E]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: `rgba(0, 70, 142, ${0.3 + (i * 0.14)})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}