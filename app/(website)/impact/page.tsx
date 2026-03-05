"use client"

import Link from "next/link"
import {
  FaUsers,
  FaGraduationCap,
  FaBuilding,
  FaRupeeSign,
  FaChartLine,
  FaMapMarkerAlt,
  FaArrowRight,
  FaDownload,
  FaCalendarAlt,
} from "react-icons/fa"


const keyMetrics = [
  { value: "15,847", label: "Children Supported", icon: FaGraduationCap, change: "+2,340 this year" },
  { value: "12,500+", label: "Families Helped", icon: FaUsers, change: "+1,890 this year" },
  { value: "523", label: "Partner Schools", icon: FaBuilding, change: "+78 this year" },
  { value: "Rs. 8.2 Cr", label: "Funds Disbursed", icon: FaRupeeSign, change: "+Rs. 1.8 Cr this year" },
  { value: "98.2%", label: "Repayment Rate", icon: FaChartLine, change: "Consistent" },
  { value: "12", label: "States Covered", icon: FaMapMarkerAlt, change: "+2 this year" },
]

export default function ImpactPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ================= HERO ================= */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 bg-[#F6F5F1]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-[#0B4C8A] mb-6">
              Our Impact
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Real numbers, real families, real change. Every statistic represents a child who
              continued their education and a family that maintained dignity.
            </p>
          </div>
        </div>
      </section>

      {/* ================= KEY METRICS ================= */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {keyMetrics.map((metric) => (
              <div
                key={metric.label}
                className="border border-[#E5E7EB] rounded-2xl p-6 bg-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#0B4C8A]/10 flex items-center justify-center">
                    <metric.icon className="text-[#0B4C8A]" />
                  </div>
                  <span className="text-xs text-[#0B4C8A] bg-[#0B4C8A]/10 px-2 py-1 rounded-full">
                    {metric.change}
                  </span>
                </div>

                <div className="text-2xl md:text-3xl font-semibold text-[#0B4C8A]">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STORIES ================= */}
      <section className="py-16 md:py-20 bg-[#F6F5F1]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">

          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0B4C8A] mb-4">
              Stories of Change
            </h2>
            <p className="text-gray-600">
              Behind every number is a family determined to continue their child’s education.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-6"
              >
                <div className="mb-4">
                  <div className="font-semibold text-[#0B4C8A]">
                    Priya Sharma
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-[#F9A11B] text-xs" />
                    Mumbai, Maharashtra
                  </div>
                </div>

                <p className="text-sm text-gray-600 italic mb-4 leading-relaxed">
                  “Schoolfee helped us during a very difficult time. Without their support,
                  my daughter would have had to leave school.”
                </p>

                <div className="border-t border-[#E5E7EB] pt-3 text-sm text-[#0B4C8A] font-medium">
                  Education continued successfully
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/impact/stories"
              className="inline-flex items-center text-[#F9A11B] font-medium text-sm"
            >
              Read More Stories
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= REPORTS ================= */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-6">

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0B4C8A] mb-4">
              Reports & Disclosures
            </h2>
            <p className="text-gray-600">
              Complete transparency in our operations and finances.
            </p>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border border-[#E5E7EB] rounded-xl p-4 hover:border-[#0B4C8A]/30 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0B4C8A]/10 flex items-center justify-center">
                    <FaCalendarAlt className="text-[#0B4C8A]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0B4C8A]">
                      Annual Report 2023-24
                    </div>
                    <div className="text-xs text-gray-500">
                      PDF - 4.2 MB
                    </div>
                  </div>
                </div>

                <button className="text-[#F9A11B] hover:opacity-80">
                  <FaDownload />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 md:py-20 bg-[#0B4C8A] text-white">
        <div className="max-w-4xl mx-auto px-5 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Be Part of This Impact
          </h2>
          <p className="text-white/80 mb-8">
            Every contribution protects another child’s education and another family’s dignity.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/funding/donate"
              className="bg-[#F9A11B] text-white px-6 py-3 rounded-md text-sm font-medium"
            >
              Donate Now
            </Link>

            <Link
              href="/contact"
              className="border border-white px-6 py-3 rounded-md text-sm font-medium hover:bg-white/10"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
