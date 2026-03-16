"use client";

import { useState } from "react";
import {
  Bell, Moon, Shield, User, Download, Trash2,
  ChevronRight, Sun, Smartphone, Mail, CreditCard, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useAdminAuth } from "../../Adminauthcontext";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function TeacherSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAdminAuth();

  // Notification toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [salaryAlerts, setSalaryAlerts] = useState(true);
  const [feeAlerts, setFeeAlerts] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(false);
  const [meetingReminders, setMeetingReminders] = useState(true);

  // Preferences
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("inr");
  const [timezone, setTimezone] = useState("asia-kolkata");

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account preferences and notifications</p>
      </div>

      {/* Notifications */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#00468E]" /> Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {[
            { label: "Email Notifications", desc: "Receive all alerts and updates via email", icon: Mail, value: emailNotif, set: setEmailNotif },
            { label: "SMS Notifications", desc: "Get important alerts via SMS to your mobile", icon: Smartphone, value: smsNotif, set: setSmsNotif },
            { label: "Salary Credit Alerts", desc: "Notify when monthly salary is credited", icon: CreditCard, value: salaryAlerts, set: setSalaryAlerts },
            { label: "Student Fee Alerts", desc: "Get notified when student fees are paid or pending", icon: Bell, value: feeAlerts, set: setFeeAlerts },
            { label: "Attendance Reports", desc: "Receive monthly attendance summary", icon: Check, value: attendanceAlerts, set: setAttendanceAlerts },
            { label: "Meeting Reminders", desc: "Reminders for parent-teacher meetings", icon: Bell, value: meetingReminders, set: setMeetingReminders },
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
            {theme === "dark" ? <Moon className="h-4 w-4 text-[#00468E]" /> : <Sun className="h-4 w-4 text-[#00468E]" />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Theme selector */}
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Smartphone },
                ].map(t => {
                  const Icon = t.icon;
                  const selected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        selected
                          ? "border-[#00468E] bg-[#00468E]/5 dark:bg-[#00468E]/10"
                          : "border-gray-200 dark:border-[#00468E]/20 hover:border-[#00468E]/40"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected ? "bg-[#00468E]" : "bg-gray-100 dark:bg-[#00468E]/10"}`}>
                        <Icon className={`h-4 w-4 ${selected ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                      </div>
                      <span className={`text-xs font-semibold ${selected ? "text-[#00468E] dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-[#00468E]" /> Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-9 dark:bg-[#0d1f3c] dark:border-[#00468E]/30 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="h-9 dark:bg-[#0d1f3c] dark:border-[#00468E]/30 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia-kolkata">India (IST) — UTC+5:30</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        <CardContent className="space-y-3">
          {[
            { label: "Change Email Address", desc: "Update your registered email for OTP login", danger: false },
            { label: "Sign Out All Devices", desc: "Terminate all active sessions", danger: false },
            { label: "Download My Data", desc: "Export a copy of your account data", danger: false },
          ].map(item => (
            <div
              key={item.label}
              className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#00468E]/5 -mx-4 px-4 rounded-lg transition-colors"
              onClick={() => toast.success(`${item.label} — coming soon`)}
            >
              <div>
                <p className={`text-sm font-semibold ${item.danger ? "text-red-600" : "text-gray-800 dark:text-white"}`}>{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          className="bg-[#00468E] hover:bg-[#003570] text-white rounded-xl px-6"
        >
          Save Settings
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Changes discarded")}
          className="border-gray-200 dark:border-[#00468E]/30 rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
