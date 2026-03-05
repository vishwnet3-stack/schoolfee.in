"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FiLayout,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiShield,
  FiAlertCircle,
  FiBarChart2,
} from "react-icons/fi"
import {
  FaGraduationCap,
  FaBuilding,
  FaHeart,
  FaRupeeSign,
} from "react-icons/fa"

const navigation = [
  { name: "Overview", href: "/dashboard/admin", icon: FiLayout },
  { name: "Parent Applications", href: "/dashboard/admin/parents", icon: FiUsers },
  { name: "Teacher Program", href: "/dashboard/admin/teachers", icon: FaGraduationCap },
  { name: "School Partners", href: "/dashboard/admin/schools", icon: FaBuilding },
  { name: "Donor Management", href: "/dashboard/admin/donors", icon: FaHeart },
  { name: "Fund Management", href: "/dashboard/admin/funds", icon: FaRupeeSign },
  { name: "Impact Analytics", href: "/dashboard/admin/analytics", icon: FiBarChart2 },
  { name: "Reports", href: "/dashboard/admin/reports", icon: FiFileText },
  { name: "Risk Monitoring", href: "/dashboard/admin/risk", icon: FiAlertCircle },
  { name: "Settings", href: "/dashboard/admin/settings", icon: FiSettings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r">
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-semibold">Schoolfee</span>
          </Link>
        </div>

        {/* Admin Info */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <FiShield className="text-white" size={18} />
            </div>
            <div>
              <p className="font-medium text-sm">Admin Panel</p>
              <p className="text-xs text-gray-500">Trustee Access</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/admin" &&
                pathname.startsWith(item.href))

            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <FiLogOut size={18} />
            Sign Out
          </button>
        </div>

      </div>
    </aside>
  )
}
