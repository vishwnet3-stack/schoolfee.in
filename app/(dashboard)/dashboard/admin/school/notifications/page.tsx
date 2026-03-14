"use client";

import { useState } from "react";
import { Bell, CreditCard, Users, AlertTriangle, BookOpen, CheckCheck, Clock, Check, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const initial = [
  { id: 1, title: "Rs. 3,72,000 Transferred by Schoolfee", desc: "Schoolfee has transferred May 2025 fee collections of Rs. 3,72,000 to your school bank account ending ••4321.", time: "1 hour ago", unread: true, type: "payment", date: "Today" },
  { id: 2, title: "18 New Application Requests Pending", desc: "18 parents have submitted new fee support applications. Please review and verify student enrollments.", time: "3 hours ago", unread: true, type: "users", date: "Today" },
  { id: 3, title: "4 Teacher Referrals Awaiting Verification", desc: "Ms. Meera Patel and Mr. Suresh Joshi have referred 4 students for fee support. Your verification is needed.", time: "5 hours ago", unread: true, type: "referral", date: "Today" },
  { id: 4, title: "42 Students with Pending Dues", desc: "42 students across all classes have pending fee dues for May 2025. Some may apply for CarePay support.", time: "1 day ago", unread: false, type: "alert", date: "Yesterday" },
  { id: 5, title: "Q1 Fee Collection Report Ready", desc: "Your quarterly fee collection report for April–June 2025 is now available for download.", time: "2 days ago", unread: false, type: "report", date: "2 Jun 2025" },
  { id: 6, title: "Profile Verified by Schoolfee", desc: "Your school's bank details and registration documents have been verified. You are now a fully verified CarePay partner.", time: "1 month ago", unread: false, type: "check", date: "1 May 2025" },
];

const typeIcon: Record<string, React.ElementType> = { payment: CreditCard, users: Users, referral: Users, alert: AlertTriangle, report: BookOpen, check: CheckCheck };
const typeBg: Record<string, string> = {
  payment: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  users: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  referral: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  alert: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  report: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  check: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
};

export default function SchoolNotificationsPage() {
  const [notifications, setNotifications] = useState(initial);
  const unread = notifications.filter(n => n.unread).length;

  const markAllRead = () => { setNotifications(p => p.map(n => ({ ...n, unread: false }))); toast.success("All marked as read"); };
  const markRead = (id: number) => setNotifications(p => p.map(n => n.id === id ? { ...n, unread: false } : n));
  const dismiss = (id: number) => { setNotifications(p => p.filter(n => n.id !== id)); toast.success("Dismissed"); };

  const groups = notifications.reduce<Record<string, typeof notifications>>((acc, n) => {
    if (!acc[n.date]) acc[n.date] = []; acc[n.date].push(n); return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{unread > 0 ? `${unread} unread` : "All caught up!"}</p>
        </div>
        {unread > 0 && (
          <Button size="sm" variant="outline" onClick={markAllRead} className="border-gray-200 dark:border-[#00468E]/30 rounded-xl text-xs">
            <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      {Object.entries(groups).map(([date, items]) => (
        <div key={date} className="space-y-2">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">{date}</p>
          <Card className={cardClass}>
            <CardContent className="p-0 divide-y divide-gray-50 dark:divide-[#00468E]/10">
              {items.map(n => {
                const Icon = typeIcon[n.type] || Bell;
                return (
                  <div key={n.id} onClick={() => markRead(n.id)}
                    className={`flex items-start gap-4 p-4 group hover:bg-gray-50/70 dark:hover:bg-[#00468E]/5 cursor-pointer transition-colors ${n.unread ? "bg-blue-50/30 dark:bg-[#00468E]/5" : ""}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${typeBg[n.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <p className={`text-sm flex-1 ${n.unread ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-200"}`}>{n.title}</p>
                        {n.unread && <div className="w-2 h-2 rounded-full bg-[#F4951D] shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{n.desc}</p>
                      <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1"><Clock className="h-3 w-3" />{n.time}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {n.unread && (
                        <button onClick={e => { e.stopPropagation(); markRead(n.id); }}
                          className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors">
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                        className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
