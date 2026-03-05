"use client";
import { useState } from 'react';
import { FaCheckCircle, FaUsers, FaBrain, FaHandHoldingHeart, FaArrowRight, FaGraduationCap, FaShieldAlt, FaHeart, FaChartLine, FaAward } from 'react-icons/fa';

export default function SchoolFeeContent() {
  const [activeCard, setActiveCard] = useState(null);

  const benefits = [
    { icon: <FaShieldAlt />, title: "Avoid Stress & Anxiety", desc: "Remove immediate pressure related to school fee deadlines" },
    { icon: <FaGraduationCap />, title: "Uninterrupted Schooling", desc: "Ensure continuous education for your children" },
    { icon: <FaHeart />, title: "Emotional Well-being", desc: "Protect students' confidence and mental health" },
    { icon: <FaChartLine />, title: "Maintain Dignity", desc: "Stability during short-term financial gaps" }
  ];

  const initiatives = [
    {
      id: 1,
      icon: <FaUsers className="text-4xl" />,
      title: "Supporting Students",
      description: "We provide timely funding support for school fees so that students can continue their education without interruption.",
      detail: "Our goal is to ensure that every child feels secure, included, and confident in their school environment.",
      color: "from-[#f4951d] to-[#ffc107]"
    },
    {
      id: 2,
      icon: <FaBrain className="text-4xl" />,
      title: "Promoting Mental Health",
      description: "Financial stress within families often impacts children silently.",
      detail: "Through awareness and integration with mental health resources, we aim to create a supportive ecosystem where students and parents feel understood, supported, and guided.",
      color: "from-[#0cab47] to-[#10d95f]"
    },
    {
      id: 3,
      icon: <FaHandHoldingHeart className="text-4xl" />,
      title: "Building Futures Through Community",
      description: "We actively engage with schools, parents, and communities to strengthen access to education.",
      detail: "By working together, we ensure that financial limitations do not become barriers to a child's future.",
      color: "from-[#00468e] to-[#003366]"
    }
  ];

  const steps = [
    { number: "01", title: "Apply Online", desc: "Parents fill out a simple registration form on Schoolfee" },
    { number: "02", title: "Fee Support Provided", desc: "Approved school fees are supported on time to avoid disruption." },
    { number: "03", title: "Easy Repayment", desc: "Parents repay the supported amount interest-free, with no extra charges." }
  ];

  const eligibility = [
    "Parents of students from Nursery to Class 9",
    "Middle-class families facing temporary financial gaps",
    "Families seeking ethical, interest-free education support",
    "Parents who value education continuity and mental well-being"
  ];

  return (
    <div className="w-full bg-gray-50">

      {/* What is Schoolfee Section */}
      <section className="relative overflow-hidden bg-white px-2 py-16 lg:py-16">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-orange-100 rounded-full blur-3xl opacity-30"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-4 md:space-y-5">
              <div className="inline-block">
                <span className="text-sm md:lg:text-sm text-md font-bold tracking-widest text-[#0cab47] uppercase bg-green-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  About Us
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#00468e] leading-tight">
                What is Schoolfee?
              </h2>

              <p className="lg:text-xl text-md md:text-base text-gray-700 leading-relaxed">
                Schoolfee is a fee-support platform that allows parents to pay their child's school fees on time, even when they are temporarily unable to arrange the full amount.
              </p>

              <p className="lg:text-xl text-md md:text-base text-gray-700 leading-relaxed">
                Through our initiative, parents can repay the supported fee amount  <strong className="text-[#0cab47]">interest-free </strong> and without any extra charges.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-4 md:p-5 rounded-xl md:rounded-2xl">
                <p className="lg:text-xl text-md md:lg:text-xl text-md text-gray-800 font-medium">
                  This service is currently applicable for students from <strong className="text-[#00468e]">Nursery to Class 9</strong>, focusing on early and middle schooling years where consistency, routine, and emotional security are critical for a child's development.
                </p>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative">
                <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-12 h-12 md:w-16 md:h-16 bg-[#f4951d] rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-16 h-16 md:w-20 md:h-20 bg-[#0cab47] rounded-full opacity-20 animate-pulse"></div>

                <div className="relative bg-gradient-to-br from-[#00468e] to-[#003366] rounded-2xl md:rounded-3xl p-4 md:p-3 shadow-xl">
                  <img
                    src="/images/what-is-schoolfee.jpg"
                      
                    alt='What is Schoolfee'
                    className="w-full h-auto rounded-xl md:rounded-2xl shadow-lg object-cover"
                  />

                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4 max-w-[140px] md:max-w-xs">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#0cab47] to-[#10d95f] rounded-full flex items-center justify-center">
                        <FaCheckCircle className="text-base md:text-xl text-white" />
                      </div>
                      <div>
                        <p className="text-lg md:text-xl font-bold text-[#00468e]">0%</p>
                        <p className="text-[10px] md:text-md text-gray-600">Interest Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Schoolfee Matters Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 px-2 py-8 section-top-space">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-6 md:gap-8 lg:gap-12">
            {/* Right Content */}
            <div className="w-full lg:w-1/2 space-y-4 md:space-y-5">
              <div className="inline-block">
                <span className="text-sm md:lg:text-md text-md font-bold tracking-widest text-[#f4951d] uppercase bg-orange-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  Our Impact
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#00468e] leading-tight">
                Why Schoolfee Matters
              </h2>

              <p className="lg:text-xl text-md md:text-base text-gray-700 leading-relaxed">
                Education delays due to unpaid fees can have serious emotional and psychological impacts on children. Fear of school exclusion, embarrassment, and academic disruption can affect a child's confidence and mental health.
              </p>

              <p className="lg:text-xl text-md md:text-base text-gray-700 leading-relaxed">
                At Schoolfee, we address this issue holistically—by solving the financial challenge while also recognizing its emotional consequences.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 md:p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="text-2xl md:text-3xl mb-2 md:mb-3">{benefit.icon}</div>
                    <h3 className="font-bold lg:text-xl text-md md:text-base text-[#00468e] mb-1 md:mb-2">{benefit.title}</h3>
                    <p className="text-md md:text-[13px] text-gray-600">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Left Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <img
                  src="/home-page/Schoolfee Matters.webp"
                  alt="Schoolfee Matters"
                  className="w-full h-auto rounded-2xl md:rounded-3xl shadow-xl object-cover"
                />

                {/* Floating Badge */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4">
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-[#0cab47]">100%</p>
                    <p className="text-[10px] md:text-md text-gray-600 font-medium">Support Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white px-2 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-6 md:gap-8 lg:gap-12">

            {/* Right Image */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative">
                <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-16 h-16 md:w-20 md:h-20 bg-[#f4951d] rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 w-20 h-20 md:w-24 md:h-24 bg-[#0cab47] rounded-full opacity-20 animate-pulse"></div>

                <img
                  src="/images/school-fee-security.jpg"
                  alt="Schoolfee Our Mission"
                  className="relative w-full h-auto rounded-2xl md:rounded-3xl shadow-xl object-cover z-10"
                />

                {/* Floating Badge */}
                <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4 z-20">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#00468e] rounded-lg md:rounded-xl flex items-center justify-center">
                      <FaGraduationCap className="text-base md:text-xl text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] text-gray-600">Focused on</p>
                      <p className="text-xs md:text-sm font-bold text-[#00468e]">Learning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-4 md:space-y-5">
              <div className="inline-block">
                <span className="text-xs md:text-sm font-bold tracking-widest text-[#00468e] uppercase bg-blue-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  Our Purpose
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-[#00468e]">
                Smarter School Fee <span className="text-[#f4951d]">Security</span>
              </h2>

              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                Parents earn monthly, but schools demand fees in heavy quarterly or annual blocks, creating stress and risk. Beyond online payments, families need protection, flexibility, and continuity. A modern platform must smooth cash flow, safeguard education during crises, reward discipline, and connect merit with opportunity.
              </p>

              <div className="bg-gradient-to-r from-blue-50 via-orange-50 to-green-50 p-4 md:p-5 rounded-xl md:rounded-2xl">
                <h3 className="text-base md:text-lg font-bold text-[#00468e] mb-3 md:mb-4">
                  Proposed Support Programs
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">

                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#00468e] text-lg md:text-xl mt-0.5 flex-shrink-0" />
                    <p className="text-sm md:text-sm text-gray-800 leading-relaxed">
                      Fee Shield for job loss or accidents
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#00468e] text-lg md:text-xl mt-0.5 flex-shrink-0" />
                    <p className="text-sm md:text-sm text-gray-800 leading-relaxed">
                      Zero-cost EMIs for every parent
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#00468e] text-lg md:text-xl mt-0.5 flex-shrink-0" />
                    <p className="text-sm md:text-sm text-gray-800 leading-relaxed">
                      School credit line via NBFC tie-up
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#00468e] text-lg md:text-xl mt-0.5 flex-shrink-0" />
                    <p className="text-sm md:text-sm text-gray-800 leading-relaxed">
                      Merit-linked scholarship sponsorships
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#00468e] text-lg md:text-xl mt-0.5 flex-shrink-0" />
                    <p className="text-sm md:text-sm text-gray-800 leading-relaxed">
                      Rewards for timely fee payments
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#00468e] text-lg md:text-xl mt-0.5 flex-shrink-0" />
                    <p className="text-sm md:text-sm text-gray-800 leading-relaxed">
                      Marketplace for books and uniforms
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Key Initiatives Section */}
      <section className="bg-[#00468e] relative overflow-hidden px-2 py-8 lg:py-16">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-10 left-5 md:top-20 md:left-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-[#f4951d] rounded-full blur-[80px] md:blur-[120px] opacity-20"></div>
        <div className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-[#0cab47] rounded-full blur-[80px] md:blur-[120px] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block mb-3 md:mb-4">
              <span className="text-[10px] md:text-md font-bold tracking-widest text-[#f4951d] uppercase">
                What We Do
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-1 md:mb-2 leading-tight">
              Our Key <span className="text-[#f4951d]">Initiatives</span>
            </h2>

            <p className="lg:text-xl text-md md:text-base text-blue-100 max-w-2xl mx-auto">
              Three pillars that drive our commitment to educational excellence and student well-being
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            {/* Card 1 - Supporting Students */}
            <div className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-0.5"></div>
              <div className="p-5 md:p-6 lg:p-8">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-[#f4951d] rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-5">
                  <FaUsers className="text-xl md:text-2xl lg:text-3xl" />
                </div>

                <h3 className="text-lg md:text-xl font-bold text-[#00468e] mb-2 md:mb-3">Supporting Students</h3>
                <p className="text-md md:text-[17px] text-gray-700 leading-relaxed">
                  We provide timely funding support for school fees so that students can continue their education without interruption. Our goal is to ensure that every child feels secure, included, and confident in their school environment.
                </p>
              </div>
            </div>

            {/* Card 2 - Promoting Mental Health */}
            <div className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-0.5"></div>
              <div className="p-5 md:p-6 lg:p-8">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-[#f4951d] rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-5">
                  <FaBrain className="text-xl md:text-2xl lg:text-3xl" />
                </div>

                <h3 className="text-lg md:text-xl font-bold text-[#00468e] mb-2 md:mb-3">Promoting Mental Health</h3>
                <p className="text-md md:text-[17px] text-gray-700 leading-relaxed">
                  Financial stress within families often impacts children silently. Through awareness and integration with mental health resources, we aim to create a supportive ecosystem where students and parents feel understood, supported, and guided.
                </p>
              </div>
            </div>

            {/* Card 3 - Building Futures */}
            <div className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-0.5]"></div>
              <div className="p-5 md:p-6 lg:p-8">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-[#f4951d] rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-5">
                  <FaHandHoldingHeart className="text-xl md:text-2xl lg:text-3xl" />
                </div>

                <h3 className="text-lg md:text-xl font-bold text-[#00468e] mb-2 md:mb-3">Building Futures Through Community</h3>
                <p className="text-md md:text-[17px] text-gray-700 leading-relaxed">
                  We actively engage with schools, parents, and communities to strengthen access to education. By working together, we ensure that financial limitations do not become barriers to a child's future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white px-2 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block mb-4 md:mb-5">
              <span className="text-sm md:lg:text-md text-md font-bold tracking-widest text-[#0cab47] uppercase bg-green-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                Simple Process
              </span>
            </div>

            <h2 className="text-3xl md:text-3xl lg:text-4xl font-extrabold text-[#00468e] mb-4 md:mb-5 leading-tight">
              How It Works
            </h2>

            <p className="lg:text-xl text-md md:text-base lg:text-lg text-gray-700 max-w-3xl mx-auto">
              Our process is transparent, responsible, and designed to protect both families and institutions
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-[#f4951d] via-[#0cab47] to-[#00468e] transform -translate-y-1/2 z-0"></div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 z-10">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="absolute -top-4 md:-top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-[#f4951d] to-[#ffc107] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-lg md:text-xl lg:text-2xl font-bold text-white">{step.number}</span>
                  </div>

                  <div className="pt-6 md:pt-7 text-center">
                    <h3 className="text-lg md:text-xl font-bold text-[#00468e] mb-3 md:mb-4">{step.title}</h3>
                    <p className="text-md md:text-[16px] text-gray-700 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Benefit Section */}
      <section className="bg-gradient-to-br from-orange-50 lg:py-16 to-blue-50 px-2 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12">
            {/* Left Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <img
                  src="/home-page/Who Can Benefit.webp"
                  alt="Happy family"
                  className="w-full h-auto rounded-2xl md:rounded-3xl shadow-xl object-cover"
                />

                {/* Floating Elements */}
                <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#f4951d] to-[#ffc107] rounded-full flex items-center justify-center">
                      <FaUsers className="text-base md:text-xl text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] text-gray-600">Serving</p>
                      <p className="lg:text-xl text-md md:text-base font-bold text-[#00468e]">Families</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-1/2 space-y-4 md:space-y-5 py-4">
              <div className="inline-block">
                <span className="text-xs md:lg:text-md font-bold tracking-widest text-[#f4951d] uppercase bg-orange-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  Eligibility
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#00468e] leading-tight">
                Who Can Benefit
              </h2>

              <p className="lg:text-xl text-md md:text-base text-gray-700 leading-relaxed">
                Schoolfee is designed for middle-class families who value education and need temporary support to ensure their children's academic continuity.
              </p>

              <div className="space-y-3 md:space-y-4">
                {eligibility.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4 bg-white p-4 md:p-5 rounded-xl transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-[#0cab47] to-[#10d95f] rounded-full flex items-center justify-center">
                      <FaCheckCircle className="lg:text-xl text-md md:text-base text-white" />
                    </div>
                    <p className="text-md md:text-[17px] text-gray-800 font-medium pt-1 md:pt-1.5">{item}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 md:pt-5">
                <a
                  href="/registration/parent"
                  className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 lg:text-xl text-md md:text-base font-bold text-white transition-all duration-300 bg-[#f4951d] rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 group"
                >
                  Apply Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}