"use client";

import { useState } from "react";
import {
  CreditCard, Wallet, IndianRupee, CheckCircle2, Clock, ArrowRight,
  Smartphone, Building, Globe, Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const repaymentHistory = [
  { id: "RP001", amount: 13000, date: "10 May 2025", method: "UPI", status: "success", plan: "6-month" },
  { id: "RP002", amount: 8500, date: "10 Apr 2025", method: "Net Banking", status: "success", plan: "6-month" },
  { id: "RP003", amount: 9100, date: "10 Mar 2025", method: "UPI", status: "success", plan: "6-month" },
  { id: "RP004", amount: 7200, date: "10 Feb 2025", method: "UPI", status: "success", plan: "6-month" },
];

const plans = [
  { months: 3, emi: 1733, label: "3 Months", badge: "Most Popular", badgeColor: "bg-[#00468E] text-white" },
  { months: 6, emi: 867, label: "6 Months", badge: "Your Current Plan", badgeColor: "bg-emerald-600 text-white" },
  { months: 12, emi: 433, label: "12 Months", badge: "Easiest EMI", badgeColor: "bg-purple-600 text-white" },
];

const paymentMethods = [
  { id: "upi", icon: Smartphone, label: "UPI", desc: "Instant · Google Pay, PhonePe, Paytm" },
  { id: "netbanking", icon: Building, label: "Net Banking", desc: "All major banks supported" },
  { id: "card", icon: CreditCard, label: "Debit/Credit Card", desc: "Visa, Mastercard, RuPay" },
  { id: "wallet", icon: Wallet, label: "Wallet / QR", desc: "Amazon Pay, MobiKwik, QR scan" },
];

export default function ParentRepaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(6);
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [amount, setAmount] = useState("5200");

  const outstanding = 5200;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Repay Schoolfee</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Repay the amount Schoolfee covered for your child's school fees — 0% interest, anytime.
        </p>
      </div>

      {/* Outstanding summary */}
      <Card className="rounded-2xl bg-gradient-to-r from-[#001f4d] to-[#00468E] border-0 text-white">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-wider">Outstanding to Schoolfee</p>
            <p className="text-3xl font-bold mt-1">Rs. {outstanding.toLocaleString()}</p>
            <p className="text-white/60 text-xs mt-1">Due by 10 Jun 2025 · 0% interest</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-white/60">On your plan</p>
            <p className="text-lg font-bold">6-Month EMI</p>
            <p className="text-xs text-[#F4951D] mt-0.5">Change plan below</p>
          </div>
        </CardContent>
      </Card>

      {/* Choose repayment plan */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Repayment Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {plans.map(plan => (
              <button
                key={plan.months}
                onClick={() => setSelectedPlan(plan.months)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === plan.months
                  ? "border-[#00468E] bg-[#00468E]/5 dark:bg-[#00468E]/10"
                  : "border-gray-200 dark:border-[#00468E]/20 hover:border-[#00468E]/40"
                }`}
              >
                {selectedPlan === plan.months && (
                  <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-[#00468E]" />
                )}
                <Badge className={`${plan.badgeColor} border-0 text-[10px] font-semibold mb-2`}>{plan.badge}</Badge>
                <p className="text-base font-bold text-gray-900 dark:text-white">{plan.label}</p>
                <p className="text-2xl font-bold text-[#00468E] dark:text-blue-400 mt-1">
                  Rs. {plan.emi.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mo</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% interest · No fees</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment amount + method */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Make a Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount to Repay</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
              <Input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="pl-8 h-11 text-lg font-bold border-gray-200 dark:border-[#00468E]/40 dark:bg-[#0d1f3c] dark:text-white"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {["2600", "5200", outstanding.toString()].map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${amount === amt
                    ? "border-[#00468E] bg-[#00468E]/5 text-[#00468E] font-semibold"
                    : "border-gray-200 dark:border-[#00468E]/20 text-gray-600 dark:text-gray-300 hover:border-[#00468E]/40"
                  }`}
                >
                  {amt === outstanding.toString() ? "Full Rs. " : "Rs. "}{Number(amt).toLocaleString()}
                  {amt === outstanding.toString() && " (Clear all)"}
                </button>
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${selectedMethod === method.id
                      ? "border-[#00468E] bg-[#00468E]/5 dark:bg-[#00468E]/10"
                      : "border-gray-200 dark:border-[#00468E]/20 hover:border-[#00468E]/40"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedMethod === method.id ? "bg-[#00468E]" : "bg-gray-100 dark:bg-[#00468E]/10"}`}>
                      <Icon className={`h-4 w-4 ${selectedMethod === method.id ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{method.label}</p>
                      <p className="text-[10px] text-gray-400 truncate">{method.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pay button */}
          <div className="pt-2">
            <Button
              onClick={() => toast.success(`Repayment of Rs. ${Number(amount).toLocaleString()} initiated via ${selectedMethod.toUpperCase()}!`)}
              className="w-full h-12 bg-[#00468E] hover:bg-[#003570] text-white font-bold rounded-xl gap-2 text-base"
            >
              <Shield className="h-5 w-5" />
              Pay Rs. {Number(amount).toLocaleString()} Securely
              <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" /> Secured by Razorpay · 256-bit SSL encryption
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Repayment history */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Past Repayments to Schoolfee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {repaymentHistory.map(r => (
              <div key={r.id} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">Rs. {r.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{r.date} · via {r.method}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] font-semibold">Received</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}