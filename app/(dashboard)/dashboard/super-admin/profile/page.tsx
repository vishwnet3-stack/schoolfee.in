"use client";

import { useState } from "react";
import {
  User, Mail, Phone, Shield, Calendar, Edit3, Key,
  Bell, LogOut, CheckCircle2, Activity, Clock, Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "../components/PageHeader";
import { useDashboardAuth } from "../components/AuthContext";
import { redirect } from "next/dist/server/api-utils";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  employee: "Employee",
  parent: "Parent",
  teacher: "Teacher",
  school: "School",
  custom: "Custom User",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-[#00468E] text-white",
  admin: "bg-red-600 text-white",
  manager: "bg-amber-500 text-white",
  employee: "bg-gray-500 text-white",
  parent: "bg-emerald-600 text-white",
  teacher: "bg-blue-500 text-white",
  school: "bg-purple-600 text-white",
  custom: "bg-indigo-500 text-white",
};

const ROLE_ACCESS_SUMMARY: Record<string, string[]> = {
  super_admin: ["Full dashboard access", "Create & manage all users", "Delete records", "Access all reports & analytics", "Manage roles & permissions"],
  admin: ["Full dashboard access", "Create & manage all users", "Delete records", "Access all reports & analytics"],
  manager: ["View & edit users", "Access schools, parents, teachers", "View payments & reports", "Cannot delete records"],
  employee: ["View schools, parents, teachers", "Submit forms", "View notifications", "Read-only access"],
  parent: ["View dashboard home", "View notifications", "Access own profile"],
  teacher: ["View teachers section", "View notifications", "Access own profile"],
  school: ["View schools section", "View notifications", "Access own profile"],
  custom: ["Employee-level access", "Custom permissions as configured"],
};

export default function ProfilePage() {
  const { user, logout } = useDashboardAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true, sms: false, push: true, reports: true,
  });
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  // Keep editForm in sync if user loads after mount
  if (user && editForm.name === "" && user.name) {
    setEditForm({ name: user.name, phone: user.phone || "" });
  }

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  const roleLabel = ROLE_LABELS[user?.role || ""] || user?.role || "";
  const roleColor = ROLE_COLORS[user?.role || ""] || "bg-gray-500 text-white";
  const accessList = ROLE_ACCESS_SUMMARY[user?.role || ""] || [];

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editForm.name, phone: editForm.phone }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return "Never";
    return new Date(d).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 border-4 border-[#00468E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader title="My Profile" description="Your account information and access details" />

      {saveSuccess && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle2 className="h-4 w-4" /> Profile updated successfully.
        </div>
      )}

      {/* Hero card */}
      <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-[#00468E] via-[#0066CC] to-[#F4951D] relative">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundColor: "#fff" }}
          />
        </div>
        <CardContent className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row gap-4 -mt-10 items-start sm:items-end">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarFallback className="bg-[#00468E] text-white text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${roleColor}`}>
                  {roleLabel}
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
              {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
            </div>
            <Button
              onClick={() => {
                if (editing) { handleSave(); }
                else { setEditForm({ name: user.name, phone: user.phone || "" }); setEditing(true); }
              }}
              variant={editing ? "default" : "outline"}
              size="sm"
              disabled={saving}
              className={`gap-2 mt-2 sm:mt-0 ${editing ? "bg-[#00468E] hover:bg-[#003570] text-white" : ""}`}
            >
              <Edit3 className="h-4 w-4" />
              {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
            </Button>
            {editing && (
              <Button variant="outline" size="sm" className="mt-2 sm:mt-0" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / main column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Information */}
          <Card className="border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-[#00468E]" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Full Name</Label>
                  {editing ? (
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      className="h-9"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{user.email}</p>
                  </div>
                  <p className="text-[10px] text-gray-400">Email cannot be changed here. Contact Super Admin.</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Phone Number</Label>
                  {editing ? (
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="h-9"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{user.phone || "—"}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Role</Label>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColor}`}>
                      {roleLabel}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Account Status</Label>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-red-400"}`} />
                    <p className="text-sm font-medium text-gray-800 capitalize">{user.status}</p>
                  </div>
                </div>

                {user.role === "custom" && (user as any).custom_role_name && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-500">Custom Role Title</Label>
                    <p className="text-sm font-medium text-gray-800">{(user as any).custom_role_name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Access & Permissions */}
          <Card className="border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#00468E]" /> Your Access & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 p-3 rounded-xl bg-[#00468E]/5 border border-[#00468E]/10">
                <p className="text-xs font-semibold text-[#00468E] mb-1">Role: {roleLabel}</p>
                <p className="text-xs text-gray-500">Your access is determined by your assigned role. Contact an Admin to change your permissions.</p>
              </div>
              <div className="space-y-2">
                {accessList.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
                  </div>
                ))}
              </div>

              {/* Custom permissions if applicable */}
              {user.role === "custom" && user.permissions && user.permissions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Custom Permissions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.permissions.map((perm) => (
                      <span key={perm} className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Key className="h-4 w-4 text-[#00468E]" /> Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">Password</p>
                  <p className="text-xs text-gray-500">Update your account password</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs h-8">Change</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Adds an extra layer of security</p>
                </div>
                <Switch className="data-[state=checked]:bg-[#00468E]" />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#00468E]" /> Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(Object.entries(notifications) as [string, boolean][]).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {key === "email" ? "Email Notifications" : key === "sms" ? "SMS Alerts" : key === "push" ? "Push Notifications" : "Monthly Reports"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {key === "email" ? "Receive updates via email" : key === "sms" ? "Critical alerts via SMS" : key === "push" ? "Browser push notifications" : "Auto-generated monthly reports"}
                    </p>
                  </div>
                  <Switch
                    checked={val}
                    onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [key]: v }))}
                    className="data-[state=checked]:bg-[#00468E]"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Account Details */}
          <Card className="border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-start text-sm gap-2">
                <span className="text-gray-500 text-xs flex items-center gap-1.5"><Hash className="h-3 w-3" />User ID</span>
                <span className="font-mono font-medium text-gray-800 dark:text-white text-xs">#{user.id}</span>
              </div>
              <div className="flex justify-between items-start text-sm gap-2">
                <span className="text-gray-500 text-xs flex items-center gap-1.5"><Shield className="h-3 w-3" />Role</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleColor}`}>{roleLabel}</span>
              </div>
              <div className="flex justify-between items-start text-sm gap-2">
                <span className="text-gray-500 text-xs flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" />Status</span>
                <span className={`font-medium text-xs capitalize ${user.status === "active" ? "text-emerald-600" : "text-red-500"}`}>
                  {user.status}
                </span>
              </div>
              {user.last_login && (
                <div className="flex flex-col gap-0.5 pt-1 border-t border-gray-100">
                  <span className="text-gray-500 text-xs flex items-center gap-1.5"><Clock className="h-3 w-3" />Last Login</span>
                  <span className="font-medium text-gray-800 dark:text-white text-xs">{formatDate(user.last_login)}</span>
                </div>
              )}
              {user.created_at && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-500 text-xs flex items-center gap-1.5"><Calendar className="h-3 w-3" />Member Since</span>
                  <span className="font-medium text-gray-800 dark:text-white text-xs">{formatDate(user.created_at)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info summary */}
          <Card className="border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00468E]/10 flex items-center justify-center shrink-0">
                  <Mail className="h-3.5 w-3.5 text-[#00468E]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Email</p>
                  <p className="text-xs font-medium text-gray-800 break-all">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Phone</p>
                  <p className="text-xs font-medium text-gray-800">{user.phone || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-red-600">Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-9 gap-2 text-red-600 border-red-200 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}