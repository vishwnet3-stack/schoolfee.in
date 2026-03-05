"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDashboardAuth } from "./AuthContext";
import { ShieldX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, canAccess } = useDashboardAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/dashboard/super-admin/login";

  useEffect(() => {
    if (loading) return;
    if (!user && !isLoginPage) {
      router.replace("/dashboard/super-admin/login");
    }
  }, [user, loading, isLoginPage, router]);

  // Show nothing while checking auth on login page
  if (isLoginPage) return <>{children}</>;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#060f1e]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-[#00468E]" />
          <p className="text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null; // redirect is in effect
  }

  // Check route access
  if (!canAccess(pathname)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <ShieldX className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-500 text-sm">
            You don't have permission to access this page. Contact your administrator
            if you believe this is a mistake.
          </p>
          <Button
            className="bg-[#00468E] text-white"
            onClick={() => router.push("/dashboard/super-admin")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}