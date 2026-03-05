"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle, Pencil, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "../../components/PageHeader";
import { useDashboardAuth } from "../../components/AuthContext";

const ALL_PERMISSIONS = [
  "View Employees", "Manage Employees",
  "View Schools", "Manage Schools",
  "View Parents", "Manage Parents",
  "View Payments", "Manage Payments",
  "View Reports", "View Analytics",
  "Manage Forms", "View Notifications",
  "View Teachers", "Manage Teachers",
  "View Users",
];

const EMPLOYEE_DEFAULT_PERMISSIONS = [
  "View Employees", "View Schools", "View Parents",
  "View Reports", "View Notifications", "View Teachers",
];

const ROLE_OPTIONS = [
  { value: "parent",     label: "Parent",      color: "bg-emerald-500", desc: "Access to parent-related features" },
  { value: "teacher",    label: "Teacher",     color: "bg-blue-500",    desc: "Access to teacher & classroom features" },
  { value: "school",     label: "School",      color: "bg-purple-500",  desc: "Access to school management features" },
  { value: "manager",    label: "Manager",     color: "bg-amber-500",   desc: "Full access except delete" },
  { value: "employee",   label: "Employee",    color: "bg-gray-500",    desc: "View-only access to assigned sections" },
  { value: "admin",      label: "Admin User",  color: "bg-red-500",     desc: "Full admin access (create, edit, delete)" },
  { value: "custom",     label: "Custom User", color: "bg-indigo-500",  desc: "Employee-level + custom permissions" },
];

interface FormErrors {
  name?: string; email?: string; phone?: string;
  role?: string; password?: string; confirmPassword?: string;
  customRoleName?: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const { user, canManageUsers } = useDashboardAuth();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", role: "", status: "active",
    password: "", confirmPassword: "", customRoleName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [enabledPerms, setEnabledPerms] = useState<string[]>([...EMPLOYEE_DEFAULT_PERMISSIONS]);

  // Block non-admin access immediately
  if (user && !canManageUsers) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-sm">
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <ShieldX className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-500 text-sm">
            Only <strong>Admin</strong> and <strong>Super Admin</strong> roles can create users.
            Your current role (<strong className="capitalize">{user.role}</strong>) does not have this permission.
          </p>
          <Button className="bg-[#00468E] text-white" onClick={() => router.push("/dashboard/super-admin/users")}>
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setApiError("");
    if (field === "role" && value === "custom") {
      setEnabledPerms([...EMPLOYEE_DEFAULT_PERMISSIONS]);
    }
  };

  const togglePerm = (perm: string) => {
    setEnabledPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Full name must be at least 2 characters";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address";
    if (!form.role) e.role = "Please select a role";
    if (form.role === "custom" && !form.customRoleName.trim()) e.customRoleName = "Custom role name is required";
    if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (form.phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(form.phone)) e.phone = "Invalid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/dashboard/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          phone: form.phone.trim() || undefined,
          role: form.role,
          status: form.status,
          password: form.password,
          customRoleName: form.role === "custom" ? form.customRoleName.trim() : undefined,
          permissions: form.role === "custom" ? enabledPerms : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/super-admin/users"), 2500);
      } else {
        if (data.errors) setErrors(data.errors);
        setApiError(data.error || "Failed to create user");
      }
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">User Created!</h2>
          <p className="text-gray-500 max-w-sm">
            The user account has been created and login credentials have been sent to their email address.
          </p>
          <p className="text-sm text-gray-400">Redirecting to users list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Create New User" description="Add a new user and send them login credentials via email">
        <Link href="/dashboard/super-admin/users">
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {apiError}
          </div>
        )}

        {/* Personal Info */}
        <Card className="border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Arjun Mehta" value={form.name} onChange={(e) => update("name", e.target.value)}
                  className={"h-10 " + (errors.name ? "border-red-400" : "")} />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Email Address <span className="text-red-500">*</span></Label>
                <Input type="email" placeholder="arjun@example.com" value={form.email} onChange={(e) => update("email", e.target.value)}
                  className={"h-10 " + (errors.email ? "border-red-400" : "")} />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Phone Number</Label>
                <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                  className={"h-10 " + (errors.phone ? "border-red-400" : "")} />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Account Status</Label>
                <Select value={form.status} onValueChange={(v) => update("status", v)}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Role <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update("role", opt.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      form.role === opt.value
                        ? "border-[#00468E] bg-[#00468E]/5"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <span className={"w-3 h-3 rounded-full shrink-0 " + opt.color} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                    {form.role === opt.value && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-[#00468E] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
            </div>

            {/* Custom role name */}
            {form.role === "custom" && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Custom Role Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={form.customRoleName}
                    onChange={(e) => update("customRoleName", e.target.value)}
                    placeholder="e.g. Field Coordinator, Regional Head..."
                    className={"h-10 pl-9 " + (errors.customRoleName ? "border-red-400" : "border-[#F4951D]/40 focus-visible:ring-[#F4951D]")}
                  />
                </div>
                {errors.customRoleName && <p className="text-red-500 text-xs">{errors.customRoleName}</p>}
                <p className="text-xs text-gray-500">This name appears on the user's profile and reports.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom permissions panel */}
        {form.role === "custom" && (
          <Card className="border-[#F4951D]/30 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Custom Permissions</CardTitle>
                  <p className="text-sm text-gray-500 mt-0.5">Defaults to Employee-level. Customize as needed.</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" className="text-xs"
                    onClick={() => setEnabledPerms([...EMPLOYEE_DEFAULT_PERMISSIONS])}>Reset</Button>
                  <Button type="button" variant="outline" size="sm" className="text-xs border-[#F4951D]/40 text-[#F4951D] hover:bg-[#F4951D]/10"
                    onClick={() => setEnabledPerms(enabledPerms.length === ALL_PERMISSIONS.length ? [] : [...ALL_PERMISSIONS])}>
                    {enabledPerms.length === ALL_PERMISSIONS.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_PERMISSIONS.map((perm) => (
                  <div key={perm} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-[#F4951D]/30 transition-colors">
                    <Label className="text-sm font-normal cursor-pointer">{perm}</Label>
                    <Switch checked={enabledPerms.includes(perm)} onCheckedChange={() => togglePerm(perm)} className="data-[state=checked]:bg-[#F4951D]" />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-[#00468E]/5 rounded-xl border border-[#00468E]/10">
                <p className="text-xs text-[#00468E] font-medium">
                  ℹ️ Custom Users have Employee-level base access. Enabled permissions will be granted additionally.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Credentials */}
        <Card className="border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Login Credentials</CardTitle>
            <p className="text-sm text-gray-500 mt-1">These will be emailed to the user automatically after account creation.</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
                    value={form.password} onChange={(e) => update("password", e.target.value)}
                    className={"h-10 pr-10 " + (errors.password ? "border-red-400" : "")} />
                  <button type="button" onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Confirm Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input type={showConfirm ? "text" : "password"} placeholder="Repeat password"
                    value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)}
                    className={"h-10 pr-10 " + (errors.confirmPassword ? "border-red-400" : "")} />
                  <button type="button" onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
              <strong>Email notification:</strong> Login URL, email, and password will be sent to the user automatically.
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="bg-[#00468E] hover:bg-[#003570] text-white px-8" disabled={loading}>
            {loading ? "Creating User..." : "Create User & Send Email"}
          </Button>
          <Link href="/dashboard/super-admin/users">
            <Button type="button" variant="outline" className="px-6">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}