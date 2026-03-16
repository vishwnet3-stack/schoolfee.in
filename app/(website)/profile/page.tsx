"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Mail, Calendar, Shield, ArrowLeft, LogOut, CheckCircle2,
  ClipboardList, UserPlus, GraduationCap, School, ChevronRight,
  Eye, X, RefreshCw, FileText, LayoutDashboard, Clock, XCircle,
  User, Phone, Building2, Star, Sparkles,
} from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────
interface Child {
  registration_id: number; full_name: string; class_grade: string;
  admission_number: string; school_name: string; school_city: string;
  apaar_id: string | null;
}
interface ParentReg {
  id: number; first_name: string; last_name: string; email: string;
  phone: string; pan_number: string; city: string; state: string;
  address: string; fee_amount: string; fee_period: string;
  reason_for_support: string; other_reason: string | null;
  description: string; repayment_duration: number;
  razorpay_payment_id: string | null;
  payment_status: "pending" | "paid" | "failed";
  payment_amount: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  admin_notes: string | null; submitted_at: string; updated_at: string;
  children: Child[];
}
interface TeacherReg {
  id: number; full_name: string; dob: string; gender: string;
  phone: string; email: string; address: string; state: string;
  qualification: string; other_qualification: string | null;
  subject: string; other_subject: string | null; experience: string;
  school_name: string; employee_id: string; salary_monthly: string;
  joining_date: string; employment_type: string;
  razorpay_payment_id: string | null;
  payment_status: "pending" | "paid" | "failed";
  payment_amount: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  admin_notes: string | null; submitted_at: string; updated_at: string;
}
interface SchoolReg {
  id: number; school_name: string; school_type: string;
  established_year: number; affiliation_board: string;
  other_affiliation_board: string | null; affiliation_id: string;
  school_address: string; city: string; state: string; pincode: string;
  contact_number: string; alternate_contact: string | null;
  official_email: string; website_url: string | null;
  principal_name: string; principal_email: string; principal_contact: string;
  total_students: number; total_teachers: number;
  infrastructure_details: string | null;
  razorpay_payment_id: string | null;
  payment_status: "pending" | "paid" | "failed";
  payment_amount: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  admin_notes: string | null; submitted_at: string; updated_at: string;
}
type ModalData =
  | { type: "parent";  data: ParentReg }
  | { type: "teacher"; data: TeacherReg }
  | { type: "school";  data: SchoolReg }
  | null;
type TabKey = "all" | "parent" | "teacher" | "school";

// ─── Helpers ─────────────────────────────────────────────────────────
const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const fmtAmount = (a: string | number) =>
  `₹${parseFloat(String(a)).toLocaleString("en-IN")}`;

const STATUS_CFG: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  pending:      { label: "Pending Review", dot: "bg-amber-400",   text: "text-amber-800",   bg: "bg-amber-50",   border: "border-amber-200" },
  under_review: { label: "Under Review",   dot: "bg-blue-500",    text: "text-blue-800",    bg: "bg-blue-50",    border: "border-blue-200" },
  approved:     { label: "Approved",       dot: "bg-emerald-500", text: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200" },
  rejected:     { label: "Rejected",       dot: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
};
const PAY_CFG: Record<string, { label: string; text: string; bg: string; border: string }> = {
  paid:    { label: "Paid",    text: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200" },
  pending: { label: "Pending", text: "text-amber-800",   bg: "bg-amber-50",   border: "border-amber-200" },
  failed:  { label: "Failed",  text: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
};

const ROLE_CFG: Record<string, { label: string; color: string; bg: string; border: string; gradient: string }> = {
  parent:  { label: "Parent",  color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",   gradient: "from-blue-600 to-blue-800" },
  teacher: { label: "Teacher", color: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200", gradient: "from-violet-600 to-violet-800" },
  school:  { label: "School",  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200",gradient: "from-emerald-600 to-emerald-800" },
};

const WAITLIST_STATUS_CFG: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  pending:  { label: "Pending Approval", icon: Clock,        color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  approved: { label: "Approved",         icon: CheckCircle2, color: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200" },
  rejected: { label: "Rejected",         icon: XCircle,      color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}
function PayBadge({ status, amount }: { status: string; amount: string }) {
  const p = PAY_CFG[status] || PAY_CFG.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${p.bg} ${p.text} ${p.border}`}>
      {status === "paid" ? "✓" : status === "failed" ? "✗" : "○"} {fmtAmount(amount)}
    </span>
  );
}

function DRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-400 font-medium flex-shrink-0 min-w-[110px] pt-0.5 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-slate-800 font-medium text-right break-words leading-relaxed">{value}</span>
    </div>
  );
}
function DSection({ title, color = "text-[#00468e]" }: { title: string; color?: string }) {
  return <p className={`text-[11px] font-extrabold uppercase tracking-widest pt-4 pb-1 first:pt-0 ${color}`}>{title}</p>;
}

const STEPS = [
  { label: "Start Survey", desc: "Share your community needs", href: "/survey", Icon: ClipboardList, accent: "#d97706", lightBg: "bg-amber-50", border: "border-amber-100", iconBg: "bg-amber-100", iconColor: "text-amber-700", tag: "Required", tagBg: "bg-amber-100", tagText: "text-amber-700", titleColor: "text-amber-900" },
  { label: "Parent Registration", desc: "Register as a parent member", href: "/registration/parent", Icon: UserPlus, accent: "#00468e", lightBg: "bg-blue-50", border: "border-blue-100", iconBg: "bg-blue-100", iconColor: "text-[#00468e]", tag: "For Parents", tagBg: "bg-blue-100", tagText: "text-blue-700", titleColor: "text-blue-900" },
  { label: "Teacher Registration", desc: "Join as an educator", href: "/registration/teacher", Icon: GraduationCap, accent: "#6d28d9", lightBg: "bg-violet-50", border: "border-violet-100", iconBg: "bg-violet-100", iconColor: "text-violet-700", tag: "For Teachers", tagBg: "bg-violet-100", tagText: "text-violet-700", titleColor: "text-violet-900" },
  { label: "School Registration", desc: "Enrol your institution", href: "/registration/school", Icon: School, accent: "#059669", lightBg: "bg-emerald-50", border: "border-emerald-100", iconBg: "bg-emerald-100", iconColor: "text-emerald-700", tag: "For Schools", tagBg: "bg-emerald-100", tagText: "text-emerald-700", titleColor: "text-emerald-900" },
];

// ─── Detail Modal ─────────────────────────────────────────────────────
function DetailModal({ modal, onClose }: { modal: ModalData; onClose: () => void }) {
  if (!modal) return null;
  const hdrGradient = modal.type === "parent" ? "from-[#00305f] to-[#00468e]" : modal.type === "teacher" ? "from-[#3b0764] to-[#6d28d9]" : "from-[#064e3b] to-[#059669]";
  const typeLabel = modal.type === "parent" ? "Parent Registration" : modal.type === "teacher" ? "Teacher Registration" : "School Registration";
  const mainTitle = modal.type === "parent" ? `${modal.data.first_name} ${modal.data.last_name}` : modal.type === "teacher" ? (modal.data as TeacherReg).full_name : (modal.data as SchoolReg).school_name;
  const TypeIcon = modal.type === "parent" ? UserPlus : modal.type === "teacher" ? GraduationCap : School;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg max-h-[94vh] sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col z-10 sm:shadow-2xl">
        <div className={`bg-gradient-to-r ${hdrGradient} px-6 py-5 flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><TypeIcon size={20} className="text-white" /></div>
            <div><p className="text-white/70 text-xs font-semibold uppercase tracking-widest">{typeLabel}</p><p className="text-white font-bold text-base leading-tight">{mainTitle}</p></div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"><X size={15} className="text-white" /></button>
        </div>
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 flex-shrink-0 flex-wrap">
          <StatusBadge status={modal.data.status} />
          <PayBadge status={modal.data.payment_status} amount={modal.data.payment_amount} />
          <span className="ml-auto text-xs text-slate-400 flex-shrink-0">Submitted {fmtDate(modal.data.submitted_at)}</span>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {modal.type === "parent" && (() => {
            const d = modal.data as ParentReg;
            return <><DSection title="Personal Information" /><DRow label="Full Name" value={`${d.first_name} ${d.last_name}`} /><DRow label="Email" value={d.email} /><DRow label="Phone" value={d.phone} /><DRow label="PAN Number" value={d.pan_number} /><DRow label="Address" value={`${d.address}, ${d.city}, ${d.state}`} /><DSection title="Support Request" color="text-blue-700" /><DRow label="Fee Amount" value={fmtAmount(d.fee_amount)} /><DRow label="Fee Period" value={d.fee_period} /><DRow label="Reason" value={d.reason_for_support === "other" ? d.other_reason : d.reason_for_support} /><DRow label="Repayment" value={`${d.repayment_duration} months`} /><DRow label="Description" value={d.description} />{d.children?.length > 0 && <><DSection title={`Children (${d.children.length})`} color="text-emerald-700" />{d.children.map((c, i) => (<div key={i} className="mb-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100"><p className="text-sm font-bold text-slate-700 mb-2">Child {i + 1} — {c.full_name}</p><div className="grid grid-cols-2 gap-x-4 gap-y-1.5">{[["Class", c.class_grade], ["Admission No.", c.admission_number], ["School", c.school_name], ["City", c.school_city], ...(c.apaar_id ? [["Apaar ID", c.apaar_id]] : [])].map(([k, v]) => (<div key={k}><span className="text-[11px] text-slate-400 uppercase tracking-wide">{k}</span><p className="text-sm font-semibold text-slate-700">{v}</p></div>))}</div></div>))}</>}<DSection title="Payment" color="text-amber-700" /><DRow label="Amount Paid" value={fmtAmount(d.payment_amount)} /><DRow label="Payment Ref." value={<span className="font-mono text-xs">{d.razorpay_payment_id || "—"}</span>} />{d.admin_notes && <DRow label="Admin Note" value={<span className="text-amber-700 font-medium">{d.admin_notes}</span>} />}</>;
          })()}
          {modal.type === "teacher" && (() => {
            const d = modal.data as TeacherReg;
            return <><DSection title="Personal Information" /><DRow label="Full Name" value={d.full_name} /><DRow label="Date of Birth" value={fmtDate(d.dob)} /><DRow label="Gender" value={d.gender} /><DRow label="Phone" value={d.phone} /><DRow label="Email" value={d.email} /><DRow label="Address" value={d.address} /><DRow label="State" value={d.state} /><DSection title="Professional Details" color="text-violet-700" /><DRow label="Qualification" value={d.qualification === "Other" ? d.other_qualification : d.qualification} /><DRow label="Subject" value={d.subject === "Other" ? d.other_subject : d.subject} /><DRow label="Experience" value={d.experience} /><DSection title="Employment" color="text-emerald-700" /><DRow label="School" value={d.school_name} /><DRow label="Employee ID" value={d.employee_id} /><DRow label="Employment Type" value={d.employment_type} /><DRow label="Monthly Salary" value={fmtAmount(d.salary_monthly)} /><DRow label="Joining Date" value={fmtDate(d.joining_date)} /><DSection title="Payment" color="text-amber-700" /><DRow label="Amount Paid" value={fmtAmount(d.payment_amount)} /><DRow label="Payment Ref." value={<span className="font-mono text-xs">{d.razorpay_payment_id || "—"}</span>} />{d.admin_notes && <DRow label="Admin Note" value={<span className="text-amber-700 font-medium">{d.admin_notes}</span>} />}</>;
          })()}
          {modal.type === "school" && (() => {
            const d = modal.data as SchoolReg;
            return <><DSection title="School Information" color="text-emerald-700" /><DRow label="School Name" value={d.school_name} /><DRow label="Type" value={d.school_type} /><DRow label="Established" value={d.established_year} /><DRow label="Board" value={d.affiliation_board === "Other" ? d.other_affiliation_board : d.affiliation_board} /><DRow label="Affiliation ID" value={d.affiliation_id} /><DSection title="Contact & Location" color="text-purple-700" /><DRow label="Address" value={`${d.school_address}, ${d.city}, ${d.state} – ${d.pincode}`} /><DRow label="Phone" value={d.contact_number} />{d.alternate_contact && <DRow label="Alt. Phone" value={d.alternate_contact} />}<DRow label="Email" value={d.official_email} />{d.website_url && <DRow label="Website" value={<a href={d.website_url} target="_blank" rel="noopener noreferrer" className="text-[#00468e] hover:underline">{d.website_url}</a>} />}<DSection title="Administration" color="text-[#00468e]" /><DRow label="Principal" value={d.principal_name} /><DRow label="Principal Email" value={d.principal_email} /><DRow label="Principal Contact" value={d.principal_contact} /><DRow label="Total Students" value={d.total_students?.toLocaleString("en-IN")} /><DRow label="Total Teachers" value={d.total_teachers?.toLocaleString("en-IN")} />{d.infrastructure_details && <DRow label="Infrastructure" value={d.infrastructure_details} />}<DSection title="Payment" color="text-amber-700" /><DRow label="Amount Paid" value={fmtAmount(d.payment_amount)} /><DRow label="Payment Ref." value={<span className="font-mono text-xs">{d.razorpay_payment_id || "—"}</span>} />{d.admin_notes && <DRow label="Admin Note" value={<span className="text-amber-700 font-medium">{d.admin_notes}</span>} />}</>;
          })()}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0 bg-white">
          <button onClick={onClose} className="w-full py-2.5 bg-[#00305f] hover:bg-[#00468e] text-white rounded-xl text-sm font-semibold transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── App Card ─────────────────────────────────────────────────────────
function AppCard({ iconBg, iconColor, TypeIcon, typeLabel, typeLabelColor, title, subtitle, status, paymentStatus, paymentAmount, date, onView }: { iconBg: string; iconColor: string; TypeIcon: any; typeLabel: string; typeLabelColor: string; title: string; subtitle: string; status: string; paymentStatus: string; paymentAmount: string; date: string; onView: () => void; }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}><TypeIcon size={20} className={iconColor} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1"><span className={`text-xs font-bold ${typeLabelColor}`}>{typeLabel}</span><span className="text-xs text-slate-300">·</span><span className="text-xs text-slate-400">{fmtDate(date)}</span></div>
        <p className="text-base font-bold text-slate-800 leading-tight truncate">{title}</p>
        <p className="text-sm text-slate-500 mt-0.5 truncate">{subtitle}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap"><StatusBadge status={status} /><PayBadge status={paymentStatus} amount={paymentAmount} /></div>
      </div>
      <button onClick={onView} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-[#00468e] hover:text-white text-slate-600 text-sm font-semibold transition-all flex-shrink-0 mt-1">
        <Eye size={14} /><span className="hidden sm:inline">View</span>
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuthSession();

  const [activity, setActivity] = useState<{ parent: ParentReg[]; teacher: TeacherReg[]; school: SchoolReg[] } | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityFetched, setActivityFetched] = useState(false);
  const [modal, setModal] = useState<ModalData>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  useEffect(() => {
    if (!user) return;
    setActivityLoading(true);
    fetch("/api/public/my-activity")
      .then(r => r.json())
      .then(d => { if (d.success) setActivity(d.activity); })
      .catch(() => {})
      .finally(() => { setActivityLoading(false); setActivityFetched(true); });
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-[3px] border-slate-200" />
            <div className="absolute inset-0 rounded-full border-[3px] border-t-[#00468E] animate-spin" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F5F9] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Shield className="w-7 h-7 text-slate-400" /></div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Not Signed In</h2>
          <p className="text-slate-500 text-sm mb-6">Please log in to view your profile.</p>
          <Link href="/join-waitlist" className="block w-full bg-[#00468E] hover:bg-[#00305f] text-white py-3 rounded-xl font-semibold text-sm transition-colors text-center">Log In</Link>
        </div>
      </div>
    );
  }

  const initials = user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const roleInfo = user.role ? ROLE_CFG[user.role] : null;
  const statusInfo = user.waitlistStatus ? WAITLIST_STATUS_CFG[user.waitlistStatus] : null;
  const WaitlistStatusIcon = statusInfo?.icon;

  const allParent  = activity?.parent  || [];
  const allTeacher = activity?.teacher || [];
  const allSchool  = activity?.school  || [];
  const totalCount = allParent.length + allTeacher.length + allSchool.length;
  const hasActivity = totalCount > 0;

  const typeTabs = [
    ...(allParent.length  > 0 ? [{ key: "parent"  as TabKey, label: "Parent",  count: allParent.length }]  : []),
    ...(allTeacher.length > 0 ? [{ key: "teacher" as TabKey, label: "Teacher", count: allTeacher.length }] : []),
    ...(allSchool.length  > 0 ? [{ key: "school"  as TabKey, label: "School",  count: allSchool.length }]  : []),
  ];
  const tabs = typeTabs.length > 1 ? [{ key: "all" as TabKey, label: "All", count: totalCount }, ...typeTabs] : typeTabs;
  const effectiveTab: TabKey = (tabs.find(t => t.key === activeTab)) ? activeTab : (tabs[0]?.key || "all");

  const visibleParent  = (effectiveTab === "all" || effectiveTab === "parent")  ? allParent  : [];
  const visibleTeacher = (effectiveTab === "all" || effectiveTab === "teacher") ? allTeacher : [];
  const visibleSchool  = (effectiveTab === "all" || effectiveTab === "school")  ? allSchool  : [];

  return (
    <>
      <DetailModal modal={modal} onClose={() => setModal(null)} />

      <div className="min-h-screen bg-[#F2F5F9] py-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          <button onClick={() => router.push("/")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#00468E] mb-6 transition-colors">
            <ArrowLeft size={15} /> Back to Home
          </button>

          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* ── SIDEBAR ─────────────────────────────────────────── */}
            <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-6 flex flex-col gap-4">

              {/* Profile hero card */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, #001635 0%, #00305f 60%, #00468E 100%)" }}>
                <div className="px-5 pt-7 pb-5 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                      <span className="text-3xl font-black text-white tracking-tight">{initials}</span>
                    </div>
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#001635]" />
                  </div>

                  <h1 className="text-base font-bold text-white leading-tight">{user.fullName}</h1>
                  <p className="text-xs text-blue-300 mt-0.5 break-all px-2">{user.email}</p>

                  {/* Role + Status badges */}
                  <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                    {roleInfo && (
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white`}>
                        {roleInfo.label}
                      </span>
                    )}
                    {statusInfo && WaitlistStatusIcon && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white">
                        <WaitlistStatusIcon size={11} />
                        {statusInfo.label}
                      </span>
                    )}
                    {!roleInfo && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300">
                        <CheckCircle2 size={11} /> Active Member
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t border-white/10 grid grid-cols-2 divide-x divide-white/10">
                  <div className="px-4 py-3">
                    <p className="text-[11px] text-blue-300 font-medium">Member Since</p>
                    <p className="text-sm font-bold text-white mt-0.5">{joinDate}</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[11px] text-blue-300 font-medium">Applications</p>
                    <p className="text-2xl font-black text-white leading-none mt-0.5">{activityLoading ? "—" : totalCount}</p>
                  </div>
                </div>
              </div>

              {/* Account details */}
              <div className="bg-white rounded-2xl p-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Account Details</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><Mail size={14} className="text-[#00468e]" /></div>
                    <div className="min-w-0"><p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Email</p><p className="text-sm font-semibold text-slate-700 truncate">{user.email}</p></div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><Phone size={14} className="text-[#00468e]" /></div>
                      <div><p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Phone</p><p className="text-sm font-semibold text-slate-700">{user.phone}</p></div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><Calendar size={14} className="text-[#00468e]" /></div>
                    <div><p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Joined</p><p className="text-sm font-semibold text-slate-700">{joinDate}</p></div>
                  </div>
                  {statusInfo && (
                    <div className={`flex items-center gap-3 p-2.5 rounded-xl ${statusInfo.bg}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${statusInfo.bg}`}>
                        {WaitlistStatusIcon && <WaitlistStatusIcon size={14} className={statusInfo.color} />}
                      </div>
                      <div><p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Waitlist Status</p><p className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.label}</p></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dashboard access — only shown for approved members */}
              {user.waitlistStatus === "approved" && (
                <Link
                  href="/dashboard/admin/login"
                  className="block bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl p-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center"><LayoutDashboard size={17} className="text-white" /></div>
                      <div><p className="text-white font-bold text-sm">Access Dashboard</p><p className="text-emerald-100 text-xs">Your account is approved</p></div>
                    </div>
                    <ChevronRight size={18} className="text-white/70" />
                  </div>
                </Link>
              )}

              {/* Pending approval notice */}
              {user.waitlistStatus === "pending" && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0"><Clock size={15} className="text-amber-700" /></div>
                    <div><p className="text-amber-800 font-semibold text-sm">Pending Approval</p><p className="text-amber-600 text-xs mt-0.5">Our team is reviewing your application. You'll be notified once approved.</p></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button onClick={() => router.push("/")} className="w-full bg-[#00468e] hover:bg-[#00305f] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">Back to Home</button>
                <button onClick={handleLogout} className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>

            {/* ── MAIN CONTENT ──────────────────────────────────────── */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">

              {/* Role card — premium contextual info */}
              {roleInfo && (
                <div className={`rounded-2xl overflow-hidden`} style={{ background: `linear-gradient(135deg, #001635 0%, #00305f 100%)` }}>
                  <div className="px-6 py-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0`}>
                        {user.role === "parent"  && <UserPlus size={22} className="text-white" />}
                        {user.role === "teacher" && <GraduationCap size={22} className="text-white" />}
                        {user.role === "school"  && <School size={22} className="text-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${roleInfo.bg} ${roleInfo.color} ${roleInfo.border} border`}>{roleInfo.label}</span>
                          {statusInfo && <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}>{statusInfo.label}</span>}
                        </div>
                        <p className="text-white font-bold text-lg leading-tight">
                          {user.role === "parent"  && "Parent Member"}
                          {user.role === "teacher" && "Teacher Member"}
                          {user.role === "school"  && "School Member"}
                        </p>
                        <p className="text-blue-300 text-sm mt-0.5">
                          {user.role === "parent"  && "Access fee support programs and track your children's education"}
                          {user.role === "teacher" && "Access professional development tools and educator support"}
                          {user.role === "school"  && "Manage partnerships, student data, and school programs"}
                        </p>
                      </div>
                    </div>
                    {user.waitlistStatus === "approved" && (
                      <Link href="/dashboard/admin/login" className="flex-shrink-0 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Applications */}
              {(activityLoading || (activityFetched && hasActivity)) && (
                <div className="bg-white rounded-2xl overflow-hidden">
                  <div className="bg-[#001f4d] px-6 py-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0"><FileText size={17} className="text-white" /></div>
                        <div><h2 className="text-white font-bold text-lg leading-tight">My Applications</h2><p className="text-blue-300 text-sm mt-0.5">Live status of all your submissions</p></div>
                      </div>
                      {activityLoading ? <RefreshCw size={15} className="text-blue-400 animate-spin flex-shrink-0" /> : <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-sm font-extrabold text-white">{totalCount}</span>}
                    </div>
                    {!activityLoading && tabs.length > 1 && (
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {tabs.map(tab => (
                          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${effectiveTab === tab.key ? "bg-white text-[#00305f]" : "bg-white/10 text-blue-200 hover:bg-white/20"}`}>
                            {tab.label}
                            <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md ${effectiveTab === tab.key ? "bg-[#00468e] text-white" : "bg-white/15 text-white"}`}>{tab.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="px-6">
                    {activityLoading ? (
                      <div className="py-5 space-y-4">{[1,2,3].map(i => (<div key={i} className="flex gap-4 items-start"><div className="w-11 h-11 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-4 bg-slate-100 rounded-lg animate-pulse w-1/2" /><div className="h-5 bg-slate-100 rounded-lg animate-pulse w-3/4" /><div className="flex gap-2 pt-1"><div className="h-6 bg-slate-100 rounded-full animate-pulse w-24" /><div className="h-6 bg-slate-100 rounded-full animate-pulse w-20" /></div></div></div>))}</div>
                    ) : (
                      <>
                        {visibleParent.map(reg => (<AppCard key={`p-${reg.id}`} iconBg="bg-blue-50" iconColor="text-[#00468e]" TypeIcon={UserPlus} typeLabel="Parent" typeLabelColor="text-[#00468e]" title={`${reg.first_name} ${reg.last_name}`} subtitle={`${reg.city}, ${reg.state} · ${reg.children?.length || 0} child${(reg.children?.length || 0) !== 1 ? "ren" : ""}`} status={reg.status} paymentStatus={reg.payment_status} paymentAmount={reg.payment_amount} date={reg.submitted_at} onView={() => setModal({ type: "parent", data: reg })} />))}
                        {visibleTeacher.map(reg => (<AppCard key={`t-${reg.id}`} iconBg="bg-violet-50" iconColor="text-violet-600" TypeIcon={GraduationCap} typeLabel="Teacher" typeLabelColor="text-violet-600" title={reg.full_name} subtitle={`${reg.school_name} · ${reg.subject === "Other" ? reg.other_subject : reg.subject}`} status={reg.status} paymentStatus={reg.payment_status} paymentAmount={reg.payment_amount} date={reg.submitted_at} onView={() => setModal({ type: "teacher", data: reg })} />))}
                        {visibleSchool.map(reg => (<AppCard key={`s-${reg.id}`} iconBg="bg-emerald-50" iconColor="text-emerald-600" TypeIcon={School} typeLabel="School" typeLabelColor="text-emerald-600" title={reg.school_name} subtitle={`${reg.city}, ${reg.state} · ${reg.total_students?.toLocaleString("en-IN")} students`} status={reg.status} paymentStatus={reg.payment_status} paymentAmount={reg.payment_amount} date={reg.submitted_at} onView={() => setModal({ type: "school", data: reg })} />))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Become a Member */}
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="bg-[#001f4d] px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0"><Sparkles size={17} className="text-white" /></div>
                    <div><h2 className="text-white font-bold text-lg leading-tight">Become a Member</h2><p className="text-blue-300 text-sm mt-0.5">Join India's largest school financial inclusion initiative</p></div>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STEPS.map(({ label, desc, href, Icon, lightBg, iconBg, iconColor, tag, tagBg, tagText, titleColor }) => (
                    <a key={href} href={href} className={`group flex items-center gap-4 p-4 rounded-xl ${lightBg} hover:opacity-90 transition-opacity cursor-pointer`}>
                      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}><Icon size={22} className={iconColor} /></div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${tagBg} ${tagText} mb-1`}>{tag}</span>
                        <p className={`text-sm font-bold ${titleColor} leading-tight`}>{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      </div>
                      <ChevronRight size={16} className={`${iconColor} flex-shrink-0 opacity-50 group-hover:translate-x-0.5 transition-transform`} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Community initiative card */}
              <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #001635 0%, #00305f 100%)" }}>
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Initiative
                    </div>
                    <h3 className="text-white font-bold text-lg leading-snug">Community Health Mission</h3>
                    <p className="text-blue-300 text-sm mt-1">CarePay® · National Health Financial Inclusion Initiative</p>
                  </div>
                  <div className="w-11 h-11 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center flex-shrink-0"><Star size={18} className="text-white/60" /></div>
                </div>
                <div className="relative mt-4 pt-4 border-t border-white/10">
                  <p className="text-blue-300 text-sm leading-relaxed">You are a registered member of <span className="text-white font-semibold">SchoolFee.org</span> — supporting education continuity across India.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
