"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FaGraduationCap,
  FaHandHoldingHeart,
  FaSchool,
  FaHeartbeat,
  FaUsers,
  FaChild,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHeart,
  FaShieldAlt,
  FaHandshake,
  FaLightbulb,
  FaStar,
  FaChartLine,
  FaUserGraduate,
  FaHome,
  FaClock,
  FaMoneyBillWave,
  FaRocket,
  FaAward,
  FaCalendar,
  FaPiggyBank,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaBookOpen,
  FaBuilding,
  FaBullseye,
  FaExclamationCircle,
  FaRupeeSign,
  FaStethoscope,
} from "react-icons/fa";

const SchoolfeeProgramsPage = () => {
  const programs = [
    {
      icon: FaBookOpen,
      title: "Fee Support Program",
      description:
        "Our flagship program provides short-term, interest-free support for families facing temporary fee payment challenges.",
      objective:
        "Enable families to pay school fees on time without financial stress or borrowing from predatory sources.",
      whoHelps:
        "Middle-class and lower-income families facing temporary income disruptions, job transitions, or cash flow challenges.",
      fundsUsed:
        "Directly paid to schools as tuition and mandatory fees. Families repay in flexible, interest-free installments.",
      impact:
        "15,000+ children have continued their education without interruption through this program.",
      slug: "fee-support",
    },
    {
      icon: FaExclamationCircle,
      title: "Emergency Education Support",
      description:
        "Immediate assistance for families hit by unexpected crises that threaten their children's education.",
      objective:
        "Provide rapid response support when families face sudden emergencies like job loss, accidents, or natural disasters.",
      whoHelps:
        "Families experiencing acute crises: sudden unemployment, medical emergencies, natural disasters, or loss of breadwinner.",
      fundsUsed:
        "Fast-tracked fee payments within 24-48 hours of verification. Extended repayment terms for crisis situations.",
      impact:
        "Helped 2,500+ families maintain education continuity during their most challenging moments.",
      slug: "emergency",
    },
    {
      icon: FaBuilding,
      title: "School Partnership Program",
      description:
        "Partner schools receive timely fee payments while building stronger relationships with families.",
      objective:
        "Create a win-win partnership where schools get timely payments and families get understanding support.",
      whoHelps:
        "Schools seeking to support families without losing fee revenue. Families at partner schools with fee challenges.",
      fundsUsed:
        "Schools receive full fee payments directly. Reduced administrative burden of fee collection and follow-ups.",
      impact:
        "500+ partner schools across 12 states, supporting thousands of families each year.",
      slug: "school-partnership",
    },
    {
      icon: FaStethoscope,
      title: "Health-Linked Education Continuity",
      description:
        "Specialized support for families where health emergencies have impacted their ability to pay school fees.",
      objective:
        "Address the health-education linkage by supporting families dealing with medical crises.",
      whoHelps:
        "Families where a member is hospitalized, undergoing treatment, or recovering from serious illness.",
      fundsUsed:
        "School fees paid while families focus on health recovery. Extended repayment aligned with recovery timelines.",
      impact:
        "1,800+ families supported at the intersection of health challenges and education needs.",
      slug: "health-linked",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* hero section ui */}
      <section className="bg-[#F6F5F1] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-6 min-h-[90vh] flex flex-col justify-between py-12 md:py-10">
          {/* ================= TOP 50/50 GRID ================= */}
          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center flex-grow">
            {/* ================= LEFT SIDE ================= */}
            <div>
              <p className="text-[11px] tracking-[2px] text-[#0B4C8A] uppercase mb-3">
                Health Financial Inclusion Program
              </p>

              <h1 className="text-[34px] sm:text-[40px] md:text-[44px] leading-[1.1] font-bold text-[#0B4C8A]">
                Our Program Schoolfee
              </h1>

              <p className="mt-5 text-[15px] md:text-[16px] text-gray-600 leading-relaxed max-w-full">
                Comprehensive programs designed to address different aspects of
                education continuity challenges faced by families across India.
                Each program is tailored to specific needs while maintaining our
                core principles of dignity, transparency, and zero interest.
              </p>

              <div className="mt-6 md:mt-8">
                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2 bg-[#F9A11B] font-bold hover:opacity-90 transition text-black px-6 py-3 text-sm rounded-md"
                >
                  Learn More
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative w-full max-w-[480px]">
                {/* Top Image */}
                <div className="rounded-xl overflow-hidden">
                  <img
                    src="/images/Benefits for Parents.jpg"
                    className="w-full h-[260px] sm:h-[300px] md:h-[320px] object-cover"
                    alt="Our Program Schoolfee"
                  />
                </div>

                {/* Second Image Underlapping */}
                <div className="absolute -bottom-14 sm:-bottom-16 right-0 w-[70%] rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src="/home-page/Who Can Benefit.webp"
                    className="w-full h-[180px] sm:h-[200px] object-cover"
                    alt="Schoolfee Program"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= IMPROVED CARDS ================= */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mt-20 md:mt-24">
            {/* CARD 1 */}
            <div className="group bg-white p-5 md:p-6 rounded-xl border border-gray-200 hover:border-[#0B4C8A] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#0B4C8A]/10 flex items-center justify-center rounded-md">
                  <FaUsers className="text-[#0B4C8A] text-sm" />
                </div>
                <FaArrowRight className="text-gray-400 text-sm group-hover:text-[#0B4C8A] transition" />
              </div>

              <strong className="text-[17px] font-semibold text-[#0B4C8A]">
                Join Community
              </strong>

              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Supporting families across India to maintain education
                continuity through structured and dignified assistance.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="group bg-white p-5 md:p-6 rounded-xl border border-gray-200 hover:border-[#0B4C8A] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#F9A11B]/20 flex items-center justify-center rounded-md">
                  <FaClock className="text-[#F9A11B] text-sm" />
                </div>
                <FaArrowRight className="text-gray-400 text-sm group-hover:text-[#0B4C8A] transition" />
              </div>

              <strong className="text-[17px] font-semibold text-[#0B4C8A]">
                Instant Support
              </strong>

              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Quick approval within 24–48 hours ensuring families receive
                immediate and transparent financial assistance.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="group bg-white p-5 md:p-6 rounded-xl border border-gray-200 hover:border-[#0B4C8A] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#0B4C8A]/10 flex items-center justify-center rounded-md">
                  <FaSchool className="text-[#0B4C8A] text-sm" />
                </div>
                <FaArrowRight className="text-gray-400 text-sm group-hover:text-[#0B4C8A] transition" />
              </div>

              <strong className="text-[17px] font-semibold text-[#0B4C8A]">
                School Partnership
              </strong>

              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Direct school fee payments ensuring accountability, reduced
                administrative burden, and timely transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Welcome To Education Continuity{" "}
                <span className="text-blue-600">Real Solution</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We understand that life brings unexpected challenges. Our
                programs are designed to ensure that temporary financial
                difficulties don't become permanent barriers to your child's
                education.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Zero interest, zero hidden charges - complete transparency",
                  "Flexible repayment plans tailored to your situation",
                  "Direct payments to schools ensuring proper fund usage",
                  "Quick approval process with dignified support",
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="bg-yellow-400 rounded-full p-1 mt-1">
                      <FaCheckCircle className="w-4 h-4 text-slate-900" />
                    </div>
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 bg-[#F9A11B] font-bold hover:opacity-90 transition text-black px-6 py-3 text-sm rounded-md"
              >
                Contact Us
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <img
                    src="/our-program/1.jpg"
                    alt="Education Continuity Real Solution program"
                    className="w-full rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM LIST */}
      <section className="pb-16 md:pb-24 mt-15">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="space-y-14">
            {programs.map((program, index) => (
              <div
                key={program.title}
                id={program.slug}
                className={`scroll-mt-28 rounded-2xl border overflow-hidden ${index % 2 === 0
                  ? "bg-white border-[#E5E7EB]"
                  : "bg-orange-20 border-cyan-100"
                  }`}
              >
                <div className="p-6 md:p-10">
                  <div className="flex flex-col lg:flex-row gap-10">
                    {/* LEFT */}
                    <div className="lg:w-1/3">
                      <div
                        className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6
                  ${index % 2 === 0 ? "bg-[#0B4C8A]/10" : "bg-white"}`}
                      >
                        <program.icon className="w-6 h-6 text-[#0B4C8A]" />
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold text-[#0B4C8A] mb-4">
                        {program.title}
                      </h2>

                      <p className="text-gray-600 leading-relaxed mb-6">
                        {program.description}
                      </p>

                      <Link
                        href={`/our-program#${program.slug}`}
                        className="hidden inline-flex hidden items-center text-[#F9A11B] font-medium text-sm hover:underline"
                      >
                        {/* Donate & Support */}
                        {/* <FaArrowRight className="ml-2 w-4 h-4" /> */}
                      </Link>
                    </div>

                    {/* RIGHT DETAILS */}
                    <div className="lg:w-2/3 grid md:grid-cols-2 gap-6">
                      <div
                        className={`p-5 rounded-xl border 
                  ${index % 2 === 0
                            ? "bg-white border-[#E5E7EB]"
                            : "bg-white border-cyan-100"
                          }`}
                      >
                        <div className="flex items-center gap-2 text-md font-semibold text-[#0B4C8A] mb-3">
                          <FaBullseye className="w-4 h-4" />
                          Objective
                        </div>
                        <p className="text-sm text-gray-600">
                          {program.objective}
                        </p>
                      </div>

                      <div
                        className={`p-5 rounded-xl border 
                  ${index % 2 === 0
                            ? "bg-white border-[#E5E7EB]"
                            : "bg-white border-cyan-100"
                          }`}
                      >
                        <div className="flex items-center gap-2 text-md font-semibold text-[#0B4C8A] mb-3">
                          <FaUsers className="w-4 h-4" />
                          Who It Helps
                        </div>
                        <p className="text-sm text-gray-600">
                          {program.whoHelps}
                        </p>
                      </div>

                      <div
                        className={`p-5 rounded-xl border 
                  ${index % 2 === 0
                            ? "bg-white border-[#E5E7EB]"
                            : "bg-white border-cyan-100"
                          }`}
                      >
                        <div className="flex items-center gap-2 text-md font-semibold text-[#0B4C8A] mb-3">
                          <FaRupeeSign className="w-4 h-4" />
                          How Funds Are Used
                        </div>
                        <p className="text-sm text-gray-600">
                          {program.fundsUsed}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl bg-[#0B4C8A] text-white">
                        <div className="flex items-center gap-2 text-md font-semibold mb-3">
                          <FaStethoscope className="w-4 h-4" />
                          Impact
                        </div>
                        <p className="text-md text-white/90">
                          {program.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                19K+
              </div>
              <div className="text-gray-300">Children Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                15K+
              </div>
              <div className="text-gray-300">Families Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                500+
              </div>
              <div className="text-gray-300">Partner Schools</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">12</div>
              <div className="text-gray-300">States Covered</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolfeeProgramsPage;
