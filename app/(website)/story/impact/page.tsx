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
  FaArrowRight,
  FaStar,
  FaQuoteLeft,
  FaPlay,
} from "react-icons/fa";
import {
  MdFamilyRestroom,
  MdAttachMoney,
  MdSchool,
  MdHealthAndSafety,
  MdArrowForward,
} from "react-icons/md";
import { IoMdHappy } from "react-icons/io";
import { BsFillPeopleFill } from "react-icons/bs";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Top Badge */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Available now</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
                Hassle-free{" "}
                <FaCheckCircle className="inline-block text-[#F4951D] text-2xl sm:text-3xl md:text-4xl mb-2" />
                <br />
                support for better
                <br />
                <span className="text-[#00468E]">education</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg">
                Get instant financial support for your child's school fees. Zero interest, flexible repayment, and complete peace of mind.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start mb-6 sm:mb-8">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="w-full sm:w-72 px-5 py-5 sm:py-6 text-sm sm:text-base border-2 border-gray-300 focus:border-[#00468E] rounded-full"
                />
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full shadow-lg whitespace-nowrap">
                  Get Started
                  <FaArrowRight className="ml-2" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <FaLock className="text-[#00468E]" />
                <span>Protected by CarePay® Digital Health Wallet</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&h=600&fit=crop"
                  alt="Parent and child learning"
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Floating Play Button */}
                <button className="absolute bottom-6 right-6 bg-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                  <FaPlay className="text-[#00468E] ml-1 text-lg sm:text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Partner Logos */}
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl mt-12 sm:mt-16">
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 text-center">
            We work in partnership with major flexible companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12">
            <div className="text-gray-400 font-bold text-lg sm:text-xl">ICICI Bank</div>
            <div className="text-gray-400 font-bold text-lg sm:text-xl">HDFC</div>
            <div className="text-gray-400 font-bold text-lg sm:text-xl">Paytm</div>
            <div className="text-gray-400 font-bold text-lg sm:text-xl">PhonePe</div>
            <div className="text-gray-400 font-bold text-lg sm:text-xl">Google Pay</div>
          </div>
        </div>
      </section>

      {/* Services Cards Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#faf9f7]">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Flexible services for
              <br />
              all of your <span className="text-[#00468E]">education needs</span>
            </h2>
            <div className="flex gap-2">
              <button className="bg-gray-900 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                <FaChevronLeft />
              </button>
              <button className="bg-gray-900 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                <FaChevronRight />
              </button>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1 - Orange */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-b from-orange-50 to-white">
              <CardContent className="p-0">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="bg-[#F4951D] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                      <FaUsers className="text-white text-lg sm:text-xl" />
                    </div>
                    <div className="bg-gray-900 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                      <FaArrowRight className="text-white text-sm" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Fee Support
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Get instant support for school fees from Nursery to Class 9 with zero interest
                  </p>
                </div>
                <div className="relative h-[150px] sm:h-[180px]">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop"
                    alt="Fee support"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Card 2 - Blue */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-b from-blue-50 to-white">
              <CardContent className="p-0">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="bg-[#00468E] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                      <FaGraduationCap className="text-white text-lg sm:text-xl" />
                    </div>
                    <div className="bg-gray-900 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                      <FaArrowRight className="text-white text-sm" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Education Continuity
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Ensure uninterrupted schooling for your children during financial challenges
                  </p>
                </div>
                <div className="relative h-[150px] sm:h-[180px]">
                  <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop"
                    alt="Education continuity"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Card 3 - Yellow */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-b from-yellow-50 to-white">
              <CardContent className="p-0">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="bg-yellow-400 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                      <MdHealthAndSafety className="text-white text-lg sm:text-xl" />
                    </div>
                    <div className="bg-gray-900 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                      <FaArrowRight className="text-white text-sm" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Mental Health Support
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Access to counseling and mental health resources for families and students
                  </p>
                </div>
                <div className="relative h-[150px] sm:h-[180px]">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop"
                    alt="Mental health support"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Card 4 - Green */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-b from-green-50 to-white">
              <CardContent className="p-0">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="bg-green-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                      <FaHandHoldingHeart className="text-white text-lg sm:text-xl" />
                    </div>
                    <div className="bg-gray-900 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                      <FaArrowRight className="text-white text-sm" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Community Support
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Join a network of families and schools working together for educational excellence
                  </p>
                </div>
                <div className="relative h-[150px] sm:h-[180px]">
                  <img
                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=250&fit=crop"
                    alt="Community support"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Management Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Improve every time aspect of your child's
                <span className="text-[#00468E]"> education journey</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Our comprehensive support platform helps families navigate financial challenges while ensuring children's education remains uninterrupted. We provide transparent processes, interest-free support, and mental health resources to create a holistic educational support ecosystem.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                From fee support to counseling services, we're committed to building stronger families and brighter futures through community-driven educational initiatives.
              </p>
              
              <div className="flex gap-3 sm:gap-4">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full shadow-lg">
                  Learn More
                  <FaArrowRight className="ml-2" />
                </Button>
                <button className="bg-white border-2 border-gray-900 text-gray-900 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all">
                  <FaPlay className="ml-1" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
                  alt="Happy parent"
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Platform Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#faf9f7]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-blue-100 to-orange-100 rounded-3xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop"
                    alt="Student success"
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                  />
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-block bg-blue-100 text-[#00468E] px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
                Platform Features
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                The complete fee support platform for
                <span className="text-[#00468E]"> modern families</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                SchoolFee operates through CarePay®, India's Digital Health Wallet, providing a seamless and secure platform for middle-class families facing temporary financial challenges. Our mission is to ensure no child misses school due to delayed fee payments.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                We support students from Nursery to Class 9, focusing on critical developmental years where educational continuity and emotional security matter most.
              </p>
              
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full shadow-lg">
                Get Started
                <FaArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              We're all about the power
              <br />
              of <span className="text-[#F4951D]">supporting families</span>
            </h2>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-blue-100 rounded-3xl"></div>
            <div className="relative bg-blue-50 rounded-3xl p-6 sm:p-10 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                    alt="Team collaboration"
                    className="w-full h-[250px] sm:h-[300px] rounded-2xl object-cover shadow-xl"
                  />
                  {/* Decorative element */}
                  <div className="absolute -bottom-4 -right-4 bg-yellow-400 w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-50 blur-2xl"></div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">0%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Interest Rate</div>
                  </div>
                  <div className="text-center border-l-2 border-r-2 border-gray-300">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">1200+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Families Supported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">99%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#faf9f7]">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Programs we offer for
              <br />
              <span className="text-[#00468E]">educational support</span>
            </h2>
            <div className="flex gap-2">
              <button className="bg-gray-900 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                <FaChevronLeft />
              </button>
              <button className="bg-gray-900 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                <FaChevronRight />
              </button>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Program 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-white">
              <CardContent className="p-5 sm:p-6">
                <div className="bg-[#F4951D] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <FaShieldAlt className="text-white text-xl sm:text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center">
                  Fee Shield Program
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                  Protection for families facing job loss or medical emergencies. We ensure your child's education continues uninterrupted.
                </p>
              </CardContent>
            </Card>
            
            {/* Program 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-white">
              <CardContent className="p-5 sm:p-6">
                <div className="bg-[#00468E] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <FaPercentage className="text-white text-xl sm:text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center">
                  Zero-Cost EMI
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                  Interest-free installment plans for every parent. Pay school fees in manageable monthly amounts with no hidden charges.
                </p>
              </CardContent>
            </Card>
            
            {/* Program 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-white">
              <CardContent className="p-5 sm:p-6">
                <div className="bg-green-500 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <FaGraduationCap className="text-white text-xl sm:text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center">
                  Merit Scholarships
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                  Rewarding academic excellence with scholarship opportunities. Connect high-performing students with sponsors and donors.
                </p>
              </CardContent>
            </Card>
            
            {/* Program 4 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-white">
              <CardContent className="p-5 sm:p-6">
                <div className="bg-yellow-500 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <MdHealthAndSafety className="text-white text-xl sm:text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center">
                  Wellness Support
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                  Access to mental health counseling and family support services. We care about the complete wellbeing of students and parents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best resource that helps
              <br />
              families to <span className="text-[#F4951D]">grow</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Resource 1 - Orange */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-b from-orange-100 to-orange-50">
              <CardContent className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  How SchoolFee supports families in challenging times
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
                  Discover how our interest-free fee support program helps maintain educational continuity
                </p>
                <div className="relative h-[150px] sm:h-[180px] rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=250&fit=crop"
                    alt="Support resource"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all">
                  Read More
                  <FaArrowRight />
                </button>
              </CardContent>
            </Card>
            
            {/* Resource 2 - Yellow */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-b from-yellow-100 to-yellow-50">
              <CardContent className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Mental health resources in challenging times
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
                  Access counseling and support services for students and parents
                </p>
                <div className="relative h-[150px] sm:h-[180px] rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop"
                    alt="Mental health"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all">
                  Read More
                  <FaArrowRight />
                </button>
              </CardContent>
            </Card>
            
            {/* Resource 3 - Blue */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-b from-blue-100 to-blue-50">
              <CardContent className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Complete guide to navigating school fees
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
                  Learn about fee structures, support options, and financial planning
                </p>
                <div className="relative h-[150px] sm:h-[180px] rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop"
                    alt="Guide"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all">
                  Read More
                  <FaArrowRight />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}