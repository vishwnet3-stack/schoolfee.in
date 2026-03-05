import { useEffect, useState, useCallback } from "react";

export interface UserSession {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export function useAuthSession() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/public/auth/profile");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    // Listen for auth state changes fired by login / logout / register
    const handler = () => fetchProfile();
    window.addEventListener("auth-change", handler);
    return () => window.removeEventListener("auth-change", handler);
  }, [fetchProfile]);

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/public/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      setUser(null);
      // Broadcast to all mounted components
      window.dispatchEvent(new Event("auth-change"));
    }
  };

  return { user, isLoading, logout, refetch: fetchProfile };
}