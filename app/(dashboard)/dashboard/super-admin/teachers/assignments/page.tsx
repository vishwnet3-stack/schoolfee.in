"use client";

import { useState } from "react";
import { Search, Plus, BookOpen, School, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "../../components/PageHeader";

const assignments = [
  { teacher: "Dr. Meenakshi Rao", school: "Delhi Public School", classes: ["10-A", "10-B", "11-Sci", "12-Sci", "9-A"], subject: "Mathematics", since: "Aug 2022" },
  { teacher: "Rajesh Verma", school: "Kendriya Vidyalaya", classes: ["11-Sci", "12-Sci", "10-A", "9-B"], subject: "Physics", since: "Jan 2023" },
  { teacher: "Sunita Pillai", school: "St. Xavier's School", classes: ["8-A", "8-B", "9-A", "9-B", "10-A", "10-B"], subject: "English Literature", since: "Jun 2020" },
  { teacher: "Priya Nambiar", school: "Sunrise Academy", classes: ["11-Sci", "12-Sci", "10-A", "9-A", "8-A"], subject: "Biology", since: "Apr 2021" },
  { teacher: "Arjun Das", school: "Delhi Public School", classes: ["9-A", "9-B", "10-A", "10-B", "11-Arts", "12-Arts", "8-A"], subject: "History", since: "Mar 2022" },
];

export default function TeacherAssignmentsPage() {
  const [search, setSearch] = useState("");
  const filtered = assignments.filter((a) =>
    a.teacher.toLowerCase().includes(search.toLowerCase()) || a.school.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader title="Teacher Assignments" description="View and manage class assignments for each teacher" />

      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search teachers or schools..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <Button className="bg-[#00468E] hover:bg-[#003570] text-white h-9 gap-1.5">
            <Plus className="h-4 w-4" /> Assign Class
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.map((a, i) => (
          <Card key={i} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-[#00468E]/10 text-[#00468E] font-bold text-sm">
                    {a.teacher.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-800 dark:text-white">{a.teacher}</p>
                    <Badge variant="secondary" className="text-xs bg-[#F4951D]/10 text-[#F4951D] border-0">{a.subject}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <School className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-xs text-gray-500">{a.school} · Since {a.since}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {a.classes.map((cls) => (
                      <span key={cls} className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                        {cls}
                      </span>
                    ))}
                    <button className="inline-flex items-center px-2.5 py-0.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-xs text-gray-400 hover:border-[#00468E] hover:text-[#00468E] transition-colors gap-1">
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                  <BookOpen className="h-3.5 w-3.5" />
                  {a.classes.length} classes
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}