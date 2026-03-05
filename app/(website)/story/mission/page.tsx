'use client';

import React from 'react';
import { Search, Users, BookOpen, Award, Heart, BarChart3, Star, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="w-full bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#F5F0F0] to-[#F0E8F0] px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Develop your skills in a new and unique way
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Explore comprehensive learning programs tailored for your growth</p>
              
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                <Button className="bg-[#00468E] hover:bg-[#003355] text-white h-9 sm:h-10 text-xs sm:text-sm font-semibold">
                  Explore Now
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <img 
                src="https://images.unsplash.com/photo-1494942458637-ff1bfc3ca585?w=400&h=500&fit=crop" 
                alt="Learning" 
                className="w-full max-w-sm md:max-w-md h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos Section */}
      <section className="w-full bg-[#B19CD9] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-5">
            {['duolingo', 'magic leap', 'microsoft', 'coursera', 'udemy'].map((brand) => (
              <span key={brand} className="text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Search Courses Section */}
      <section className="w-full bg-white px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4 sm:mb-6">Search Courses</h2>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for over 500 courses"
                className="w-full pl-9 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#00468E]"
              />
            </div>
            <Button className="bg-[#B19CD9] hover:bg-[#9D7EC9] text-white h-10 text-sm font-semibold px-6 sm:px-8">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full bg-white px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {[
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=250&h=250&fit=crop',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop',
              ].map((src, i) => (
                <div key={i} className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#D8A5E5] to-[#C9A3DB] p-1 sm:p-1.5">
                  <img src={src || "/placeholder.svg"} alt={`Student ${i + 1}`} className="w-full h-24 sm:h-28 md:h-36 object-cover rounded-3xl" />
                </div>
              ))}
            </div>

            {/* Benefits List */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Benefits From Our Online Learnings</h2>
              
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {[
                  { icon: BookOpen, title: 'Online Programs', desc: 'Comprehensive learning programs' },
                  { icon: Clock, title: 'Short Courses', desc: 'Quick skill-building courses' },
                  { icon: Users, title: 'Training From Experts', desc: 'Learn from industry experts' },
                  { icon: Award, title: '13k+ Video Courses', desc: 'Extensive video library' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-7 sm:h-8 w-7 sm:w-8 rounded-full bg-[#E8C4F0]">
                        <item.icon className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-[#B19CD9]" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="w-full bg-[#B19CD9] px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8 md:mb-10">Our Popular Courses</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              { title: 'Web Design & Development', price: '$199.00', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop' },
              { title: 'UI/UX Design Masterclass', price: '$179.00', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop' },
              { title: 'Digital Marketing Strategy', price: '$149.00', image: 'https://images.unsplash.com/photo-1460925895917-adf4e5a5dc75?w=300&h=200&fit=crop' },
            ].map((course, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-32 sm:h-40 object-cover" />
                
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2">{course.title}</h3>
                  <p className="text-[#B19CD9] font-bold text-xs sm:text-sm mt-2">Price: {course.price}</p>

                  <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-gray-200 mt-2 sm:mt-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop" alt="Instructor" className="w-5 sm:w-6 h-5 sm:h-6 rounded-full" />
                    <span className="text-xs text-gray-600">Expert Trainer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="w-full bg-white px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                If You Are A Certified Teacher Then <span className="text-[#B19CD9]">Become An Instructor</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">Share your expertise and help millions of students achieve their goals</p>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Enjoy Many Perks</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {[
                    'Competitive earning potential',
                    'Flexible working hours',
                    'Professional development',
                    'Global reach & impact',
                  ].map((perk, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                      <CheckCircle className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-[#B19CD9] flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="bg-[#E8C4F0] hover:bg-[#D8A5E5] text-[#B19CD9] h-9 sm:h-10 text-xs sm:text-sm font-semibold w-full sm:w-auto">
                Start Teaching
              </Button>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="w-40 sm:w-48 md:w-56 h-40 sm:h-48 md:h-56 rounded-3xl bg-gradient-to-br from-[#D8A5E5] to-[#C9A3DB] p-1.5 sm:p-2">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" 
                  alt="Instructor" 
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-[#B19CD9] px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8 md:mb-10">Student's Testimonials</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              { name: 'Sarah Johnson', feedback: 'Amazing course! The instructors are very supportive and content is well-structured.' },
              { name: 'Michael Chen', feedback: 'Best learning platform. Practical approach and excellent mentorship throughout.' },
              { name: 'Emma Williams', feedback: 'Great experience with real projects. Highly recommend for skill development.' },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl p-4 sm:p-5 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={`https://images.unsplash.com/photo-${1500 + i * 100}-7a1dd7228f2d?w=48&h=48&fit=crop`}
                    alt={testimonial.name}
                    className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{testimonial.name}</h3>
                </div>

                <div className="flex gap-0.5 mb-2 sm:mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-[#F4951D] text-[#F4951D]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-gray-600">{testimonial.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-[#E8C4F0] to-[#D8A5E5] px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 md:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Ready to Begin Learning?</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-700">Join thousands of students and start your journey today</p>
          
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center pt-2 sm:pt-4">
            <Button className="bg-[#B19CD9] hover:bg-[#9D7EC9] text-white h-9 sm:h-10 text-xs sm:text-sm font-semibold px-4 sm:px-8">
              Get Started
            </Button>
            <Button variant="outline" className="border-[#B19CD9] text-[#B19CD9] hover:bg-[#B19CD9]/10 h-9 sm:h-10 text-xs sm:text-sm font-semibold px-4 sm:px-8 bg-transparent">
              Explore More
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Clock icon component
function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
