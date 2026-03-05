"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Download, RefreshCw, ClipboardList, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PageHeader } from "../components/PageHeader";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewed: "bg-amber-100 text-amber-700",
  contacted: "bg-purple-100 text-purple-700",
  completed: "bg-emerald-100 text-emerald-700",
};

function SurveyStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

interface SurveyRow {
  id: number;
  father_name?: string;
  mother_name?: string;
  guardian_name?: string;
  email: string;
  mobile_number: string;
  state: string;
  family_type: string;
  number_of_children: string;
  monthly_income: string;
  income_source: string;
  delay_in_fee: string;
  borrowing_source: string;
  preferred_duration: string;
  status: string;
  school_type_quantity: Record<string, number>;
  school_incidents: string[];
  borrowing_details: Record<string, string>;
  admin_notes?: string;
  created_at: string;
}

export default function FormsPage() {
  const [surveys, setSurveys] = useState<SurveyRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [delayFilter, setDelayFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [viewSurvey, setViewSurvey] = useState<SurveyRow | null>(null);
  const [editSurvey, setEditSurvey] = useState<SurveyRow | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        state: stateFilter,
        status: statusFilter,
        delayInFee: delayFilter,
        page: String(page),
        limit: "20",
      });
      const res = await fetch("/api/dashboard/survey-submissions?" + params);
      const data = await res.json();
      if (data.success) {
        setSurveys(data.surveys);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch surveys:", err);
    } finally {
      setLoading(false);
    }
  }, [search, stateFilter, statusFilter, delayFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchSurveys, 300);
    return () => clearTimeout(t);
  }, [fetchSurveys]);

  useEffect(() => { setPage(1); }, [search, stateFilter, statusFilter, delayFilter]);

  const openEdit = (survey: SurveyRow) => {
    setEditSurvey(survey);
    setEditStatus(survey.status);
    setEditNotes(survey.admin_notes || "");
  };

  const handleEditSave = async () => {
    if (!editSurvey) return;
    setEditLoading(true);
    try {
      const res = await fetch("/api/dashboard/survey-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId: editSurvey.id, status: editStatus, adminNotes: editNotes }),
      });
      const data = await res.json();
      if (data.success) { setEditSurvey(null); fetchSurveys(); }
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  const getPrimaryName = (s: SurveyRow) =>
    s.father_name || s.mother_name || s.guardian_name || "—";

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const exportCSV = () => {
    const headers = ["ID", "Name", "Email", "Mobile", "State", "Family Type", "Children", "Monthly Income", "Fee Delay", "Status", "Submitted"];
    const rows = surveys.map((s) => [
      s.id, getPrimaryName(s), s.email, s.mobile_number, s.state,
      s.family_type, s.number_of_children, s.monthly_income, s.delay_in_fee,
      s.status, formatDate(s.created_at),
    ]);
    const csv = [headers, ...rows].map((r) => r.map(String).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `survey-submissions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Survey Submissions" description={`${total} total survey responses`}>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={fetchSurveys} disabled={loading}>
            <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} />
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-2" onClick={exportCSV}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total", value: total, color: "text-gray-900" },
          { label: "New", value: surveys.filter((s) => s.status === "new").length, color: "text-blue-600" },
          { label: "Reviewed", value: surveys.filter((s) => s.status === "reviewed").length, color: "text-amber-600" },
          { label: "Contacted", value: surveys.filter((s) => s.status === "contacted").length, color: "text-purple-600" },
          { label: "Completed", value: surveys.filter((s) => s.status === "completed").length, color: "text-emerald-600" },
        ].map((s) => (
          <Card key={s.label} className="border-gray-100 shadow-sm rounded-2xl p-4">
            <p className="text-xs font-medium text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-gray-100 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by name, email or mobile..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full sm:w-[150px] h-9 text-sm"><SelectValue placeholder="All States" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {["Maharashtra","Delhi","Karnataka","Tamil Nadu","Uttar Pradesh","Gujarat","Rajasthan","West Bengal","Telangana","Kerala","Madhya Pradesh","Andhra Pradesh","Bihar","Punjab","Haryana"].map((st) => (
                  <SelectItem key={st} value={st}>{st}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={delayFilter} onValueChange={setDelayFilter}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm"><SelectValue placeholder="Fee Delay" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Fee Delayed</SelectItem>
                <SelectItem value="no">No Delay</SelectItem>
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
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Respondent</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">State</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Income</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Fee Delay</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Submitted</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="py-4 px-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : surveys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <ClipboardList className="h-12 w-12 opacity-30" />
                      <p className="font-medium">No survey submissions found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                surveys.map((survey) => (
                  <tr key={survey.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-500">#{survey.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-gray-800">{getPrimaryName(survey)}</p>
                      <p className="text-xs text-gray-500">{survey.email}</p>
                      <p className="text-xs text-gray-400">{survey.mobile_number}</p>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="text-xs bg-blue-50 text-[#00468E] font-medium px-2.5 py-1 rounded-full">{survey.state}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs hidden md:table-cell">{survey.monthly_income}</td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${survey.delay_in_fee === "yes" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {survey.delay_in_fee === "yes" ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4"><SurveyStatusBadge status={survey.status} /></td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs hidden lg:table-cell">{formatDate(survey.created_at)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#00468E]" onClick={() => setViewSurvey(survey)}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-600" onClick={() => openEdit(survey)}>
                          Update
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {surveys.length} of {total} submissions</p>
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading}>Previous</Button>
            <span className="text-sm text-gray-600 px-2">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>Next</Button>
          </div>
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!viewSurvey} onOpenChange={() => setViewSurvey(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Survey Details #{viewSurvey?.id}</DialogTitle></DialogHeader>
          {viewSurvey && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div><span className="text-gray-500 block text-xs">Father Name</span><p className="font-medium">{viewSurvey.father_name || "—"}</p></div>
                <div><span className="text-gray-500 block text-xs">Mother Name</span><p className="font-medium">{viewSurvey.mother_name || "—"}</p></div>
                <div><span className="text-gray-500 block text-xs">Guardian Name</span><p className="font-medium">{viewSurvey.guardian_name || "—"}</p></div>
                <div><span className="text-gray-500 block text-xs">Email</span><p className="font-medium">{viewSurvey.email}</p></div>
                <div><span className="text-gray-500 block text-xs">Mobile</span><p className="font-medium">{viewSurvey.mobile_number}</p></div>
                <div><span className="text-gray-500 block text-xs">State</span><p className="font-medium">{viewSurvey.state}</p></div>
                <div><span className="text-gray-500 block text-xs">Family Type</span><p className="font-medium">{viewSurvey.family_type}</p></div>
                <div><span className="text-gray-500 block text-xs">No. of Children</span><p className="font-medium">{viewSurvey.number_of_children}</p></div>
                <div><span className="text-gray-500 block text-xs">Monthly Income</span><p className="font-medium">{viewSurvey.monthly_income}</p></div>
                <div><span className="text-gray-500 block text-xs">Income Source</span><p className="font-medium">{viewSurvey.income_source}</p></div>
                <div><span className="text-gray-500 block text-xs">Fee Delayed?</span><p className="font-medium">{viewSurvey.delay_in_fee === "yes" ? "Yes" : "No"}</p></div>
                <div><span className="text-gray-500 block text-xs">Borrowing Source</span><p className="font-medium">{viewSurvey.borrowing_source}</p></div>
                <div><span className="text-gray-500 block text-xs">Preferred Duration</span><p className="font-medium">{viewSurvey.preferred_duration}</p></div>
                <div><span className="text-gray-500 block text-xs">Submitted</span><p className="font-medium">{formatDate(viewSurvey.created_at)}</p></div>
              </div>
              {viewSurvey.school_type_quantity && Object.keys(viewSurvey.school_type_quantity).length > 0 && (
                <div>
                  <span className="text-gray-500 block text-xs mb-1">School Types</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(viewSurvey.school_type_quantity).map(([k, v]) => (
                      <span key={k} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{k}: {v}</span>
                    ))}
                  </div>
                </div>
              )}
              {viewSurvey.admin_notes && (
                <div>
                  <span className="text-gray-500 block text-xs mb-1">Admin Notes</span>
                  <p className="text-gray-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">{viewSurvey.admin_notes}</p>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-gray-500 text-xs">Status:</span>
                <SurveyStatusBadge status={viewSurvey.status} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={!!editSurvey} onOpenChange={() => setEditSurvey(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Update Survey #{editSurvey?.id}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Admin Notes</Label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full min-h-[100px] rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#00468E]/20 focus:border-[#00468E]"
                placeholder="Add notes about this submission..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSurvey(null)}>Cancel</Button>
            <Button className="bg-[#00468E] hover:bg-[#003570] text-white" onClick={handleEditSave} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}