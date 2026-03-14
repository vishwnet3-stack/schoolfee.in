"use client";

import {
  Building2, Mail, Phone, MapPin, Globe, Edit2, Upload,
  CheckCircle2, Shield, CreditCard, Hash, Users, Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "../../AdminAuthContext";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

export default function SchoolProfilePage() {
  const { user } = useAdminAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Profile</h1>
        <Button size="sm" variant="outline" className="border-[#00468E] text-[#00468E] hover:bg-[#00468E]/5 rounded-xl"
          onClick={() => toast.success("Edit profile coming soon!")}>
          <Edit2 className="h-4 w-4 mr-1.5" /> Edit Profile
        </Button>
      </div>

      {/* Hero card */}
      <Card className={`${cardClass} overflow-hidden`}>
        <div className="h-28 bg-gradient-to-r from-[#001a3d] via-[#00468E] to-[#0061c3] relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)" }} />
        </div>
        <CardContent className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white dark:border-[#0d1f3c] shadow-xl flex items-center justify-center overflow-hidden">
              <Building2 className="h-9 w-9 text-[#00468E]" />
            </div>
            <div className="flex gap-2 mb-1">
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 text-xs font-semibold">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Partner
              </Badge>
              <Badge className="bg-[#00468E]/10 text-[#00468E] dark:text-blue-300 border-0 text-xs font-semibold">
                CarePay Enabled
              </Badge>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delhi Public School</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">New Delhi, India · CBSE Board</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-0 text-xs">Est. 1949</Badge>
            <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-0 text-xs">CBSE Affiliated</Badge>
            <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-0 text-xs">Co-educational</Badge>
            <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-0 text-xs">English Medium</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Students", value: "1,240", icon: Users, color: "text-[#00468E]", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
          { label: "CarePay Students", value: "892", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
          { label: "Partner Since", value: "2024", icon: Calendar, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
          { label: "Total Received", value: "Rs. 1.12Cr", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={cardClass}>
              <CardContent className="p-4 text-center">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* School info */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#00468E]" /> School Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "School Name", value: "Delhi Public School, New Delhi", icon: Building2 },
              { label: "Registration Number", value: "CBSE/AFF/2510256", icon: Hash },
              { label: "Address", value: "Mathura Road, New Delhi – 110003", icon: MapPin },
              { label: "Contact Number", value: "+91 11 2621 8621", icon: Phone },
              { label: "Email Address", value: user?.email || "admin@dpsnd.in", icon: Mail },
              { label: "Website", value: "www.dpsnd.in", icon: Globe },
              { label: "Principal", value: "Dr. Rajesh Sharma", icon: Users },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#00468E]/15 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Verification documents */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#00468E]" /> Verification Documents
            </CardTitle>
            <Button size="sm" variant="outline" className="border-[#00468E] text-[#00468E] rounded-xl text-xs"
              onClick={() => toast.success("Upload dialog opening...")}>
              <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "School Registration Certificate", status: "verified", date: "Jan 2024" },
            { name: "Bank Verification Document (NEFT Details)", status: "verified", date: "Jan 2024" },
            { name: "CBSE Affiliation Certificate", status: "verified", date: "Jan 2024" },
          ].map(doc => (
            <div key={doc.name} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-[#00468E]/10 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{doc.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Uploaded {doc.date}</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-0 text-[10px] font-semibold shrink-0">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
