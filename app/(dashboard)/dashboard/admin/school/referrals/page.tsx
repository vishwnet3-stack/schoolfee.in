"use client";

import { useState } from "react";
import {
  UserCheck, CheckCircle2, XCircle, Clock, ChevronDown,
  Phone, FileText, MessageSquare, Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

type RefStatus = "pending" | "verified" | "rejected";

const initial = [
  { id: "REF-201", student: "Rahul Verma", class: "IX-A", teacher: "Ms. Meera Patel", teacherSubject: "Mathematics", parent: "Mohan Verma", phone: "98765 43212", amount: 16800, dueDate: "15 Jun 2025", reason: "Student shows high potential but parent cannot afford tuition. Teacher-confirmed case.", docs: 2, date: "Today", status: "pending" as RefStatus },
  { id: "REF-200", student: "Deepa Mishra", class: "VIII-C", teacher: "Ms. Meera Patel", teacherSubject: "Mathematics", parent: "Kiran Mishra", phone: "98765 43218", amount: 14200, dueDate: "15 Jun 2025", reason: "Single mother raising 3 children. Teacher noticed child coming to school without books.", docs: 1, date: "Yesterday", status: "pending" as RefStatus },
  { id: "REF-199", student: "Arjun Nair", class: "X-B", teacher: "Mr. Suresh Joshi", teacherSubject: "Science", parent: "Suresh Nair", phone: "98765 43221", amount: 16800, dueDate: "01 Jun 2025", reason: "Father's business shut down. Student is at risk of dropping out.", docs: 3, date: "1 Jun", status: "verified" as RefStatus },
  { id: "REF-198", student: "Geeta Kumari", class: "IX-B", teacher: "Ms. Ananya Sharma", teacherSubject: "English", parent: "Ram Kumari", phone: "98765 43222", amount: 16800, dueDate: "15 May 2025", reason: "Insufficient evidence of financial hardship provided by family.", docs: 0, date: "28 May", status: "rejected" as RefStatus },
];

const statusStyle: Record<RefStatus, string> = {
  pending:  "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  verified: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  rejected: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

export default function SchoolReferralsPage() {
  const [referrals, setReferrals] = useState(initial);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const update = (id: string, s: RefStatus) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status: s } : r));
    toast.success(s === "verified" ? "Referral verified! Forwarded to Schoolfee." : "Referral rejected.");
    setExpandedId(null);
  };

  const counts = { all: referrals.length, pending: referrals.filter(r => r.status === "pending").length, verified: referrals.filter(r => r.status === "verified").length, rejected: referrals.filter(r => r.status === "rejected").length };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Referrals</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Students referred by teachers for fee support — verify enrollment and fee amount</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Referrals", value: counts.all, icon: Users, color: "text-[#00468E]", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
          { label: "Awaiting Verification", value: counts.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
          { label: "Verified", value: counts.verified, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={cardClass}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className={cardClass}>
        <CardContent className="p-0 divide-y divide-gray-50 dark:divide-[#00468E]/10">
          {referrals.map(r => {
            const isExp = expandedId === r.id;
            return (
              <div key={r.id}>
                <div
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(isExp ? null : r.id)}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs font-bold bg-purple-100 dark:bg-purple-900/20 text-purple-700">
                      {r.student.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{r.student}</p>
                    <p className="text-xs text-gray-400">{r.id} · {r.class} · Referred by {r.teacher} · {r.date}</p>
                  </div>
                  <div className="text-right shrink-0 mr-3 hidden sm:block">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Rs. {r.amount.toLocaleString()}</p>
                  </div>
                  <Badge className={`text-[10px] border-0 font-semibold shrink-0 ${statusStyle[r.status]}`}>
                    {r.status === "pending" ? "Pending" : r.status === "verified" ? "Verified" : "Rejected"}
                  </Badge>
                  <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isExp ? "rotate-180" : ""}`} />
                </div>

                {isExp && (
                  <div className="px-5 pb-5 bg-gray-50/50 dark:bg-[#00468E]/5 border-t border-gray-100 dark:border-[#00468E]/15">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Referral Info</p>
                        <div>
                          <p className="text-xs text-gray-400">Referred by</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-white">{r.teacher}</p>
                          <p className="text-xs text-gray-400">{r.teacherSubject} Teacher</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Parent</p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{r.parent}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{r.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Fee Amount</p>
                          <p className="text-base font-bold text-gray-900 dark:text-white">Rs. {r.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Due {r.dueDate}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Reason</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-[#0d1f3c] rounded-xl p-3 border border-gray-100 dark:border-[#00468E]/15">
                          {r.reason}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {r.docs > 0 ? `${r.docs} document${r.docs > 1 ? "s" : ""} attached` : "No documents"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Actions</p>
                        <div className="space-y-2">
                          {r.status === "pending" && (
                            <>
                              <Button size="sm" className="w-full bg-[#00468E] hover:bg-[#003570] text-white rounded-xl h-9"
                                onClick={() => update(r.id, "verified")}>
                                <UserCheck className="h-4 w-4 mr-1.5" /> Verify & Approve
                              </Button>
                              <Button size="sm" variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-xl h-9"
                                onClick={() => toast.info("Clarification request sent to teacher.")}>
                                <MessageSquare className="h-4 w-4 mr-1.5" /> Request Clarification
                              </Button>
                              <Button size="sm" variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl h-9"
                                onClick={() => update(r.id, "rejected")}>
                                <XCircle className="h-4 w-4 mr-1.5" /> Reject Referral
                              </Button>
                            </>
                          )}
                          {r.status !== "pending" && (
                            <div className={`p-3 rounded-xl text-center text-sm font-semibold ${statusStyle[r.status]}`}>
                              {r.status === "verified" ? "✓ Verified & Forwarded" : "✗ Rejected"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
