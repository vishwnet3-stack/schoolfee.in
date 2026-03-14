"use client";

import { useState } from "react";
import { AdminSidebar } from "./Adminsidebar";
import { AdminHeader } from "./Adminheader";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { AdminAuthProvider, useAdminAuth } from "./Adminauthcontext"
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAdminAuth();
  const isLoginPage = pathname === "/dashboard/admin/login";

  // Login page: no layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // While loading: show minimal skeleton shell so sidebar/header appear instantly
  // The sidebar reads from context — once user loads it fills in, no full-page reload
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#060f1e] flex">
        {/* Sidebar skeleton */}
        <aside className="fixed left-0 top-0 z-30 h-screen w-[240px] bg-[#000d1a] border-r border-white/5 hidden md:flex flex-col">
          <div className="h-[64px] border-b border-white/10 flex items-center px-3">
            <div className="bg-white py-1 px-2 rounded-sm">
              <img src="https://schoolfee.in/logo/schoolfee%20logo.webp" alt="Schoolfee" className="h-7 w-auto object-contain" />
            </div>
          </div>
          <div className="flex-1 p-3 space-y-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        </aside>
        {/* Main skeleton */}
        <div className="md:ml-[240px] flex-1">
          <div className="h-[64px] bg-white dark:bg-[#0a1628] border-b border-gray-100 dark:border-[#00468E]/20 sticky top-0 z-40 flex items-center px-6">
            <div className="flex-1 max-w-xs h-9 bg-gray-100 dark:bg-[#00468E]/10 rounded-xl animate-pulse" />
            <div className="ml-auto flex gap-2">
              <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#00468E]/10 animate-pulse" />
              <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#00468E]/10 animate-pulse" />
              <div className="w-32 h-9 rounded-xl bg-gray-100 dark:bg-[#00468E]/10 animate-pulse" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="h-8 w-64 bg-gray-200 dark:bg-[#00468E]/10 rounded-xl animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-white dark:bg-[#0d1f3c] rounded-2xl animate-pulse" />
              ))}
            </div>
            <div className="h-64 bg-white dark:bg-[#0d1f3c] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // No user after loading → redirect handled in context, show nothing
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060f1e]">
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        collapsed ? "md:ml-[68px]" : "md:ml-[240px]"
      )}>
        <AdminHeader onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="min-h-[calc(100vh-64px)] p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AdminAuthProvider>
        <AdminShell>{children}</AdminShell>
        <Toaster richColors position="top-right" />
      </AdminAuthProvider>
    </ThemeProvider>
  );
}