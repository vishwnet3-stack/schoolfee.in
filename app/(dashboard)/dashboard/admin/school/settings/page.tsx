"use client";

import { useState } from "react";
import { Bell, Moon, Sun, Shield, Smartphone, Mail, CreditCard, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function SchoolSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [applicationAlerts, setApplicationAlerts] = useState(true);
  const [referralAlerts, setReferralAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [language, setLanguage] = useState("en");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your school account preferences</p>
      </div>

      {/* Notifications */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#00468E]" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {[
            { label: "Email Notifications", desc: "All alerts and updates via email", icon: Mail, value: emailNotif, set: setEmailNotif },
            { label: "SMS Alerts", desc: "Critical alerts via SMS", icon: Smartphone, value: smsNotif, set: setSmsNotif },
            { label: "Payment Received Alerts", desc: "Notify when Schoolfee transfers funds", icon: CreditCard, value: paymentAlerts, set: setPaymentAlerts },
            { label: "New Application Alerts", desc: "When a parent submits a support request", icon: Bell, value: applicationAlerts, set: setApplicationAlerts },
            { label: "Teacher Referral Alerts", desc: "When a teacher refers a student", icon: Bell, value: referralAlerts, set: setReferralAlerts },
            { label: "Weekly Summary Report", desc: "Receive a weekly email summary of activities", icon: Bell, value: weeklyReport, set: setWeeklyReport },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between py-3.5 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00468E]/8 dark:bg-[#00468E]/15 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-[#00468E] dark:text-blue-400" />
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
            {theme === "dark" ? <Moon className="h-4 w-4 text-[#00468E]" /> : <Sun className="h-4 w-4 text-[#00468E]" />} Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[{ id: "light", label: "Light", Icon: Sun }, { id: "dark", label: "Dark", Icon: Moon }, { id: "system", label: "System", Icon: Smartphone }].map(t => {
              const Icon = t.Icon;
              const selected = theme === t.id;
              return (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${selected ? "border-[#00468E] bg-[#00468E]/5 dark:bg-[#00468E]/10" : "border-gray-200 dark:border-[#00468E]/20 hover:border-[#00468E]/40"}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected ? "bg-[#00468E]" : "bg-gray-100 dark:bg-[#00468E]/10"}`}>
                    <Icon className={`h-4 w-4 ${selected ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                  </div>
                  <span className={`text-xs font-semibold ${selected ? "text-[#00468E] dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>{t.label}</span>
                </button>
              );
            })}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-9 dark:bg-[#0d1f3c] dark:border-[#00468E]/30 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
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
        <CardContent className="space-y-1">
          {[
            { label: "Change Admin Email", desc: "Update email address used for OTP login" },
            { label: "Sign Out All Devices", desc: "Terminate all active sessions" },
            { label: "Download Account Data", desc: "Export a copy of your school's data" },
          ].map(item => (
            <div key={item.label} onClick={() => toast.success(`${item.label} — coming soon`)}
              className="flex items-center justify-between py-3.5 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#00468E]/5 -mx-4 px-4 rounded-lg transition-colors">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => toast.success("Settings saved!")} className="bg-[#00468E] hover:bg-[#003570] text-white rounded-xl px-6">Save Settings</Button>
        <Button variant="outline" onClick={() => toast.info("Cancelled")} className="border-gray-200 dark:border-[#00468E]/30 rounded-xl">Cancel</Button>
      </div>
    </div>
  );
}
