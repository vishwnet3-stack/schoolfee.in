"use client";

import {
  createContext, useContext, useEffect, useState, useCallback, ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export type DashboardRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "employee"
  | "parent"
  | "teacher"
  | "school"
  | "custom";

export interface DashboardUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: DashboardRole;
  status: string;
  permissions?: string[]; // for custom role
  last_login?: string;    // ISO date string from DB
  created_at?: string;    // ISO date string from DB
}

// ─── Route permissions by role ─────────────────────────────────────────────
// "super_admin" and "admin" see everything.
// Others see only whitelisted paths.
export const ROLE_ALLOWED_ROUTES: Record<string, string[]> = {
  manager: [
    "/dashboard/super-admin",
    "/dashboard/super-admin/analytics",
    "/dashboard/super-admin/schools",
    "/dashboard/super-admin/parents",
    "/dashboard/super-admin/teachers",
    "/dashboard/super-admin/employees",
    "/dashboard/super-admin/payments",
    "/dashboard/super-admin/forms",
    "/dashboard/super-admin/reports",
    "/dashboard/super-admin/notifications",
    "/dashboard/super-admin/profile",
  ],
  employee: [
    "/dashboard/super-admin",
    "/dashboard/super-admin/schools",
    "/dashboard/super-admin/parents",
    "/dashboard/super-admin/teachers",
    "/dashboard/super-admin/forms",
    "/dashboard/super-admin/notifications",
    "/dashboard/super-admin/profile",
  ],
  parent: [
    "/dashboard/super-admin",
    "/dashboard/super-admin/notifications",
    "/dashboard/super-admin/profile",
  ],
  teacher: [
    "/dashboard/super-admin",
    "/dashboard/super-admin/teachers",
    "/dashboard/super-admin/notifications",
    "/dashboard/super-admin/profile",
  ],
  school: [
    "/dashboard/super-admin",
    "/dashboard/super-admin/schools",
    "/dashboard/super-admin/notifications",
    "/dashboard/super-admin/profile",
  ],
  custom: [], // populated from permissions
};

// ─── Action permissions by role ────────────────────────────────────────────
export const ROLE_ACTIONS: Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canManageUsers: boolean }> = {
  super_admin: { canCreate: true,  canEdit: true,  canDelete: true,  canManageUsers: true  },
  admin:       { canCreate: true,  canEdit: true,  canDelete: true,  canManageUsers: true  },
  manager:     { canCreate: true,  canEdit: true,  canDelete: false, canManageUsers: false },
  employee:    { canCreate: false, canEdit: false, canDelete: false, canManageUsers: false },
  parent:      { canCreate: false, canEdit: false, canDelete: false, canManageUsers: false },
  teacher:     { canCreate: false, canEdit: false, canDelete: false, canManageUsers: false },
  school:      { canCreate: false, canEdit: false, canDelete: false, canManageUsers: false },
  custom:      { canCreate: false, canEdit: false, canDelete: false, canManageUsers: false },
};

// ─── Context ────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: DashboardUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  canAccess: (path: string) => boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
  refresh: async () => {},
  canAccess: () => false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canManageUsers: false,
});

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) { setUser(data.user); return data.user; }
      }
    } catch {}
    setUser(null);
    return null;
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const u = await fetchUser();
      setLoading(false);
      // If not logged in and not on login page, redirect
      const isLoginPage = pathname === "/dashboard/super-admin/login";
      if (!u && !isLoginPage) {
        router.replace("/dashboard/super-admin/login");
      }
    };
    init();
  }, []); // eslint-disable-line

  // Check route access for current user
  const canAccess = useCallback(
    (path: string): boolean => {
      if (!user) return false;
      if (user.role === "super_admin" || user.role === "admin") return true;
      const allowed = ROLE_ALLOWED_ROUTES[user.role] || [];
      return allowed.some((r) => path === r || path.startsWith(r + "/"));
    },
    [user]
  );

  const logout = async () => {
    await fetch("/api/dashboard/auth/logout", { method: "POST" });
    setUser(null);
    router.replace("/dashboard/super-admin/login");
  };

  const actions = ROLE_ACTIONS[user?.role || "employee"];

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        refresh: fetchUser,
        canAccess,
        canCreate: actions?.canCreate ?? false,
        canEdit:   actions?.canEdit   ?? false,
        canDelete: actions?.canDelete ?? false,
        canManageUsers: actions?.canManageUsers ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useDashboardAuth() {
  return useContext(AuthContext);
}