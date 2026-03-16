"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth, ROLE_HOME } from "./Adminauthcontext";

export default function AdminRootPage() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/dashboard/admin/login"); return; }
    router.replace(ROLE_HOME[user.role]);
  }, [user, loading, router]);

  return null;
}