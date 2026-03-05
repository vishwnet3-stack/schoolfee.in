"use client"

import Link from "next/link"
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiArrowRight,
  FiBell,
} from "react-icons/fi"
import { FaRupeeSign } from "react-icons/fa"

const stats = [
  {
    title: "Active Applications",
    value: "1",
    description: "Currently in process",
    icon: FiFileText,
  },
  {
    title: "Total Support Received",
    value: "Rs. 45,000",
    description: "For 2024-25 academic year",
    icon: FaRupeeSign,
  },
  {
    title: "Amount Repaid",
    value: "Rs. 30,000",
    description: "67% of total",
    icon: FiCheckCircle,
  },
  {
    title: "Next Payment",
    value: "Rs. 5,000",
    description: "Due Feb 15, 2025",
    icon: FiCalendar,
  },
]

const applications = [
  {
    id: "APP-2024-1234",
    child: "Rahul Sharma",
    school: "Delhi Public School, Vasant Kunj",
    amount: "Rs. 45,000",
    status: "approved",
    date: "Dec 15, 2024",
  },
  {
    id: "APP-2023-5678",
    child: "Priya Sharma",
    school: "Delhi Public School, Vasant Kunj",
    amount: "Rs. 38,000",
    status: "completed",
    date: "Aug 10, 2023",
  },
]

const notifications = [
  {
    title: "Payment Reminder",
    message: "Your next installment of Rs. 5,000 is due on February 15, 2025.",
    time: "2 days ago",
    type: "reminder",
  },
  {
    title: "Application Approved",
    message: "Your fee support application for Rahul has been approved.",
    time: "1 week ago",
    type: "success",
  },
  {
    title: "Document Received",
    message: "We have received your updated income certificate.",
    time: "2 weeks ago",
    type: "info",
  },
]

const upcomingPayments = [
  { date: "Feb 15, 2025", amount: "Rs. 5,000", status: "upcoming" },
  { date: "Mar 15, 2025", amount: "Rs. 5,000", status: "scheduled" },
  { date: "Apr 15, 2025", amount: "Rs. 5,000", status: "scheduled" },
]

export default function ParentDashboard() {
  return (
    <div className="space-y-8 pt-16 lg:pt-0">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back, Priya
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s an overview of your fee support status and upcoming payments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white border rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon size={18} className="text-blue-600" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.title}</div>
                <div className="text-xs text-gray-400">{stat.description}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Applications */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Your Applications</h3>
              <p className="text-sm text-gray-500">Track your fee support applications</p>
            </div>
            <Link href="/dashboard/applications" className="text-sm border px-3 py-1 rounded-md hover:bg-gray-100">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="flex justify-between p-4 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{app.child}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      app.status === "approved"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}>
                      {app.status === "approved" ? "Active" : "Completed"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{app.school}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {app.id} - Applied {app.date}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">{app.amount}</div>
                  <Link
                    href={`/dashboard/applications/${app.id}`}
                    className="text-sm text-blue-600 flex items-center justify-end mt-1 hover:underline"
                  >
                    Details <FiArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <Link href="/dashboard/notifications">
              <FiBell size={18} />
            </Link>
          </div>

          <div className="space-y-4">
            {notifications.map((n, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {n.type === "reminder" ? (
                    <FiClock size={16} className="text-yellow-600" />
                  ) : n.type === "success" ? (
                    <FiCheckCircle size={16} className="text-green-600" />
                  ) : (
                    <FiAlertCircle size={16} className="text-gray-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-gray-600">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repayment Schedule */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Repayment Schedule</h3>
            <p className="text-sm text-gray-500">Upcoming installments</p>
          </div>
          <Link href="/dashboard/schedule" className="text-sm border px-3 py-1 rounded-md hover:bg-gray-100 flex items-center gap-1">
            View Full Schedule <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {upcomingPayments.map((payment, i) => (
            <div key={i} className="w-48 flex-shrink-0 border rounded-lg p-4">
              <div className="text-sm text-gray-500">{payment.date}</div>
              <div className="text-lg font-semibold mt-1">{payment.amount}</div>
              {payment.status === "upcoming" && (
                <button className="w-full mt-3 bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700">
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-100 rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h3 className="font-semibold">Need Help?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Our support team is here to assist you.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="px-4 py-2 border rounded-lg text-sm hover:bg-white">
              FAQs
            </Link>
            <Link href="/contact" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
