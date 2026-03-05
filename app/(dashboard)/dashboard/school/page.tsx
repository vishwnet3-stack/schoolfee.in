"use client"

import Link from "next/link"
import {
  FiUsers,
  FiClock,
  FiTrendingUp,
  FiDownload,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi"
import { FaRupeeSign } from "react-icons/fa"

const stats = [
  {
    title: "Active Students",
    value: "47",
    change: "+5 this month",
    icon: FiUsers,
  },
  {
    title: "Total Disbursed",
    value: "Rs. 18.5L",
    change: "+Rs. 2.4L this month",
    icon: FaRupeeSign,
  },
  {
    title: "Pending Verification",
    value: "8",
    change: "3 urgent",
    icon: FiClock,
  },
  {
    title: "Repayment Rate",
    value: "98.5%",
    change: "Above average",
    icon: FiTrendingUp,
  },
]

const recentApplications = [
  {
    id: "APP-2025-0089",
    student: "Arjun Mehta",
    class: "Class 8",
    amount: "Rs. 35,000",
    status: "pending",
    date: "Jan 18, 2025",
  },
  {
    id: "APP-2025-0088",
    student: "Sneha Gupta",
    class: "Class 10",
    amount: "Rs. 42,000",
    status: "pending",
    date: "Jan 17, 2025",
  },
  {
    id: "APP-2025-0087",
    student: "Vikram Singh",
    class: "Class 5",
    amount: "Rs. 28,000",
    status: "verified",
    date: "Jan 15, 2025",
  },
  {
    id: "APP-2025-0086",
    student: "Ananya Sharma",
    class: "Class 12",
    amount: "Rs. 55,000",
    status: "disbursed",
    date: "Jan 12, 2025",
  },
]

const recentDisbursements = [
  { date: "Jan 15, 2025", students: 5, amount: "Rs. 2,15,000" },
  { date: "Jan 1, 2025", students: 8, amount: "Rs. 3,42,000" },
  { date: "Dec 15, 2024", students: 6, amount: "Rs. 2,78,000" },
]

export default function SchoolDashboard() {
  return (
    <div className="space-y-6 pt-16 lg:pt-0">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">School Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome, Delhi Public School, Vasant Kunj
          </p>
        </div>

        <Link
          href="/dashboard/school/reports"
          className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <FiDownload size={16} />
          Export Report
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white border rounded-xl p-4 lg:p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.title}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-lg font-semibold">Recent Applications</h2>
              <p className="text-sm text-gray-500">
                Student fee support requests requiring verification
              </p>
            </div>
            <Link
              href="/dashboard/school/applications"
              className="text-sm border px-3 py-1 rounded-md hover:bg-gray-100"
            >
              View All
            </Link>
          </div>

          <div className="p-6 space-y-4">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{app.student}</span>
                    <span className="text-xs text-gray-500">{app.class}</span>

                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "verified"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {app.status === "pending"
                        ? "Needs Verification"
                        : app.status === "verified"
                        ? "Verified"
                        : "Disbursed"}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500">
                    {app.id} - {app.date}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">{app.amount}</div>
                  {app.status === "pending" && (
                    <button className="mt-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Disbursements */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">Recent Disbursements</h2>
          <p className="text-sm text-gray-500 mb-4">
            Fee payments received from Schoolfee
          </p>

          <div className="space-y-4">
            {recentDisbursements.map((d, i) => (
              <div key={i} className="flex items-start justify-between py-3 border-b last:border-0">
                <div>
                  <div className="text-sm font-medium">{d.amount}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {d.students} students - {d.date}
                  </div>
                </div>
                <FiCheckCircle className="text-green-600" size={18} />
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/school/disbursements"
            className="flex items-center justify-center gap-2 w-full mt-4 border px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
          >
            View All Disbursements
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Partnership Summary */}
      <div className="bg-gray-100 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Partnership Summary</h3>
            <p className="text-sm text-gray-600 mt-1">
              Your school has been a Schoolfee partner since January 2022.
              Together, we've supported 156 students.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard/school/reports"
              className="border px-4 py-2 rounded-lg hover:bg-white text-sm"
            >
              View Reports
            </Link>

            <Link
              href="/contact"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
