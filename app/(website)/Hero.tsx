"use client";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#00468e] to-[#003366] py-20 lg:py-10">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#f4951d] rounded-full blur-[100px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#0cab47] rounded-full blur-[100px] opacity-30 animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Side */}
          <div className="w-full lg:w-1/2 text-left lg:text-left space-y-4">

            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#f4951d] font-bold text-sm tracking-widest uppercase shadow-lg">
              <span className="text-2xl w-2 h-2 rounded-full bg-[#0cab47] animate-ping"></span>
              Empowering Education
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
              Schoolfee -
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4951d] via-[#ffc107] to-[#f4951d]">
                Education Without Financial Stress
              </span>
            </h1>

            <div className="text-base sm:text-lg md:text-xl text-blue-100 font-light max-w-4xl">
              <p>
                Schoolfee is a Health Financial Inclusion Program, a collaborative initiative of Community Health Mission (CHM) and India Health Fund Limited. Operating through <b>CarePay®</b>, India’s Digital Health Wallet, our platform is designed to support middle-class Lower Income Group families who face temporary financial challenges in paying their children’s school fees on time.
              </p>
            </div>

            {/* Buttons — stacked on mobile/tablet */}
            <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row gap-4">

              <Link
                href="/contact-us"
                className="inline-flex justify-center items-center gap-2 px-5 py-2 text-lg font-bold text-white bg-[#f4951d] rounded-full shadow-lg hover:bg-[#d68118]"
              >
                Connect With Us <FaArrowRight />
              </Link>

              <Link
                href="/about-us"
                className="inline-flex justify-center items-center gap-3 px-8 py-4 text-lg font-bold text-white bg-white/10 border border-white/20 rounded-full shadow-lg hover:bg-white/20"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Side — Hidden on mobile & tablet */}
          <div className="hidden lg:flex w-full lg:w-1/2 flex-col items-center justify-center mt-12 lg:mt-0 relative">
            <div className="relative w-full max-w-lg mx-auto mb-8">
              <img src="/hero-image.png" alt="Schoolfee Hero" className="w-full h-auto object-contain" />
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-base font-medium text-white w-full">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <FaCheckCircle className="text-[#f4951d]" /> Interest Free
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <FaCheckCircle className="text-[#0cab47]" /> Instant Support
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <FaCheckCircle className="text-blue-400" /> Secure Process
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
