"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FiLayout,
  FiHeart,
  FiFileText,
  FiHelpCircle,
  FiUser,
  FiLogOut,
  FiClock,
  FiCalendar,
} from "react-icons/fi"
import { FaGraduationCap } from "react-icons/fa"

const navigation = [
  { name: "Overview", href: "/dashboard/teacher", icon: FiLayout },
  { name: "My Support", href: "/dashboard/teacher/support", icon: FiHeart },
  { name: "Repayment", href: "/dashboard/teacher/repayment", icon: FiCalendar },
  { name: "Documents", href: "/dashboard/teacher/documents", icon: FiFileText },
  { name: "Profile", href: "/dashboard/teacher/profile", icon: FiUser },
]

export function TeacherSidebar() {
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

        {/* User Info */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaGraduationCap className="text-blue-600" size={18} />
            </div>
            <div>
              <p className="font-medium text-sm">Priya Sharma</p>
              <p className="text-xs text-gray-500">Teacher</p>
            </div>
          </div>

          <div className="mt-3 p-2 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2 text-xs">
              <FiClock size={12} className="text-blue-600" />
              <span className="text-gray-500">Support Active</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/teacher" &&
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
