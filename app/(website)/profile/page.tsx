"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Calendar, Shield, ArrowLeft, LogOut, CheckCircle2 } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuthSession();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#00468E]/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#00468E] animate-spin" />
          </div>
          <p className="text-slate-500 font-medium text-sm tracking-wide">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full border border-slate-100">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Not Signed In</h2>
          <p className="text-slate-500 text-sm mb-6">Please log in to view your profile.</p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-[#00468E] hover:bg-[#003870] text-white rounded-xl h-11"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const initials = user.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#00468E] transition mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT COLUMN — Avatar + quick actions */}
          <div className="md:col-span-1 flex flex-col gap-5">

            {/* Avatar card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center gap-4">
              {/* Avatar ring */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00468E] to-[#0066CC] flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-white tracking-tight">{initials}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">{user.fullName}</h1>
                <p className="text-sm text-slate-500 mt-0.5 break-all">{user.email}</p>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
                <CheckCircle2 size={13} />
                Active Member
              </div>
            </div>

            {/* Actions card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Actions</p>
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-[#00468E] hover:bg-[#003870] text-white h-10 rounded-xl font-medium text-sm"
              >
                Back to Home
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 h-10 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
              >
                <LogOut size={15} />
                Logout
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN — Profile details */}
          <div className="md:col-span-2 flex flex-col gap-5">

            {/* Account details card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-800 mb-5 pb-4 border-b border-slate-100">
                Account Information
              </h2>
              <div className="space-y-5">

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-[#00468E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                    <p className="text-sm font-medium text-slate-900 break-all">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-[#00468E]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Member Since</p>
                    <p className="text-sm font-medium text-slate-900">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Account Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-sm font-medium text-green-700">Active & Verified</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Program info card */}
            <div className="bg-gradient-to-br from-[#00468E] to-[#0066CC] rounded-2xl shadow-sm p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Initiative</p>
                  <h3 className="text-lg font-bold leading-snug">Community Health Mission</h3>
                  <p className="text-blue-200 text-sm mt-1">CarePay® · National Health Financial Inclusion Initiative</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={22} className="text-white" />
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-white/20">
                <p className="text-xs text-blue-200">
                  You are a registered member of SchoolFee.org — supporting education continuity across India.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}