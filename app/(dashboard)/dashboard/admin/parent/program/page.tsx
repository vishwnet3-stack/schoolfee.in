"use client";

import {
  Wallet, ShieldCheck, Zap, RefreshCw, Clock, CheckCircle2,
  ArrowUpRight, School, IndianRupee, CalendarDays, Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const repayHistory = [
  { month: "Dec", repaid: 5000 }, { month: "Jan", repaid: 8500 },
  { month: "Feb", repaid: 7200 }, { month: "Mar", repaid: 9100 },
  { month: "Apr", repaid: 8500 }, { month: "May", repaid: 13000 },
];

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const schoolPayments = [
  { month: "Jan 2025", type: "Tuition Fee Q3", amount: 14200, status: "paid", paidOn: "15 Jan 2025" },
  { month: "Feb 2025", type: "Activity Fee", amount: 2000, status: "paid", paidOn: "10 Feb 2025" },
  { month: "Mar 2025", type: "Tuition Fee Q4", amount: 14200, status: "paid", paidOn: "15 Mar 2025" },
  { month: "Apr 2025", type: "Transport Fee", amount: 4500, status: "paid", paidOn: "01 Apr 2025" },
  { month: "May 2025", type: "Tuition Fee Q1 '26", amount: 16800, status: "paid", paidOn: "15 May 2025" },
  { month: "Jun 2025", type: "Tuition Fee Q1 '26", amount: 16800, status: "upcoming", paidOn: "15 Jun 2025" },
];

export default function ParentCarePayProgramPage() {
  const creditLimit = 50000;
  const used = 5200;
  const available = creditLimit - used;
  const usedPct = (used / creditLimit) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CarePay Program</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Your interest-free school fee support — Schoolfee pays schools on your behalf, you repay when ready.
        </p>
      </div>

      {/* Main CarePay card */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-br from-[#001f4d] via-[#00468E] to-[#0058b4] p-6 text-white">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white/20 rounded-lg p-1.5">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="text-white/75 text-sm font-medium">CarePay Account</span>
                <Badge className="bg-emerald-500 text-white border-0 text-[10px] ml-auto">Active</Badge>
              </div>
              <p className="text-white/60 text-xs uppercase tracking-wider">Available to use</p>
              <p className="text-4xl font-bold mt-1">Rs. {available.toLocaleString()}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Utilization</span>
                  <span className="text-white font-medium">{usedPct.toFixed(0)}% of Rs. {creditLimit.toLocaleString()} limit</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-[#F4951D] h-2 rounded-full" style={{ width: `${usedPct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-white/50">
                  <span>Rs. {used.toLocaleString()} outstanding</span>
                  <span>Rs. {creditLimit.toLocaleString()} total limit</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:w-44">
              {[
                { label: "Interest", value: "0%", sub: "Always free" },
                { label: "Your Plan", value: "6-month", sub: "Repayment" },
                { label: "Next Due", value: "10 Jun", sub: "Rs. 5,200" },
              ].map(item => (
                <div key={item.label} className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-white font-bold">{item.value}</p>
                  <p className="text-white/50 text-[10px] mt-0.5">{item.label}</p>
                  <p className="text-white/70 text-[10px]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Program features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, title: "Zero Interest", desc: "No interest, no penalties. Repay at your own pace within your chosen plan.", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
          { icon: Zap, title: "Instant Fee Payment", desc: "Schoolfee credits your school's account within minutes of the due date.", color: "text-[#F4951D]", bg: "bg-[#F4951D]/10 dark:bg-[#F4951D]/15" },
          { icon: RefreshCw, title: "Flexible Repayment", desc: "Choose 3, 6, or 12 month plans. Change plan anytime, no questions asked.", color: "text-[#00468E] dark:text-blue-400", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className={cardClass}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Repayment chart */}
      <Card className={cardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Your Repayment History to Schoolfee</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={repayHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, "Repaid"]} />
              <Line type="monotone" dataKey="repaid" stroke="#F4951D" strokeWidth={2.5} dot={{ fill: "#F4951D", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Schoolfee → School payment log */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Payments by Schoolfee to School</CardTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">All fee payments made on your behalf</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#00468E] bg-[#00468E]/10 px-2.5 py-1 rounded-full">
              <Info className="h-3 w-3" /> Real-time
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#00468E]/15">
                  {["Month", "Fee Type", "Amount", "Paid On", "Status"].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schoolPayments.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-[#00468E]/10 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors">
                    <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{p.month}</td>
                    <td className="py-3 px-3 font-medium text-gray-800 dark:text-gray-200">{p.type}</td>
                    <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">Rs. {p.amount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{p.paidOn}</td>
                    <td className="py-3 px-3">
                      <Badge className={`text-[10px] border-0 font-semibold ${p.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {p.status === "paid"
                          ? <><CheckCircle2 className="h-3 w-3 mr-1" /> Paid to School</>
                          : <><Clock className="h-3 w-3 mr-1" /> Upcoming</>
                        }
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pay now option */}
      <Card className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-900/10">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-emerald-600" />
              Ready to repay Schoolfee early?
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              You can repay anytime — partially or fully. Early repayment increases your credit limit.
            </p>
          </div>
          <Link href="/dashboard/admin/parent/repayment">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shrink-0">
              Make a Repayment
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}