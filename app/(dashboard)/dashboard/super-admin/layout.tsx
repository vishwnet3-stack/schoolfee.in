"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { DashboardAuthProvider } from "./components/AuthContext";
import { RouteGuard } from "./components/RouteGuard";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/dashboard/super-admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060f1e]">
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          collapsed ? "md:ml-[68px]" : "md:ml-[240px]"
        )}
      >
        <Header onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="min-h-[calc(100vh-64px)] p-4 md:p-6">
          <RouteGuard>{children}</RouteGuard>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <DashboardAuthProvider>
        <DashboardShell>{children}</DashboardShell>
        <Toaster richColors position="top-right" />
      </DashboardAuthProvider>
    </ThemeProvider>
  );
}