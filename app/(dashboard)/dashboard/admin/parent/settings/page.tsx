"use client";

import { Bell, Shield, Smartphone, Mail, Moon, Globe, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function ParentSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [paymentAlert, setPaymentAlert] = useState(true);
  const [dueReminder, setDueReminder] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#00468E]" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive fee receipts and reminders via email", value: emailNotif, set: setEmailNotif, icon: Mail },
            { label: "SMS Notifications", desc: "Get payment alerts on your registered mobile", value: smsNotif, set: setSmsNotif, icon: Smartphone },
            { label: "Payment Alerts", desc: "Notify when payment is processed successfully", value: paymentAlert, set: setPaymentAlert, icon: Bell },
            { label: "Due Reminders", desc: "Remind 3 days before fee due date", value: dueReminder, set: setDueReminder, icon: Bell },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#00468E]/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-[#00468E]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <Switch checked={item.value} onCheckedChange={item.set} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Moon className="h-4 w-4 text-[#00468E]" /> Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Dark Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={v => setTheme(v ? "dark" : "light")} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#00468E]" /> Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: "Change Login Email", desc: "Update your registered email address" },
            { label: "Active Sessions", desc: "Manage devices where you're logged in" },
            { label: "Download My Data", desc: "Export all your account data" },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 rounded-xl px-2 transition-colors group">
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
            </button>
          ))}
        </CardContent>
      </Card>

      <Button onClick={() => toast.success("Settings saved!")} className="bg-[#00468E] hover:bg-[#003570] text-white rounded-xl">
        Save Settings
      </Button>
    </div>
  );
}
