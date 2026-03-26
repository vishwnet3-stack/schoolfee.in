import {
  LayoutDashboard,
  Users,
  Shield,
  School,
  UserCheck,
  Briefcase,
  UsersRound,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  LineChart,
  Bell,
  GraduationCap,
  User,
  Globe,
  ClipboardList,
  HeartHandshake,
} from "lucide-react";

export const navItems = [
  {
    label: "Overview",
    href: "/dashboard/super-admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Analytics",
    href: "/dashboard/super-admin/analytics",
    icon: LineChart,
  },
  {
    label: "Users",
    icon: Users,
    children: [
      { label: "All Users", href: "/dashboard/super-admin/users" },
      { label: "Create User", href: "/dashboard/super-admin/users/create" },
    ],
  },
  {
    label: "Website Users",
    href: "/dashboard/super-admin/website-users",
    icon: Globe,
  },
  {
    label: "Roles & Permissions",
    href: "/dashboard/super-admin/roles",
    icon: Shield,
  },
  {
    label: "Schools",
    icon: School,
    children: [
      { label: "All Schools", href: "/dashboard/super-admin/schools" },
      {
        label: "School Profiles",
        href: "/dashboard/super-admin/schools/profiles",
      },
      {
        label: "Fee Structure",
        href: "/dashboard/super-admin/schools/fee-structure",
      },
      {
        label: "Enrollments",
        href: "/dashboard/super-admin/schools/enrollments",
      },
      {
        label: "Submit Application",
        href: "/dashboard/super-admin/schools/school-applications",
      },
    ],
  },
  {
    label: "Parents",
    icon: UserCheck,
    children: [
      {
        label: "Submit Application",
        href: "/dashboard/super-admin/parents/parent-applications",
      },
      { label: "All Parents", href: "/dashboard/super-admin/parents" },
      {
        label: "Payment History",
        href: "/dashboard/super-admin/parents/payment-history",
      },
      {
        label: "Pending Dues",
        href: "/dashboard/super-admin/parents/pending-dues",
      },
    ],
  },
  {
    label: "Teachers",
    icon: GraduationCap,
    children: [
      {
        label: "Submit Application",
        href: "/dashboard/super-admin/teachers/teacher-applications",
      },
      { label: "All Teachers", href: "/dashboard/super-admin/teachers" },
      {
        label: "Assignments",
        href: "/dashboard/super-admin/teachers/assignments",
      },
      {
        label: "Performance",
        href: "/dashboard/super-admin/teachers/performance",
      },
    ],
  },
  {
    label: "Employees",
    href: "/dashboard/super-admin/employees",
    icon: Briefcase,
  },
  {
    label: "Managers",
    href: "/dashboard/super-admin/managers",
    icon: UsersRound,
  },
  {
    label: "Payments",
    href: "/dashboard/super-admin/payments",
    icon: CreditCard,
  },
  {
    label: "Donations Received",
    href: "/dashboard/super-admin/donations-received",
    icon: HeartHandshake,
  },
  {
    label: "Survey Submissions",
    href: "/dashboard/super-admin/forms",
    icon: ClipboardList,
  },
  {
    label: "Reports",
    href: "/dashboard/super-admin/reports",
    icon: BarChart3,
  },
  {
    label: "Notifications",
    href: "/dashboard/super-admin/notifications",
    icon: Bell,
  },
  {
    label: "My Profile",
    href: "/dashboard/super-admin/profile",
    icon: User,
  },
  {
    label: "Settings",
    href: "/dashboard/super-admin/settings",
    icon: Settings,
  },
];