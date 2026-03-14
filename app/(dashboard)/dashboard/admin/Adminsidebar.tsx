"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  PanelLeftClose, PanelLeftOpen,
  LayoutDashboard, CreditCard, Wallet, School, User, Bell, Settings,
  BookOpen, Users, GraduationCap, FileText, Building2, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAdminAuth, ROLE_NAV, ROLE_LABELS, ROLE_COLORS, AdminUserRole } from "./Adminauthcontext";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, CreditCard, Wallet, School, User, Bell, Settings,
  BookOpen, Users, GraduationCap, FileText, Building2, RefreshCw,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAdminAuth();
  const role = user?.role as AdminUserRole | undefined;
  const navItems = role ? ROLE_NAV[role] : [];

  const isActive = (href: string) => {
    // Exact match for home routes
    if (href === `/dashboard/admin/${role}`) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const roleBadge = role ? ROLE_COLORS[role] : "bg-gray-600";
  const roleLabel = role ? ROLE_LABELS[role] : "";
  const homeHref = role ? `/dashboard/admin/${role}` : "/dashboard/admin/login";

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-screen flex flex-col transition-all duration-300 ease-in-out",
          "bg-[#000d1a] dark:bg-[#000d1a]",
          "border-r border-white/5",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-[64px] border-b border-white/10 shrink-0",
          collapsed ? "justify-center px-3" : "justify-between px-3"
        )}>
          {!collapsed && (
            <Link href={homeHref} className="flex items-center gap-2 min-w-0">
              <div className="bg-white py-1 px-2 rounded-sm shrink-0">
                <img
                  src="https://schoolfee.in/logo/schoolfee%20logo.webp"
                  alt="Schoolfee"
                  className="h-7 w-auto object-contain"
                />
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href={homeHref}>
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="https://schoolfee.in/logo/schoolfee.webp"
                  alt="SF"
                  className="object-contain w-7 h-7"
                />
              </div>
            </Link>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10 h-7 w-7 shrink-0"
              onClick={onToggle}
            >
              <PanelLeftClose className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Role badge */}
        {!collapsed && role && (
          <div className="px-3 py-2.5 border-b border-white/5 shrink-0">
            <span className={cn(
              "inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white",
              roleBadge
            )}>
              {roleLabel} Portal
            </span>
          </div>
        )}

        {/* Nav */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full py-3">
            <nav className="space-y-0.5 px-2">
              {navItems.map((item) => {
                const Icon = ICON_MAP[item.icon] || LayoutDashboard;
                const active = isActive(item.href);

                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-center h-10 rounded-lg transition-colors",
                            active
                              ? "bg-white/20 text-white"
                              : "text-white/55 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-950 text-white border-gray-800 text-xs">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/55 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {active && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00468E]/80 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </div>

        {/* Footer */}
        {!collapsed ? (
          <div className="p-3 border-t border-white/10 shrink-0">
            <div className="bg-white/8 rounded-xl p-3 border border-white/10">
              <p className="text-[11px] font-semibold text-white/90">Schoolfee Dashboard</p>
              <p className="text-[10px] text-white/45 mt-0.5">Interest-free education support</p>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-white/10 flex justify-center shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/50 hover:text-white hover:bg-white/10 h-7 w-7"
              onClick={onToggle}
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}