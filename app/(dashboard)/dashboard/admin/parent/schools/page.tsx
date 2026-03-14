"use client";

import { School, MapPin, Phone, Globe, BookOpen, Users, CreditCard, CalendarDays, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const upcomingDues = [
  { type: "Tuition Fee Q2", amount: 16800, due: "15 Jun 2025", status: "upcoming" },
  { type: "Transport Fee", amount: 4500, due: "01 Jul 2025", status: "upcoming" },
  { type: "Activity Fee", amount: 2000, due: "10 Feb 2025", status: "overdue" },
];

export default function ParentSchoolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Schools</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Schools enrolled via Schoolfee CarePay</p>
      </div>

      {/* School Card */}
      <Card className={cardClass}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#00468E]/10 dark:bg-[#00468E]/20 flex items-center justify-center shrink-0">
              <School className="h-8 w-8 text-[#00468E]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delhi Public School, New Delhi</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs font-semibold">Active Enrollment</Badge>
                    <Badge className="bg-[#00468E]/10 text-[#00468E] dark:text-blue-400 border-0 text-xs">CBSE Board</Badge>
                    <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Class IX-A</Badge>
                  </div>
                </div>
                <Button size="sm" className="bg-[#00468E] hover:bg-[#003570] text-white rounded-xl shrink-0">
                  Pay Fees via CarePay
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Mathura Road, New Delhi - 110003</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>+91-11-2636 8001</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>www.dpsnewdelhi.com</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Child Info + Fee Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className={cardClass}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Child Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Student Name", value: "Aryan Sharma" },
              { label: "Class & Section", value: "IX-A" },
              { label: "Roll Number", value: "24" },
              { label: "Admission Number", value: "DPS/2020/8254" },
              { label: "Academic Year", value: "2025-26" },
              { label: "Enrollment Date", value: "01 April 2020" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0">
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Fee Structure 2025-26</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Tuition Fee (Quarterly)", value: "Rs. 16,800" },
              { label: "Transport Fee (Monthly)", value: "Rs. 1,500" },
              { label: "Activity Fee (Annual)", value: "Rs. 8,000" },
              { label: "Lab & Library", value: "Rs. 3,600" },
              { label: "Sports Fee (Annual)", value: "Rs. 3,500" },
              { label: "Annual Total", value: "Rs. 1,24,000", bold: true },
            ].map(item => (
              <div key={item.label} className={`flex items-center justify-between py-2 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0 ${(item as any).bold ? "pt-3" : ""}`}>
                <span className={`text-sm ${(item as any).bold ? "font-bold text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>{item.label}</span>
                <span className={`text-sm font-bold ${(item as any).bold ? "text-[#00468E] dark:text-blue-400 text-base" : "text-gray-800 dark:text-white"}`}>{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Dues */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Upcoming & Overdue Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingDues.map((due, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${due.status === "overdue" ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30" : "bg-blue-50/50 dark:bg-[#00468E]/10 border-[#00468E]/10"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${due.status === "overdue" ? "bg-red-100 dark:bg-red-900/20" : "bg-[#00468E]/10"}`}>
                    {due.status === "overdue"
                      ? <Clock className="h-4 w-4 text-red-500" />
                      : <CalendarDays className="h-4 w-4 text-[#00468E]" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{due.type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Due: {due.due}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-base font-bold text-gray-900 dark:text-white">Rs. {due.amount.toLocaleString()}</p>
                  <Button size="sm" className={`rounded-xl text-xs ${due.status === "overdue" ? "bg-red-600 hover:bg-red-700" : "bg-[#00468E] hover:bg-[#003570]"} text-white`}>
                    Pay Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
