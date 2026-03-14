"use client";

import { useState } from "react";
import {
  Search, CheckCircle2, Clock, XCircle, Eye, UserCheck,
  FileText, ChevronDown, Phone, Mail, CalendarDays, IndianRupee,
  AlertCircle, Filter, Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

type ReqStatus = "pending" | "verified" | "approved" | "rejected";

const initialRequests = [
  { id: "REQ-1024", student: "Ravi Kumar", class: "IX-A", parent: "Suresh Kumar", phone: "98765 43210", email: "suresh@mail.com", amount: 16800, dueDate: "15 Jun 2025", reason: "Parent lost job due to factory closure. Unable to pay Q1 fee this month.", docs: 2, date: "Today", status: "pending" as ReqStatus },
  { id: "REQ-1023", student: "Nisha Patel", class: "X-B", parent: "Anil Patel", phone: "98765 43211", email: "anil@mail.com", amount: 16800, dueDate: "15 Jun 2025", reason: "Single-parent family facing medical emergency expenses.", docs: 3, date: "Today", status: "verified" as ReqStatus },
  { id: "REQ-1022", student: "Arjun Mehta", class: "VIII-C", parent: "Vikas Mehta", phone: "98765 43212", email: "vikas@mail.com", amount: 14200, dueDate: "01 Jun 2025", reason: "Seasonal income — parent is a daily-wage worker.", docs: 1, date: "Yesterday", status: "approved" as ReqStatus },
  { id: "REQ-1021", student: "Priya Singh", class: "IX-B", parent: "Ramesh Singh", phone: "98765 43213", email: "ramesh@mail.com", amount: 16800, dueDate: "15 Jun 2025", reason: "Family affected by recent floods — all savings exhausted.", docs: 2, date: "Yesterday", status: "pending" as ReqStatus },
  { id: "REQ-1020", student: "Dev Sharma", class: "X-A", parent: "Mohan Sharma", phone: "98765 43214", email: "mohan@mail.com", amount: 16800, dueDate: "01 May 2025", reason: "Business loss — small shop closed temporarily.", docs: 2, date: "2 Jun", status: "approved" as ReqStatus },
  { id: "REQ-1019", student: "Kavya Nair", class: "IX-A", parent: "Sanjay Nair", phone: "98765 43215", email: "sanjay@mail.com", amount: 16800, dueDate: "15 Jun 2025", reason: "Primary earner hospitalised — temporary financial hardship.", docs: 4, date: "1 Jun", status: "pending" as ReqStatus },
  { id: "REQ-1018", student: "Akash Verma", class: "VIII-C", parent: "Dilip Verma", phone: "98765 43216", email: "dilip@mail.com", amount: 14200, dueDate: "01 May 2025", reason: "Unable to provide sufficient evidence of financial need.", docs: 0, date: "30 May", status: "rejected" as ReqStatus },
];

const statusStyle: Record<ReqStatus, string> = {
  pending:  "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  verified: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

const statusLabel: Record<ReqStatus, string> = {
  pending:  "Pending",
  verified: "Verified by School",
  approved: "Approved",
  rejected: "Rejected",
};

export default function SchoolRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.student.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.parent.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    verified: requests.filter(r => r.status === "verified").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  const updateStatus = (id: string, newStatus: ReqStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    const msgs: Record<ReqStatus, string> = {
      verified: "Application verified! Sent to Schoolfee for review.",
      approved: "Application approved successfully!",
      rejected: "Application rejected.",
      pending: "Status updated.",
    };
    toast.success(msgs[newStatus]);
    setExpandedId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Support Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Review and verify student fee support applications from parents and teachers
          </p>
        </div>
        <Button size="sm" variant="outline" className="border-[#00468E] text-[#00468E] hover:bg-[#00468E]/5 rounded-xl self-start sm:self-auto"
          onClick={() => toast.success("Exported!")}>
          <Download className="h-4 w-4 mr-1.5" /> Export
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "verified", "approved", "rejected"] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              statusFilter === s
                ? "bg-[#00468E] text-white border-[#00468E]"
                : "bg-white dark:bg-[#0d1f3c] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#00468E]/20 hover:border-[#00468E]/40"
            }`}
          >
            {s === "all" ? "All" : statusLabel[s]}
            <span className={`rounded-full text-[10px] font-bold px-1.5 py-0.5 ${
              statusFilter === s ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-[#00468E]/15 text-gray-600 dark:text-gray-300"
            }`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Table card */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input placeholder="Search by student, ID, or parent..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm dark:bg-[#0d1f3c] dark:border-[#00468E]/30" />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{filtered.length} request{filtered.length !== 1 ? "s" : ""}</p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-gray-50 dark:divide-[#00468E]/10">
            {filtered.map(r => {
              const isExpanded = expandedId === r.id;
              return (
                <div key={r.id}>
                  <div
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 cursor-pointer transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs font-bold bg-[#00468E]/10 dark:bg-[#00468E]/20 text-[#00468E]">
                        {r.student.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{r.student}</p>
                      <p className="text-xs text-gray-400">{r.id} · {r.class} · Parent: {r.parent} · {r.date}</p>
                    </div>
                    <div className="hidden sm:block text-right mr-4 shrink-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Rs. {r.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400">Due {r.dueDate}</p>
                    </div>
                    <Badge className={`text-[10px] border-0 font-semibold shrink-0 ${statusStyle[r.status]}`}>
                      {statusLabel[r.status]}
                    </Badge>
                    <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 bg-gray-50/50 dark:bg-[#00468E]/5 border-t border-gray-100 dark:border-[#00468E]/15">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
                        {/* Student & parent info */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Application Details</p>
                          <div>
                            <p className="text-xs text-gray-400">Student</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-white">{r.student} · {r.class}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Parent / Guardian</p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{r.parent}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{r.phone}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3" />{r.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Fee Amount</p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">Rs. {r.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Due {r.dueDate}</p>
                          </div>
                        </div>

                        {/* Reason */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Reason for Support</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-[#0d1f3c] rounded-xl p-3 border border-gray-100 dark:border-[#00468E]/15">
                            {r.reason}
                          </p>
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {r.docs > 0 ? `${r.docs} supporting document${r.docs > 1 ? "s" : ""} uploaded` : "No documents uploaded"}
                          </p>
                        </div>

                        {/* Actions */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Take Action</p>
                          <div className="space-y-2">
                            {r.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="w-full bg-[#00468E] hover:bg-[#003570] text-white rounded-xl h-9"
                                  onClick={() => updateStatus(r.id, "verified")}
                                >
                                  <UserCheck className="h-4 w-4 mr-1.5" /> Verify Student Enrollment
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl h-9"
                                  onClick={() => updateStatus(r.id, "rejected")}
                                >
                                  <XCircle className="h-4 w-4 mr-1.5" /> Reject Application
                                </Button>
                              </>
                            )}
                            {r.status === "verified" && (
                              <>
                                <Button
                                  size="sm"
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9"
                                  onClick={() => updateStatus(r.id, "approved")}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve for Schoolfee
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-xl h-9"
                                  onClick={() => toast.info("Request for additional documents sent to parent.")}
                                >
                                  <FileText className="h-4 w-4 mr-1.5" /> Request More Documents
                                </Button>
                              </>
                            )}
                            {(r.status === "approved" || r.status === "rejected") && (
                              <div className={`p-3 rounded-xl ${statusStyle[r.status]} text-center text-sm font-semibold`}>
                                {statusLabel[r.status]}
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-full text-xs text-[#00468E] hover:bg-[#00468E]/5 rounded-xl h-8"
                              onClick={() => toast.info("Document viewer opening...")}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" /> View Documents
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
                <ClipboardList className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No requests match your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ClipboardList({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}
