"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-config";
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardAuth, ROLE_ALLOWED_ROUTES } from "./AuthContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>(["Users"]);
  const { user } = useDashboardAuth();

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string, exact?: boolean) => {
    if (!href) return false;
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  // Filter nav items based on user role
  const isRouteAllowed = (href?: string): boolean => {
    if (!href || !user) return false;
    if (user.role === "super_admin" || user.role === "admin") return true;
    const allowed = ROLE_ALLOWED_ROUTES[user.role] || [];
    return allowed.some((r) => href === r || href.startsWith(r + "/") || r.startsWith(href));
  };

  const visibleItems = navItems.filter((item) => {
    if (item.href) return isRouteAllowed(item.href);
    if (item.children) return item.children.some((c) => isRouteAllowed(c.href));
    return false;
  });

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-screen flex flex-col transition-all duration-300 ease-in-out",
          "bg-[#000000] dark:bg-[#001f42]",
          "border-r border-white/5 dark:border-[#00468E]/40",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center h-[64px] border-b border-white/10 shrink-0", collapsed ? "justify-center px-3" : "justify-between px-2")}>
          {!collapsed && (
            <Link href="/dashboard/super-admin" className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0 bg-white py-1" style={{ borderRadius: "3px" }}>
                <img src="https://schoolfee.in/logo/schoolfee%20logo.webp" alt="Schoolfee" className="h-8 w-auto object-contain" />
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard/super-admin">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="https://schoolfee.in/logo/schoolfee.webp" alt="SF" className="object-contain" />
              </div>
            </Link>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 h-7 w-7 shrink-0" onClick={onToggle}>
              <PanelLeftClose className="h-8 w-8" />
            </Button>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full py-3">
            <nav className="space-y-0.5 px-2">
              {visibleItems.map((item) => {
                const Icon = item.icon;

                if (item.children) {
                  const visibleChildren = item.children.filter((c) => isRouteAllowed(c.href));
                  if (!visibleChildren.length) return null;

                  const isOpen = openMenus.includes(item.label);
                  const isAnyChildActive = visibleChildren.some((c) => isActive(c.href));

                  if (collapsed) {
                    return (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                          <button
                            className={cn("w-full flex items-center justify-center h-10 rounded-lg transition-all", isAnyChildActive ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white")}
                            onClick={() => toggleMenu(item.label)}
                          >
                            <Icon className="h-[18px] w-[18px]" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-950 text-white border-gray-800 text-xs">{item.label}</TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <div key={item.label}>
                      <button
                        className={cn("w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium transition-all", isAnyChildActive ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white")}
                        onClick={() => toggleMenu(item.label)}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isOpen ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                      </button>
                      {isOpen && (
                        <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                          {visibleChildren.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn("flex items-center h-8 px-2 rounded-md text-sm transition-all", isActive(child.href) ? "bg-[#00468E] text-white font-semibold" : "text-white/55 hover:text-white hover:bg-white/10")}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (collapsed) {
                  return (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <Link href={item.href!} className={cn("w-full flex items-center justify-center h-10 rounded-lg transition-all", isActive(item.href, item.exact) ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white")}>
                          <Icon className="h-[18px] w-[18px]" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-950 text-white border-gray-800 text-xs">{item.label}</TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <Link key={item.label} href={item.href!}
                    className={cn("flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium transition-all", isActive(item.href, item.exact) ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white")}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isActive(item.href, item.exact) && <div className="w-1.5 h-1.5 rounded-full bg-[#00468E]/60 shrink-0" />}
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
              <p className="text-[11px] font-semibold text-white/90">Schoolfee Admin Panel</p>
              <p className="text-[10px] text-white/45 mt-0.5">Interest-free education support</p>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-white/10 flex justify-center shrink-0">
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10 h-7 w-7" onClick={onToggle}>
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}