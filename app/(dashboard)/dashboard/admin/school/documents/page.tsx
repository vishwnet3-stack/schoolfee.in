"use client";

import { useState } from "react";
import {
  FolderOpen, Upload, Download, Eye, Trash2, File, FileText,
  ImageIcon, CheckCircle2, Search, Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

type DocCategory = "school" | "payment" | "student" | "application";

const documents = [
  { id: "DOC-001", name: "School Registration Certificate", category: "school" as DocCategory, type: "PDF", size: "2.4 MB", uploadedOn: "Jan 2024", status: "verified" },
  { id: "DOC-002", name: "Bank Account Verification", category: "school" as DocCategory, type: "PDF", size: "1.1 MB", uploadedOn: "Jan 2024", status: "verified" },
  { id: "DOC-003", name: "School Logo", category: "school" as DocCategory, type: "PNG", size: "0.5 MB", uploadedOn: "Jan 2024", status: "verified" },
  { id: "DOC-004", name: "Payment Receipt — May 2025", category: "payment" as DocCategory, type: "PDF", size: "0.8 MB", uploadedOn: "15 May 2025", status: "available" },
  { id: "DOC-005", name: "Payment Receipt — Apr 2025", category: "payment" as DocCategory, type: "PDF", size: "0.8 MB", uploadedOn: "15 Apr 2025", status: "available" },
  { id: "DOC-006", name: "Fee Receipt — Ravi Kumar", category: "student" as DocCategory, type: "PDF", size: "0.3 MB", uploadedOn: "Today", status: "pending" },
  { id: "DOC-007", name: "Fee Receipt — Nisha Patel", category: "student" as DocCategory, type: "PDF", size: "0.2 MB", uploadedOn: "Today", status: "available" },
  { id: "DOC-008", name: "Enrollment Proof — Arjun Mehta", category: "application" as DocCategory, type: "PDF", size: "0.6 MB", uploadedOn: "Yesterday", status: "available" },
  { id: "DOC-009", name: "Q1 2025 Payment Summary", category: "payment" as DocCategory, type: "XLSX", size: "1.2 MB", uploadedOn: "1 Apr 2025", status: "available" },
];

const catColors: Record<DocCategory, string> = {
  school: "bg-[#00468E]/10 text-[#00468E] dark:text-blue-300",
  payment: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  student: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  application: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
};

const fileIcon: Record<string, React.ElementType> = { PDF: FileText, PNG: ImageIcon, XLSX: File };

export default function SchoolDocumentsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = documents.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || d.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Document Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage all documents — school verification, payments, and student applications</p>
        </div>
        <Button size="sm" className="bg-[#00468E] hover:bg-[#003570] text-white rounded-xl self-start sm:self-auto"
          onClick={() => toast.success("File picker opening...")}>
          <Upload className="h-4 w-4 mr-1.5" /> Upload Document
        </Button>
      </div>

      {/* Category summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "School Documents", count: documents.filter(d => d.category === "school").length, cat: "school" as DocCategory },
          { label: "Payment Receipts", count: documents.filter(d => d.category === "payment").length, cat: "payment" as DocCategory },
          { label: "Student Docs", count: documents.filter(d => d.category === "student").length, cat: "student" as DocCategory },
          { label: "Applications", count: documents.filter(d => d.category === "application").length, cat: "application" as DocCategory },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setCatFilter(s.cat)}
            className={`text-left p-4 rounded-2xl border-2 transition-all ${catFilter === s.cat ? "border-[#00468E] bg-[#00468E]/5 dark:bg-[#00468E]/10" : "border-gray-100 dark:border-[#00468E]/20 bg-white dark:bg-[#0d1f3c] hover:border-[#00468E]/30"}`}
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.count}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Doc list */}
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm dark:bg-[#0d1f3c] dark:border-[#00468E]/30" />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="h-9 w-[160px] text-xs dark:bg-[#0d1f3c] dark:border-[#00468E]/30"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="school">School Docs</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="student">Student Docs</SelectItem>
                <SelectItem value="application">Applications</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50 dark:divide-[#00468E]/10">
            {filtered.map(doc => {
              const Icon = fileIcon[doc.type] || FileText;
              return (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#00468E]/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className={`text-[10px] border-0 ${catColors[doc.category]}`}>
                        {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-400">{doc.type} · {doc.size} · {doc.uploadedOn}</span>
                    </div>
                  </div>
                  <Badge className={`text-[10px] border-0 font-semibold shrink-0 ${
                    doc.status === "verified" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" :
                    doc.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" :
                    "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}>
                    {doc.status === "verified" ? <><CheckCircle2 className="h-3 w-3 mr-1" />Verified</> : doc.status === "pending" ? "Pending" : "Available"}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button className="w-8 h-8 rounded-lg bg-[#00468E]/10 text-[#00468E] flex items-center justify-center hover:bg-[#00468E]/20 transition-colors"
                      onClick={() => toast.success(`Viewing ${doc.name}...`)}>
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 dark:hover:bg-emerald-900/30 transition-colors"
                      onClick={() => toast.success(`Downloading ${doc.name}...`)}>
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
