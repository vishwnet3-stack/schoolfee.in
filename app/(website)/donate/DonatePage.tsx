"use client"

import { useState } from "react"
import {
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaGraduationCap,
} from "react-icons/fa"

const presetAmounts = [1000, 2500, 5000, 10000, 25000, 50000]

const impactExamples = [
  {
    amount: "Rs. 5,000",
    impact: "Supports one month of school fees for a child",
    icon: FaGraduationCap,
  },
  {
    amount: "Rs. 15,000",
    impact: "Helps a family through a full school term",
    icon: FaUsers,
  },
  {
    amount: "Rs. 50,000",
    impact: "Creates a mini-revolving fund supporting 5+ families",
    icon: FaHeart,
  },
]

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000)
  const [customAmount, setCustomAmount] = useState("")

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const currentAmount =
    customAmount ? parseInt(customAmount) || 0 : selectedAmount || 0

  return (
    <main className="bg-[#F6F5F1] min-h-screen">

      {/* HERO */}
      <section className="pt-24 pb-12 md:pt-10 md:pb-10">
        <div className="max-w-7xl mx-auto px-5 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#0B4C8A] mb-6">
            Donate to Schoolfee
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Donate to Schoolfee and help children continue their education without interruption during financial hardships.
          </p>
        </div>
      </section>


      {/* DONATION SECTION */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* ================= FORM ================= */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8">

              <h2 className="text-2xl font-semibold text-[#0B4C8A] mb-2">
                Make a Donation
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Donations are eligible for tax deduction under Section 80G. 
              </p>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#0B4C8A] mb-3">
                  Select Amount
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 px-4 rounded-lg border text-sm font-medium transition
                        ${selectedAmount === amount
                          ? "bg-[#0B4C8A] text-white border-[#0B4C8A]"
                          : "border-[#E5E7EB] hover:border-[#0B4C8A]/40"
                        }`}
                    >
                      Rs. {amount.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <span className="text-sm text-gray-500">
                    Or custom amount:
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) =>
                      handleCustomAmountChange(e.target.value)
                    }
                    placeholder="Enter amount"
                    className="border border-[#E5E7EB] rounded-md px-3 py-2 text-sm w-40 focus:outline-none focus:border-[#0B4C8A]"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="border-t border-[#E5E7EB] pt-6 space-y-5">

                <h3 className="font-semibold text-[#0B4C8A]">
                  Your Details
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="First Name"
                    className="border border-[#E5E7EB] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#0B4C8A]"
                  />
                  <input
                    placeholder="Last Name"
                    className="border border-[#E5E7EB] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#0B4C8A]"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-[#E5E7EB] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#0B4C8A]"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full border border-[#E5E7EB] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#0B4C8A]"
                />

                <input
                  placeholder="PAN Number (for tax receipt)"
                  className="w-full border border-[#E5E7EB] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#0B4C8A]"
                />

              </div>

              {/* Submit */}
              <div className="mt-8">
                <button className="w-full bg-[#F9A11B] text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:opacity-90 transition">
                  <FaHeart />
                  Donate Rs. {currentAmount.toLocaleString()}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  You will be redirected to our secure payment partner to
                  complete your donation.
                </p>
              </div>

            </div>


            {/* ================= SIDEBAR ================= */}
            <div className="lg:col-span-2 space-y-6">

              {/* Impact Card */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <h3 className="text-lg font-semibold text-[#0B4C8A] mb-5">
                  Your Impact
                </h3>

                <div className="space-y-5">
                  {impactExamples.map((example) => (
                    <div
                      key={example.amount}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#0B4C8A]/10 flex items-center justify-center">
                        <example.icon className="text-[#0B4C8A] text-sm" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0B4C8A]">
                          {example.amount}
                        </div>
                        <div className="text-sm text-gray-600">
                          {example.impact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Card */}
              <div className="bg-[#0B4C8A] text-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaShieldAlt className="text-lg" />
                  <div className="font-semibold">
                    Secure & Transparent
                  </div>
                </div>

                <ul className="space-y-2 text-sm text-white/90">
                  <li>100% donations support families</li>
                  <li>Tax receipt within 24 hours</li>
                  <li>Quarterly impact reports</li>
                  <li>Secure payment processing</li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
