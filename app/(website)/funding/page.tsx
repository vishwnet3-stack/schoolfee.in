"use client"

import { Navigation } from "lucide-react"
// import { Navigation } from "@/components/navigation"
// import { Footer } from "@/components/footer"
import Link from "next/link"
import { 
  FaArrowRight, 
  FaUniversity, 
  FaHeart, 
  FaChartLine, 
  FaBuilding, 
  FaGift, 
  FaShieldAlt, 
  FaEye, 
  FaFileAlt 
} from "react-icons/fa"
import Footer from "../Footer"

const fundingOptions = [
  {
    icon: FaUniversity,
    title: "Corpus Fund",
    description: "Contribute to our permanent corpus that generates sustainable returns to support families year after year.",
    features: ["short-term impact", "Sustainable giving", "Named recognition options"],
    href: "/funding/corpus",
  },
  {
    icon: FaHeart,
    title: "Donate",
    description: "Make a one-time or recurring donation to directly support families facing school fee challenges.",
    features: ["Immediate impact", "Tax deductible (80G)", "Choose your amount"],
    href: "/funding/donate",
  },
  {
    icon: FaChartLine,
    title: "Invest for Impact",
    description: "For impact investors seeking measurable social returns alongside financial sustainability.",
    features: ["Impact metrics", "Financial reporting", "ESG compliance"],
    href: "/funding/invest",
  },
  {
    icon: FaBuilding,
    title: "CSR & Grants",
    description: "Partner with us to meet your CSR objectives with complete compliance and detailed impact reporting.",
    features: ["Schedule VII compliant", "Custom reporting", "Employee engagement"],
    href: "/funding/csr",
  },
  {
    icon: FaGift,
    title: "Sponsor a Program",
    description: "Sponsor an entire program or a cohort of families for concentrated, measurable impact.",
    features: ["Program ownership", "Direct connection", "Branded initiatives"],
    href: "/funding/sponsor",
  },
]

const transparencyPoints = [
  {
    icon: FaShieldAlt,
    title: "100% Accountable",
    description: "Every rupee is tracked from receipt to utilization. We publish detailed fund flow statements quarterly.",
  },
  {
    icon: FaEye,
    title: "Public Reporting",
    description: "Annual reports, audited financials, and impact assessments are publicly available on our website.",
  },
  {
    icon: FaFileAlt,
    title: "Third-Party Audited",
    description: "Independent auditors verify our financials. External evaluators assess our impact claims.",
  },
]

export default function FundingPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-gray-900 mb-6">
              Funding & Support
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your contribution to Schoolfee creates a revolving fund that helps families again and
              again. Unlike traditional donations that are spent once, your support multiplies over
              time as families repay and funds are reused.
            </p>
          </div>
        </div>
      </section>

      {/* How Your Funds Work */}
      <section className="pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray-200">
            <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">
              How Your Funds Create Impact
            </h2>
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-blue-600 mb-2">1</div>
                <p className="text-sm text-gray-600">You contribute to the fund</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-blue-600 mb-2">2</div>
                <p className="text-sm text-gray-600">Families receive interest-free support</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-blue-600 mb-2">3</div>
                <p className="text-sm text-gray-600">Families repay over time (98% rate)</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-blue-600 mb-2">4</div>
                <p className="text-sm text-gray-600">Funds help more families</p>
              </div>
            </div>
            <p className="text-center mt-8 text-gray-600">
              One donation of Rs. 50,000 can support <span className="text-blue-600 font-semibold">5+ families</span> over 3 years through this revolving model.
            </p>
          </div>
        </div>
      </section>

      {/* Funding Options */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
              Ways to Support
            </h2>
            <p className="text-lg text-gray-600">
              Choose the giving option that best aligns with your goals and capacity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundingOptions.map((option) => (
              <div
                key={option.title}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                  <option.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{option.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{option.description}</p>
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature) => (
                    <li key={feature} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={option.href}
                  className="inline-flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all"
                >
                  Learn more
                  <FaArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
              Complete Transparency
            </h2>
            <p className="text-lg text-gray-600">
              We believe donors have the right to know exactly how their funds are used. Our
              transparency practices go beyond regulatory requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {transparencyPoints.map((point) => (
              <div key={point.title} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <point.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/impact/reports"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors"
            >
              View Annual Reports
              <FaArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Your contribution, no matter the size, helps keep children in school. Start your
            impact journey today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/funding/donate"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors text-lg"
            >
              Donate Now
              <FaArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-lg"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}