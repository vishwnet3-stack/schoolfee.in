"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Globe,
  Users,
  UserCheck,
  LayoutList,
  RefreshCw,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

/* ─────────────────────────────────────────
   Types — matches exact DB schema
───────────────────────────────────────── */
interface PublicUser {
  id: number;
  full_name: string;
  email: string;
  is_active: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  active: number;
  pageCount: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-[#00468E]",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-600",
  "bg-indigo-600",
  "bg-teal-600",
];

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

/* ─────────────────────────────────────────
   Stat Card
───────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function WebsiteUsersPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, pageCount: 0 });
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/dashboard/public-users?search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=20`
        );
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to load users");
        setUsers(data.users);
        setStats(data.stats);
        setPagination(data.pagination);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Website Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            All users registered on schoolfee.in
          </p>
        </div>
        <button
          onClick={() => fetchUsers(pagination.page)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#00468E]/30 bg-white dark:bg-[#0d1f3c] rounded-xl hover:border-[#00468E] hover:text-[#00468E] transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total Registered"
          value={stats.total}
          iconBg="bg-blue-50 dark:bg-[#00468E]/20"
          iconColor="text-[#00468E] dark:text-blue-400"
        />
        <StatCard
          icon={UserCheck}
          label="Active Users"
          value={stats.active}
          iconBg="bg-emerald-50 dark:bg-emerald-900/25"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={LayoutList}
          label="This Page"
          value={stats.pageCount}
          iconBg="bg-amber-50 dark:bg-amber-900/25"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* ── Table card ── */}
      <div className="bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 rounded-2xl shadow-sm overflow-hidden">

        {/* Search */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-[#00468E]/15">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-[#001833] border border-gray-200 dark:border-[#00468E]/25 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00468E]/25 focus:border-[#00468E] transition-all"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 my-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">Failed to load users</p>
              <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="divide-y divide-gray-100 dark:divide-[#00468E]/10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#001833] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 dark:bg-[#001833] rounded w-36" />
                  <div className="h-3 bg-gray-100 dark:bg-[#001833] rounded w-52" />
                </div>
                <div className="hidden md:block h-6 bg-gray-100 dark:bg-[#001833] rounded-full w-16" />
                <div className="hidden lg:block h-3 bg-gray-100 dark:bg-[#001833] rounded w-24" />
                <div className="hidden xl:block h-3 bg-gray-100 dark:bg-[#001833] rounded w-24" />
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#001833] flex items-center justify-center mb-4">
                  <Globe className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  {debouncedSearch ? "No matching users" : "No website users found"}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {debouncedSearch
                    ? "Try a different name or email"
                    : "Users who register on schoolfee.in will appear here"}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-[#00468E]/15 bg-gray-50/70 dark:bg-[#001833]/50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          User
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Registered
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-[#00468E]/10">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50/70 dark:hover:bg-[#001833]/50 transition-colors"
                        >
                          {/* User */}
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColor(user.id)}`}
                              >
                                {getInitials(user.full_name)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                                  {user.full_name}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Mail className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{user.email}</span>
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Status — from is_active */}
                          <td className="px-4 py-3.5">
                            {user.is_active === 1 ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                                <CheckCircle2 className="h-3 w-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700/40">
                                <XCircle className="h-3 w-3" />
                                Inactive
                              </span>
                            )}
                          </td>

                          {/* Registered */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3.5 w-3.5 shrink-0" />
                              {formatDate(user.created_at)}
                            </div>
                          </td>

                          {/* Last Updated */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              {formatDate(user.updated_at)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card list */}
                <div className="md:hidden divide-y divide-gray-100 dark:divide-[#00468E]/10">
                  {users.map((user) => (
                    <div key={user.id} className="px-5 py-4 flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 ${avatarColor(user.id)}`}
                      >
                        {getInitials(user.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {user.full_name}
                          </p>
                          {user.is_active === 1 ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(user.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 dark:border-[#00468E]/15 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {pagination.total}
              </span>{" "}
              users
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-[#00468E]/25 text-gray-500 hover:border-[#00468E] hover:text-[#00468E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => fetchUsers(p)}
                    className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold border transition-colors ${
                      pagination.page === p
                        ? "bg-[#00468E] text-white border-[#00468E] shadow-sm"
                        : "border-gray-200 dark:border-[#00468E]/25 text-gray-600 dark:text-gray-300 hover:border-[#00468E] hover:text-[#00468E]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-[#00468E]/25 text-gray-500 hover:border-[#00468E] hover:text-[#00468E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}