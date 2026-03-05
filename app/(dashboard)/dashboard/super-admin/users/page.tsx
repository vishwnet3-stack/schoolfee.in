"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, MoreHorizontal, Eye, Pencil, Trash2,
  RefreshCw, UserCheck, Users, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { useDashboardAuth } from "../components/AuthContext";

const ROLE_COLORS: Record<string, string> = {
  parent: "bg-emerald-100 text-emerald-700",
  teacher: "bg-blue-100 text-blue-700",
  school: "bg-purple-100 text-purple-700",
  manager: "bg-amber-100 text-amber-700",
  employee: "bg-gray-100 text-gray-700",
  admin: "bg-red-100 text-red-700",
  custom: "bg-indigo-100 text-indigo-700",
  super_admin: "bg-blue-900 text-white",
};

function RoleBadge({ role }: { role: string }) {
  const label = role === "super_admin" ? "Super Admin" : role.charAt(0).toUpperCase() + role.slice(1);
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[role] || "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
}

// Inline dropdown that works reliably
function ActionMenu({ onView, onEdit, onDelete, canEdit, canDelete }: {
  onView: () => void; onEdit: () => void; onDelete: () => void;
  canEdit: boolean; canDelete: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const handler = (e: MouseEvent) => {
      if (!node.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen((o) => !o)}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden z-50">
          <button onClick={() => { onView(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          {canEdit && (
            <button onClick={() => { onEdit(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          )}
          {canDelete && (
            <>
              <div className="h-px bg-gray-100 dark:bg-gray-800" />
              <button onClick={() => { onDelete(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface DashboardUser {
  id: number; name: string; email: string; phone?: string;
  role: string; status: string; created_at: string; last_login?: string;
}

export default function UsersPage() {
  const { canCreate, canEdit, canDelete, canManageUsers } = useDashboardAuth();
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editUser, setEditUser] = useState<DashboardUser | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", role: "", status: "" });
  const [deleteUser, setDeleteUser] = useState<DashboardUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewUser, setViewUser] = useState<DashboardUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, role: roleFilter, status: statusFilter, page: String(page), limit: "15" });
      const res = await fetch("/api/dashboard/users?" + params);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  useEffect(() => { setPage(1); }, [search, roleFilter, statusFilter]);

  const openEdit = (user: DashboardUser) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, phone: user.phone || "", role: user.role, status: user.status });
    setEditError("");
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    setEditLoading(true);
    setEditError("");
    try {
      const res = await fetch("/api/dashboard/users/" + editUser.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) { setEditUser(null); fetchUsers(); }
      else setEditError(data.error || "Update failed");
    } catch { setEditError("Something went wrong"); }
    finally { setEditLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/dashboard/users/" + deleteUser.id, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { setDeleteUser(null); fetchUsers(); }
    } catch (err) { console.error("Delete failed:", err); }
    finally { setDeleteLoading(false); }
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description={`${total} total users`}>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} />
          </Button>
          {canManageUsers && (
            <Link href="/dashboard/super-admin/users/create">
              <Button className="bg-[#00468E] hover:bg-[#003570] text-white h-9 gap-1.5">
                <Plus className="h-4 w-4" /> Create User
              </Button>
            </Link>
          )}
        </div>
      </PageHeader>

      {/* Permission info for non-admin roles */}
      {(!canEdit || !canDelete) && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 rounded-xl text-sm">
          <ShieldAlert className="h-4 w-4 flex-shrink-0" />
          <span>
            Your role has limited permissions —{" "}
            {!canEdit && !canDelete ? "view only" : !canDelete ? "no delete access" : "no edit access"}.
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["parent", "teacher", "school", "manager"].map((role) => (
          <Card key={role} className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={"p-2 rounded-lg " + ROLE_COLORS[role]}>
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 capitalize">{role}s</p>
                <p className="text-xl font-bold text-gray-800">{users.filter((u) => u.role === role).length}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-gray-100 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by name, email or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[150px] h-9 text-sm"><SelectValue placeholder="All Roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
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
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Created</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="py-4 px-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <UserCheck className="h-12 w-12 opacity-30" />
                      <p className="font-medium">No users found</p>
                      <p className="text-sm">{search || roleFilter !== "all" || statusFilter !== "all" ? "Try adjusting your filters" : "Create your first user"}</p>
                    </div>
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs font-bold bg-[#00468E]/10 text-[#00468E]">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 hidden md:table-cell">{user.phone || "—"}</td>
                  <td className="py-3.5 px-4"><RoleBadge role={user.role} /></td>
                  <td className="py-3.5 px-4"><StatusBadge status={user.status} /></td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs hidden lg:table-cell">{formatDate(user.created_at)}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex justify-end">
                      <ActionMenu
                        onView={() => setViewUser(user)}
                        onEdit={() => openEdit(user)}
                        onDelete={() => setDeleteUser(user)}
                        canEdit={canEdit}
                        canDelete={canDelete}
                      />
                    </div>
                  </td>
                </tr>
              ))}
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
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-lg font-bold bg-[#00468E]/10 text-[#00468E]">{getInitials(viewUser.name)}</AvatarFallback>
                </Avatar>
                <div><h3 className="font-semibold text-gray-800">{viewUser.name}</h3><p className="text-sm text-gray-500">{viewUser.email}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Phone</span><p className="font-medium">{viewUser.phone || "—"}</p></div>
                <div><span className="text-gray-500">Role</span><p><RoleBadge role={viewUser.role} /></p></div>
                <div><span className="text-gray-500">Status</span><p><StatusBadge status={viewUser.status} /></p></div>
                <div><span className="text-gray-500">Created</span><p className="font-medium">{formatDate(viewUser.created_at)}</p></div>
                {viewUser.last_login && <div className="col-span-2"><span className="text-gray-500">Last Login</span><p className="font-medium">{formatDate(viewUser.last_login)}</p></div>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {editError && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{editError}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label>Full Name</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Email</Label>
                <Input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={editForm.role} onValueChange={(v) => setEditForm((f) => ({ ...f, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button className="bg-[#00468E] hover:bg-[#003570] text-white" onClick={handleEditSave} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete User</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600">Are you sure you want to delete <strong>{deleteUser?.name}</strong>? This action cannot be undone.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}