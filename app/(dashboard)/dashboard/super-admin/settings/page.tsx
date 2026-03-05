"use client";

import { useState } from "react";
import { User, Lock, Bell, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "../components/PageHeader";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    newUser: true,
    payment: true,
    school: true,
    weeklyReport: false,
    monthlyReport: true,
    systemAlerts: true,
  });

  const toggleNotif = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Settings" description="Manage your account and platform preferences" />

      <Tabs defaultValue="profile">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg text-sm gap-1.5"><User className="h-3.5 w-3.5" /> Profile</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg text-sm gap-1.5"><Lock className="h-3.5 w-3.5" /> Security</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg text-sm gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg text-sm gap-1.5"><Palette className="h-3.5 w-3.5" /> Appearance</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-4">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl font-bold bg-[#00468E] text-white">AM</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">Change Photo</Button>
                  <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name</Label>
                  <Input defaultValue="Arjun Mehta" className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input defaultValue="arjun@schoolfee.in" type="email" className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <Input defaultValue="+91 98765 43210" className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Role</Label>
                  <Input defaultValue="Admin" disabled className="h-10 bg-gray-50 dark:bg-gray-800" />
                </div>
              </div>
              <Button className="bg-[#00468E] hover:bg-[#003570] text-white gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-4">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Current Password</Label>
                <Input type="password" placeholder="Enter current password" className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">New Password</Label>
                <Input type="password" placeholder="Min. 8 characters" className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Confirm New Password</Label>
                <Input type="password" placeholder="Repeat new password" className="h-10" />
              </div>
              <Button className="bg-[#00468E] hover:bg-[#003570] text-white gap-2">
                <Save className="h-4 w-4" /> Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { key: "newUser", label: "New User Registrations", desc: "Notify when a new user signs up" },
                  { key: "payment", label: "Payment Alerts", desc: "Notify on payment success or failure" },
                  { key: "school", label: "School Activity", desc: "Notify on new school registrations" },
                  { key: "weeklyReport", label: "Weekly Summary", desc: "Receive weekly analytics report" },
                  { key: "monthlyReport", label: "Monthly Report", desc: "Receive monthly performance report" },
                  { key: "systemAlerts", label: "System Alerts", desc: "Critical system notifications" },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{n.label}</p>
                      <p className="text-xs text-gray-500">{n.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[n.key as keyof typeof notifications]}
                      onCheckedChange={() => toggleNotif(n.key)}
                      className="data-[state=checked]:bg-[#00468E]"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-4">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-sm font-medium mb-3 block">Theme</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "light", label: " Light Mode", desc: "Clean white interface" },
                    { value: "dark", label: " Dark Mode", desc: "Easy on the eyes" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        theme === t.value
                          ? "border-[#00468E] bg-[#00468E]/5 dark:bg-[#00468E]/10"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-800 dark:text-white">{t.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-1 block">Brand Colors</Label>
                <p className="text-xs text-gray-500 mb-3">Schoolfee brand palette</p>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#00468E] shadow-sm" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-white">Primary Blue</p>
                      <p className="text-xs text-gray-400">#00468E</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F4951D] shadow-sm" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-white">Accent Orange</p>
                      <p className="text-xs text-gray-400">#F4951D</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}