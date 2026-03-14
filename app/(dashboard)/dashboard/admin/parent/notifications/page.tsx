"use client";

import { Bell, CreditCard, School, Wallet, CheckCheck, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const notifications = [
  { id: 1, title: "Fee Payment Successful", desc: "Your payment of Rs. 16,800 to DPS New Delhi was processed via CarePay.", time: "2 min ago", unread: true, type: "payment" },
  { id: 2, title: "Fee Reminder", desc: "DPS New Delhi has sent a fee reminder for June 2025 Tuition Fee of Rs. 16,800.", time: "1 hour ago", unread: true, type: "school" },
  { id: 3, title: "CarePay Balance Updated", desc: "Your CarePay balance has been updated. Available: Rs. 45,000.", time: "3 hours ago", unread: true, type: "wallet" },
  { id: 4, title: "Account Verified", desc: "Your Schoolfee parent account has been successfully verified.", time: "2 days ago", unread: false, type: "account" },
  { id: 5, title: "Fee Receipt Available", desc: "Your receipt for March 2025 Tuition Fee is ready to download.", time: "3 days ago", unread: false, type: "payment" },
  { id: 6, title: "New School Added", desc: "DPS New Delhi has been added to your Schoolfee account.", time: "1 week ago", unread: false, type: "school" },
];

const typeIcon: Record<string, React.ElementType> = {
  payment: CreditCard, school: School, wallet: Wallet, account: Bell,
};

const typeBg: Record<string, string> = {
  payment: "bg-emerald-100 text-emerald-700",
  school: "bg-blue-100 text-blue-700",
  wallet: "bg-purple-100 text-purple-700",
  account: "bg-amber-100 text-amber-700",
};

export default function ParentNotificationsPage() {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{unreadCount} unread notifications</p>
        </div>
        <Button size="sm" variant="outline" className="border-gray-200 text-gray-600 rounded-xl">
          <CheckCheck className="h-4 w-4 mr-1.5" /> Mark all read
        </Button>
      </div>

      <Card className={cardClass}>
        <CardContent className="p-0 divide-y divide-gray-50 dark:divide-[#00468E]/10">
          {notifications.map(n => {
            const Icon = typeIcon[n.type] || Bell;
            return (
              <div key={n.id} className={`flex items-start gap-4 p-4 hover:bg-gray-50/70 dark:hover:bg-[#00468E]/5 cursor-pointer transition-colors ${n.unread ? "bg-blue-50/30 dark:bg-[#00468E]/5" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${typeBg[n.type] || typeBg.account}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${n.unread ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-200"}`}>
                      {n.title}
                    </p>
                    {n.unread && <div className="w-2 h-2 rounded-full bg-[#F4951D] shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.desc}</p>
                  <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />{n.time}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
