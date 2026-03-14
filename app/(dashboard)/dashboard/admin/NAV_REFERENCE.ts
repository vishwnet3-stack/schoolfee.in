// SCHOOL NAV — replace the school section in AdminAuthContext.tsx ROLE_NAV:
// This is a reference snippet showing the updated school nav items.
// Copy this into your AdminAuthContext.tsx to replace the existing school nav array.

export const SCHOOL_NAV_UPDATED = [
  { label: "Overview",         href: "/dashboard/admin/school",                   icon: "LayoutDashboard" },
  { label: "Fee Requests",     href: "/dashboard/admin/school/requests",          icon: "ClipboardList" },
  { label: "Payments",         href: "/dashboard/admin/school/payments",          icon: "CreditCard" },
  { label: "Students",         href: "/dashboard/admin/school/students",          icon: "Users" },
  { label: "Teacher Referrals",href: "/dashboard/admin/school/referrals",         icon: "UserCheck" },
  { label: "Reports",          href: "/dashboard/admin/school/reports",           icon: "BarChart3" },
  { label: "Documents",        href: "/dashboard/admin/school/documents",         icon: "FolderOpen" },
  { label: "Activity Logs",    href: "/dashboard/admin/school/activity",          icon: "Activity" },
  { label: "Notifications",    href: "/dashboard/admin/school/notifications",     icon: "Bell" },
  { label: "Support",          href: "/dashboard/admin/school/support",           icon: "HelpCircle" },
  { label: "Profile",          href: "/dashboard/admin/school/profile",           icon: "Building2" },
  { label: "Settings",         href: "/dashboard/admin/school/settings",          icon: "Settings" },
];
