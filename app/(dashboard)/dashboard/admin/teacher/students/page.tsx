"use client";

import { useState } from "react";
import {
  Search, CheckCircle2, Clock, Users, Download, Filter,
  AlertCircle, ChevronDown, Phone, Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const allStudents = [
  { id: 1, name: "Aryan Sharma", roll: "IX-A/01", class: "IX-A", fee: "paid", carepay: true, parent: "Rajesh Sharma", phone: "98765 43210", email: "rajesh@email.com", feeAmt: 16800, dueDate: "—" },
  { id: 2, name: "Priya Gupta", roll: "IX-A/02", class: "IX-A", fee: "paid", carepay: false, parent: "Suresh Gupta", phone: "98765 43211", email: "suresh@email.com", feeAmt: 16800, dueDate: "—" },
  { id: 3, name: "Rahul Verma", roll: "IX-A/03", class: "IX-A", fee: "pending", carepay: true, parent: "Mohan Verma", phone: "98765 43212", email: "mohan@email.com", feeAmt: 16800, dueDate: "May 2025" },
  { id: 4, name: "Sneha Patel", roll: "IX-A/04", class: "IX-A", fee: "paid", carepay: true, parent: "Ramesh Patel", phone: "98765 43213", email: "ramesh@email.com", feeAmt: 16800, dueDate: "—" },
  { id: 5, name: "Anita Singh", roll: "X-B/01", class: "X-B", fee: "paid", carepay: true, parent: "Ramesh Singh", phone: "98765 43214", email: "ramesh.s@email.com", feeAmt: 16800, dueDate: "—" },
  { id: 6, name: "Vikram Patel", roll: "X-B/02", class: "X-B", fee: "paid", carepay: false, parent: "Sunil Patel", phone: "98765 43215", email: "sunil@email.com", feeAmt: 16800, dueDate: "—" },
  { id: 7, name: "Meera Joshi", roll: "X-B/03", class: "X-B", fee: "pending", carepay: true, parent: "Vijay Joshi", phone: "98765 43216", email: "vijay@email.com", feeAmt: 16800, dueDate: "May 2025" },
  { id: 8, name: "Karan Mehta", roll: "X-B/04", class: "X-B", fee: "paid", carepay: false, parent: "Anil Mehta", phone: "98765 43217", email: "anil@email.com", feeAmt: 16800, dueDate: "—" },
  { id: 9, name: "Deepa Mishra", roll: "VIII-C/01", class: "VIII-C", fee: "pending", carepay: true, parent: "Kiran Mishra", phone: "98765 43218", email: "kiran@email.com", feeAmt: 14200, dueDate: "May 2025" },
  { id: 10, name: "Amit Kumar", roll: "VIII-C/02", class: "VIII-C", fee: "paid", carepay: true, parent: "Vijay Kumar", phone: "98765 43219", email: "vijay.k@email.com", feeAmt: 14200, dueDate: "—" },
  { id: 11, name: "Riya Shah", roll: "VIII-C/03", class: "VIII-C", fee: "paid", carepay: false, parent: "Arun Shah", phone: "98765 43220", email: "arun@email.com", feeAmt: 14200, dueDate: "—" },
  { id: 12, name: "Arjun Nair", roll: "X-B/05", class: "X-B", fee: "pending", carepay: true, parent: "Suresh Nair", phone: "98765 43221", email: "suresh.n@email.com", feeAmt: 16800, dueDate: "May 2025" },
];

const avatarColors = [
  "bg-[#00468E]/10 text-[#00468E]",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = allStudents.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q) || s.parent.toLowerCase().includes(q);
    const matchClass = classFilter === "all" || s.class === classFilter;
    const matchFee = feeFilter === "all" || s.fee === feeFilter;
    return matchSearch && matchClass && matchFee;
  });

  const paid = allStudents.filter(s => s.fee === "paid").length;
  const pending = allStudents.filter(s => s.fee === "pending").length;
  const carepay = allStudents.filter(s => s.carepay).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">All students across your 3 assigned classes</p>
        </div>
        <Button
          size="sm" variant="outline"
          className="border-[#00468E] text-[#00468E] hover:bg-[#00468E]/5 rounded-xl self-start sm:self-auto"
          onClick={() => toast.success("Student list exported!")}
        >
          <Download className="h-4 w-4 mr-1.5" /> Export List
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: allStudents.length, icon: Users, color: "text-[#00468E]", bg: "bg-[#00468E]/10 dark:bg-[#00468E]/20" },
          { label: "Fee Paid", value: paid, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
          { label: "Fee Pending", value: pending, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
          { label: "On CarePay", value: carepay, icon: Users, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={cardClass}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters + table */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by name, roll no, or parent..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm dark:bg-[#0d1f3c] dark:border-[#00468E]/30"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="h-9 w-[130px] text-xs dark:bg-[#0d1f3c] dark:border-[#00468E]/30">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="IX-A">Class IX-A</SelectItem>
                <SelectItem value="X-B">Class X-B</SelectItem>
                <SelectItem value="VIII-C">Class VIII-C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={feeFilter} onValueChange={setFeeFilter}>
              <SelectTrigger className="h-9 w-[130px] text-xs dark:bg-[#0d1f3c] dark:border-[#00468E]/30">
                <SelectValue placeholder="All Fees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fee Status</SelectItem>
                <SelectItem value="paid">Fee Paid</SelectItem>
                <SelectItem value="pending">Fee Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{filtered.length} student{filtered.length !== 1 ? "s" : ""} found</p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-gray-50 dark:divide-[#00468E]/10">
            {filtered.map((s, idx) => {
              const isExpanded = expandedId === s.id;
              const colorClass = avatarColors[idx % avatarColors.length];
              return (
                <div key={s.id}>
                  <div
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 cursor-pointer transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  >
                    {/* Avatar */}
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className={`text-xs font-bold ${colorClass}`}>
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name & Roll */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{s.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{s.roll} · Parent: {s.parent}</p>
                    </div>

                    {/* Class */}
                    <Badge className="bg-gray-100 dark:bg-[#00468E]/10 text-gray-600 dark:text-gray-300 border-0 text-xs hidden sm:flex">
                      {s.class}
                    </Badge>

                    {/* CarePay */}
                    {s.carepay && (
                      <Badge className="bg-[#00468E]/10 text-[#00468E] dark:text-blue-300 border-0 text-[10px] hidden md:flex">
                        CarePay
                      </Badge>
                    )}

                    {/* Fee status */}
                    <Badge className={`text-[10px] border-0 font-semibold shrink-0 ${
                      s.fee === "paid"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    }`}>
                      {s.fee === "paid"
                        ? <><CheckCircle2 className="h-3 w-3 mr-1" />Paid</>
                        : <><Clock className="h-3 w-3 mr-1" />Pending</>
                      }
                    </Badge>

                    <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-5 pb-4 bg-gray-50/60 dark:bg-[#00468E]/5 border-t border-gray-100 dark:border-[#00468E]/15">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        {/* Parent contact */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Parent Contact</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{s.parent}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" /> {s.phone}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" /> {s.email}
                          </p>
                        </div>
                        {/* Fee info */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Fee Details</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">Rs. {s.feeAmt.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {s.fee === "paid" ? "Paid for May 2025" : `Due: ${s.dueDate}`}
                          </p>
                          {s.carepay && (
                            <Badge className="bg-[#00468E]/10 text-[#00468E] dark:text-blue-300 border-0 text-[10px] mt-1.5">
                              Paid via Schoolfee CarePay
                            </Badge>
                          )}
                        </div>
                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Quick Actions</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-gray-200 dark:border-[#00468E]/30 rounded-lg"
                            onClick={() => toast.success(`Fee reminder sent to ${s.parent}`)}
                          >
                            {s.fee === "pending" ? "Send Reminder" : "View Receipt"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-[#00468E] hover:bg-[#00468E]/5 rounded-lg"
                            onClick={() => toast.success(`Calling ${s.phone}...`)}
                          >
                            Contact Parent
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Users className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No students match your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
