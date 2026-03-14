"use client";

import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, TrendingUp, Shield, Zap, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAdminAuth } from "../../Adminauthcontext";

const repayHistory = [
  { month: "Dec", amount: 5000 }, { month: "Jan", amount: 8500 },
  { month: "Feb", amount: 7200 }, { month: "Mar", amount: 9100 },
  { month: "Apr", amount: 6800 }, { month: "May", amount: 11000 },
];

const carePayTxns = [
  { id: "CP001", desc: "DPS New Delhi - May Tuition", amount: -16800, date: "15 May 2025", type: "debit", status: "success" },
  { id: "CP002", desc: "EMI Repayment", amount: +5000, date: "10 May 2025", type: "credit", status: "success" },
  { id: "CP003", desc: "DPS New Delhi - Apr Transport", amount: -4500, date: "02 Apr 2025", type: "debit", status: "success" },
  { id: "CP004", desc: "EMI Repayment", amount: +8500, date: "10 Apr 2025", type: "credit", status: "success" },
  { id: "CP005", desc: "DPS New Delhi - Mar Tuition", amount: -14200, date: "15 Mar 2025", type: "debit", status: "success" },
];

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function ParentCarePayPage() {
  const { user } = useAdminAuth();

  const creditLimit = 50000;
  const usedCredit = 5000;
  const availableBalance = creditLimit - usedCredit;
  const usagePercent = (usedCredit / creditLimit) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CarePay Account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your interest-free school fee credit account powered by Schoolfee</p>
      </div>

      {/* Main CarePay Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 rounded-2xl overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-br from-[#00468E] via-[#0058b4] to-[#003570] p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-white/20 rounded-lg p-1.5">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">CarePay Balance</span>
                </div>
                <p className="text-4xl font-bold">Rs. {availableBalance.toLocaleString()}</p>
                <p className="text-white/60 text-sm mt-1">Available Credit</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs">Account</p>
                <p className="text-white font-mono text-sm mt-1">SF-{user?.id?.toString().padStart(6, "0") || "000001"}</p>
                <Badge className="mt-2 bg-emerald-500 text-white border-0 text-[10px]">Active</Badge>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Credit Utilization</span>
                <span className="text-white font-medium">{usagePercent.toFixed(0)}% used</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-[#F4951D] h-2 rounded-full transition-all" style={{ width: `${usagePercent}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Used: Rs. {usedCredit.toLocaleString()}</span>
                <span>Limit: Rs. {creditLimit.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { label: "Interest Rate", value: "0%", sub: "Always free" },
                { label: "Credit Limit", value: "Rs. 50K", sub: "Per year" },
                { label: "Repayment", value: "Flexible", sub: "EMI plans" },
              ].map(item => (
                <div key={item.label} className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-white font-bold text-sm">{item.value}</p>
                  <p className="text-white/60 text-[10px] mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {[
            { icon: Shield, title: "Zero Interest", desc: "Pay school fees now, repay conveniently with zero interest charges.", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
            { icon: Zap, title: "Instant Processing", desc: "Fees credited directly to school within seconds of your payment.", color: "text-[#F4951D]", bg: "bg-[#F4951D]/10 dark:bg-[#F4951D]/20" },
            { icon: RefreshCw, title: "Auto-Replenish", desc: "Credit limit resets automatically after repayment.", color: "text-[#00468E]", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className={cardClass}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Repayment History Chart */}
      <Card className={cardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Repayment History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={repayHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,70,142,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, "Repaid"]} />
              <Line type="monotone" dataKey="amount" stroke="#F4951D" strokeWidth={2.5} dot={{ fill: "#F4951D", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CarePay Transactions */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">CarePay Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {carePayTxns.map(txn => (
              <div key={txn.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 rounded-xl transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${txn.type === "debit" ? "bg-red-100 dark:bg-red-900/20" : "bg-emerald-100 dark:bg-emerald-900/20"}`}>
                  {txn.type === "debit"
                    ? <ArrowUpRight className="h-5 w-5 text-red-500" />
                    : <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{txn.desc}</p>
                  <p className="text-xs text-gray-400">{txn.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${txn.amount < 0 ? "text-red-500" : "text-emerald-600"}`}>
                    {txn.amount < 0 ? "-" : "+"}Rs. {Math.abs(txn.amount).toLocaleString()}
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] border-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Done
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
