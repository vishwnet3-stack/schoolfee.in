"use client";

import { useState } from "react";
import { Search, MoreHorizontal, UserCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { mockParents } from "../components/mock-data";

const paymentHistory = [
  { month: "May 2024", amount: 8500, status: "Paid" },
  { month: "Apr 2024", amount: 8500, status: "Paid" },
  { month: "Mar 2024", amount: 4250, status: "Paid" },
  { month: "Feb 2024", amount: 0, status: "Pending" },
];

export default function ParentsPage() {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedParent, setSelectedParent] = useState<number | null>(null);

  const filtered = mockParents.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchPayment = paymentFilter === "all" || p.paymentStatus === paymentFilter;
    return matchSearch && matchPayment;
  });

  const totalPending = mockParents.reduce((sum, p) => sum + p.pendingAmount, 0);
  const paidCount = mockParents.filter((p) => p.paymentStatus === "Paid").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Parents" description={`${mockParents.length} parents enrolled`} />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4">
          <p className="text-xs font-medium text-gray-500">Total Parents</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{mockParents.length}</p>
        </Card>
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4">
          <p className="text-xs font-medium text-gray-500">Paid Up</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{paidCount}</p>
        </Card>
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4">
          <p className="text-xs font-medium text-gray-500">Pending Dues</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">₹{(totalPending / 1000).toFixed(1)}K</p>
        </Card>
        <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4">
          <p className="text-xs font-medium text-gray-500">Overdue</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{mockParents.filter((p) => p.paymentStatus === "Overdue").length}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search parents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-[150px] h-9 text-sm"><SelectValue placeholder="Payment Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parents Table */}
      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Parent</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">School</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Children</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pending</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((parent) => (
                <tr key={parent.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs font-bold bg-[#F4951D]/10 text-[#F4951D]">
                          {parent.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{parent.name}</p>
                        <p className="text-xs text-gray-500">{parent.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 hidden md:table-cell text-sm">{parent.school}</td>
                  <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300 font-medium">{parent.children}</td>
                  <td className="py-3.5 px-4"><StatusBadge status={parent.paymentStatus} /></td>
                  <td className="py-3.5 px-4">
                    {parent.pendingAmount > 0 ? (
                      <span className="text-red-600 font-semibold text-sm">₹{parent.pendingAmount.toLocaleString()}</span>
                    ) : (
                      <span className="text-emerald-600 font-medium text-sm flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Clear
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Payment History</DropdownMenuItem>
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filtered.length} of {mockParents.length} parents</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}