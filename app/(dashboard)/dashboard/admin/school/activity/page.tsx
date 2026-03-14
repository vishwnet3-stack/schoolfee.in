"use client";

import { useState } from "react";
import { Activity, CheckCircle2, XCircle, CreditCard, User, Settings, Search, Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

type LogType = "approval" | "rejection" | "payment" | "profile" | "verification";

const logs = [
  { id: "LOG-1001", action: "Application Approved", detail: "REQ-1022 — Arjun Mehta (VIII-C) approved for fee support of Rs. 14,200", type: "approval" as LogType, by: "School Admin", time: "15 May 2025 · 11:32 AM" },
  { id: "LOG-1000", action: "Payment Confirmed", detail: "TXN-5501 — Rs. 14,200 received from Schoolfee for Arjun Mehta", type: "payment" as LogType, by: "System", time: "15 May 2025 · 10:32 AM" },
  { id: "LOG-0999", action: "Student Verified", detail: "REQ-1023 — Nisha Patel (X-B) enrollment verified", type: "verification" as LogType, by: "School Admin", time: "Today · 09:15 AM" },
  { id: "LOG-0998", action: "Application Rejected", detail: "REQ-1018 — Akash Verma (VIII-C) rejected — insufficient documentation", type: "rejection" as LogType, by: "School Admin", time: "30 May 2025 · 3:44 PM" },
  { id: "LOG-0997", action: "Profile Updated", detail: "School bank account details updated for NEFT transfers", type: "profile" as LogType, by: "School Admin", time: "28 May 2025 · 2:01 PM" },
  { id: "LOG-0996", action: "Payment Confirmed", detail: "TXN-5499 — Rs. 16,800 received from Schoolfee for Meera Joshi", type: "payment" as LogType, by: "System", time: "01 May 2025 · 09:14 AM" },
  { id: "LOG-0995", action: "Referral Verified", detail: "REF-199 — Arjun Nair (X-B) referral from Mr. Suresh Joshi verified", type: "verification" as LogType, by: "School Admin", time: "1 Jun 2025 · 10:05 AM" },
  { id: "LOG-0994", action: "Application Approved", detail: "REQ-1020 — Dev Sharma (X-A) approved for fee support", type: "approval" as LogType, by: "School Admin", time: "2 Jun 2025 · 11:00 AM" },
];

const typeIcon: Record<LogType, React.ElementType> = {
  approval: CheckCircle2, rejection: XCircle, payment: CreditCard, profile: User, verification: Activity,
};
const typeBg: Record<LogType, string> = {
  approval: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  rejection: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  payment: "bg-[#00468E]/10 text-[#00468E] dark:text-blue-300",
  profile: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  verification: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
};
const typeBadge: Record<LogType, string> = {
  approval: "bg-emerald-100 text-emerald-700",
  rejection: "bg-red-100 text-red-600",
  payment: "bg-[#00468E]/10 text-[#00468E]",
  profile: "bg-purple-100 text-purple-700",
  verification: "bg-amber-100 text-amber-700",
};

export default function SchoolActivityPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = logs.filter(l => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || l.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Complete audit trail of all actions on your school account</p>
        </div>
        <Button size="sm" variant="outline" className="border-[#00468E] text-[#00468E] hover:bg-[#00468E]/5 rounded-xl self-start sm:self-auto"
          onClick={() => toast.success("Logs exported!")}>
          <Download className="h-4 w-4 mr-1.5" /> Export Logs
        </Button>
      </div>

      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm dark:bg-[#0d1f3c] dark:border-[#00468E]/30" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-[160px] text-xs dark:bg-[#0d1f3c] dark:border-[#00468E]/30"><SelectValue placeholder="All Actions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="approval">Approvals</SelectItem>
                <SelectItem value="rejection">Rejections</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="verification">Verifications</SelectItem>
                <SelectItem value="profile">Profile Updates</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50 dark:divide-[#00468E]/10">
            {filtered.map(log => {
              const Icon = typeIcon[log.type];
              return (
                <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${typeBg[log.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="text-sm font-bold text-gray-800 dark:text-white">{log.action}</p>
                      <Badge className={`text-[10px] border-0 ${typeBadge[log.type]}`}>{log.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{log.detail}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-[10px] text-gray-400">{log.time}</p>
                      <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                      <p className="text-[10px] text-gray-400">by {log.by}</p>
                      <span className="text-[10px] font-mono text-gray-300 dark:text-gray-600">{log.id}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Activity className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No logs found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
