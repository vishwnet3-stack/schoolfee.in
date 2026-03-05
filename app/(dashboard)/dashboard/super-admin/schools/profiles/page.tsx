"use client";

import { useState } from "react";
import { Search, Building2, MapPin, Users, GraduationCap, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";

const schools = [
  { id: 1, name: "Delhi Public School", city: "New Delhi", state: "Delhi", principal: "Dr. Anand Kumar", phone: "+91 11 2345 6789", email: "principal@dps.edu.in", students: 1240, teachers: 68, established: "1972", board: "CBSE", status: "Active", paymentStatus: "Paid" },
  { id: 2, name: "Kendriya Vidyalaya", city: "Mumbai", state: "Maharashtra", principal: "Mrs. Rekha Sharma", phone: "+91 22 3456 7890", email: "kv.mumbai@kv.edu.in", students: 980, teachers: 52, established: "1985", board: "CBSE", status: "Active", paymentStatus: "Pending" },
  { id: 3, name: "St. Xavier's School", city: "Kolkata", state: "West Bengal", principal: "Fr. Thomas Paul", phone: "+91 33 4567 8901", email: "office@sxk.edu.in", students: 750, teachers: 41, established: "1948", board: "ICSE", status: "Active", paymentStatus: "Paid" },
  { id: 4, name: "Sardar Patel School", city: "Ahmedabad", state: "Gujarat", principal: "Mr. Girish Patel", phone: "+91 79 5678 9012", email: "sps@edu.in", students: 620, teachers: 34, established: "1995", board: "GSEB", status: "Inactive", paymentStatus: "Overdue" },
  { id: 5, name: "Sunrise Academy", city: "Bangalore", state: "Karnataka", principal: "Ms. Deepa Krishnan", phone: "+91 80 6789 0123", email: "admin@sunrise.edu.in", students: 890, teachers: 47, established: "2005", board: "CBSE", status: "Active", paymentStatus: "Paid" },
];

export default function SchoolProfilesPage() {
  const [search, setSearch] = useState("");
  const filtered = schools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="School Profiles" description="Detailed information for all registered schools" />

      <Card className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search schools..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((school) => (
          <Card key={school.id} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00468E]/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-[#00468E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{school.name}</h3>
                    <div className="flex gap-1.5">
                      <StatusBadge status={school.status} />
                      <StatusBadge status={school.paymentStatus} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" /> {school.city}, {school.state}
                    <span className="text-gray-300">·</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-0">{school.board}</Badge>
                    <span className="text-gray-300">·</span>
                    Est. {school.established}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <Users className="h-3.5 w-3.5 text-gray-400" /> Principal: <span className="font-medium text-gray-800 dark:text-white truncate">{school.principal}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <GraduationCap className="h-3.5 w-3.5 text-gray-400" /> {school.students} Students
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <Mail className="h-3.5 w-3.5 text-gray-400" /> <span className="truncate">{school.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <Phone className="h-3.5 w-3.5 text-gray-400" /> {school.teachers} Teachers
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                      <ExternalLink className="h-3 w-3" /> View Details
                    </Button>
                    <Button size="sm" className="h-7 text-xs bg-[#00468E] hover:bg-[#003570] text-white">Edit</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}