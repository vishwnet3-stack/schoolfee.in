"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Globe, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";

interface PublicUser {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  status: string;
  created_at: string;
  last_login?: string;
}

export default function WebsiteUsersPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewUser, setViewUser] = useState<PublicUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, page: String(page), limit: "20" });
      const res = await fetch("/api/dashboard/public-users?" + params);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch website users:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  useEffect(() => { setPage(1); }, [search]);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Website Users"
        description={`${total} users registered on schoolfee.in`}
      >
        <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={fetchUsers} disabled={loading}>
          <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} />
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Registered</p>
              <p className="text-xl font-bold text-gray-800">{total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Users</p>
              <p className="text-xl font-bold text-gray-800">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm rounded-xl col-span-2 sm:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">This Page</p>
              <p className="text-xl font-bold text-gray-800">{users.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-gray-100 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Phone</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Registered</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Last Login</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="py-4 px-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <Globe className="h-12 w-12 opacity-30" />
                      <p className="font-medium">No website users found</p>
                      <p className="text-sm">{search ? "Try adjusting your search" : "No users have registered yet"}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs font-bold bg-[#00468E]/10 text-[#00468E]">
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{user.full_name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 hidden md:table-cell">{user.phone || "—"}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={user.status} /></td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs hidden lg:table-cell">{formatDate(user.created_at)}</td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs hidden lg:table-cell">
                      {user.last_login ? formatDate(user.last_login) : "Never"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {users.length} of {total} users</p>
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading}>Previous</Button>
            <span className="text-sm text-gray-600 px-2">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>Next</Button>
          </div>
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Website User Details</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-lg font-bold bg-[#00468E]/10 text-[#00468E]">
                    {getInitials(viewUser.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-800">{viewUser.full_name}</h3>
                  <p className="text-sm text-gray-500">{viewUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500 text-xs block">Phone</span><p className="font-medium">{viewUser.phone || "—"}</p></div>
                <div><span className="text-gray-500 text-xs block">Status</span><p><StatusBadge status={viewUser.status} /></p></div>
                <div><span className="text-gray-500 text-xs block">Registered</span><p className="font-medium">{formatDate(viewUser.created_at)}</p></div>
                <div><span className="text-gray-500 text-xs block">Last Login</span><p className="font-medium">{viewUser.last_login ? formatDate(viewUser.last_login) : "Never"}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}