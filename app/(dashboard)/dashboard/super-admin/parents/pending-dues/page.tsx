"use client";

import { AlertCircle, Send, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "../../components/PageHeader";

const pendingDues = [
  { parent: "Manoj Tiwari", email: "manoj@gmail.com", phone: "+91 87654 32100", school: "St. Xavier's School", children: 3, overdueMonths: 3, amount: 18000, severity: "Critical" },
  { parent: "Arun Sharma", email: "arun@gmail.com", phone: "+91 76543 21099", school: "Delhi Public School", children: 2, overdueMonths: 2, amount: 11000, severity: "High" },
  { parent: "Sunita Verma", email: "sunita@gmail.com", phone: "+91 65432 10988", school: "Kendriya Vidyalaya", children: 1, overdueMonths: 1, amount: 4500, severity: "Medium" },
  { parent: "Prakash Nair", email: "prakash@gmail.com", phone: "+91 54321 09877", school: "Sunrise Academy", children: 2, overdueMonths: 1, amount: 6800, severity: "Medium" },
  { parent: "Rekha Jain", email: "rekha@gmail.com", phone: "+91 43210 98766", school: "Delhi Public School", children: 1, overdueMonths: 1, amount: 3200, severity: "Low" },
];

const severityColor: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function PendingDuesPage() {
  const totalDues = pendingDues.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Pending Dues" description="Parents with outstanding fee payments">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="bg-[#F4951D] hover:bg-[#e8861a] text-white h-9 gap-1.5">
            <Send className="h-4 w-4" /> Send All Reminders
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Dues", value: `₹${(totalDues / 1000).toFixed(1)}K`, color: "text-red-600" },
          { label: "Parents Affected", value: pendingDues.length, color: "text-[#00468E]" },
          { label: "Critical Cases", value: pendingDues.filter(p => p.severity === "Critical").length, color: "text-red-600" },
          { label: "Avg. Overdue", value: `${(pendingDues.reduce((s, p) => s + p.overdueMonths, 0) / pendingDues.length).toFixed(1)} mo.`, color: "text-[#F4951D]" },
        ].map((s) => (
          <Card key={s.label} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4">
            <p className="text-xs font-medium text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl">
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <p className="text-sm text-red-700 dark:text-red-400 font-medium">
          {pendingDues.filter(p => p.severity === "Critical").length} critical cases require immediate attention. Consider scheduling calls with these parents to arrange fee payment plans.
        </p>
      </div>

      <div className="space-y-3">
        {pendingDues.sort((a, b) => b.amount - a.amount).map((due, i) => (
          <Card key={i} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-red-100 text-red-600 font-bold text-sm dark:bg-red-900/30">
                    {due.parent.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-gray-800 dark:text-white">{due.parent}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${severityColor[due.severity]}`}>{due.severity}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{due.school} · {due.children} {due.children > 1 ? "children" : "child"} · Overdue {due.overdueMonths} {due.overdueMonths > 1 ? "months" : "month"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-red-600 dark:text-red-400 text-lg">₹{due.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">outstanding</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="h-7 text-xs gap-1 bg-[#F4951D] hover:bg-[#e8861a] text-white">
                  <Send className="h-3 w-3" /> Remind
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs">View Profile</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs">Payment Plan</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}