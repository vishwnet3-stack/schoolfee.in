"use client";

import { TrendingUp, UserPlus, School, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";

const enrollments = [
  { id: "ENR001", student: "Rahul Sharma", parent: "Suresh Sharma", school: "Delhi Public School", class: "Class 7-A", date: "2024-05-22", status: "Approved" },
  { id: "ENR002", student: "Priya Gupta", parent: "Ramesh Gupta", school: "Sunrise Academy", class: "Class 5-B", date: "2024-05-21", status: "Pending" },
  { id: "ENR003", student: "Ananya Singh", parent: "Vikram Singh", school: "Kendriya Vidyalaya", class: "Class 9-A", date: "2024-05-20", status: "Approved" },
  { id: "ENR004", student: "Rohan Patel", parent: "Mahesh Patel", school: "St. Xavier's School", class: "Class 11-Sci", date: "2024-05-19", status: "Rejected" },
  { id: "ENR005", student: "Deepika Nair", parent: "Sanjay Nair", school: "Sunrise Academy", class: "Class 3-A", date: "2024-05-18", status: "Pending" },
];

export default function EnrollmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="School Enrollments" description="Track new student enrollment requests across schools">
        <Button className="bg-[#00468E] hover:bg-[#003570] text-white h-9 gap-1.5">
          <UserPlus className="h-4 w-4" /> New Enrollment
        </Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total This Month", value: enrollments.length, icon: UserPlus, color: "text-[#00468E]", bg: "bg-[#00468E]/10" },
          { label: "Approved", value: enrollments.filter(e => e.status === "Approved").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Pending Review", value: enrollments.filter(e => e.status === "Pending").length, icon: TrendingUp, color: "text-[#F4951D]", bg: "bg-[#F4951D]/10" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">School</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Class</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3.5 px-4 text-xs font-mono text-gray-400">{e.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-800 dark:text-white">{e.student}</p>
                    <p className="text-xs text-gray-500">Parent: {e.parent}</p>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 hidden md:table-cell text-sm">{e.school}</td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell text-sm">{e.class}</td>
                  <td className="py-3.5 px-4"><StatusBadge status={e.status} /></td>
                  <td className="py-3.5 px-4">
                    <div className="flex justify-end gap-2">
                      {e.status === "Pending" && (
                        <>
                          <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">Approve</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                        </>
                      )}
                      {e.status !== "Pending" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs">View</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}