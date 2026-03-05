"use client"

import Link from "next/link"
import {
  FiHeart,
  FiUsers,
  FiTrendingUp,
  FiDownload,
  FiArrowRight,
  FiAward,
} from "react-icons/fi"
import { FaRupeeSign, FaGraduationCap } from "react-icons/fa"

const stats = [
  {
    title: "Total Donated",
    value: "Rs. 25L",
    description: "Lifetime contribution",
    icon: FaRupeeSign,
  },
  {
    title: "Families Supported",
    value: "142",
    description: "Through your contributions",
    icon: FiUsers,
  },
  {
    title: "Children Educated",
    value: "187",
    description: "Education continuity ensured",
    icon: FaGraduationCap,
  },
  {
    title: "Multiplier Effect",
    value: "3.2x",
    description: "Impact amplification",
    icon: FiTrendingUp,
  },
]

const donations = [
  {
    date: "Jan 15, 2025",
    amount: "Rs. 5,00,000",
    program: "Fee Support Program",
    utilization: "100%",
  },
  {
    date: "Oct 1, 2024",
    amount: "Rs. 10,00,000",
    program: "Emergency Education Support",
    utilization: "92%",
  },
  {
    date: "Apr 15, 2024",
    amount: "Rs. 10,00,000",
    program: "General Corpus",
    utilization: "100%",
  },
]

const impactHighlights = [
  { label: "Schools Reached", value: "45" },
  { label: "States Covered", value: "8" },
  { label: "Teachers Supported", value: "24" },
  { label: "Repayment Rate", value: "98.4%" },
]

const certificates = [
  { title: "80G Tax Certificate 2024-25", date: "Jan 20, 2025" },
  { title: "CSR Utilization Report Q3", date: "Jan 5, 2025" },
  { title: "Impact Certificate 2024", date: "Dec 31, 2024" },
]

export default function DonorDashboard() {
  return (
    <div className="space-y-8 pt-16 lg:pt-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Donor Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome, TechCorp Foundation - CSR Partner since 2022
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/donor/reports"
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            <FiDownload size={16} />
            Download Reports
          </Link>

          <Link
            href="/funding/donate"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            <FiHeart size={16} />
            Donate Again
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon size={18} className="text-blue-600" />
              </div>

              <div className="mt-4">
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.title}</div>
                <div className="text-xs text-gray-400">
                  {stat.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Impact Highlight */}
      <div className="bg-blue-600 text-white rounded-xl p-6">
        <h3 className="font-semibold mb-4">Your Impact at a Glance</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {impactHighlights.map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-sm text-white/80">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Donation History */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Donation History</h3>
              <p className="text-sm text-gray-500">
                Your contributions and utilization
              </p>
            </div>
            <Link
              href="/dashboard/donor/donations"
              className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {donations.map((donation, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{donation.amount}</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      {donation.utilization} utilized
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {donation.program}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {donation.date}
                  </div>
                </div>

                <Link
                  href={`/dashboard/donor/donations/${index}`}
                  className="flex items-center text-sm text-blue-600 hover:underline"
                >
                  Details
                  <FiArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Certificates & Documents
          </h3>

          <div className="space-y-3">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FiAward size={18} className="text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">
                      {cert.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {cert.date}
                    </div>
                  </div>
                </div>

                <FiDownload
                  size={16}
                  className="text-gray-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/donor/certificates"
            className="flex items-center justify-center gap-2 w-full mt-4 px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            View All Documents
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Teacher Support */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <FaGraduationCap className="text-blue-600" size={18} />
          Teacher Support Program Impact
        </h3>

        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-gray-600">
              Teachers Supported
            </div>
          </div>

          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="text-2xl font-bold">Rs. 7.2L</div>
            <div className="text-sm text-gray-600">
              Allocated to Teachers
            </div>
          </div>

          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              96.2%
            </div>
            <div className="text-sm text-gray-600">
              Repayment Rate
            </div>
          </div>

          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-gray-600">
              Teacher Retention
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Your CSR contribution supports the Teacher Financial Support Program,
          ensuring educators facing temporary hardships can continue their work
          without financial stress.
        </p>
      </div>

      {/* CSR Compliance */}
      <div className="bg-gray-100 rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h3 className="font-semibold">CSR Compliance</h3>
            <p className="text-sm text-gray-600 mt-1">
              All contributions are Schedule VII compliant. Annual utilization
              reports and 80G certificates are generated automatically.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard/donor/reports"
              className="px-4 py-2 border rounded-lg text-sm hover:bg-white"
            >
              Utilization Reports
            </Link>

            <Link
              href="/contact"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
