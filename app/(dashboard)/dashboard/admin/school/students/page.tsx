"use client";

import { useState } from "react";
import {
  Users, Search, CheckCircle2, Clock, ChevronDown,
  IndianRupee, Calendar, CreditCard, Phone, Mail,
  History, FileText, Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const cardClass =
  "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

type AppStatus = "active" | "completed" | "pending";

interface PaymentRecord {
  month: string;
  amount: number;
  date: string;
  txn: string;
  status: "completed" | "pending";
}

interface Student {
  id: string;
  name: string;
  class: string;
  parent: string;
  phone: string;
  email: string;
  totalSupported: number;
  monthlyFee: number;
  supportSince: string;
  applicationId: string;
  appStatus: AppStatus;
  payments: PaymentRecord[];
}

const students: Student[] = [
  {
    id: "STU-001", name: "Arjun Mehta", class: "VIII-C",
    parent: "Vikas Mehta", phone: "98765 43212", email: "vikas@mail.com",
    totalSupported: 42600, monthlyFee: 14200, supportSince: "Jan 2025",
    applicationId: "REQ-1022", appStatus: "active",
    payments: [
      { month: "Mar 2025", amount: 14200, date: "15 Mar 2025", txn: "TXN-5481", status: "completed" },
      { month: "Apr 2025", amount: 14200, date: "15 Apr 2025", txn: "TXN-5491", status: "completed" },
      { month: "May 2025", amount: 14200, date: "15 May 2025", txn: "TXN-5501", status: "completed" },
    ],
  },
  {
    id: "STU-002", name: "Dev Sharma", class: "X-A",
    parent: "Mohan Sharma", phone: "98765 43214", email: "mohan@mail.com",
    totalSupported: 33600, monthlyFee: 16800, supportSince: "Mar 2025",
    applicationId: "REQ-1020", appStatus: "active",
    payments: [
      { month: "Mar 2025", amount: 16800, date: "15 Mar 2025", txn: "TXN-5482", status: "completed" },
      { month: "Apr 2025", amount: 16800, date: "15 Apr 2025", txn: "TXN-5492", status: "completed" },
    ],
  },
  {
    id: "STU-003", name: "Meera Joshi", class: "X-B",
    parent: "Vijay Joshi", phone: "98765 43216", email: "vijay@mail.com",
    totalSupported: 50400, monthlyFee: 16800, supportSince: "Dec 2024",
    applicationId: "REQ-1005", appStatus: "active",
    payments: [
      { month: "Dec 2024", amount: 16800, date: "15 Dec 2024", txn: "TXN-5440", status: "completed" },
      { month: "Jan 2025", amount: 16800, date: "15 Jan 2025", txn: "TXN-5455", status: "completed" },
      { month: "Feb 2025", amount: 16800, date: "15 Feb 2025", txn: "TXN-5469", status: "completed" },
    ],
  },
  {
    id: "STU-004", name: "Kavya Nair", class: "IX-A",
    parent: "Sanjay Nair", phone: "98765 43215", email: "sanjay@mail.com",
    totalSupported: 16800, monthlyFee: 16800, supportSince: "May 2025",
    applicationId: "REQ-1019", appStatus: "pending",
    payments: [
      { month: "May 2025", amount: 16800, date: "—", txn: "TXN-5510", status: "pending" },
    ],
  },
  {
    id: "STU-005", name: "Rohit Das", class: "IX-B",
    parent: "Anil Das", phone: "98765 43230", email: "anil@mail.com",
    totalSupported: 84000, monthlyFee: 16800, supportSince: "Jun 2024",
    applicationId: "REQ-0980", appStatus: "completed",
    payments: [
      { month: "Jun 2024", amount: 16800, date: "15 Jun 2024", txn: "TXN-5301", status: "completed" },
      { month: "Jul 2024", amount: 16800, date: "15 Jul 2024", txn: "TXN-5320", status: "completed" },
      { month: "Aug 2024", amount: 16800, date: "15 Aug 2024", txn: "TXN-5340", status: "completed" },
      { month: "Sep 2024", amount: 16800, date: "15 Sep 2024", txn: "TXN-5360", status: "completed" },
      { month: "Oct 2024", amount: 16800, date: "15 Oct 2024", txn: "TXN-5380", status: "completed" },
    ],
  },
];

const appStatusStyle: Record<AppStatus, string> = {
  active:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  completed: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  pending:   "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
};

const avatarPalette = [
  "bg-[#00468E]/10 text-[#00468E]",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

export default function SchoolStudentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      s.parent.toLowerCase().includes(q) ||
      s.class.toLowerCase().includes(q) ||
      s.applicationId.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || s.appStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = students.reduce((sum, s) => sum + s.totalSupported, 0);
  const active = students.filter(s => s.appStatus === "active").length;
  const pending = students.filter(s => s.appStatus === "pending").length;
  const completed = students.filter(s => s.appStatus === "completed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supported Students</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Students receiving fee support through Schoolfee CarePay
          </p>
        </div>
        <Button
          size="sm" variant="outline"
          className="border-[#00468E] text-[#00468E] hover:bg-[#00468E]/5 rounded-xl self-start sm:self-auto"
          onClick={() => toast.success("Student support list exported!")}
        >
          Export List
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: students.length, icon: Users, color: "text-[#00468E] dark:text-blue-400", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
          { label: "Active Support", value: active, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
          { label: "Pending", value: pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
          { label: "Total Supported", value: `Rs. ${(total / 1000).toFixed(0)}k`, icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className={cardClass}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters + table */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by name, class, parent, or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm dark:bg-[#0d1f3c] dark:border-[#00468E]/30"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[150px] text-xs dark:bg-[#0d1f3c] dark:border-[#00468E]/30">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""}
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-gray-50 dark:divide-[#00468E]/10">
            {filtered.map((s, idx) => {
              const isExpanded = expandedId === s.id;
              const colorCls = avatarPalette[idx % avatarPalette.length];
              const completedPayments = s.payments.filter(p => p.status === "completed").length;
              const totalPayments = s.payments.length;

              return (
                <div key={s.id}>
                  {/* Row */}
                  <div
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 cursor-pointer transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className={`text-xs font-bold ${colorCls}`}>
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{s.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {s.class} · {s.applicationId} · Parent: {s.parent}
                      </p>
                    </div>

                    {/* Payments progress */}
                    <div className="hidden md:flex flex-col items-end mr-2 shrink-0">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {completedPayments}/{totalPayments} payments
                      </p>
                      <div className="w-20 bg-gray-200 dark:bg-[#00468E]/20 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${(completedPayments / totalPayments) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right shrink-0 mr-2 hidden sm:block">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Rs. {s.totalSupported.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400">Total supported</p>
                    </div>

                    <Badge className={`text-[10px] border-0 font-semibold shrink-0 ${appStatusStyle[s.appStatus]}`}>
                      {s.appStatus === "active" ? "Active" : s.appStatus === "pending" ? "Pending" : "Completed"}
                    </Badge>

                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="px-5 pb-5 bg-gray-50/50 dark:bg-[#00468E]/5 border-t border-gray-100 dark:border-[#00468E]/15">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">

                        {/* Student & parent info */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Student Details</p>
                          <div>
                            <p className="text-xs text-gray-400">Student</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-white">{s.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Class {s.class}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Parent / Guardian</p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{s.parent}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Phone className="h-3 w-3" /> {s.phone}
                            </p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3" /> {s.email}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 rounded-xl bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/15">
                              <p className="text-[10px] text-gray-400">Monthly Fee</p>
                              <p className="text-sm font-bold text-gray-800 dark:text-white">Rs. {s.monthlyFee.toLocaleString()}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/15">
                              <p className="text-[10px] text-gray-400">Since</p>
                              <p className="text-sm font-bold text-gray-800 dark:text-white">{s.supportSince}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment history */}
                        <div className="sm:col-span-2">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                            Payment History
                          </p>
                          <div className="space-y-2">
                            {s.payments.map((p, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/15"
                              >
                                {/* Status dot */}
                                <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === "completed" ? "bg-emerald-500" : "bg-amber-500"}`} />

                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{p.month}</p>
                                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{p.txn}</p>
                                </div>

                                <p className="text-sm font-bold text-gray-900 dark:text-white shrink-0">
                                  Rs. {p.amount.toLocaleString()}
                                </p>

                                <p className="text-[10px] text-gray-400 shrink-0 hidden sm:block">{p.date}</p>

                                <Badge
                                  className={`text-[10px] border-0 font-semibold shrink-0 ${
                                    p.status === "completed"
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                  }`}
                                >
                                  {p.status === "completed" ? (
                                    <><CheckCircle2 className="h-3 w-3 mr-1" />Received</>
                                  ) : (
                                    <><Clock className="h-3 w-3 mr-1" />Pending</>
                                  )}
                                </Badge>
                              </div>
                            ))}
                          </div>

                          {/* Summary row */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#00468E]/15">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Total received from Schoolfee
                            </p>
                            <p className="text-base font-bold text-emerald-600">
                              Rs. {s.payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-[#00468E]/30 text-[#00468E] hover:bg-[#00468E]/5 rounded-lg h-8"
                              onClick={() => toast.success(`Payment history for ${s.name} downloaded!`)}
                            >
                              <FileText className="h-3.5 w-3.5 mr-1" /> Download History
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs text-gray-500 rounded-lg h-8 hover:bg-gray-100 dark:hover:bg-[#00468E]/10"
                              onClick={() => toast.info(`Viewing application ${s.applicationId}...`)}
                            >
                              View Application
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Users className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No students match your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
