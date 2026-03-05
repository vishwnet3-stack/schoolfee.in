"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FaShieldAlt,
  FaBolt,
  FaLock,
  FaPercentage,
  FaHeart,
  FaGraduationCap,
  FaSmile,
  FaHandHoldingHeart,
  FaUsers,
  FaLightbulb,
  FaCheckCircle,
  FaUserFriends,
  FaClock,
  FaMoneyBillWave,
  FaChild,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  MdFamilyRestroom,
  MdAttachMoney,
  MdSchool,
  MdHealthAndSafety,
} from "react-icons/md";
import { IoMdHappy } from "react-icons/io";
import { BsFillPeopleFill } from "react-icons/bs";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#00468E]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 sm:w-64 sm:h-64 bg-[#F4951D]/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="mb-3 sm:mb-4">
                <span className="inline-block bg-white text-[#00468E] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                  Empowering Education Through Financial Support
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
                Support School Fees{" "}
                <span className="text-[#00468E]">Interest-Free</span> For{" "}
                <span className="text-[#F4951D]">Every Child</span>{" "}
                <span className="inline-block">📚</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                Support your child's education with ₹0 interest. Our fee support program covers all school fees from Nursery to Class 9. Just pay what you need, and repay when you can. We bring the best support to families.
              </p>
              
              <Button className="bg-[#00468E] hover:bg-[#003d7a] text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all">
                Start Registration
              </Button>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&h=600&fit=crop"
                  alt="Student learning online"
                  className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover"
                />
              </div>
              {/* Decorative plant illustration */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-32 sm:h-32 opacity-50">
                <div className="w-full h-full bg-green-500 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              <span className="text-[#00468E]">Reliable Support</span> Without Barriers{" "}
              <span className="inline-block">✓</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              We understand financial challenges. Our team of education support experts is dedicated to understanding your unique needs and delivering support solutions that propel your child's educational journey forward.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-5 sm:p-6">
                <div className="bg-gray-900 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <FaShieldAlt className="text-xl sm:text-2xl" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  Smart And Reliable
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  We provide reliable financial support with transparent processes and ethical practices.
                </p>
                <button className="text-[#00468E] text-xs sm:text-sm font-semibold hover:underline">
                  Know More
                </button>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-5 sm:p-6">
                <div className="bg-gray-900 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <FaGraduationCap className="text-xl sm:text-2xl" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  Education & Fluent Support
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  We support families with clear communication and seamless processes.
                </p>
                <button className="text-[#00468E] text-xs sm:text-sm font-semibold hover:underline">
                  Know More
                </button>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-5 sm:p-6">
                <div className="bg-gray-900 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <FaCheckCircle className="text-xl sm:text-2xl" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  Loyal & Reliable
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  We are transparent with families and schools, building trust through reliability.
                </p>
                <button className="text-[#00468E] text-xs sm:text-sm font-semibold hover:underline">
                  Know More
                </button>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-5 sm:p-6">
                <div className="bg-gray-900 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <FaPercentage className="text-xl sm:text-2xl" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  Low & Fair Pricing
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Fee support with zero interest. No hidden charges, simple repayment plans.
                </p>
                <button className="text-[#00468E] text-xs sm:text-sm font-semibold hover:underline">
                  Know More
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Excellence Section - Dark Background */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-900 text-white px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative">
              {/* Stats Cards */}
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 lg:mb-0">
                <Card className="bg-white border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-[#00468E] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold">
                        0%
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">Interest Rate</div>
                        <div className="text-xs sm:text-sm text-gray-600">100% Interest Free</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-[#F4951D] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-base sm:text-lg font-bold">
                        24/7
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">Help And Support</div>
                        <div className="text-xs sm:text-sm text-gray-600">Always available for families</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-[#00468E] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold">
                        95%
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">Satisfaction Rate</div>
                        <div className="text-xs sm:text-sm text-gray-600">Happy families nationwide</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Diamond shape with image */}
              <div className="hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2">
                <div className="relative w-64 h-64 rotate-45 overflow-hidden rounded-3xl">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
                    alt="Support representative"
                    className="-rotate-45 scale-150 object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-[#F4951D] mb-2 sm:mb-3 uppercase tracking-wider">
                Why Choose Us
              </h2>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Choose <span className="text-[#F4951D]">Excellence</span>
                <br />
                Elevate Your Educational Support Experience
              </h3>
              <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                At Schoolfee, we are dedicated to redefining the way you access educational support by understanding your unique needs and delivering solutions that propel your child's academic journey forward.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-[#F4951D] mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Highest Quality Standards</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-[#F4951D] mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Fast Application Process</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-[#F4951D] mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Protected Student Privacy</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-[#F4951D] mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Timely Fee Payments</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-[#F4951D] mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Dedicated Support</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-[#F4951D] mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Complete Fee Coverage</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-[#F4951D] mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">No Extra Charges</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-[#F4951D] mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Counseling And Support</span>
                </div>
              </div>
              
              <Button className="bg-[#F4951D] hover:bg-[#e08718] text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-lg shadow-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#f0fdf4] to-white px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-xs sm:text-sm font-semibold text-[#F4951D] uppercase tracking-wider">
              Process
            </h2>
          </div>
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Fee Support Made <span className="text-[#F4951D]">Easy</span>
              <br />
              <span className="text-[#00468E]">& Simple</span>{" "}
              <span className="inline-block">✓</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Get support in just three simple steps. Save time and money.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="bg-white border-2 border-[#00468E] w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <FaUsers className="text-lg sm:text-xl text-[#00468E]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                    Collaborate With Our Team
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Talk to our friendly team, share your child's school fee details and your temporary financial situation. Let us understand your needs.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="bg-white border-2 border-[#00468E] w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <FaCheckCircle className="text-lg sm:text-xl text-[#00468E]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                    We Will Hunt For The Best
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    We'll review your application and match the best support option for your child's education. We find the right fit for your needs.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="bg-white border-2 border-[#00468E] w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <FaBolt className="text-lg sm:text-xl text-[#00468E]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                    Quick Approval
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Once the fee support is approved, we'll work with you closely. We'll pay your child's school fees on time. You focus on their education.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="bg-white border-2 border-[#00468E] w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <FaMoneyBillWave className="text-lg sm:text-xl text-[#00468E]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                    SUPPORT & LESS
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Continuous support at lower costs. Easy repayment, more benefits, less stress. We handle fee payments more efficiently.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-green-200 rounded-full blur-3xl opacity-30"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=600&fit=crop"
                  alt="Family support"
                  className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-[#f0fdf4] px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 sm:w-48 sm:h-48 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=600&fit=crop"
                  alt="Support representative"
                  className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover rounded-3xl shadow-2xl"
                />
                {/* Floating avatars */}
                <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-orange-400 rounded-full border-4 border-white shadow-lg"></div>
                <div className="absolute top-1/2 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 rounded-full border-4 border-white shadow-lg"></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                <span className="text-[#00468E]">Huge Support</span>{" "}
                <span className="text-[#F4951D]">Low Cost</span>{" "}
                <span className="inline-block">💰</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                We believe education should never stop due to temporary financial gaps. Schoolfee is looking to hire the best support team for education continuity at zero interest, helping families and children thrive. Looking to hire the talent of a candidate seeking their next career opportunity.
              </p>
              <Button className="bg-[#00468E] hover:bg-[#003d7a] text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-lg shadow-lg">
                Know More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-3 sm:mb-4">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              <span className="text-[#00468E]">You</span> Name It
              <br />
              We Support <span className="text-[#F4951D]">4 Less</span>{" "}
              <span className="inline-block">💼</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Our fee support services cover all schools nationwide. Just let us know what you need, and we will bring the best support to you.
            </p>
          </div>
          
          <div className="relative mt-8 sm:mt-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Card 1 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <div className="relative h-[200px] sm:h-[250px]">
                  <img
                    src="https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=400&h=300&fit=crop"
                    alt="Administrative services"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 sm:p-6 bg-[#00468E] text-white">
                  <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">
                    Primary Education Support
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-4 sm:mb-6">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#F4951D] flex-shrink-0" />
                      <span>Nursery to Class 5</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#F4951D] flex-shrink-0" />
                      <span>Complete fee coverage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#F4951D] flex-shrink-0" />
                      <span>Zero interest</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#F4951D] flex-shrink-0" />
                      <span>Flexible repayment</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full bg-white text-[#00468E] hover:bg-gray-100 py-2 sm:py-3 text-xs sm:text-sm">
                    Explore More Services
                  </Button>
                </CardContent>
              </Card>
              
              {/* Card 2 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <div className="relative h-[200px] sm:h-[250px]">
                  <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"
                    alt="Operations support"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 sm:p-6 bg-gray-900 text-white">
                  <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">
                    Middle School Support
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-4 sm:mb-6">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#F4951D] flex-shrink-0" />
                      <span>Class 6 to Class 9</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#F4951D] flex-shrink-0" />
                      <span>Exam fee support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#F4951D] flex-shrink-0" />
                      <span>Book allowance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#F4951D] flex-shrink-0" />
                      <span>Mental health resources</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-[#F4951D] hover:bg-[#e08718] text-white py-2 sm:py-3 text-xs sm:text-sm">
                    Explore More Services
                  </Button>
                </CardContent>
              </Card>
              
              {/* Card 3 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden sm:col-span-2 lg:col-span-1">
                <div className="relative h-[200px] sm:h-[250px]">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
                    alt="Support services"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 sm:p-6 bg-[#F4951D] text-white">
                  <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">
                    Emergency Education Support
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-4 sm:mb-6">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-white flex-shrink-0" />
                      <span>Job loss protection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-white flex-shrink-0" />
                      <span>Medical emergency aid</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-white flex-shrink-0" />
                      <span>Crisis counseling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-white flex-shrink-0" />
                      <span>School fee management</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full bg-white text-[#F4951D] hover:bg-gray-100 py-2 sm:py-3 text-xs sm:text-sm">
                    Explore More Services
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Navigation Arrows */}
            <div className="flex gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
              <button className="bg-[#00468E] hover:bg-[#003d7a] text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all">
                <FaChevronLeft className="text-base sm:text-lg" />
              </button>
              <button className="bg-[#F4951D] hover:bg-[#e08718] text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all">
                <FaChevronRight className="text-base sm:text-lg" />
              </button>
            </div>
          </div>
          
          <div className="text-center mt-6 sm:mt-8">
            <Button className="bg-[#00468E] hover:bg-[#003d7a] text-white px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base rounded-lg shadow-lg">
              View All
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f0fdf4] to-white px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-10 text-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Get In Touch
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Ready to support your child's education? Fill out the form below and our team will contact you within 24 hours.
              </p>
              
              <div className="max-w-md mx-auto space-y-3 sm:space-y-4">
                <Input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-4 sm:py-5 text-sm sm:text-base border-2 border-gray-300 focus:border-[#00468E] rounded-lg"
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-4 sm:py-5 text-sm sm:text-base border-2 border-gray-300 focus:border-[#00468E] rounded-lg"
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-4 sm:py-5 text-sm sm:text-base border-2 border-gray-300 focus:border-[#00468E] rounded-lg"
                />
                <Button className="w-full bg-[#00468E] hover:bg-[#003d7a] text-white px-6 py-5 sm:py-6 text-sm sm:text-base rounded-lg shadow-lg">
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}