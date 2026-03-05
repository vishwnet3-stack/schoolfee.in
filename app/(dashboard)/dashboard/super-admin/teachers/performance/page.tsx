"use client";

import { Star, TrendingUp, Award, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "../../components/PageHeader";

const teachers = [
  { name: "Sunita Pillai", school: "St. Xavier's School", subject: "English", rating: 4.9, students: 108, attendance: 98, feedback: 156, trend: "+0.2" },
  { name: "Dr. Meenakshi Rao", school: "Delhi Public School", subject: "Mathematics", rating: 4.8, students: 120, attendance: 97, feedback: 143, trend: "+0.3" },
  { name: "Priya Nambiar", school: "Sunrise Academy", subject: "Biology", rating: 4.7, students: 115, attendance: 95, feedback: 128, trend: "+0.1" },
  { name: "Arjun Das", school: "Delhi Public School", subject: "History", rating: 4.6, students: 140, attendance: 96, feedback: 134, trend: "0.0" },
  { name: "Rajesh Verma", school: "Kendriya Vidyalaya", subject: "Physics", rating: 4.5, students: 95, attendance: 94, feedback: 98, trend: "+0.1" },
  { name: "Amit Tiwari", school: "Sardar Patel School", subject: "Chemistry", rating: 3.9, students: 82, attendance: 88, feedback: 71, trend: "-0.2" },
];

export default function TeacherPerformancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Teacher Performance" description="Ratings, attendance, and student feedback overview" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg. Rating", value: "4.6", color: "text-[#F4951D]", icon: Star },
          { label: "Top Performer", value: "Sunita Pillai", color: "text-[#00468E]", icon: Award },
          { label: "Avg. Attendance", value: "94.7%", color: "text-emerald-600", icon: TrendingUp },
          { label: "Total Feedback", value: "730", color: "text-purple-600", icon: Users },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${s.color}`} />
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
              </div>
              <p className={`text-xl font-bold mt-1 ${s.color} truncate`}>{s.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3">
        {teachers.map((t, i) => (
          <Card key={t.name} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 shrink-0">
                  {i + 1}
                </div>
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-[#00468E]/10 text-[#00468E] text-xs font-bold">
                    {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{t.name}</p>
                    {i === 0 && (
                      <Badge className="bg-[#F4951D] text-white text-[10px] px-1.5 flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-white" /> Top
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{t.school} · {t.subject}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-center">
                  <div>
                    <div className="flex items-center gap-1 text-[#F4951D] font-bold text-sm">
                      <Star className="h-3.5 w-3.5 fill-[#F4951D]" />{t.rating}
                    </div>
                    <p className="text-[10px] text-gray-400">Rating</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800 dark:text-white">{t.attendance}%</p>
                    <p className="text-[10px] text-gray-400">Attendance</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800 dark:text-white">{t.students}</p>
                    <p className="text-[10px] text-gray-400">Students</p>
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${t.trend.startsWith("+") ? "text-emerald-600" : t.trend === "0.0" ? "text-gray-500" : "text-red-500"}`}>
                      {t.trend}
                    </p>
                    <p className="text-[10px] text-gray-400">Trend</p>
                  </div>
                </div>
                {/* Mobile rating */}
                <div className="flex sm:hidden items-center gap-1 text-[#F4951D] font-bold text-sm shrink-0">
                  <Star className="h-3.5 w-3.5 fill-[#F4951D]" />{t.rating}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}