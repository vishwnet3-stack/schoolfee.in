"use client";

import {
  createContext, useContext, useEffect, useState, useCallback, ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export type AdminUserRole = "parent" | "teacher" | "school";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: AdminUserRole;
  status: string;
  created_at?: string;
}

// ─── Allowed route prefixes per role ────────────────────────────────────────
export const ROLE_ALLOWED_PREFIXES: Record<AdminUserRole, string[]> = {
  parent: ["/dashboard/admin/parent", "/dashboard/admin/login"],
  teacher: ["/dashboard/admin/teacher", "/dashboard/admin/login"],
  school: ["/dashboard/admin/school", "/dashboard/admin/login"],
};

export function isRouteAllowed(role: AdminUserRole, pathname: string): boolean {
  const allowed = ROLE_ALLOWED_PREFIXES[role] || [];
  return allowed.some(prefix => pathname === prefix || pathname.startsWith(prefix + "/"));
}

// ─── Nav config per role ────────────────────────────────────────────────────
export const ROLE_NAV: Record<AdminUserRole, { label: string; href: string; icon: string }[]> = {
  parent: [
    { label: "Overview", href: "/dashboard/admin/parent", icon: "LayoutDashboard" },
    { label: "CarePay Program", href: "/dashboard/admin/parent/program", icon: "Wallet" },
    { label: "Transactions", href: "/dashboard/admin/parent/transactions", icon: "CreditCard" },
    { label: "Repayment", href: "/dashboard/admin/parent/repayment", icon: "RefreshCw" },
    { label: "My Schools", href: "/dashboard/admin/parent/schools", icon: "School" },
    { label: "Notifications", href: "/dashboard/admin/parent/notifications", icon: "Bell" },
    { label: "Profile", href: "/dashboard/admin/parent/profile", icon: "User" },
    { label: "Settings", href: "/dashboard/admin/parent/settings", icon: "Settings" },
  ],
  teacher: [
    { label: "Overview", href: "/dashboard/admin/teacher", icon: "LayoutDashboard" },
    { label: "Students", href: "/dashboard/admin/teacher/students", icon: "Users" },
    { label: "Fee Tracking", href: "/dashboard/admin/teacher/payments", icon: "CreditCard" },
    { label: "Notifications", href: "/dashboard/admin/teacher/notifications", icon: "Bell" },
    { label: "Profile", href: "/dashboard/admin/teacher/profile", icon: "User" },
    { label: "Settings", href: "/dashboard/admin/teacher/settings", icon: "Settings" },
  ],
  school: [
    { label: "Overview", href: "/dashboard/admin/school", icon: "LayoutDashboard" },
    { label: "Fee Requests", href: "/dashboard/admin/school/requests", icon: "ClipboardList" },
    { label: "Payments", href: "/dashboard/admin/school/payments", icon: "CreditCard" },
    { label: "Students", href: "/dashboard/admin/school/students", icon: "Users" },
    { label: "Teacher Referrals", href: "/dashboard/admin/school/referrals", icon: "UserCheck" },
    { label: "Reports", href: "/dashboard/admin/school/reports", icon: "BarChart3" },
    { label: "Documents", href: "/dashboard/admin/school/documents", icon: "FolderOpen" },
    { label: "Activity Logs", href: "/dashboard/admin/school/activity", icon: "Activity" },
    { label: "Notifications", href: "/dashboard/admin/school/notifications", icon: "Bell" },
    { label: "Support", href: "/dashboard/admin/school/support", icon: "HelpCircle" },
    { label: "Profile", href: "/dashboard/admin/school/profile", icon: "Building2" },
    { label: "Settings", href: "/dashboard/admin/school/settings", icon: "Settings" },
  ]
};

export const ROLE_HOME: Record<AdminUserRole, string> = {
  parent: "/dashboard/admin/parent",
  teacher: "/dashboard/admin/teacher",
  school: "/dashboard/admin/school",
};

export const ROLE_LABELS: Record<AdminUserRole, string> = {
  parent: "Parent",
  teacher: "Teacher",
  school: "School",
};

export const ROLE_COLORS: Record<AdminUserRole, string> = {
  parent: "bg-emerald-600",
  teacher: "bg-purple-600",
  school: "bg-[#00468E]",
};

// ─── Context ────────────────────────────────────────────────────────────────
interface AdminAuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<AdminUser | null>;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  user: null,
  loading: true,
  logout: async () => { },
  refresh: async () => null,
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  // Track whether the very first fetch has completed
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async (): Promise<AdminUser | null> => {
    try {
      const res = await fetch("/api/admin-auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          return data.user;
        }
      }
    } catch { }
    setUser(null);
    return null;
  }, []);

  // ── Re-check session on every pathname change ────────────────────────────
  // This is the key fix: when the login page does router.replace() the pathname
  // changes, this effect fires, fetchUser() finds the now-set cookie, and sets
  // the user — so the dashboard renders without a manual page refresh.
  useEffect(() => {
    const init = async () => {
      const isLoginPage = pathname === "/dashboard/admin/login";
      setLoading(true);

      const u = await fetchUser();

      setLoading(false);
      setInitialized(true);

      if (!u) {
        if (!isLoginPage) router.replace("/dashboard/admin/login");
        return;
      }

      // Authenticated on login page → push to their home
      if (isLoginPage) {
        router.replace(ROLE_HOME[u.role]);
        return;
      }

      // Route guard: wrong role's section → redirect to their home
      if (!isRouteAllowed(u.role, pathname)) {
        router.replace(ROLE_HOME[u.role]);
      }
    };
    init();
    // pathname is intentionally in deps — re-run on every navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/admin-auth/logout", { method: "POST" });
    setUser(null);
    router.replace("/dashboard/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, logout, refresh: fetchUser }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}