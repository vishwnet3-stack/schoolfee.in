"use client";
import { FaArrowRight, FaEnvelope, FaPhone, FaHandHoldingHeart } from 'react-icons/fa';

export default function CTASection() {
  const teamMembers = [
    {
      name: "ANSHUL",
      location: "Mumbai",
      image: "/users/user1.avif",
      color: "bg-cyan-400",
      position: { top: "10%", left: "15%" }
    },
    {
      name: "RAHUL",
      location: "Delhi",
      image: "/users/user2.webp",
      color: "bg-yellow-400",
      position: { top: "5%", right: "20%" }
    },
    {
      name: "ROHIT",
      location: "Bangalore",
      image: "https://img.freepik.com/premium-photo/face-young-handsome-indian-man_251136-20659.jpg",
      color: "bg-orange-400",
      position: { top: "35%", right: "15%" }
    },
    {
      name: "VIKRAM",
      location: "Chennai",
      image: "/users/user3.webp",
      color: "bg-green-400",
      position: { bottom: "25%", right: "10%" }
    },
    {
      name: "MEERA",
      location: "Pune",
      image: "/users/user4.jpg",
      color: "bg-purple-400",
      position: { bottom: "15%", left: "20%" }
    },
    {
      name: "ARJUN",
      location: "Hyderabad",
      image: "/users/user5.avif",
      color: "bg-blue-400",
      position: { top: "45%", left: "10%" }
    }
  ];

  return (
    <section className="relative py-10 lg:py-8 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#f4951d] rounded-full blur-[150px] opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0cab47] rounded-full blur-[150px] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-2 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 sm:gap-10 lg:gap-16">

          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-4 sm:space-y-5 lg:space-y-6 text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#00468e] leading-tight">
              <span className="text-[#f4951d]">Join Us</span> in Supporting Education and Mental Health
            </h2>

            <p className="text-base text-gray-700 leading-relaxed">
              Schoolfee is more than a financial support platform—it is a movement to protect children's education, confidence, and mental health. By standing with parents during difficult moments, we help build stronger families, healthier students, and brighter futures.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="/registration/parent"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-bold text-white transition-all duration-300 bg-[#f4951d] rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 group"
              >
                Get Started Today
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-bold text-[#00468e] transition-all duration-300 bg-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 border-2 border-[#00468e]"
              >
                <FaEnvelope />
                Contact Us
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">

            {/* Desktop Network */}
            <div className="relative w-full max-w-lg h-[420px] hidden lg:block">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-[#00468e]">
                  <div className="text-center">
                    <FaHandHoldingHeart className="text-2xl text-[#00468e] mx-auto mb-1" />
                    <p className="text-xs font-bold text-[#00468e]">Schoolfee</p>
                    <p className="text-xs text-gray-600">Team</p>
                  </div>
                </div>
              </div>

              {teamMembers.map((member, index) => {
                const angle = (index * 60) * (Math.PI / 180);
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={index}
                    className="absolute animate-float"
                    style={{
                      top: `calc(50% + ${y}px)`,
                      left: `calc(50% + ${x}px)`,
                      transform: "translate(-50%, -50%)",
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <div className="relative group">
                      <div className={`w-16 h-16 ${member.color} rounded-full p-1 shadow-lg group-hover:scale-110 transition-transform`}>
                        <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover border-2 border-white" />
                      </div>

                      <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs font-bold text-[#00468e]">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.location}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile & Tablet Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full  lg:hidden">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-left">
                  <div className={`w-16 h-16 ${member.color} rounded-full p-1 shadow-md mb-1`}>
                    <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover border-2 border-white" />
                  </div>
                  <p className="text-xs font-bold text-[#00468e]">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.location}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}