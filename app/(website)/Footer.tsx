import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 border-t border-gray-800 relative overflow-hidden">

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">

          {/* Column 1 - Wider Brand Section */}
          <div className="lg:col-span-3">
            <Link href="/" className="flex items-center mb-4">
              <img
                src="/logo/schoolfee-logo.webp"
                alt="Schoolfee"
                className="h-13 w-auto object-contain rounded-md"
              />
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              A Health Financial Inclusion Program by Community Health Mission
              and India Health Fund Limited.
            </p>

            <p className="text-gray-500 text-xs mb-6">
              Registered under Section 8 of Companies Act, 2013
            </p>

            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/people/School-Fee/61586280328441/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://x.com/school__fee"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter size={18} />
              </a>
              <a
                href="https://www.instagram.com/school_fee/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/school-fee/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2 - About */}
          <div className="lg:col-span-2">
            <strong className="text-lg font-semibold">About</strong>
            <ul className="space-y-3 text-gray-400 text-sm mt-3">
              <li><Link href="/our-mission" className="hover:text-white transition">Our Mission</Link></li>
              <li><Link href="/about-us" className="hover:text-white transition">Why Schoolfee Matters</Link></li>
              <li><Link href="/our-program" className="hover:text-white transition">Our Program</Link></li>
              <li><Link href="/our-mission" className="hover:text-white transition">Founding Institutions</Link></li>
            </ul>
          </div>

          {/* Column 3 - Programs */}
          <div className="lg:col-span-3">
            <strong className="text-lg font-semibold">Programs</strong>
            <ul className="space-y-3 text-gray-400 text-sm mt-3">
              <li>
                <Link href="/our-program#fee-support" className="hover:text-white transition">
                  Fee Support Program
                </Link>
              </li>

              <li>
                <Link href="/our-program#emergency" className="hover:text-white transition">
                  Emergency Education Support
                </Link>
              </li>

              <li>
                <Link href="/our-program#school-partnership" className="hover:text-white transition">
                  School Partnership Program
                </Link>
              </li>

              <li>
                <Link href="/our-program#health-linked" className="hover:text-white transition">
                  Health-Linked Education Continuity
                </Link>
              </li>
            </ul>

          </div>

          {/* Column 4 - Support Us */}
          <div className="lg:col-span-2">
            <strong className="text-lg font-semibold">Quick Links</strong>
            <ul className="space-y-3 text-gray-400 text-sm mt-3">
              <li><Link href="/donate" className="hover:text-white transition">Donate</Link></li>
              <li><Link href="/partners" className="hover:text-white transition">CSR & Grants</Link></li>
              <li><Link href="/partners" className="hover:text-white transition">Partner With Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 5 - Resources */}
          <div className="lg:col-span-2">
            <strong className="text-lg font-semibold">Resources</strong>
            <ul className="space-y-3 text-gray-400 text-sm mt-3">
              <li><Link href="/blogs" className="hover:text-white transition">Blogs</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/about-us" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Schoolfee.in. All rights reserved.
            A collaborative initiative of CHM & India Health Fund Limited.
          </p>

          <div className="flex space-x-6 mt-3 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms-condition" className="hover:text-white transition">Terms</Link>
            <Link href="/contact-us" className="hover:text-white transition">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
