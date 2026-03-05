"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import {
  FaHandsHelping,
  FaHeartbeat,
  FaGraduationCap,
  FaUsers,
  FaChalkboardTeacher,
  FaShieldAlt,
  FaNetworkWired,
  FaHome,
  FaCity,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSeedling,
  FaBalanceScale,
  FaLock,
  FaEye,
  FaUserShield,
  FaPlayCircle,
  FaBriefcase,
  FaChartLine,
  FaHandshake,
  FaHospital,
  FaUserTie,
  FaSearch,
} from "react-icons/fa";

export default function SchoolfeeMissionPage() {
  const [activeTab, setActiveTab] = useState(0);

  const causes = [
    {
      id: 0,
      shortTitle: "Financial Stress",
      fullTitle:
        "Financial Stress as the Root of Physical & Mental Health Issues",
      icon: FaExclamationTriangle,
      image: "/our-mission/2.jpg",
      subtitle:
        "In today's India, financial stress has become a public health crisis.",
      sectionTitle: "Key impacts:",
      points: [
        "Medical emergencies drain household savings",
        "Income disruptions create chronic anxiety",
        "Debt pressure leads to depression and burnout",
        'Parents silently absorb stress to "keep things going"',
      ],
      sectionTitle2: "The ripple effect:",
      points2: [
        "Children absorb this stress",
        "Teachers carry it into classrooms",
        "Families fracture under its weight",
      ],
      conclusion:
        "Financial stress is no longer just an economic issue—it's a critical public health challenge.",
    },
    {
      id: 1,
      shortTitle: "Social Security",
      fullTitle: "Absence of a Consolidated Social Security Framework",
      icon: FaShieldAlt,
      image: "/our-mission/3.jpg",
      subtitle:
        "India lacks a single, integrated social protection system that supports families during short-term distress.",
      sectionTitle: "Current systems are:",
      points: [
        "Fragmented",
        "Eligibility-bound",
        "Delayed",
        "Credit-driven",
        "Often inaccessible to the working middle class",
      ],
      sectionTitle2: "As a result:",
      points2: [
        "Families fall between systems",
        "Temporary problems become permanent scars",
        "Education and health pay the price",
      ],
      conclusion:
        "Our mission is to fill this gap with a structured, ethical, and community-backed framework—not charity, not debt.",
    },
    {
      id: 2,
      shortTitle: "Urbanisation & Migration",
      fullTitle: "Urbanisation, Nuclear Families & Migration",
      icon: FaCity,
      image: "/our-mission/4.jpg",
      subtitle: "India's social fabric has changed rapidly in recent decades.",
      sectionTitle: "Urbanisation and livelihood migration have led to:",
      points: [
        "Nuclear families replacing joint families",
        "Loss of traditional emotional and financial support",
        "Isolation in cities",
        "Weak neighbourhood and community ties",
      ],
      sectionTitle2: "Earlier, families relied on:",
      points2: [
        "Extended relatives",
        "Community elders",
        "Informal support networks",
      ],
      conclusion:
        "Our mission recognizes that modern India needs modern community systems to replace what urbanisation has dismantled.",
    },
  ];

  const activeCause = causes[activeTab];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Large Image */}
      <section className="relative bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="circles"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="2" fill="#0A4D8C" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-2 py-10 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block bg-orange-200 text-orange-800 px-6 py-2 rounded-full text-sm font-semibold">
                NATIONAL MISSION
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
                Our Mission
              </h1>
              <h2 className="text-2xl lg:text-3xl font-bold text-blue-900">
                Education Continuity Through National Health Financial Inclusion
                Initiative Program
              </h2>
              <p className="text-lg lg:text-xl text-gray-700">
                Schoolfee.org — The Flagship Program of Community Health Mission
                & India Health Fund Limited
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/about-us"
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center gap-2"
                >
                  LEARN MORE
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            </div>

            {/* Right Image Area */}
            <div className="relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full opacity-40 blur-3xl"></div>
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop"
                  alt="Happy students"
                  className="rounded-3xl shadow-2xl w-full"
                />
                {/* Floating Stats */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden sm:block">
                  <div className="flex items-center gap-3">
                    <FaGraduationCap className="text-blue-600 text-4xl" />
                    <div>
                      {/* <div className="text-3xl font-bold text-gray-900">5702</div> */}
                      <div className="text-sm text-gray-600">
                        Students Helped
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden sm:block">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-orange-500 text-4xl" />
                    <div>
                      {/* <div className="text-3xl font-bold text-gray-900">4,310</div> */}
                      <div className="text-sm text-gray-600">
                        Families Supported
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-2 py-4 lg:p-16">
            <h2 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Mission Statement
            </h2>
            <p className="text-lg lg:text-xl leading-relaxed text-gray-700 text-center max-w-4xl mx-auto">
              Our mission is to protect children, families, teachers, and
              communities from health-related financial stress by building a
              structured, humane, and community-led financial inclusion
              framework—so that education, health, and dignity are never
              compromised due to temporary financial hardship.
            </p>
            <p className="text-lg lg:text-xl leading-relaxed text-gray-700 text-center max-w-5xl mx-auto mt-6">
              Schoolfee.org is the flagship program of Community Health Mission
              (CHM) and India Health Fund Limited (IHFL), operating under the
              broader national vision of National Health Financial Inclusion
              Initiative Program.
            </p>
          </div>
        </div>
      </section>

      {/* The Belief Section with Image */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
            {/* Image Side */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-orange-300 opacity-20 blur-3xl"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded w-full max-w-md mx-auto flex items-center justify-center overflow-hidden">
                  <img
                    src="/our-mission/our-mission-1.jpg"
                    alt="Community support"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-8 -right-8 bg-blue-600 text-white p-8 rounded-2xl shadow-2xl max-w-xs hidden sm:block">
                  <div className="text-4xl font-bold">10+</div>
                  <div className="text-lg">Years of Experience</div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="text-sm text-orange-500 font-semibold tracking-wider uppercase">
                WHO WE ARE
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                The Belief That Drives Our Mission
              </h2>
              <p className="text-lg text-gray-700">
                At Community Health Mission, we believe that finance is the
                single most common root cause of health distress in India—both
                physical and mental. Health issues rarely begin with illness
                alone. They begin with financial stress, uncertainty, and the
                absence of support systems.
              </p>
              <div className="">
                <p className="text-xl font-bold text-gray-900 mb-4">
                  When families face financial instability:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl">
                    <FaCheckCircle className="text-orange-500 mt-1 flex-shrink-0 text-xl" />
                    <p className="text-gray-700">
                      Physical health deteriorates
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl">
                    <FaCheckCircle className="text-orange-500 mt-1 flex-shrink-0 text-xl" />
                    <p className="text-gray-700">
                      Mental health suffers silently
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl">
                    <FaCheckCircle className="text-orange-500 mt-1 flex-shrink-0 text-xl" />
                    <p className="text-gray-700">
                      Education continuity collapses
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl">
                    <FaCheckCircle className="text-orange-500 mt-1 flex-shrink-0 text-xl" />
                    <p className="text-gray-700">Social relationships weaken</p>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl">
                    <FaCheckCircle className="text-orange-500 mt-1 flex-shrink-0 text-xl" />
                    <p className="text-gray-700">Children lose confidence</p>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl">
                    <FaCheckCircle className="text-orange-500 mt-1 flex-shrink-0 text-xl" />
                    <p className="text-gray-700">short-term damage follows</p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-900 font-bold pt-4">
                Our mission exists to intervene at the financial stress
                point—before health and education break down.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Causes Section with Tabs */}
      <section
        className="py-6 md:py-8 bg-gradient-to-b from-gray-50 to-white scroll-mt-28"
        id="core-challenges"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-2">
          {/* Section Header */}
          <div className="text-center mb-3 md:mb-4">
            <div className="text-xs font-semibold tracking-wider uppercase mb-2 text-[#F4951D]">
              CRITICAL CHALLENGES
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              The Three Core Causes of India's Hidden Health Crisis
            </h2>
          </div>

          {/* Tabs - Centered Pills on Top */}
          <div className="mb-2 rounded-full mb-3">
            <div className="flex gap-1 overflow-x-auto scroll-smooth sm:justify-center py-2 px-2 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {causes.map((cause, index) => {
                const IconComponent = cause.icon;
                return (
                  <button
                    key={cause.id}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap flex-shrink-0 transition-all ${
                      activeTab === index
                        ? "bg-[#00468E] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                  >
                    <IconComponent
                      className={`text-base ${
                        activeTab === index ? "text-white" : "text-[#00468E]"
                      }`}
                    />
                    <span className="text-sm font-semibold">
                      {cause.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two Column Layout: Image Left, Content Right */}
          <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* LEFT: Image */}
            <div className="order-2 lg:order-1">
              <div className="relative h-[300px] lg:min-h-full lg:min-h-[310px] rounded-xl overflow-hidden">
                <img
                  src={activeCause.image}
                  alt={activeCause.fullTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* RIGHT: Content */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-2 sm:p-4 h-full flex flex-col">
                {/* Content Wrapper with controlled spacing */}
                <div className="flex flex-col gap-3">
                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">
                    {activeCause.fullTitle}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-md text-gray-600 leading-relaxed">
                    {activeCause.subtitle}
                  </p>

                  {/* Section 1 Card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-2">
                    <h4 className="text-md font-semibold text-[#00468E] uppercase tracking-wide">
                      {activeCause.sectionTitle}
                    </h4>

                    <div className="flex flex-col gap-1 mt-2">
                      {activeCause.points.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-1 bg-white border border-gray-100 rounded-lg px-3 py-0"
                        >
                          <FaCheckCircle className="text-[#00468E] text-md mt-1 flex-shrink-0" />
                          <p className="text-md text-gray-800 leading-snug">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2 Card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-2">
                    <h4 className="text-md font-semibold text-[#00468E] uppercase tracking-wide">
                      {activeCause.sectionTitle2}
                    </h4>

                    <div className="flex flex-col gap-1 mt-1">
                      {activeCause.points2.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-1 bg-white border border-gray-100 rounded-lg px-3 py-0"
                        >
                          <FaCheckCircle className="text-[#00468E] text-md mt-1 flex-shrink-0" />
                          <p className="text-md text-gray-800 leading-snug">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Conclusion Card */}
                  <div className="bg-[#EEF2FF] border border-indigo-100 rounded-xl p-2">
                    <p className="text-md text-gray-900 font-medium leading-relaxed">
                      {activeCause.conclusion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* National Health Financial Inclusion Approach */}
      <section
        className="py-20 bg-gradient-to-br from-blue-50 to-blue-100 scroll-mt-18"
        id="our-framework"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-6">
              National Health Financial Inclusion Initiative Program: Our
              Approach
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Health, education, and finance are deeply interconnected. Under
              National Health Financial Inclusion Initiative Program, we work on
              the principle that:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 text-center transition">
              <div className="bg-blue-100 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-blue-600 text-4xl" />
              </div>
              <p className="text-lg text-gray-700 font-semibold">
                Financial protection is preventive healthcare
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 text-center transition">
              <div className="bg-orange-100 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaGraduationCap className="text-orange-600 text-4xl" />
              </div>
              <p className="text-lg text-gray-700 font-semibold">
                Education continuity is mental health protection
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 text-center transition">
              <div className="bg-blue-100 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-blue-600 text-4xl" />
              </div>
              <p className="text-lg text-gray-700 font-semibold">
                Social support reduces short-term public health costs
              </p>
            </div>
          </div>

          <p className="text-xl text-gray-700 text-center mt-12 max-w-3xl mx-auto">
            Schoolfee addresses this intersection by ensuring that temporary
            financial stress does not become a lifelong disadvantage.
          </p>
        </div>
      </section>

      {/* What Schoolfee Stands For - Header */}
      <section
        className="pt-20 pb-4 bg-white scroll-mt-8"
        id="what-we-stand-for"
      >
        <div className="max-w-8xl mx-auto px-6 text-center">
          <div className="text-sm text-orange-500 font-semibold tracking-wider uppercase">
            FEATURED SERVICES
          </div>
          <h2 className="text-4xl lg:text-4xl font-bold text-gray-900">
            What Schoolfee Stands For
          </h2>
        </div>
      </section>

      {/* Education Without Fear - Card Grid */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Compact Card Section */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-[#00468E] text-white p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-0">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <FaGraduationCap className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
                    Education Without Fear
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base opacity-90 mb-4">
                  We ensure children remain in school even when families face:
                </p>

                {/* Risk Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {[
                    "Health emergencies",
                    "Salary delays",
                    "Income disruption",
                    "Temporary financial stress",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/10 p-3 rounded-lg backdrop-blur-sm"
                    >
                      <p className="text-sm sm:text-base">{item}</p>
                    </div>
                  ))}
                </div>

                {/* Support Title */}
                <p className="text-sm sm:text-base font-semibold mb-3">
                  Support is:
                </p>

                {/* Support Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Interest-free",
                    "Short-term",
                    "Paid directly to schools",
                    "Transparent and accountable",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/10 p-3 rounded-lg backdrop-blur-sm"
                    >
                      <p className="text-sm sm:text-base">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dignity Card */}
            <div className="bg-white rounded-3xl p-10 shadow-lg">
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FaHandsHelping className="text-orange-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Dignity for Parents & Guardians
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Parents are caregivers—not defaulters.
              </p>
              <p className="text-gray-900 font-bold mb-3">We reject:</p>
              <div className="space-y-2 text-gray-700">
                <p>• Credit-score-based judgement</p>
                <p>• Penalties and intimidation</p>
                <p>• Dehumanised decision-making</p>
              </div>
              <p className="text-gray-700 mt-4 leading-relaxed">
                Temporary hardship is treated as a human reality, not a moral
                failure.
              </p>
            </div>

            {/* Teachers Card */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-10">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FaChalkboardTeacher className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Stability & Respect for Teachers
              </h3>
              <p className="text-gray-900 font-bold mb-3">
                Teachers are among the most affected by:
              </p>
              <div className="grid grid-cols-2 gap-3 text-gray-700 mb-4">
                <div className="bg-white p-3 rounded-xl">Suppressed wages</div>
                <div className="bg-white p-3 rounded-xl">Delayed salaries</div>
                <div className="bg-white p-3 rounded-xl">
                  Financial insecurity
                </div>
                <div className="bg-white p-3 rounded-xl">Mental stress</div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Supporting teachers is protective healthcare for the education
                system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology as Trust Infrastructure */}
      <section
        className="pt-20 pb-10 bg-gray-50 scroll-mt-18"
        id="trust-governance"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-6">
              Technology as Trust Infrastructure
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We use technology to protect people—not control them:
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-blue-600 text-3xl" />
              </div>
              <p className="text-gray-700 font-medium">
                Digital payments for safe, direct fund flow
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaEye className="text-orange-600 text-3xl" />
              </div>
              <p className="text-gray-700 font-medium">
                Blockchain for transparent utilisation
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaBalanceScale className="text-blue-600 text-3xl" />
              </div>
              <p className="text-gray-700 font-medium">
                AI to assist fairness—not replace human judgment
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaUserShield className="text-orange-600 text-3xl" />
              </div>
              <p className="text-gray-700 font-medium">Privacy protection</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white">
            <h3 className="text-3xl lg:text-4xl font-bold">
              No credit scores. No automated rejection. No permanent labels.
            </h3>
          </div>
        </div>
      </section>

      {/* Institutional Commitment */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&h=800&fit=crop"
            alt="Team"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-4xl font-bold mb-4">
              Institutional Commitment
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-3xl p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 p-4 rounded-2xl">
                  <FaHeartbeat className="text-white text-4xl" />
                </div>
                <h3 className="text-2xl lg:text-2xl text-black font-bold">
                  Community Health Mission (CHM)
                </h3>
              </div>
              <div className="space-y-3 text-black">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-blue-400 mt-1 flex-shrink-0" />
                  <p>
                    Anchors ethics, community participation, and grievance
                    redressal
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-blue-400 mt-1 flex-shrink-0" />
                  <p>Integrates health, education, and social protection</p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-blue-400 mt-1 flex-shrink-0" />
                  <p>Upholds dignity-first principles</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur rounded-3xl p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-600 p-4 rounded-2xl">
                  <FaLock className="text-white text-4xl" />
                </div>
                <h3 className="text-2xl lg:text-2xl text-black font-bold">
                  India Health Fund Limited (IHFL)
                </h3>
              </div>
              <div className="space-y-3 text-black">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <p>Acts as fiduciary steward of funds</p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <p>Ensures compliance and transparency</p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <p>Manages sustainability and short-term impact</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xl text-center mt-12 opacity-90">
            Participation in community systems is never tied to financial
            ownership.
          </p>
        </div>
      </section>

      {/* What We Are Building */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-6">
              What We Are Building for India
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <FaShieldAlt className="text-blue-600 text-4xl mx-auto mb-4" />
              <p className="text-lg text-gray-700">
                A society where financial stress does not become a health crisis
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <FaGraduationCap className="text-orange-600 text-4xl mx-auto mb-4" />
              <p className="text-lg text-gray-700">
                A system where children are protected from family hardship
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <FaChalkboardTeacher className="text-blue-600 text-4xl mx-auto mb-4" />
              <p className="text-lg text-gray-700">
                An ecosystem where teachers are supported, not exploited
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <FaHome className="text-orange-600 text-4xl mx-auto mb-4" />
              <p className="text-lg text-gray-700">
                A future where urbanisation does not mean isolation
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 text-center lg:col-span-2">
              <FaHeartbeat className="text-blue-600 text-4xl mx-auto mb-4" />
              <p className="text-lg text-gray-700">
                A nation where health, finance, and education work together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="py-3   bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* LEFT SIDE – Graphic */}
            <div className="relative flex justify-center">
              {/* Background Shape */}
              <div className="absolute bg-[#F4951D]/10 rounded-full -z-10"></div>

              <img
                src="/our-mission/5.jpg"
                alt="Community Support"
                className="w-full max-w-full rounded"
              />
            </div>

            {/* RIGHT SIDE – Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                Strengthening Families Before Crisis Begins
              </h2>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                Schoolfee.org works to prevent financial stress from escalating
                into short-term damage. We intervene early, protect education
                continuity, and restore community-backed support systems.
              </p>

              {/* Feature Points */}
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-2xl text-[#00468E] mt-1 flex-shrink-0" />
                  <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                    Early identification of financial distress
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-2xl text-[#00468E] mt-1 flex-shrink-0" />
                  <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                    Structured and ethical financial inclusion
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-2xl text-[#00468E] mt-1 flex-shrink-0" />
                  <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                    Community-based resilience framework
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-2xl text-[#00468E] mt-1 flex-shrink-0" />
                  <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                    Protecting a child’s right to stay in school
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-2xl text-[#00468E] mt-1 flex-shrink-0" />
                  <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                    Family financial capability strengthening
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Mission - Premium CTA */}
      <section className="py-10 bg-[#f5f5f5] shadow-lg">
        <div className="max-w-7xl mx-auto px-1">
          <div className="relative overflow-hidden rounded-[40px] bg-[#ffffff]">
            {/* Background Pattern Circles */}
            <div className="absolute inset-0">
              {/* <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div> */}
              {/* <div className="absolute right-10 top-10 w-[500px] h-[500px] bg-white/10 rounded-full"></div> */}
              {/* <div className="absolute right-20 top-20 w-[400px] h-[400px] bg-white/10 rounded-full"></div> */}
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-4 md:px-16 md:py-10 grid md:grid-cols-2 items-center gap-10">
              {/* Left Content */}
              <div className="text-black">
                <h2 className="text-4xl md:text-4xl font-bold mb-6 leading-tight">
                  Join the Mission.
                </h2>

                <p className="text-lg md:text-xl leading-relaxed mb-4 text-black/90">
                  If you are a parent, teacher, school, citizen, policymaker, or
                  partner — this mission belongs to you.
                </p>

                <p className="text-lg md:text-xl font-semibold leading-relaxed text-black">
                  Protecting health, education, and dignity is a shared national
                  responsibility.
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="/contact-us"
                    className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:opacity-90 transition"
                  >
                    Apply Now
                  </a>

                  <a
                    href="/partners"
                    className="bg-[#00468E] text-white px-8 py-3 rounded-full text-lg font-medium hover:opacity-90 transition"
                  >
                    Partner With Us
                  </a>
                </div>
              </div>

              {/* Right Visual Placeholder (Optional Illustration Area) */}
              <div className="hidden md:flex justify-center">
                <img
                  src="/images/cta.png"
                  alt="Community and Education Support"
                  className="rounded-3xl w-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
