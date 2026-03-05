"use client";
import { useState } from "react";
import { FaChalkboardTeacher, FaSchool, FaUserTie, FaCheckCircle, FaArrowRight, FaShieldAlt, FaReceipt, FaClock, FaChartLine, FaMobileAlt, FaUsers, FaGraduationCap, FaHandHoldingUsd } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
  const [activeTab, setActiveTab] = useState("parents");
  const router = useRouter();

  const cards = [
    {
      id: "teacher",
      title: "Teacher Registration",
      icon: <FaChalkboardTeacher className="text-4xl text-[#f89520]" />,
      image: "/home-page/Student Registration.webp",
      description: "Empower educators with financial support and professional development.",
      benefits: [
        "Interest-free salary advances",
        "Professional development funds",
        "Health & wellness benefits",
        "Retirement planning assistance",
        "Educational resource grants",
        "Flexible loan options",
        "Career advancement support"
      ],
      btnColor: "bg-[#f89520] hover:bg-[#e08515]",
      link: "/registration/teacher" // ✅ Added link
    },
    {
      id: "parent",
      title: "Parent Registration",
      icon: <FaUserTie className="text-4xl text-[#0cab47]" />,
      image: "/home-page/Parent Registration.webp",
      description: "Secure your child's future with stress-free fee management.",
      benefits: [
        "Instant fee disbursement",
        "Zero collateral required",
        "Minimal documentation",
        "Stress-free repayment plans",
        "Financial planning assistance",
        "Transparent processing",
        "24/7 Support helpline"
      ],
      btnColor: "bg-[#0cab47] hover:bg-[#09963d]",
      link: "/registration/parent" // ✅ Added link
    },
    {
      id: "school",
      title: "School Registration",
      icon: <FaSchool className="text-4xl text-[#1e5a8e]" />,
      image: "/home-page/School Registration.webp",
      description: "Partner with us to ensure uninterrupted education for all.",
      benefits: [
        "Timely fee collection",
        "Reduced administrative load",
        "Zero dropout due to fees",
        "Digital fee management",
        "Infrastructure support",
        "Teacher training programs",
        "Enhanced school reputation"
      ],
      btnColor: "bg-[#1e5a8e] hover:bg-[#164a73]",
      link: "/registration/school" // ✅ Added link
    }
  ];

  const stats = [
    { icon: <FaUsers className="text-3xl" />, count: "500+", label: "Happy Families" },
    { icon: <FaSchool className="text-3xl" />, count: "38+", label: "Partner Schools" },
    { icon: <FaGraduationCap className="text-3xl" />, count: "₹10L+", label: "Fees Processed" },
    { icon: <FaHandHoldingUsd className="text-3xl" />, count: "99.8%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section with Pattern Background */}
      <div className="relative bg-gradient-to-r from-[#1e5a8e] via-[#2563a8] to-[#1e5a8e] overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("https://www.toptal.com/designers/subtlepatterns/uploads/double-bubble-dark.png")`
        }}></div>

        {/* Subtle gradient overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                Health Financial Inclusion Program
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-tight">
                Secure & Easy Online School Fee Payments
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-xl">
                Secure & easy online school fee payments with zero interest, designed to support families and ensure stress-free education continuity.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => router.push('/registration/parent')}
                  className="group bg-[#0cab47] hover:bg-[#09963d] text-white px-8 py-3.5 rounded-lg text-base font-semibold transition-all flex items-center gap-2"
                >
                  Start Registration
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3.5 rounded-lg text-base font-semibold transition-all">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src="/images/School Fee Payments.webp"
                  alt="Students studying"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 "></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3 text-[#1e5a8e]">
                    {stat.icon}
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.count}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div key={card.id} className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border-t-4 ${card.id === 'teacher' ? 'border-[#f89520]' : card.id === 'parent' ? 'border-[#0cab47]' : 'border-[#1e5a8e]'}`}>
              <div className="relative h-48 overflow-hidden group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                <img src={card.image} alt={card.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                  {card.icon}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 mb-6 text-md leading-relaxed">{card.description}</p>

                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Key Benefits</h4>
                  <ul className="space-y-3 mb-8">
                    {card.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700 text-md font-medium">
                        <FaCheckCircle className={`mt-0.5 flex-shrink-0 ${card.id === 'teacher' ? 'text-[#f4951d]' : card.id === 'parent' ? 'text-[#0cab47]' : 'text-[#00468e]'}`} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ✅ UPDATED: Direct navigation instead of modal */}
                <button
                  onClick={() => router.push(card.link)}
                  className={`w-full py-3.5 rounded-xl text-white font-bold shadow-md transition-all duration-300 flex items-center justify-center gap-2 group ${card.btnColor}`}
                >
                  Register Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ REMOVED: Modal imports and components */}
      {/* <TeacherModal isOpen={modalType === "teacher"} onClose={() => setModalType(null)} /> */}
      {/* <SchoolModal isOpen={modalType === "school"} onClose={() => setModalType(null)} /> */}

      {/* Why Choose Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Why Choose <span className="text-[#1e5a8e]">schoolfee.in?</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Experience seamless, secure, and instant school fee payments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div className="bg-green-50 p-6 rounded-2xl">
                <FaShieldAlt className="text-5xl text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">100% Secure Transactions</h3>
            <p className="text-gray-600 leading-relaxed">
              SSL encrypted with bank-grade security protocols ensuring your data is always protected
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div className="bg-blue-50 p-6 rounded-2xl">
                <FaClock className="text-5xl text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Receipts</h3>
            <p className="text-gray-600 leading-relaxed">
              Get immediate digital confirmation and downloadable receipts for every transaction
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div className="bg-purple-50 p-6 rounded-2xl">
                <FaChartLine className="text-5xl text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Payment History</h3>
            <p className="text-gray-600 leading-relaxed">
              Track all transactions with detailed analytics and exportable reports anytime
            </p>
          </div>
        </div>
      </div>

      {/* Simple 3-Step Process */}
      <div className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Simple 3-Step Process
            </h2>
            <p className="text-base md:text-lg text-gray-600">Get started in minutes</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative w-full md:w-64">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-12 h-12 bg-[#1e5a8e] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  1
                </div>
                <div className="flex justify-center mb-4">
                  <FaChalkboardTeacher className="text-4xl text-[#1e5a8e]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Login & Select Ward</h3>
                <p className="text-sm text-gray-600">Access your account and choose student</p>
              </div>
            </div>

            <div className="hidden md:block">
              <FaArrowRight className="text-3xl text-[#1e5a8e]" />
            </div>

            <div className="relative w-full md:w-64">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-12 h-12 bg-[#0cab47] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  2
                </div>
                <div className="flex justify-center mb-4">
                  <FaReceipt className="text-4xl text-[#0cab47]" />
                </div>
                <h3 className="font-bold text-lg mb-2">View Due Fees</h3>
                <p className="text-sm text-gray-600">Check pending amounts and details</p>
              </div>
            </div>

            <div className="hidden md:block">
              <FaArrowRight className="text-3xl text-[#1e5a8e]" />
            </div>

            <div className="relative w-full md:w-64">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-12 h-12 bg-[#f89520] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  3
                </div>
                <div className="flex justify-center mb-4">
                  <FaMobileAlt className="text-4xl text-[#f89520]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Pay Securely</h3>
                <p className="text-sm text-gray-600">Card/UPI/Netbanking options</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For Parents & Schools with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Benefits for Everyone
          </h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab("parents")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "parents"
                  ? "bg-[#0cab47] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              For Parents
            </button>
            <button
              onClick={() => setActiveTab("schools")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "schools"
                  ? "bg-[#1e5a8e] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              For Schools
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 md:p-12">
          {activeTab === "parents" ? (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaUserTie className="text-[#0cab47]" />
                  Parent Benefits
                </h3>
                <ul className="space-y-4">
                  {[
                    "Convenient online payment from anywhere",
                    "Automated email and SMS reminders",
                    "Flexible payment schedules",
                    "Multiple payment options",
                    "Instant digital receipts",
                    "24/7 access to payment history",
                    "Dedicated customer support"
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <FaCheckCircle className="text-[#0cab47] mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/images/Benefits for Parents.jpg"
                  alt="Happy parent"
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="flex items-center justify-center">
                <img
                  src="/images/Benefits for Schools.jpg"
                  alt="School building"
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaSchool className="text-[#1e5a8e]" />
                  School Benefits
                </h3>
                <ul className="space-y-4">
                  {[
                    "Automated fee collection system",
                    "Real-time payment tracking",
                    "Comprehensive financial reports",
                    "Reduced administrative workload",
                    "Zero dropout due to fee issues",
                    "Enhanced parent satisfaction",
                    "Professional dashboard analytics"
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <FaCheckCircle className="text-[#1e5a8e] mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}