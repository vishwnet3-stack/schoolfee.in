"use client"

import Link from "next/link"
import Image from "next/image"
import {
  FaGraduationCap,
  FaLaptopCode,
  FaTrophy,
  FaRocket,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaChartLine,
  FaUserGraduate,
  FaBriefcase,
  FaLightbulb,
  FaCertificate,
  FaBook,
  FaUsers,
  FaAward,
  FaHandshake,
  FaGlobe,
  FaHeart,
  FaClock,
  FaMoneyBillWave,
  FaTools,
  FaPalette,
  FaCode,
  FaCamera,
  FaMusic,
  FaUtensils,
  FaMicrophone,
  FaVideo,
} from "react-icons/fa"
import { MdSchool, MdWork, MdLanguage, MdComputer } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const roadmapPhases = [
  {
    phase: "Phase 1",
    title: "Foundation Building",
    timeline: "Months 1-6",
    status: "Active",
    icon: FaBook,
    color: "from-[#0B4C8A] to-[#094076]",
    features: [
      "Basic skill assessment",
      "Career counseling sessions",
      "Goal-setting workshops",
      "Foundation courses access",
    ],
  },
  {
    phase: "Phase 2",
    title: "Skill Development",
    timeline: "Months 7-18",
    status: "Coming Soon",
    icon: FaLaptopCode,
    color: "from-[#F9A11B] to-[#E69010]",
    features: [
      "Industry-specific training",
      "Certification programs",
      "Hands-on projects",
      "Mentor support",
    ],
  },
  {
    phase: "Phase 3",
    title: "Career Launch",
    timeline: "Months 19-24",
    status: "Planned",
    icon: FaRocket,
    color: "from-[#10B981] to-[#059669]",
    features: [
      "Job placement assistance",
      "Interview preparation",
      "Resume building",
      "Industry networking",
    ],
  },
]

const graduationSupport = [
  {
    icon: FaCertificate,
    title: "Higher Education Guidance",
    description: "Expert counseling for college admissions, entrance exams, and scholarship applications",
    benefits: ["Career path planning", "College selection help", "Application support", "Entrance exam prep"],
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
  },
  {
    icon: FaMoneyBillWave,
    title: "Financial Support",
    description: "Continued fee assistance for higher education and vocational training programs",
    benefits: ["College fee support", "Book allowances", "Equipment funding", "Living stipends"],
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop",
  },
  {
    icon: FaHandshake,
    title: "Mentorship Program",
    description: "Connect with industry professionals and alumni for career guidance and networking",
    benefits: ["1-on-1 mentoring", "Industry insights", "Professional network", "Success stories"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
]

const skillCourses = [
  {
    category: "Technology & IT",
    icon: FaCode,
    color: "bg-[#0B4C8A]",
    courses: [
      { name: "Web Development", duration: "6 months", level: "Beginner to Advanced" },
      { name: "Digital Marketing", duration: "4 months", level: "Beginner" },
      { name: "Data Analytics", duration: "5 months", level: "Intermediate" },
      { name: "Mobile App Development", duration: "6 months", level: "Intermediate" },
    ],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
  },
  {
    category: "Creative Arts",
    icon: FaPalette,
    color: "bg-[#F9A11B]",
    courses: [
      { name: "Graphic Design", duration: "4 months", level: "Beginner" },
      { name: "Photography", duration: "3 months", level: "All Levels" },
      { name: "Video Editing", duration: "4 months", level: "Beginner to Intermediate" },
      { name: "UI/UX Design", duration: "5 months", level: "Intermediate" },
    ],
    image: "https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=500&h=300&fit=crop",
  },
  {
    category: "Business & Finance",
    icon: FaBriefcase,
    color: "bg-[#10B981]",
    courses: [
      { name: "Accounting & Taxation", duration: "6 months", level: "Beginner" },
      { name: "Financial Planning", duration: "4 months", level: "Intermediate" },
      { name: "Business Management", duration: "5 months", level: "All Levels" },
      { name: "Entrepreneurship", duration: "3 months", level: "Beginner" },
    ],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
  },
  {
    category: "Vocational Skills",
    icon: FaTools,
    color: "bg-[#8B5CF6]",
    courses: [
      { name: "Hospitality Management", duration: "4 months", level: "Beginner" },
      { name: "Culinary Arts", duration: "6 months", level: "All Levels" },
      { name: "Beauty & Wellness", duration: "3 months", level: "Beginner" },
      { name: "Retail Management", duration: "4 months", level: "Beginner" },
    ],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
  },
]

const scholarshipTypes = [
  {
    type: "Merit-Based Scholarships",
    icon: FaTrophy,
    amount: "Up to ₹50,000",
    eligibility: "85%+ marks in Class 10/12",
    coverage: "Tuition fees, books, and course materials",
    color: "from-[#F59E0B] to-[#D97706]",
  },
  {
    type: "Need-Based Support",
    icon: FaHeart,
    amount: "Up to ₹75,000",
    eligibility: "Family income < ₹3L/year",
    coverage: "Full course fees and living expenses",
    color: "from-[#EF4444] to-[#DC2626]",
  },
  {
    type: "Skill Excellence Awards",
    icon: FaAward,
    amount: "Up to ₹40,000",
    eligibility: "Outstanding skill performance",
    coverage: "Advanced training and certifications",
    color: "from-[#8B5CF6] to-[#7C3AED]",
  },
  {
    type: "Community Impact Grants",
    icon: FaUsers,
    amount: "Up to ₹30,000",
    eligibility: "Active community service",
    coverage: "Project funding and resources",
    color: "from-[#10B981] to-[#059669]",
  },
]

const successStories = [
  {
    name: "Priya Sharma",
    course: "Web Development",
    achievement: "Full-Stack Developer at Tech Startup",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    quote: "The skill courses opened doors I never imagined. From school support to a career in tech!",
  },
  {
    name: "Rahul Verma",
    course: "Digital Marketing",
    achievement: "Marketing Manager at E-commerce Company",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    quote: "Schoolfee's graduation support program helped me transition from student to professional seamlessly.",
  },
  {
    name: "Anjali Patel",
    course: "Graphic Design",
    achievement: "Freelance Designer & Entrepreneur",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    quote: "The mentorship and financial support gave me confidence to pursue my creative dreams.",
  },
]

const partnerInstitutions = [
  { name: "Coursera", logo: "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg" },
  { name: "Udemy", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg" },
  { name: "NIIT", logo: "https://www.niit.com/india/sites/default/files/2021-08/niit-logo.svg" },
]

export default function BeyondSchoolPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ================= HERO SECTION ================= */}
      <section className="pt-16 pb-8 md:pt-20 md:pb-10 bg-gradient-to-br from-[#0B4C8A] to-[#094076] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F9A11B]/20 text-[#F9A11B] px-3 py-1 rounded-full text-xs font-medium mb-3">
                <FaRocket className="text-sm" />
                Future-Ready Programs
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                Beyond School: Your Path to Success
              </h1>
              <p className="text-base sm:text-lg text-white/90 mb-5 leading-relaxed">
                From Class 10 to Career Excellence. We don't just support education—we prepare you for life beyond school with graduation guidance, professional skill courses, and scholarships that transform dreams into reality.
              </p>
              
              {/* Quick Features */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <FaGraduationCap className="text-2xl text-[#F9A11B] mx-auto mb-1" />
                  <div className="text-xs text-white/80">Graduation Support</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <FaLaptopCode className="text-2xl text-[#F9A11B] mx-auto mb-1" />
                  <div className="text-xs text-white/80">Skill Courses</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <FaTrophy className="text-2xl text-[#F9A11B] mx-auto mb-1" />
                  <div className="text-xs text-white/80">Scholarships</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/registration/parent"
                  className="inline-flex items-center justify-center bg-[#F9A11B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#E69010] transition"
                >
                  Explore Programs
                  <FaArrowRight className="ml-2 text-xs" />
                </Link>
                <Link
                  href="#roadmap"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white hover:text-[#0B4C8A] transition"
                >
                  View Roadmap
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop"
                  alt="Students celebrating graduation"
                  className="w-full h-[300px] lg:h-[400px] object-cover"
                />
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600 mb-0.5">Launch Phase</div>
                      <div className="text-sm font-bold text-[#0B4C8A]">Coming Q2 2025</div>
                    </div>
                    <FaRocket className="text-3xl text-[#F9A11B]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROADMAP TIMELINE ================= */}
      <section id="roadmap" className="py-8 md:py-10 bg-gradient-to-b from-[#F6F5F1] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-[#0B4C8A]/10 text-[#0B4C8A] px-3 py-1 rounded-full text-xs font-medium mb-2">
              Our Journey Together
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0B4C8A] mb-2">
              Future Roadmap Timeline
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
              A structured pathway from school graduation to professional excellence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0B4C8A] via-[#F9A11B] to-[#10B981] z-0"></div>
            
            {roadmapPhases.map((phase, index) => (
              <div key={index} className="relative z-10">
                <div className={`bg-gradient-to-br ${phase.color} rounded-xl p-4 text-white h-full`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-white/20 px-2 py-1 rounded text-xs font-semibold">
                      {phase.phase}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      phase.status === 'Active' ? 'bg-green-500' : 
                      phase.status === 'Coming Soon' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}>
                      {phase.status}
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <phase.icon className="text-2xl" />
                  </div>
                  
                  <h3 className="text-lg font-bold mb-1 text-center">{phase.title}</h3>
                  <p className="text-sm text-white/80 mb-3 text-center">{phase.timeline}</p>
                  
                  <ul className="space-y-1.5">
                    {phase.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <FaCheckCircle className="flex-shrink-0 mt-0.5 text-white/80" />
                        <span className="text-white/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GRADUATION SUPPORT ================= */}
      <section className="py-8 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-[#F9A11B]/10 text-[#F9A11B] px-3 py-1 rounded-full text-xs font-medium mb-2">
              Transition Support
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0B4C8A] mb-2">
              Graduation Support Programs
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
              Comprehensive guidance and support as you transition from school to higher education or professional training
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {graduationSupport.map((program, index) => (
              <div key={index} className="bg-gradient-to-br from-[#F6F5F1] to-white rounded-xl overflow-hidden border border-[#E5E7EB] hover:shadow-lg transition-all">
                <div className="relative h-48">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center">
                    <program.icon className="text-2xl text-[#0B4C8A]" />
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#0B4C8A] mb-2">{program.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                  
                  <div className="space-y-1.5">
                    {program.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <FaCheckCircle className="text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-[#0B4C8A] to-[#094076] rounded-xl p-4 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-center md:text-left">
                <h4 className="text-lg font-bold mb-1">Ready to Plan Your Future?</h4>
                <p className="text-sm text-white/90">
                  Schedule a free counseling session with our career advisors
                </p>
              </div>
              <Link
                href="/contact-us"
                className="inline-flex items-center bg-[#F9A11B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#E69010] transition whitespace-nowrap"
              >
                Book Consultation
                <FaArrowRight className="ml-2 text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SKILL COURSES ================= */}
      <section className="py-8 md:py-10 bg-gradient-to-br from-[#F6F5F1] to-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-[#0B4C8A]/10 text-[#0B4C8A] px-3 py-1 rounded-full text-xs font-medium mb-2">
              Industry-Ready Skills
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0B4C8A] mb-2">
              Professional Skill Development Courses
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
              Choose from 50+ industry-recognized courses designed to make you job-ready in high-demand fields
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {skillCourses.map((category, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden border-2 border-[#E5E7EB] hover:border-[#F9A11B] hover:shadow-lg transition-all">
                <div className="relative h-40">
                  <img
                    src={category.image}
                    alt={category.category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`${category.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                        <category.icon className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{category.category}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2">
                    {category.courses.map((course, idx) => (
                      <div key={idx} className="flex items-start justify-between p-2 bg-[#F6F5F1] rounded-lg hover:bg-[#E8E6E0] transition-colors">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-[#0B4C8A] mb-0.5">{course.name}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaClock className="text-[#F9A11B]" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaStar className="text-[#F9A11B]" />
                              {course.level}
                            </span>
                          </div>
                        </div>
                        <FaArrowRight className="text-[#0B4C8A] flex-shrink-0 ml-2 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/programs"
              className="inline-flex items-center bg-[#0B4C8A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#094076] transition"
            >
              View All Courses
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY SCHOLARSHIPS ================= */}
      <section className="py-8 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-[#F9A11B]/10 text-[#F9A11B] px-3 py-1 rounded-full text-xs font-medium mb-2">
              Financial Support
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0B4C8A] mb-2">
              Community Scholarship Programs
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
              Merit-based and need-based scholarships to support your educational and skill development journey
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scholarshipTypes.map((scholarship, index) => (
              <div
                key={index}
                className={`relative rounded-xl p-4 text-white overflow-hidden bg-gradient-to-br ${scholarship.color}`}
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <scholarship.icon className="text-2xl" />
                  </div>
                  
                  <h3 className="text-base font-bold mb-2 text-center">{scholarship.type}</h3>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
                    <div className="text-2xl font-bold text-center mb-1">{scholarship.amount}</div>
                    <div className="text-xs text-white/80 text-center">Maximum Support</div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="text-white/80 mb-0.5">Eligibility:</div>
                      <div className="font-semibold">{scholarship.eligibility}</div>
                    </div>
                    <div>
                      <div className="text-white/80 mb-0.5">Coverage:</div>
                      <div className="font-semibold">{scholarship.coverage}</div>
                    </div>
                  </div>
                </div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-[#F6F5F1] to-[#E8E6E0] rounded-xl p-4 border border-[#E5E7EB]">
            <div className="flex items-start gap-3">
              <FaLightbulb className="text-3xl text-[#F9A11B] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-bold text-[#0B4C8A] mb-1">
                  How to Apply for Scholarships
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  All scholarship applications are processed through your Community Points account. Maintain active participation, earn points, and unlock scholarship opportunities based on your performance and needs.
                </p>
                <Link href="/how-it-works/community-points" className="text-sm font-semibold text-[#0B4C8A] hover:text-[#F9A11B] inline-flex items-center gap-1">
                  Learn About Points System
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SUCCESS STORIES ================= */}
      <section className="py-8 md:py-10 bg-gradient-to-b from-[#F6F5F1] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-[#0B4C8A]/10 text-[#0B4C8A] px-3 py-1 rounded-full text-xs font-medium mb-2">
              Real Impact
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0B4C8A] mb-2">
              Success Stories from Our Community
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
              Meet students who transformed their lives through our Beyond School programs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#F9A11B]"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#0B4C8A]">{story.name}</h4>
                    <p className="text-xs text-gray-600">{story.course}</p>
                  </div>
                </div>
                
                <div className="bg-[#F9A11B]/10 rounded-lg p-3 mb-3">
                  <FaTrophy className="text-[#F9A11B] mb-1" />
                  <p className="text-sm font-semibold text-[#0B4C8A]">{story.achievement}</p>
                </div>
                
                <div className="relative">
                  <FaStar className="absolute top-0 left-0 text-[#F9A11B] text-xl opacity-20" />
                  <p className="text-xs text-gray-600 italic pl-6">"{story.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PARTNER INSTITUTIONS ================= */}
      <section className="py-8 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-4">
            <h3 className="text-base font-semibold text-gray-600 mb-3">
              Partnered with Leading Educational Platforms
            </h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-gray-400 font-bold text-xl">Coursera</div>
            <div className="text-gray-400 font-bold text-xl">Udemy</div>
            <div className="text-gray-400 font-bold text-xl">NIIT</div>
            <div className="text-gray-400 font-bold text-xl">Simplilearn</div>
            <div className="text-gray-400 font-bold text-xl">upGrad</div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-10 md:py-12 bg-gradient-to-br from-[#0B4C8A] to-[#094076] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6 text-center relative z-10">
          <FaRocket className="text-5xl text-[#F9A11B] mx-auto mb-4" />
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Start Your Journey Beyond School Today
          </h2>
          <p className="text-base text-white/90 mb-5 max-w-2xl mx-auto">
            Join our Beyond School program and unlock access to graduation support, professional skill courses, and scholarship opportunities. Your future starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/registration/parent"
              className="inline-flex items-center justify-center bg-[#F9A11B] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#E69010] transition"
            >
              Register Now
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white hover:text-[#0B4C8A] transition"
            >
              Request Information
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}