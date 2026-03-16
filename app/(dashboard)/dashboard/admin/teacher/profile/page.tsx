"use client";

import {
  User, Mail, Phone, MapPin, Calendar, BookOpen, Users,
  GraduationCap, Award, Edit2, CheckCircle2, Star, Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdminAuth } from "../../Adminauthcontext";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function TeacherProfilePage() {
  const { user } = useAdminAuth();
  const initials = user?.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "T";

  const stats = [
    { label: "Classes Assigned", value: "3", icon: BookOpen, color: "text-[#00468E]", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
    { label: "Total Students", value: "125", icon: Users, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
    { label: "Years Experience", value: "8 yrs", icon: Award, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
    { label: "Attendance Rate", value: "94.8%", icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
  ];

  const info = [
    { label: "Full Name", value: user?.name || "Not set", icon: User },
    { label: "Email Address", value: user?.email || "Not set", icon: Mail },
    { label: "Phone Number", value: user?.phone || "+91 98765 43210", icon: Phone },
    { label: "City", value: "New Delhi, India", icon: MapPin },
    { label: "Joined Schoolfee", value: "January 2024", icon: Calendar },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <Button
          size="sm"
          variant="outline"
          className="border-[#00468E] text-[#00468E] hover:bg-[#00468E]/5 rounded-xl"
          onClick={() => toast.success("Edit profile coming soon!")}
        >
          <Edit2 className="h-4 w-4 mr-1.5" /> Edit Profile
        </Button>
      </div>

      {/* Profile hero */}
      <Card className={`${cardClass} overflow-hidden`}>
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 relative">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244,149,29,0.2) 0%, transparent 40%)" }}
          />
        </div>
        <CardContent className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-[#0d1f3c] shadow-xl">
              <AvatarFallback className="bg-purple-600 text-white font-bold text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 text-xs font-semibold mb-1">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Teacher
            </Badge>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || "Teacher Name"}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-0 text-xs">
                <GraduationCap className="h-3 w-3 mr-1" /> Mathematics Teacher
              </Badge>
              <Badge className="bg-[#00468E]/10 text-[#00468E] dark:text-blue-300 border-0 text-xs">
                DPS New Delhi
              </Badge>
              <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-0 text-xs">
                CBSE Board
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={cardClass}>
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Personal info */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-[#00468E]" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {info.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#00468E]/15 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Teaching details */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#00468E]" /> Teaching Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Subject", value: "Mathematics" },
              { label: "Classes", value: "IX-A, X-B, VIII-C" },
              { label: "School", value: "DPS New Delhi" },
              { label: "Board", value: "CBSE" },
              { label: "Total Students", value: "125 students" },
              { label: "Account Status", value: "Active" },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl bg-gray-50 dark:bg-[#00468E]/5">
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account security */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#00468E]" /> Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Login Method", desc: "Email OTP — passwordless and secure", status: "Enabled" },
            { label: "Active Sessions", desc: "1 device currently logged in", status: "1 Active" },
            { label: "Account Type", desc: "Verified Teacher on Schoolfee.in", status: "Verified" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-0 text-[10px] font-semibold shrink-0">
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
