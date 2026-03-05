"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal, GraduationCap, Star, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";

const mockTeachers = [
  { id: 1, name: "Dr. Meenakshi Rao", email: "meenakshi@dps.edu.in", subject: "Mathematics", school: "Delhi Public School", students: 120, classes: 5, status: "Active", rating: 4.8, experience: "12 years" },
  { id: 2, name: "Rajesh Verma", email: "rajesh@kv.edu.in", subject: "Physics", school: "Kendriya Vidyalaya", students: 95, classes: 4, status: "Active", rating: 4.5, experience: "8 years" },
  { id: 3, name: "Sunita Pillai", email: "sunita@xavier.edu.in", subject: "English Literature", school: "St. Xavier's School", students: 108, classes: 6, status: "Active", rating: 4.9, experience: "15 years" },
  { id: 4, name: "Amit Tiwari", email: "amit@sp.edu.in", subject: "Chemistry", school: "Sardar Patel School", students: 82, classes: 3, status: "Inactive", rating: 3.9, experience: "5 years" },
  { id: 5, name: "Priya Nambiar", email: "priya@sunrise.edu.in", subject: "Biology", school: "Sunrise Academy", students: 115, classes: 5, status: "Active", rating: 4.7, experience: "10 years" },
  { id: 6, name: "Arjun Das", email: "arjun@dps.edu.in", subject: "History", school: "Delhi Public School", students: 140, classes: 7, status: "Active", rating: 4.6, experience: "9 years" },
];

export default function TeachersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockTeachers.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()) || t.school.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Teachers" description={`${mockTeachers.length} teachers across all schools`}>
        <Button className="bg-[#00468E] hover:bg-[#003570] text-white h-9 gap-1.5">
          <Plus className="h-4 w-4" /> Add Teacher
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Teachers", value: mockTeachers.length, color: "text-[#00468E]" },
          { label: "Active", value: mockTeachers.filter(t => t.status === "Active").length, color: "text-emerald-600" },
          { label: "Avg. Rating", value: "4.6 ★", color: "text-[#F4951D]" },
          { label: "Total Students", value: mockTeachers.reduce((s, t) => s + t.students, 0), color: "text-purple-600" },
        ].map((s) => (
          <Card key={s.label} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4">
            <p className="text-xs font-medium text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by name, subject, school..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Teacher</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">School</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Subject</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Students</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Rating</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((teacher) => (
                <tr key={teacher.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs font-bold bg-[#00468E]/10 text-[#00468E]">
                          {teacher.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{teacher.name}</p>
                        <p className="text-xs text-gray-500">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 hidden md:table-cell text-sm">{teacher.school}</td>
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <Badge variant="secondary" className="text-xs font-medium bg-[#00468E]/10 text-[#00468E] dark:bg-[#00468E]/20 dark:text-blue-300 border-0">
                      {teacher.subject}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      {teacher.students}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-[#F4951D] font-semibold text-sm">
                      <Star className="h-3.5 w-3.5 fill-[#F4951D]" />
                      {teacher.rating}
                    </div>
                  </td>
                  <td className="py-3.5 px-4"><StatusBadge status={teacher.status} /></td>
                  <td className="py-3.5 px-4">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>View Classes</DropdownMenuItem>
                          <DropdownMenuItem>Performance Report</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filtered.length} of {mockTeachers.length} teachers</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}