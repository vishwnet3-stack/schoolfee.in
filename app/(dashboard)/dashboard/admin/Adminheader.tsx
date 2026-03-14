"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell, Search, Sun, Moon, Menu, ChevronDown, User, Settings,
  LogOut, CheckCheck, CreditCard, AlertTriangle, School, BookOpen, Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./Adminsidebar";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAdminAuth, ROLE_LABELS, ROLE_COLORS, AdminUserRole } from "./Adminauthcontext";

const ROLE_NOTIFICATIONS: Record<AdminUserRole, { id: number; text: string; time: string; unread: boolean; type: string }[]> = {
  parent: [
    { id: 1, text: "Schoolfee paid May tuition of Rs. 16,800 to DPS New Delhi on your behalf", time: "2m ago", unread: true, type: "payment" },
    { id: 2, text: "Your repayment of Rs. 5,000 to Schoolfee was received — thank you!", time: "1h ago", unread: true, type: "wallet" },
    { id: 3, text: "June fee of Rs. 16,800 will be paid to school on 15 Jun 2025", time: "3h ago", unread: false, type: "school" },
  ],
  teacher: [
    { id: 1, text: "Your May salary of Rs. 45,000 has been credited", time: "30m ago", unread: true, type: "payment" },
    { id: 2, text: "3 students in Class IX-A have pending dues this month", time: "2h ago", unread: true, type: "alert" },
    { id: 3, text: "Monthly attendance report for May is ready for review", time: "1d ago", unread: false, type: "form" },
  ],
  school: [
    { id: 1, text: "Schoolfee transferred Rs. 1,24,000 for April fee collection", time: "1h ago", unread: true, type: "payment" },
    { id: 2, text: "18 new parent enrollments pending your confirmation", time: "3h ago", unread: true, type: "users" },
    { id: 3, text: "Q1 fee collection report for 2025-26 is ready", time: "2d ago", unread: false, type: "form" },
  ],
};

const typeIcon: Record<string, React.ElementType> = {
  payment: CreditCard, school: School, alert: AlertTriangle,
  form: BookOpen, wallet: Wallet, users: Users,
};
const typeBg: Record<string, string> = {
  payment: "bg-emerald-100 text-emerald-700",
  school: "bg-blue-100 text-blue-700",
  alert: "bg-red-100 text-red-700",
  form: "bg-amber-100 text-amber-700",
  wallet: "bg-purple-100 text-purple-700",
  users: "bg-indigo-100 text-indigo-700",
};

function Dropdown({ trigger, children, align = "right" }: {
  trigger: React.ReactNode; children: React.ReactNode; align?: "right" | "left";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute top-full mt-2 z-50",
            "bg-white dark:bg-[#0d1f3c]",
            "border border-gray-100 dark:border-[#00468E]/30",
            "shadow-xl rounded-2xl overflow-hidden",
            align === "right" ? "right-0" : "left-0"
          )}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function AdminHeader({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAdminAuth();
  const role = user?.role as AdminUserRole | undefined;
  const notifications = role ? ROLE_NOTIFICATIONS[role] : [];
  const unreadCount = notifications.filter(n => n.unread).length;

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  const roleLabel = role ? ROLE_LABELS[role] : "";
  const roleBadge = role ? ROLE_COLORS[role] : "bg-gray-500";
  const profileLink = role ? `/dashboard/admin/${role}/profile` : "#";
  const settingsLink = role ? `/dashboard/admin/${role}/settings` : "#";
  const notifLink = role ? `/dashboard/admin/${role}/notifications` : "#";

  return (
    <header className="h-[64px] bg-white dark:bg-[#0a1628] border-b border-gray-100 dark:border-[#00468E]/20 sticky top-0 z-40 flex items-center px-4 md:px-6 gap-3 shadow-sm">
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden shrink-0 text-gray-600">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[240px] border-0">
          <AdminSidebar collapsed={false} onToggle={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="flex-1 max-w-xs relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search..."
          className="pl-9 h-9 bg-gray-50 dark:bg-[#00468E]/10 border-gray-200 dark:border-[#00468E]/30 text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Theme toggle */}
        <Button
          variant="ghost" size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 text-gray-500 hover:text-[#00468E] hover:bg-gray-100 dark:hover:bg-[#00468E]/15 rounded-xl"
        >
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        {/* Notifications */}
        <Dropdown align="right" trigger={
          <Button variant="ghost" size="icon" className="h-9 w-9 relative text-gray-500 hover:text-[#00468E] hover:bg-gray-100 dark:hover:bg-[#00468E]/15 rounded-xl cursor-pointer">
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-[#F4951D] rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        }>
          <div className="w-[320px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#00468E]/20">
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</p>
                <p className="text-xs text-gray-500">{unreadCount} unread</p>
              </div>
              <button className="text-xs text-[#00468E] font-semibold flex items-center gap-1 hover:opacity-80">
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            </div>
            <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-50 dark:divide-[#00468E]/10">
              {notifications.map(n => {
                const Icon = typeIcon[n.type] || AlertTriangle;
                return (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#00468E]/10 ${n.unread ? "bg-blue-50/50 dark:bg-[#00468E]/5" : ""}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${typeBg[n.type] || typeBg.form}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${n.unread ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#F4951D] shrink-0 mt-2" />}
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[#00468E]/20 bg-gray-50/50 dark:bg-[#00468E]/5">
              <Link href={notifLink} className="text-xs text-[#00468E] font-semibold hover:underline">
                View all notifications →
              </Link>
            </div>
          </div>
        </Dropdown>

        {/* Profile */}
        <Dropdown align="right" trigger={
          <button className="flex items-center gap-2 px-2 h-9 hover:bg-gray-100 dark:hover:bg-[#00468E]/15 rounded-xl cursor-pointer transition-colors">
            <Avatar className="h-7 w-7 ring-2 ring-[#00468E]/20">
              <AvatarFallback className="bg-[#00468E] text-white text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight max-w-[120px] truncate">
                {user?.name || "Loading..."}
              </p>
              <p className="text-[11px] text-gray-500 leading-tight max-w-[120px] truncate">{user?.email || ""}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden md:block" />
          </button>
        }>
          <div className="w-64">
            <div className="px-4 py-4 border-b border-gray-100 dark:border-[#00468E]/20 bg-gradient-to-br from-[#00468E]/5 to-[#F4951D]/5">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 ring-2 ring-[#00468E]/30">
                  <AvatarFallback className="bg-[#00468E] text-white font-bold text-sm">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white ${roleBadge}`}>
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-1.5">
              <Link href={profileLink} className="flex items-center gap-2.5 h-10 px-3 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#00468E]/15">
                <User className="h-4 w-4 text-[#00468E]" /> My Profile
              </Link>
              <Link href={settingsLink} className="flex items-center gap-2.5 h-10 px-3 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#00468E]/15">
                <Settings className="h-4 w-4 text-gray-400" /> Settings
              </Link>
              <div className="h-px bg-gray-100 dark:bg-[#00468E]/20 my-1" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 h-10 px-3 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}