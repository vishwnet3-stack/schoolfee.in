"use client";

import { useState } from "react";
import { CheckCheck, Trash2, Bell, AlertTriangle, CreditCard, FileText, Users, School, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "../components/PageHeader";
import { allNotifications } from "../components/mock-data";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: typeof Bell; bg: string; color: string }> = {
  school:   { icon: School,       bg: "bg-[#00468E]/10 dark:bg-[#00468E]/25", color: "text-[#00468E] dark:text-blue-400" },
  payment:  { icon: CreditCard,   bg: "bg-emerald-100 dark:bg-emerald-900/25", color: "text-emerald-600 dark:text-emerald-400" },
  form:     { icon: FileText,     bg: "bg-amber-100 dark:bg-amber-900/25",   color: "text-amber-600 dark:text-amber-400" },
  employee: { icon: Users,        bg: "bg-purple-100 dark:bg-purple-900/25", color: "text-purple-600 dark:text-purple-400" },
  alert:    { icon: AlertTriangle,bg: "bg-red-100 dark:bg-red-900/25",       color: "text-red-600 dark:text-red-400" },
  user:     { icon: Users,        bg: "bg-indigo-100 dark:bg-indigo-900/25", color: "text-indigo-600 dark:text-indigo-400" },
  report:   { icon: BarChart3,    bg: "bg-[#F4951D]/10 dark:bg-[#F4951D]/20", color: "text-[#F4951D]" },
};

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

// Notification item type derived from mock data shape
type NotifItem = (typeof allNotifications)[number];

// Defined outside component so key prop works correctly in TypeScript
function NotifCard({
  n,
  onMarkRead,
  onDelete,
}: {
  n: NotifItem;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const cfg = typeConfig[n.type] || typeConfig.alert;
  const Icon = cfg.icon;
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border transition-colors group cursor-pointer",
        n.read
          ? "border-gray-100 dark:border-[#00468E]/10 hover:bg-gray-50 dark:hover:bg-[#00468E]/5"
          : "border-[#00468E]/20 dark:border-[#00468E]/30 bg-[#00468E]/3 dark:bg-[#00468E]/8 hover:bg-[#00468E]/5 dark:hover:bg-[#00468E]/12"
      )}
      onClick={() => onMarkRead(n.id)}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
        <Icon className={`h-5 w-5 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold leading-snug ${n.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}>
            {n.title}
          </p>
          {!n.read && (
            <div className="w-2 h-2 rounded-full bg-[#F4951D] shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{n.message}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
        onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications);

  const unread = notifications.filter((n) => !n.read);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`${unread.length} unread notifications`}
      >
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 border-gray-200 dark:border-[#00468E]/30 text-gray-700 dark:text-gray-300 hover:border-[#00468E] hover:text-[#00468E]"
          onClick={markAllRead}
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: notifications.length, color: "text-gray-900 dark:text-white" },
          { label: "Unread", value: unread.length, color: "text-[#00468E] dark:text-blue-400" },
          { label: "Alerts", value: notifications.filter(n => n.type === "alert").length, color: "text-red-600 dark:text-red-400" },
          { label: "Payments", value: notifications.filter(n => n.type === "payment").length, color: "text-emerald-600 dark:text-emerald-400" },
        ].map((s) => (
          <Card key={s.label} className={`${cardClass} p-4`}>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className={cardClass}>
        <CardContent className="p-5">
          <Tabs defaultValue="all">
            <TabsList className="bg-gray-100 dark:bg-[#00468E]/10 border border-gray-200 dark:border-[#00468E]/20 p-1 rounded-xl mb-5 flex-wrap gap-1 h-auto">
              <TabsTrigger value="all" className="rounded-lg text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#00468E]/30 data-[state=active]:text-[#00468E] dark:data-[state=active]:text-blue-300">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="rounded-lg text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#00468E]/30 data-[state=active]:text-[#00468E] dark:data-[state=active]:text-blue-300">
                Unread ({unread.length})
              </TabsTrigger>
              <TabsTrigger value="alerts" className="rounded-lg text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#00468E]/30 data-[state=active]:text-[#00468E] dark:data-[state=active]:text-blue-300">
                Alerts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-2 mt-0">
              {notifications.map((n) => <NotifCard key={n.id} n={n} onMarkRead={markRead} onDelete={deleteNotif} />)}
            </TabsContent>

            <TabsContent value="unread" className="space-y-2 mt-0">
              {unread.length > 0 ? (
                unread.map((n) => <NotifCard key={n.id} n={n} onMarkRead={markRead} onDelete={deleteNotif} />)
              ) : (
                <div className="text-center py-12">
                  <CheckCheck className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">All caught up!</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">No unread notifications.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="alerts" className="space-y-2 mt-0">
              {notifications.filter((n) => n.type === "alert").map((n) => <NotifCard key={n.id} n={n} onMarkRead={markRead} onDelete={deleteNotif} />)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}