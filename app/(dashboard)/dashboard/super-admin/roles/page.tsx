"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "../components/PageHeader";

const roles = [
  { id: "admin", name: "Admin", description: "Full system access", color: "bg-red-100 text-red-700", count: 8 },
  { id: "manager", name: "Manager", description: "Manage regions and teams", color: "bg-purple-100 text-purple-700", count: 28 },
  { id: "employee", name: "Employee", description: "Operational tasks", color: "bg-blue-100 text-blue-700", count: 142 },
  { id: "normal", name: "Normal User", description: "Basic platform access", color: "bg-gray-100 text-gray-600", count: 3240 },
  { id: "custom", name: "Custom User", description: "Customizable permissions", color: "bg-orange-100 text-orange-700", count: 95 },
];

const permissionGroups = [
  {
    group: "Employees",
    permissions: ["View Employees", "Manage Employees", "Assign Employees"],
  },
  {
    group: "Schools",
    permissions: ["View Schools", "Manage Schools", "Add Schools"],
  },
  {
    group: "Parents",
    permissions: ["View Parents", "Manage Parents", "Contact Parents"],
  },
  {
    group: "Payments",
    permissions: ["View Payments", "Manage Payments", "Export Payments"],
  },
  {
    group: "Reports",
    permissions: ["View Reports", "Export Reports", "Schedule Reports"],
  },
];

const defaultPerms: Record<string, string[]> = {
  admin: permissionGroups.flatMap((g) => g.permissions),
  manager: ["View Employees", "Assign Employees", "View Schools", "View Parents", "Contact Parents", "View Payments", "View Reports"],
  employee: ["View Schools", "View Parents", "Contact Parents", "View Payments"],
  normal: ["View Schools"],
  custom: [],
};

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState("manager");
  const [perms, setPerms] = useState<Record<string, string[]>>(defaultPerms);

  const toggle = (perm: string) => {
    setPerms((prev) => ({
      ...prev,
      [selectedRole]: prev[selectedRole].includes(perm)
        ? prev[selectedRole].filter((p) => p !== perm)
        : [...prev[selectedRole], perm],
    }));
  };

  const hasPermission = (perm: string) => perms[selectedRole]?.includes(perm);

  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" description="Configure access rights for each role" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Cards */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Roles</p>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedRole === role.id
                  ? "border-[#00468E] bg-[#00468E]/5 dark:bg-[#00468E]/10 shadow-sm"
                  : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${role.color.split(" ")[0]}`}>
                    <Shield className={`h-4 w-4 ${role.color.split(" ")[1]}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">{role.name}</p>
                    <p className="text-xs text-gray-500">{role.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">{role.count}</Badge>
              </div>
            </button>
          ))}
        </div>

        {/* Permissions Panel */}
        <div className="lg:col-span-2">
          <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Permissions: {roles.find((r) => r.id === selectedRole)?.name}
                </CardTitle>
                <span className="text-sm text-gray-500">
                  {perms[selectedRole]?.length || 0} / {permissionGroups.flatMap((g) => g.permissions).length} enabled
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {permissionGroups.map((group, idx) => (
                <div key={group.group}>
                  {idx > 0 && <Separator className="mb-5" />}
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{group.group}</p>
                  <div className="space-y-2">
                    {group.permissions.map((perm) => (
                      <div
                        key={perm}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{perm}</p>
                        </div>
                        <Switch
                          checked={hasPermission(perm)}
                          onCheckedChange={() => toggle(perm)}
                          disabled={selectedRole === "admin"}
                          className="data-[state=checked]:bg-[#00468E]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {selectedRole === "admin" && (
                <p className="text-xs text-center text-gray-400 pt-2">Admin role has all permissions by default and cannot be modified.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}