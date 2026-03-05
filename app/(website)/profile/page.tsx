"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  LogOut,
  CheckCircle2,
  ClipboardList,
  UserPlus,
  GraduationCap,
  School,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { MdCardMembership } from "react-icons/md";

const membershipSteps = [
  {
    label: "Start Survey",
    description: "Share your community needs",
    href: "http://localhost:3000/survey",
    icon: ClipboardList,
    step: "01",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    iconColor: "text-amber-600",
    tag: "Required",
    tagColor: "bg-amber-100 text-amber-700",
  },
  {
    label: "Parent Registration",
    description: "Register as a parent member",
    href: "http://localhost:3000/registration/parent",
    icon: UserPlus,
    step: "02",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    iconColor: "text-[#00468E]",
    tag: "For Parents",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    label: "Teacher Registration",
    description: "Join as an educator",
    href: "http://localhost:3000/registration/teacher",
    icon: GraduationCap,
    step: "03",
    lightBg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-800",
    iconColor: "text-violet-600",
    tag: "For Teachers",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    label: "School Registration",
    description: "Enrol your institution",
    href: "http://localhost:3000/registration/school",
    icon: School,
    step: "04",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    iconColor: "text-emerald-600",
    tag: "For Schools",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
];

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
    <div className="min-h-screen bg-[#F4F7FB] py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#00468E] transition mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* ══════════════════════════
              LEFT — STICKY SIDEBAR
          ══════════════════════════ */}
          <div className="w-full md:w-[268px] flex-shrink-0 md:sticky md:top-6 flex flex-col gap-4">

            {/* Profile card — dark blue */}
            <div className="bg-[#002F60] rounded-2xl shadow-lg overflow-hidden">
              {/* Top section */}
              <div className="px-5 pt-6 pb-5 flex flex-col items-center text-center gap-3">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-extrabold text-white">{initials}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-white">{user.fullName}</h1>
                  <p className="text-xs text-blue-200 mt-0.5 break-all">{user.email}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                  <CheckCircle2 size={11} />
                  Active Member
                </span>
              </div>

              {/* Stats strip */}
              <div className="bg-black/20 px-5 py-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-blue-300 mb-0.5">Member Since</p>
                  <p className="text-white font-semibold">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-blue-300 mb-0.5">Status</p>
                  <p className="text-green-300 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                    Verified
                  </p>
                </div>
              </div>
            </div>

            {/* Account details — white card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Account Details</p>
              <div className="space-y-3">

                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-[#00468E]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Email</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-[#00468E]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Joined</p>
                    <p className="text-xs font-semibold text-slate-800">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Account</p>
                    <p className="text-xs font-semibold text-green-700">Active & Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-[#00468E] hover:bg-[#003870] text-white h-10 rounded-xl font-semibold text-sm shadow-sm"
              >
                Back to Home
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                Sign Out
              </Button>
            </div>
          </div>

          {/* ══════════════════════════
              RIGHT — MAIN CONTENT
          ══════════════════════════ */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">

            {/* ── BECOME A MEMBER — TOP CARD ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

              {/* Banner header */}
              <div className="bg-[#00305F] px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {/* <Sparkles size={18} className="text-white" /> */}
                    {/* <MdCardMembership size={18} className="text-white" /> */}
                    <UserPlus size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-extrabold text-lg leading-tight">
                      Become a Member of SchoolFee.org
                    </h2>
                    <p className="text-blue-200 text-sm mt-1 leading-snug">
                      Complete the steps below to join India's largest school financial inclusion initiative.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step cards */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {membershipSteps.map(({ label, description, href, icon: Icon, step, lightBg, border, text, iconColor, tag, tagColor }) => (
                  <a
                    key={href}
                    href={href}
                    className={`group relative flex flex-col gap-3 p-4 rounded-xl border-2 ${border} ${lightBg} hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${tagColor}`}>{tag}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl border-2 ${border} bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                        <Icon size={22} className={iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${text} leading-tight`}>{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-1 text-xs font-bold ${text}`}>
                      <span>Get started</span>
                      <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* ── INITIATIVE CARD ── */}
            <div className="relative bg-gradient-to-br from-[#00305F] via-[#00468E] to-[#006BD6] rounded-2xl shadow-md p-6 text-white overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-blue-100 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active Initiative
                  </div>
                  <h3 className="text-xl font-extrabold leading-snug">Community Health Mission</h3>
                  <p className="text-blue-200 text-sm mt-1">
                    CarePay® · National Health Financial Inclusion Initiative
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20">
                  <CheckCircle2 size={22} className="text-white" />
                </div>
              </div>

              <div className="relative mt-5 pt-4 border-t border-white/15">
                <p className="text-xs text-blue-200 leading-relaxed">
                  You are a registered member of{" "}
                  <span className="text-white font-bold">SchoolFee.org</span>{" "}
                  — supporting education continuity across India.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}