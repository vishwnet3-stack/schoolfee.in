"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { mockEmployees } from "../components/mock-data";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockEmployees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Employees" description={`${mockEmployees.length} employees on platform`}>
        <Button className="bg-[#00468E] hover:bg-[#003570] text-white h-9 gap-1.5">
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: mockEmployees.length, color: "text-gray-900 dark:text-white" },
          { label: "Active", value: mockEmployees.filter((e) => e.status === "Active").length, color: "text-emerald-600" },
          { label: "Inactive", value: mockEmployees.filter((e) => e.status === "Inactive").length, color: "text-red-600" },
          { label: "Avg Performance", value: `${Math.round(mockEmployees.reduce((sum, e) => sum + e.performance, 0) / mockEmployees.length)}%`, color: "text-[#00468E]" },
        ].map((s) => (
          <Card key={s.label} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4">
            <p className="text-xs font-medium text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm max-w-sm" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((emp) => (
          <Card key={emp.id} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="font-bold bg-[#00468E]/10 text-[#00468E]">
                      {emp.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{emp.name}</p>
                    <p className="text-sm text-gray-500">{emp.email}</p>
                    <p className="text-xs text-[#00468E] font-medium mt-0.5">{emp.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={emp.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Assigned Schools</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{emp.assignedSchools}</p>
                  <p className="text-xs text-gray-500">Schools</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{emp.assignedParents}</p>
                  <p className="text-xs text-gray-500">Parents</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-lg font-bold text-[#00468E]">{emp.performance}%</p>
                  </div>
                  <p className="text-xs text-gray-500">Performance</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00468E] to-[#F4951D] transition-all"
                    style={{ width: `${emp.performance}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}