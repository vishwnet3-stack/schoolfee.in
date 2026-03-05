"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function UserProfileDropdown() {
  const router = useRouter();
  const { user, logout } = useAuthSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const showDropdown = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setIsDropdownOpen(true);
  };

  const scheduleHide = () => {
    hideTimeout.current = setTimeout(() => setIsDropdownOpen(false), 150);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    const loadingId = toast.loading("Signing you out...");
    await logout();
    toast.dismiss(loadingId);
    toast.success("Logged out successfully", {
      description: "",
      duration: 4000,
    });
    router.push("/");
  };

  // ── Not logged in → show Login button ─────────────────────
  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center px-4 h-10 bg-gradient-to-r from-[#00468E] to-[#0066CC] hover:from-[#003a75] hover:to-[#0052a3] text-white shadow-md hover:shadow-lg transition-all rounded-md font-medium text-sm"
      >
        <User className="mr-2 h-4 w-4" />
        Login / Register
      </Link>
    );
  }

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ── Logged in → avatar button with chevron + dropdown ─────
  return (
    <div
      className="relative"
      onMouseEnter={showDropdown}
      onMouseLeave={scheduleHide}
    >
      {/* Trigger Button */}
      <button
        className="inline-flex items-center gap-2 px-3 h-10 border border-[#D0D0D0] rounded-lg hover:border-[#00468E] hover:shadow-md transition-all duration-200 bg-white"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        {/* Avatar circle */}
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#00468E] to-[#0056b3] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>

        {/* First name */}
        <span className="hidden sm:inline text-sm font-medium text-slate-700 truncate max-w-[100px]">
          {user.fullName.split(" ")[0]}
        </span>

        {/* Chevron — rotates when open */}
        <ChevronDown
          size={15}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Invisible bridge so mouse can travel from button to dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 h-3" />
      )}

      {/* Dropdown panel */}
      {isDropdownOpen && (
        <div
          onMouseEnter={showDropdown}
          onMouseLeave={scheduleHide}
          className="absolute right-0 mt-2 left-0 w-56 bg-white rounded-xl shadow-xl border border-[#E0E0E0] py-2 z-50"
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#00468E] to-[#0056b3] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* View Profile */}
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors text-slate-700 text-sm"
            onClick={() => setIsDropdownOpen(false)}
          >
            <User size={16} className="text-[#00468E] flex-shrink-0" />
            View Profile
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FFEBEE] transition-colors text-[#D32F2F] text-sm border-t border-[#F0F0F0]"
          >
            <LogOut size={16} className="flex-shrink-0" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}