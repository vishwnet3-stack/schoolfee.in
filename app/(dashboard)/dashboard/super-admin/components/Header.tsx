"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell, Search, Sun, Moon, Menu, ChevronDown, User, Settings,
  LogOut, CheckCheck, Shield, School, CreditCard, FileText, Users, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useDashboardAuth } from "./AuthContext";

const notifications = [
  { id: 1, text: "New school registration request from Delhi Public School", time: "2m ago", unread: true, type: "school" },
  { id: 2, text: "Payment of Rs. 8,500 received from Ramesh Gupta", time: "15m ago", unread: true, type: "payment" },
  { id: 3, text: "3 new form submissions awaiting review", time: "1h ago", unread: false, type: "form" },
  { id: 4, text: "Employee Kiran Bhat successfully assigned to school", time: "2h ago", unread: false, type: "employee" },
  { id: 5, text: "Overdue payment alert: Manoj Tiwari — Rs. 12,000 pending", time: "3h ago", unread: false, type: "alert" },
];

// Lucide icons per notification type — no emojis
const typeIcon: Record<string, React.ElementType> = {
  school: School,
  payment: CreditCard,
  form: FileText,
  employee: Users,
  alert: AlertTriangle,
};

const typeBg: Record<string, string> = {
  school:   "bg-blue-100 text-blue-700",
  payment:  "bg-emerald-100 text-emerald-700",
  form:     "bg-amber-100 text-amber-700",
  employee: "bg-purple-100 text-purple-700",
  alert:    "bg-red-100 text-red-700",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin", admin: "Admin", manager: "Manager",
  employee: "Employee", parent: "Parent", teacher: "Teacher",
  school: "School", custom: "Custom User",
};

interface HeaderProps { onMenuToggle?: () => void; }

function Dropdown({ trigger, children, align = "right" }: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "right" | "left";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={`absolute top-full mt-2 z-50 bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/30 shadow-xl rounded-2xl overflow-hidden ${align === "right" ? "right-0" : "left-0"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useDashboardAuth();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  return (
    <header className="h-[64px] bg-white dark:bg-[#0a1628] border-b border-gray-100 dark:border-[#00468E]/20 sticky top-0 z-40 flex items-center px-4 md:px-6 gap-3 shadow-sm">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden shrink-0 text-gray-600">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[240px] border-0">
          <Sidebar collapsed={false} onToggle={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search..."
          className="pl-9 h-9 bg-gray-50 dark:bg-[#00468E]/10 border-gray-200 text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Theme toggle */}
        <Button
          variant="ghost" size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 text-gray-500 hover:text-[#00468E] hover:bg-gray-100 rounded-xl"
        >
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        {/* Notifications */}
        <Dropdown
          align="right"
          trigger={
            <Button variant="ghost" size="icon" className="h-9 w-9 relative text-gray-500 hover:text-[#00468E] hover:bg-gray-100 rounded-xl cursor-pointer">
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-[#F4951D] rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          }
        >
          <div className="w-[360px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#00468E]/20">
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</p>
                <p className="text-xs text-gray-500">{unreadCount} unread</p>
              </div>
              <button className="text-xs text-[#00468E] font-semibold flex items-center gap-1 hover:opacity-80">
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            </div>
            <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-50 dark:divide-[#00468E]/10">
              {notifications.map((n) => {
                const Icon = typeIcon[n.type] || AlertTriangle;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#00468E]/10 ${n.unread ? "bg-blue-50/40" : ""}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${typeBg[n.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${n.unread ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                        {n.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && <div className="w-2 h-2 rounded-full bg-[#F4951D] shrink-0 mt-2" />}
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
              <Link href="/dashboard/super-admin/notifications" className="text-xs text-[#00468E] font-semibold hover:underline">
                View all notifications →
              </Link>
            </div>
          </div>
        </Dropdown>

        {/* Profile */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 px-2 h-9 hover:bg-gray-100 dark:hover:bg-[#00468E]/15 rounded-xl cursor-pointer transition-colors">
              <Avatar className="h-7 w-7 ring-2 ring-[#00468E]/20">
                <AvatarFallback className="bg-[#00468E] text-white text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                  {user?.name || "Loading..."}
                </p>
                <p className="text-[11px] text-gray-500 leading-tight">
                  {user?.email || ""}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden md:block" />
            </button>
          }
        >
          <div className="w-64">
            {/* Profile header */}
            <div className="px-4 py-4 border-b border-gray-100 dark:border-[#00468E]/20 bg-gradient-to-br from-[#00468E]/5 to-[#F4951D]/5">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 ring-2 ring-[#00468E]/30">
                  <AvatarFallback className="bg-[#00468E] text-white font-bold text-sm">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00468E] text-white capitalize">
                    {ROLE_LABELS[user?.role || ""] || user?.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-1.5">
              <Link
                href="/dashboard/super-admin/profile"
                className="flex items-center gap-2.5 h-10 px-3 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#00468E]/15 cursor-pointer"
              >
                <User className="h-4 w-4 text-[#00468E]" /> My Profile
              </Link>
              <Link
                href="/dashboard/super-admin/settings"
                className="flex items-center gap-2.5 h-10 px-3 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#00468E]/15 cursor-pointer"
              >
                <Settings className="h-4 w-4 text-gray-400" /> Account Settings
              </Link>
              {(user?.role === "super_admin" || user?.role === "admin") && (
                <Link
                  href="/dashboard/super-admin/roles"
                  className="flex items-center gap-2.5 h-10 px-3 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#00468E]/15 cursor-pointer"
                >
                  <Shield className="h-4 w-4 text-gray-400" /> Roles & Permissions
                </Link>
              )}
              <div className="h-px bg-gray-100 dark:bg-[#00468E]/20 my-1" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 h-10 px-3 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer font-medium"
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