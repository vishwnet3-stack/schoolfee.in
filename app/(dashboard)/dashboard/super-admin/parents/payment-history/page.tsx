"use client";

import { useState } from "react";
import { Search, Download, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";

const allPayments = [
  { parent: "Ramesh Gupta", school: "Delhi Public School", month: "May 2024", amount: 8500, status: "Completed", method: "UPI", date: "2024-05-20", txnId: "TXN001" },
  { parent: "Ramesh Gupta", school: "Delhi Public School", month: "Apr 2024", amount: 8500, status: "Completed", method: "UPI", date: "2024-04-18", txnId: "TXN009" },
  { parent: "Sunita Verma", school: "Kendriya Vidyalaya", month: "May 2024", amount: 4500, status: "Pending", method: "Net Banking", date: "2024-05-18", txnId: "TXN002" },
  { parent: "Manoj Tiwari", school: "St. Xavier's School", month: "May 2024", amount: 6000, status: "Failed", method: "Card", date: "2024-05-15", txnId: "TXN003" },
  { parent: "Kavita Desai", school: "Sunrise Academy", month: "May 2024", amount: 7200, status: "Completed", method: "UPI", date: "2024-05-14", txnId: "TXN004" },
  { parent: "Arun Sharma", school: "Delhi Public School", month: "May 2024", amount: 5500, status: "Pending", method: "NEFT", date: "2024-05-12", txnId: "TXN005" },
  { parent: "Lakshmi Narayan", school: "Kendriya Vidyalaya", month: "May 2024", amount: 9000, status: "Completed", method: "UPI", date: "2024-05-10", txnId: "TXN006" },
  { parent: "Manoj Tiwari", school: "St. Xavier's School", month: "Apr 2024", amount: 6000, status: "Completed", method: "UPI", date: "2024-04-12", txnId: "TXN010" },
];

export default function PaymentHistoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = allPayments.filter((p) => {
    const matchSearch = p.parent.toLowerCase().includes(search.toLowerCase()) || p.school.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCollected = allPayments.filter(p => p.status === "Completed").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Payment History" description="Complete payment transaction history for all parents">
        <Button variant="outline" size="sm" className="gap-1.5 h-9">
          <Download className="h-4 w-4" /> Export
        </Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Collected", value: `₹${(totalCollected / 1000).toFixed(0)}K`, color: "text-emerald-600" },
          { label: "Successful", value: allPayments.filter(p => p.status === "Completed").length, color: "text-[#00468E]" },
          { label: "Failed/Pending", value: allPayments.filter(p => p.status !== "Completed").length, color: "text-red-500" },
        ].map((s) => (
          <Card key={s.label} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4">
            <p className="text-xs font-medium text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by parent or school..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Parent</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">School</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Month</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Method</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px] font-bold bg-[#F4951D]/10 text-[#F4951D]">
                          {p.parent.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white text-sm">{p.parent}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{p.txnId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 hidden md:table-cell text-sm">{p.school}</td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell text-sm">{p.month}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-800 dark:text-white">₹{p.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">{p.method}</span>
                  </td>
                  <td className="py-3.5 px-4"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500">Showing {filtered.length} of {allPayments.length} transactions</p>
        </div>
      </Card>
    </div>
  );
}