"use client";

import { useState } from "react";
import {
  HelpCircle, Plus, MessageSquare, Clock, CheckCircle2,
  Paperclip, Send, ChevronDown, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const cardClass = "bg-white dark:bg-[#0d1f3c] border border-gray-100 dark:border-[#00468E]/20 shadow-sm rounded-2xl";

const tickets = [
  { id: "TKT-301", subject: "Payment for May not reflected in dashboard", type: "Payment Issue", status: "open", priority: "high", createdOn: "Today", lastReply: "2h ago", replies: 2 },
  { id: "TKT-300", subject: "Unable to verify student enrollment for REQ-1021", type: "Verification Issue", status: "in-progress", priority: "medium", createdOn: "Yesterday", lastReply: "5h ago", replies: 3 },
  { id: "TKT-299", subject: "Profile update not saving bank details", type: "Account Issue", status: "resolved", priority: "low", createdOn: "28 May", lastReply: "29 May", replies: 4 },
  { id: "TKT-298", subject: "Dashboard loading slow on mobile devices", type: "Technical Support", status: "resolved", priority: "low", createdOn: "20 May", lastReply: "22 May", replies: 6 },
];

const statusStyle: Record<string, string> = {
  open: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
};

const priorityStyle: Record<string, string> = {
  high: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

export default function SchoolSupportPage() {
  const [showForm, setShowForm] = useState(false);
  const [ticketType, setTicketType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!subject || !ticketType) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Support ticket submitted! Our team will respond within 24 hours.");
    setShowForm(false);
    setSubject(""); setDescription(""); setTicketType("");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Get help from the Schoolfee support team</p>
        </div>
        <Button size="sm" className="bg-[#00468E] hover:bg-[#003570] text-white rounded-xl"
          onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1.5" /> New Ticket
        </Button>
      </div>

      {/* Contact info banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#001f4d] to-[#00468E] p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-sm">Schoolfee Support Team</p>
            <p className="text-white/60 text-xs mt-0.5">Mon–Fri · 9 AM – 6 PM IST · Typically replies within 24 hours</p>
          </div>
        </div>
        <a href="mailto:support@schoolfee.in" className="text-xs bg-white/15 border border-white/20 rounded-xl px-4 py-2 font-semibold hover:bg-white/25 transition-colors shrink-0">
          support@schoolfee.in
        </a>
      </div>

      {/* New ticket form */}
      {showForm && (
        <Card className={cardClass}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">Create New Support Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Ticket Type *</Label>
                <Select value={ticketType} onValueChange={setTicketType}>
                  <SelectTrigger className="h-9 dark:bg-[#0d1f3c] dark:border-[#00468E]/30 text-sm">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="verification">Application Verification Issue</SelectItem>
                    <SelectItem value="account">Account Problem</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Subject *</Label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief description of the issue"
                  className="h-9 text-sm dark:bg-[#0d1f3c] dark:border-[#00468E]/30" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Description</Label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail, including any relevant IDs (e.g. TXN-XXXX, REQ-XXXX)..."
                rows={4}
                className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-[#00468E]/30 bg-white dark:bg-[#0d1f3c] text-gray-800 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:border-[#00468E]"
              />
            </div>
            <div className="flex gap-3">
              <Button className="bg-[#00468E] hover:bg-[#003570] text-white rounded-xl gap-2" onClick={handleSubmit}>
                <Send className="h-4 w-4" /> Submit Ticket
              </Button>
              <Button variant="outline" className="border-gray-200 dark:border-[#00468E]/30 rounded-xl" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ticket list */}
      <Card className={cardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-800 dark:text-white">Your Support Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50 dark:divide-[#00468E]/10">
            {tickets.map(t => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#00468E]/5 cursor-pointer transition-colors"
                onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.status === "resolved" ? "bg-emerald-100 dark:bg-emerald-900/20" : "bg-amber-100 dark:bg-amber-900/20"}`}>
                  {t.status === "resolved" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{t.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.id} · {t.type} · {t.replies} replies · Last: {t.lastReply}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`text-[10px] border-0 font-semibold hidden sm:flex ${priorityStyle[t.priority]}`}>{t.priority}</Badge>
                  <Badge className={`text-[10px] border-0 font-semibold ${statusStyle[t.status]}`}>
                    {t.status === "open" ? "Open" : t.status === "in-progress" ? "In Progress" : "Resolved"}
                  </Badge>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expandedId === t.id ? "rotate-180" : ""}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
