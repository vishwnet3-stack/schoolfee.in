"use client"

import Link from "next/link"
import Image from "next/image"
import {
  FaFileAlt,
  FaCheckCircle,
  FaGraduationCap,
  FaHeart,
  FaUsers,
  FaBuilding,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaHandHoldingHeart,
  FaChartLine,
  FaCalendarAlt,
  FaCoins,
  FaStar,
  FaGift,
  FaTrophy,
} from "react-icons/fa"


const parentSteps = [
  {
    step: "01",
    icon: FaFileAlt,
    title: "Submit Application",
    description:
      "Fill out a simple online form with basic information about your child and school. No complex documentation needed upfront.",
  },
  {
    step: "02",
    icon: FaCheckCircle,
    title: "Verification",
    description:
      "Our team verifies your application confidentially and respectfully within 48 hours.",
  },
  {
    step: "03",
    icon: FaGraduationCap,
    title: "Fee Payment",
    description:
      "Once approved, we pay the school directly. Your child continues education without interruption.",
  },
  {
    step: "04",
    icon: FaHeart,
    title: "Flexible Repayment",
    description:
      "Repay in small, manageable installments. Zero interest, zero penalties.",
  },
]

const schoolSteps = [
  {
    step: "01",
    icon: FaShieldAlt,
    title: "Partner Registration",
    description:
      "Sign up as a partner school through our simple registration process.",
  },
  {
    step: "02",
    icon: FaCheckCircle,
    title: "Student Verification",
    description:
      "Verify enrolled students when parents apply for fee support.",
  },
  {
    step: "03",
    icon: FaClock,
    title: "Receive Payment",
    description:
      "Get timely fee payments directly deposited to your school account.",
  },
  {
    step: "04",
    icon: FaUsers,
    title: "Support Students",
    description:
      "Help families stay enrolled without financial stress or stigma.",
  },
]

const donorSteps = [
  {
    step: "01",
    icon: FaHandHoldingHeart,
    title: "Choose Your Impact",
    description:
      "Select how you'd like to contribute - one-time or recurring donations.",
  },
  {
    step: "02",
    icon: FaCheckCircle,
    title: "Funds Deployed",
    description:
      "Your contribution is used to support families in need immediately.",
  },
  {
    step: "03",
    icon: FaChartLine,
    title: "Track Impact",
    description:
      "Receive regular updates on families helped and impact created.",
  },
  {
    step: "04",
    icon: FaHeart,
    title: "Funds Recycle",
    description:
      "As families repay, funds help more children - multiplying your impact.",
  },
]

const repaymentPlans = [
  {
    months: "6",
    title: "6-Month Pay Regular",
    participation: "6 Months",
    repayment: "2-3 Months",
    icon: FaCalendarAlt,
    highlight: false,
  },
  {
    months: "8",
    title: "8-Month Pay Regular",
    participation: "8 Months",
    repayment: "4-5 Months",
    icon: FaCalendarAlt,
    highlight: true,
  },
  {
    months: "12",
    title: "12-Month Pay Regular",
    participation: "12 Months",
    repayment: "6-7 Months",
    icon: FaCalendarAlt,
    highlight: false,
  },
  {
    months: "24",
    title: "Hardship Support",
    participation: "24 Months",
    repayment: "28-30 Months",
    icon: FaShieldAlt,
    highlight: false,
    special: true,
  },
]

const memberBenefits = [
  {
    icon: FaUsers,
    title: "Community Pool",
    description: "Your payments contribute to supporting parents with children in higher classes",
  },
  {
    icon: FaCoins,
    title: "Reward Points",
    description: "Earn points through participation and regular payments",
  },
  {
    icon: FaGift,
    title: "Donate Points",
    description: "Use accumulated points to enroll other parents into the community",
  },
  {
    icon: FaHeart,
    title: "Support Students",
    description: "Redeem points for school fees, books, and uniforms for needy students",
  },
  {
    icon: FaTrophy,
    title: "Founding Members",
    description: "First 100 parents get Life Member status with special recognition",
  },
  {
    icon: FaGraduationCap,
    title: "Future Access",
    description: "Access to graduation programs and educational courses",
  },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white"> 

      {/* ================= HERO ================= */}
      <section className="pt-16 pb-8 md:pt-24 md:pb-12 lg:pt-4 lg:pb-16 bg-gradient-to-br from-[#F6F5F1] to-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-block bg-[#0B4C8A]/10 text-[#0B4C8A] px-3 py-1 rounded-full text-xs font-medium mb-3">
                Simple & Transparent Process
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0B4C8A] mb-3 lg:mb-4 leading-tight">
                How Schoolfee Works
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-1 lg:mb-6">
                A simple, dignified process connecting families, schools, and donors to cover school fees. No complex procedures. No stigma. No interest.
              </p>
              <p className="text-base sm:text-lg text-gray-600 font-bold leading-relaxed mb-5 lg:mb-6">
               <i> Individuals and institutions can participate via donation to support the community.</i>  
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-3 gap-3 mb-5 lg:mb-6">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xl lg:text-2xl font-bold text-[#0B4C8A] mb-1">0%</div>
                  <div className="text-xs text-gray-600">Interest</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xl lg:text-2xl font-bold text-[#0B4C8A] mb-1">48hrs</div>
                  <div className="text-xs text-gray-600">Processing</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xl lg:text-2xl font-bold text-[#0B4C8A] mb-1">100%</div>
                  <div className="text-xs text-gray-600">Dignified</div>
                </div>
              </div>
              

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center bg-[#F9A11B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#E69010] transition"
                >
                  Donate & Suppport
                  <FaArrowRight className="ml-2 text-xs" />
                </Link>
                <Link
                  href="/about-us"
                  className="inline-flex items-center justify-center border-2 border-[#0B4C8A] text-[#0B4C8A] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0B4C8A] hover:text-white transition"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:h-[450px] h-[300px] rounded-2xl overflow-hidden">
              <Image
                src="/how/banner.jpg"
                alt="School fees support process"
                fill
                className="object-cover"
                priority                
              />
              
              {/* Floating stats card */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#F9A11B] rounded-lg flex items-center justify-center">
                    <FaGraduationCap className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Students Helped</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOR PARENTS ================= */}
      <section id="parents" className="py-10 md:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">

          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-[#0B4C8A] flex items-center justify-center flex-shrink-0">
              <FaUsers className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-[#0B4C8A]">
                For Parents
              </h2>
              <p className="text-gray-600 text-xs lg:text-sm">
                Interest-free, dignified support
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {parentSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-[#E5E7EB] rounded-xl lg:rounded-2xl p-4 lg:p-5 hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl lg:text-3xl font-semibold text-[#0B4C8A]/20 mb-3">
                  {item.step}
                </div>

                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-[#0B4C8A]/10 flex items-center justify-center mb-3">
                  <item.icon className="text-[#0B4C8A] text-base lg:text-lg" />
                </div>

                <h3 className="text-base lg:text-lg font-semibold text-[#0B4C8A] mb-2">
                  {item.title}
                </h3>

                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 lg:mt-8 text-center">
            <Link
              href="/registration/parent"
              className="inline-flex items-center bg-[#F9A11B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#E69010] transition"
            >
              Apply for Fee Support
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= REPAYMENT STRUCTURE ================= */}
      <section className="py-8 md:py-10 lg:py-12 bg-gradient-to-br from-[#F6F5F1] to-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-block bg-[#0B4C8A]/10 text-[#0B4C8A] px-3 py-1 rounded-full text-xs font-medium mb-2">
              0% Interest Always
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#0B4C8A] mb-2">
              Interest-Free Repayment Structure
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
              Repayment eligibility and duration are based on continuous participation and regular school fee payments through the Schoolfee platform using CarePay.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {repaymentPlans.map((plan) => (
              <div
                key={plan.months}
                className={`relative bg-white rounded-xl p-4 lg:p-5 transition-all ${
                  plan.highlight 
                    ? 'ring-2 ring-[#F9A11B] shadow-lg' 
                    : 'border border-[#E5E7EB] hover:shadow-md'
                } ${plan.special ? 'border-2 border-[#0B4C8A]' : ''}`}
              >
                
                
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    plan.special ? 'bg-[#0B4C8A]' : 'bg-[#0B4C8A]/10'
                  }`}>
                    <plan.icon className={`text-base ${plan.special ? 'text-white' : 'text-[#0B4C8A]'}`} />
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-[#0B4C8A]">
                    {plan.title}
                  </h3>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Participation:</span>
                    <span className="font-semibold text-[#0B4C8A]">{plan.participation}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Repayment:</span>
                    <span className="font-semibold text-[#0B4C8A]">{plan.repayment}</span>
                  </div>
                </div>

                {plan.special && (
                  <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Available for verified severe financial hardship cases
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-[#0B4C8A]/20">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-[#0B4C8A] text-lg flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#0B4C8A] mb-1">
                  Eligibility & Support
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Members become eligible for Emergency School Fee Support after completing their participation period. 
                  All repayment plans are 100% interest-free with flexible terms based on your continuous participation through the Schoolfee platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MEMBER BENEFITS ================= */}
      <section className="py-8 md:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-block bg-[#F9A11B]/10 text-[#F9A11B] px-3 py-1 rounded-full text-xs font-medium mb-2">
              Community Support
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#0B4C8A] mb-2">
              Additional Member Benefits
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
              Building a stronger community together through participation and mutual support
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {memberBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#F6F5F1] to-white border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F9A11B]/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="text-[#F9A11B] text-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm lg:text-base font-semibold text-[#0B4C8A] mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-[#0B4C8A] to-[#094076] rounded-xl p-4 lg:p-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-center md:text-left">
                <h3 className="text-base lg:text-lg font-semibold text-white mb-1">
                  Join as a Founding Member
                </h3>
                <p className="text-xs lg:text-sm text-white/90">
                  First 100 parents get exclusive Life Member status with special recognition
                </p>
              </div>
              <Link
                href="/registration/parent"
                className="inline-flex items-center bg-[#F9A11B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#E69010] transition whitespace-nowrap"
              >
                Get Started
                <FaArrowRight className="ml-2 text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOR SCHOOLS ================= */}
      <section className="py-10 md:py-14 lg:py-16 bg-[#F6F5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">

          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-[#0B4C8A] flex items-center justify-center flex-shrink-0">
              <FaBuilding className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-[#0B4C8A]">
                For Schools
              </h2>
              <p className="text-gray-600 text-xs lg:text-sm">
                Timely payments & stronger relationships
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {schoolSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-[#E5E7EB] rounded-xl lg:rounded-2xl p-4 lg:p-5 hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl lg:text-3xl font-semibold text-[#0B4C8A]/20 mb-3">
                  {item.step}
                </div>

                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-[#0B4C8A]/10 flex items-center justify-center mb-3">
                  <item.icon className="text-[#0B4C8A] text-base lg:text-lg" />
                </div>

                <h3 className="text-base lg:text-lg font-semibold text-[#0B4C8A] mb-2">
                  {item.title}
                </h3>

                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 lg:mt-8 text-center">
            <Link
              href="/registration/school"
              className="inline-flex items-center border-2 border-[#0B4C8A] text-[#0B4C8A] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0B4C8A] hover:text-white transition"
            >
              Become a Partner School
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= FOR DONORS ================= */}
      <section className="py-10 md:py-14 lg:py-16 bg-gradient-to-br from-[#0B4C8A] to-[#094076] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">

          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <FaHeart className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold">
                For Donors & CSR
              </h2>
              <p className="text-white/80 text-xs lg:text-sm">
                Transparent and multiplying impact
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {donorSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-5 hover:bg-white/15 transition-all"
              >
                <div className="text-2xl lg:text-3xl font-semibold text-white/30 mb-3">
                  {item.step}
                </div>

                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                  <item.icon className="text-white text-base lg:text-lg" />
                </div>

                <h3 className="text-base lg:text-lg font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-xs lg:text-sm text-white/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 lg:mt-8 text-center">
            <Link
              href="/donate"
              className="inline-flex items-center bg-[#F9A11B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#E69010] transition"
            >
              Donate Now
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#0B4C8A] mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 text-sm lg:text-base mb-5 lg:mb-6">
            Join thousands of families, schools, and donors creating educational opportunities together.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center bg-[#0B4C8A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#094076] transition"
            >
              Contact Us
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}