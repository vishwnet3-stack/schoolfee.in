"use client";

import { useState } from "react";
import {
  Bell, CreditCard, AlertTriangle, BookOpen, Users,
  CheckCheck, Clock, Trash2, Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const initialNotifications = [
  {
    id: 1,
    title: "May Salary Credited",
    desc: "Your May 2025 salary of Rs. 52,000 (includes performance bonus) has been credited to SBI ••4321.",
    time: "30 min ago",
    unread: true,
    type: "payment",
    date: "Today",
  },
  {
    id: 2,
    title: "3 Students Have Pending Dues",
    desc: "Rahul Verma (IX-A), Meera Joshi (X-B), and Deepa Mishra (VIII-C) have overdue fees for May 2025. Consider sending a reminder.",
    time: "2 hours ago",
    unread: true,
    type: "alert",
    date: "Today",
  },
  {
    id: 3,
    title: "Arjun Nair's Fee Paid via CarePay",
    desc: "Schoolfee has paid Arjun Nair's (X-B) May fee of Rs. 16,800 directly to DPS New Delhi on behalf of the parent.",
    time: "4 hours ago",
    unread: true,
    type: "payment",
    date: "Today",
  },
  {
    id: 4,
    title: "Monthly Attendance Report Ready",
    desc: "Your May 2025 attendance report has been generated. Student average attendance: 91.2%. Download the report from your dashboard.",
    time: "1 day ago",
    unread: false,
    type: "report",
    date: "Yesterday",
  },
  {
    id: 5,
    title: "New Student Enrolled in IX-A",
    desc: "A new student, Sanjay Mehta, has been enrolled in Class IX-A effective June 2025. Total class strength: 43 students.",
    time: "2 days ago",
    unread: false,
    type: "users",
    date: "2 Jun 2025",
  },
  {
    id: 6,
    title: "April Salary Credited",
    desc: "Your April 2025 salary of Rs. 45,000 has been credited to SBI ••4321.",
    time: "1 month ago",
    unread: false,
    type: "payment",
    date: "1 Apr 2025",
  },
  {
    id: 7,
    title: "Parent Meeting — Class IX-A",
    desc: "A parent-teacher meeting for Class IX-A is scheduled for 15 June 2025 at 11:00 AM in Room 204.",
    time: "2 days ago",
    unread: false,
    type: "calendar",
    date: "2 Jun 2025",
  },
];

const typeIcon: Record<string, React.ElementType> = {
  payment: CreditCard,
  alert: AlertTriangle,
  report: BookOpen,
  users: Users,
  calendar: Bell,
};

const typeBg: Record<string, string> = {
  payment: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  alert: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  report: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  users: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  calendar: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
};

export default function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const dismiss = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification dismissed");
  };

  const displayed = filter === "unread" ? notifications.filter(n => n.unread) : notifications;

  // Group by date
  const groups = displayed.reduce<Record<string, typeof notifications>>((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllRead}
              className="border-gray-200 dark:border-[#00468E]/30 rounded-xl text-xs">
              <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-[#00468E]/10 rounded-xl w-fit">
        {(["all", "unread"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              filter === f
                ? "bg-white dark:bg-[#0d1f3c] text-[#00468E] shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {f === "all" ? "All" : "Unread"}
            {f === "unread" && unreadCount > 0 && (
              <span className="bg-[#F4951D] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification groups */}
      {Object.entries(groups).length === 0 ? (
        <Card className={cardClass}>
          <CardContent className="py-16 text-center">
            <Bell className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No {filter === "unread" ? "unread " : ""}notifications</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groups).map(([date, items]) => (
          <div key={date} className="space-y-2">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">{date}</p>
            <Card className={cardClass}>
              <CardContent className="p-0 divide-y divide-gray-50 dark:divide-[#00468E]/10">
                {items.map(n => {
                  const Icon = typeIcon[n.type] || Bell;
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-4 p-4 group hover:bg-gray-50/70 dark:hover:bg-[#00468E]/5 cursor-pointer transition-colors ${
                        n.unread ? "bg-blue-50/30 dark:bg-[#00468E]/5" : ""
                      }`}
                      onClick={() => markRead(n.id)}
                    >
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${typeBg[n.type] || typeBg.report}`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <p className={`text-sm flex-1 ${n.unread ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-200"}`}>
                            {n.title}
                          </p>
                          {n.unread && <div className="w-2 h-2 rounded-full bg-[#F4951D] shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{n.desc}</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {n.time}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        {n.unread && (
                          <button
                            onClick={e => { e.stopPropagation(); markRead(n.id); }}
                            className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors"
                            title="Mark read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                          className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                          title="Dismiss"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
