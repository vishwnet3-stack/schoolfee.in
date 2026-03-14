"use client";

import { User, Mail, Phone, MapPin, Calendar, Edit2, Shield, CreditCard, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdminAuth } from "../../Adminauthcontext";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function ParentProfilePage() {
  const { user } = useAdminAuth();
  const initials = user?.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "P";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your personal information</p>
        </div>
        <Button size="sm" variant="outline" className="border-[#00468E] text-[#00468E] rounded-xl">
          <Edit2 className="h-4 w-4 mr-1.5" /> Edit Profile
        </Button>
      </div>

      {/* Profile Header */}
      <Card className={`${cardClass} overflow-hidden`}>
        <div className="bg-gradient-to-r from-[#00468E] to-[#0058b4]" />
        <CardContent className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-[#0d1f3c] shrink-0">
              <AvatarFallback className="bg-[#00468E] text-white text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-2 sm:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || "Parent User"}</h2>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 font-semibold w-fit">Verified Parent</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-1">Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "2025"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { icon: User, label: "Full Name", value: user?.name || "—" },
            { icon: Mail, label: "Email Address", value: user?.email || "—" },
            { icon: Phone, label: "Phone Number", value: user?.phone || "+91 98765 43210" },
            { icon: MapPin, label: "City / Location", value: "New Delhi, India" },
            { icon: Calendar, label: "Joined On", value: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN") : "—" },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0">
                <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#00468E]/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.value}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Account Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { icon: Shield, label: "Account Status", value: "Active", badge: "bg-emerald-100 text-emerald-700" },
            { icon: CreditCard, label: "CarePay Status", value: "Activated", badge: "bg-[#00468E]/10 text-[#00468E]" },
            { icon: Bell, label: "Notifications", value: "Enabled", badge: "bg-purple-100 text-purple-700" },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#00468E]/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-200">{item.label}</span>
                </div>
                <Badge className={`${item.badge} border-0 text-xs font-semibold`}>{item.value}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
