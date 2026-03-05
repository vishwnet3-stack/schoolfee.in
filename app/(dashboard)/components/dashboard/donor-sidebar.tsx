"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  FiHome,
  FiHeart,
  FiTrendingUp,
  FiFileText,
  FiAward,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi"

const navigation = [
  { name: "Overview", href: "/dashboard/donor", icon: FiHome },
  { name: "Donations", href: "/dashboard/donor/donations", icon: FiHeart },
  { name: "Impact Metrics", href: "/dashboard/donor/impact", icon: FiTrendingUp },
  { name: "Reports", href: "/dashboard/donor/reports", icon: FiFileText },
  { name: "Certificates", href: "/dashboard/donor/certificates", icon: FiAward },
  { name: "Settings", href: "/dashboard/donor/settings", icon: FiSettings },
]

export default function DonorSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard/donor" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-semibold">Schoolfee</span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2"
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-semibold">Schoolfee</span>
        </div>

        {/* Donor Info */}
        <div className="px-4 py-4 border-b">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FiHeart className="text-blue-600" size={18} />
            </div>
            <div>
              <div className="text-sm font-medium truncate">
                TechCorp Foundation
              </div>
              <div className="text-xs text-gray-500">CSR Partner</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon size={18} />
                {item.name}
                {isActive && (
                  <FiChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
          >
            <FiLogOut size={18} />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r pt-16">
            {/* Donor Info */}
            <div className="px-4 py-4 border-b">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiHeart className="text-blue-600" size={18} />
                </div>
                <div>
                  <div className="text-sm font-medium truncate">
                    TechCorp Foundation
                  </div>
                  <div className="text-xs text-gray-500">
                    CSR Partner
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
              >
                <FiLogOut size={18} />
                Back to Website
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
