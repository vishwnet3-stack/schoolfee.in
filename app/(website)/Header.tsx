"use client";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Settings,
  UserPlus,
  FileText,
  GraduationCap,
  School,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfileDropdown from "@/components/UserProfileDropdown";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDesktopRegDropdownOpen, setIsDesktopRegDropdownOpen] = useState(false);
  const [isMobileRegDropdownOpen, setIsMobileRegDropdownOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const pathname = usePathname();
  const stickyRef = useRef<HTMLDivElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Track scroll state
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Measure sticky header height so we can push page content down
  useEffect(() => {
    const updateHeight = () => {
      if (stickyRef.current) {
        setHeaderHeight(stickyRef.current.offsetHeight);
      }
    };
    updateHeight();
    // Re-measure when menu opens/closes
    const observer = new ResizeObserver(updateHeight);
    if (stickyRef.current) observer.observe(stickyRef.current);
    return () => observer.disconnect();
  }, [isMenuOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target as Node)) {
        setIsDesktopRegDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target as Node)) {
        setIsMobileRegDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smooth scroll to hash
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const element = document.querySelector(hash);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };
    setTimeout(scrollToHash, 150);
  }, [headerHeight]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    {
      label: "Our Mission", href: "/our-mission",
      submenu: [
        { label: "Core Challenges", href: "/our-mission#core-challenges" },
        { label: "Our Framework", href: "/our-mission#our-framework" },
        { label: "What We Stand For", href: "/our-mission#what-we-stand-for" },
        { label: "Trust & Governance", href: "/our-mission#trust-governance" },
      ],
    },
    { label: "How It Works", href: "/how-it-works" },
    {
      label: "Programs", href: "/our-program",
      submenu: [
        { label: "Fee Support Program", href: "/our-program#fee-support" },
        { label: "Emergency Education Support", href: "/our-program#emergency" },
        { label: "School Partnership Program", href: "/our-program#school-partnership" },
        { label: "Health-Linked Education Continuity", href: "/our-program#health-linked" },
        { label: "Community Points", href: "/community-points" },
      ],
    },
    {
      label: "Teacher Support", href: "#",
      submenu: [
        { label: "About the Program", href: "/teacher-support" },
        { label: "How It Works", href: "/teacher-support/how-it-works" },
        { label: "Financial Package", href: "/teacher-support/package" },
        { label: "Apply as Teacher", href: "/registration/teacher" },
      ],
    },
    { label: "Partners", href: "/partners" },
    { label: "Donate & Support", href: "/donate" },
    {
      label: "Media", href: "#",
      submenu: [
        { label: "Photo Gallery", href: "/photo-gallery" },
        { label: "Press Release", href: "/press-release" },
        { label: "Twitter Feed", href: "https://x.com/school__fee" },
        { label: "Events / Announcements", href: "/news-events" },
        { label: "Key Developments", href: "/key-developments" },
        { label: "Major Achievements", href: "/major-achievements" },
      ],
    },
    { label: "Contact Us", href: "/contact-us" },
  ];

  const registrationOptions = [
    { label: "Start Survey", href: "/survey", icon: FileText, description: "Complete our survey" },
    { label: "Parent Registration", href: "/registration/parent", icon: UserPlus, description: "Complete Your Registration" },
    { label: "Teacher Registration", href: "/registration/teacher", icon: GraduationCap, description: "Complete Your Registration" },
    { label: "School Registration", href: "/registration/school", icon: School, description: "Complete Your Registration" },
  ];

  return (
    <>
      {/*
        ─────────────────────────────────────────────────────────
        SPACER — pushes page content below the fixed header.
        Height matches the fixed header exactly via JS measurement.
        This is the correct pattern for fixed-position headers.
        ─────────────────────────────────────────────────────────
      */}
      <div style={{ height: headerHeight }} aria-hidden="true" />

      {/*
        ─────────────────────────────────────────────────────────
        FIXED HEADER — position:fixed is IMMUNE to parent
        overflow:hidden / overflow-x:hidden unlike sticky.
        Works 100% of the time regardless of layout wrappers.
        ─────────────────────────────────────────────────────────
      */}
      <div
        ref={stickyRef}
        id="site-header"
        className="fixed top-0 left-0 right-0 z-50 bg-white"
        style={{ boxShadow: isScrolled ? "0 2px 8px rgba(0,0,0,0.12)" : "none" }}
      >
        {/* ── TOP BAR (orange) — animates away on scroll ── */}
        <div
          style={{
            maxHeight: isScrolled ? "0px" : "36px",
            opacity: isScrolled ? 0 : 1,
            transition: "max-height 0.35s ease, opacity 0.25s ease",
            overflow: "hidden",
            backgroundColor: "#F9A618",
          }}
        >
          <div className="h-9 px-4 flex items-center">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-center lg:justify-between text-xs md:text-sm text-black">
              <div className="flex gap-4 md:gap-6 font-bold flex-wrap justify-center lg:justify-start text-center lg:text-left">
                <span className="hidden sm:block font-normal">
                  <span className="font-devanagari"> सामुदायिक स्वास्थ्य मिशन </span>
                  | Community Health Mission
                </span>
                <span>CarePay® | National Health Financial Inclusion Initiative Program</span>
              </div>
              <div className="hidden lg:flex gap-6 items-center">
                <button className="hover:text-blue-700 transition flex items-center gap-2">
                  <Settings size={16} />
                  Screen Reader Access
                </button>
                <select
                  onChange={(e) => { const v = e.target.value; if (v) window.location.href = v; }}
                  defaultValue=""
                  className="bg-gray-800 rounded px-3 py-1 text-white cursor-pointer hover:bg-gray-700 transition"
                >
                  <option value="" disabled>Our Policy</option>
                  <option value="/privacy-policy">Privacy Policy</option>
                  <option value="/terms-condition">Terms & Condition</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── MIDDLE HEADER — logo row ── */}
        <div className="bg-white border-b border-gray-200">
          <div className="h-16 px-4 flex items-center">
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-4">
              <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                <img src="/logo/schoolfee logo.webp" alt="SchoolFee Logo" className="h-12 w-auto" />
              </Link>

              <div className="flex items-center gap-3">
                <img src="/images/chm-circle-logo.jpeg" alt="CHM Logo" className="h-14 w-auto" />

                {/* Desktop — User Profile */}
                <div className="hidden">
                  <UserProfileDropdown />
                </div>

                {/* Desktop — Join Waitlist button */}
                <Link
                  href="/join-waitlist"
                  className="hidden lg:inline-flex items-center justify-center px-4 h-10 bg-gradient-to-r from-[#F4951D] to-[#e07d0a] hover:from-[#e07d0a] hover:to-[#c96f00] text-white shadow-md hover:shadow-lg transition-all rounded-md font-medium text-sm whitespace-nowrap"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Waitlist
                </Link>

                {/* Desktop — Become A Member (original, restored) */}
                <div className="hidden lg:block relative" ref={desktopDropdownRef}>
                  <button
                    onClick={() => setIsDesktopRegDropdownOpen(!isDesktopRegDropdownOpen)}
                    className="inline-flex items-center justify-center px-4 h-10 bg-gradient-to-r from-[#00468E] to-[#0066CC] hover:from-[#003a75] hover:to-[#0052a3] text-white shadow-md hover:shadow-lg transition-all rounded-md font-medium text-sm whitespace-nowrap"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Become A Member
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isDesktopRegDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDesktopRegDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg border border-gray-200 py-3 z-50">
                      {registrationOptions.map((option, i) => {
                        const Icon = option.icon;
                        return (
                          <Link
                            key={i}
                            href={option.href}
                            className="flex items-start gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsDesktopRegDropdownOpen(false)}
                          >
                            <Icon className="h-4 w-4 mt-0.5 text-[#00468E] flex-shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 text-sm">{option.label}</span>
                              <span className="text-xs text-gray-500">{option.description}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── NAV BAR ── */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-2">

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center justify-center h-11">
              {navItems.map((item, i) => (
                <div key={i} className="relative group">
                  {item.submenu ? (
                    <>
                      <button className="text-gray-800 font-medium px-3 xl:px-4 py-3 hover:text-blue-600 flex items-center gap-1 text-sm whitespace-nowrap">
                        {item.label}
                        <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
                      </button>
                      <div className="absolute left-0 top-full hidden group-hover:block bg-white px-4 py-2 shadow-lg border border-gray-100 rounded-md min-w-max z-50">
                        {item.submenu.map((sub, j) => (
                          <Link
                            key={j}
                            href={sub.href}
                            className="block py-2 text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap"
                            onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-800 font-medium px-3 xl:px-4 py-3 hover:text-blue-600 block text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile top row */}
            <div className="lg:hidden flex items-center justify-between h-12 gap-2">
              {/* <div className="flex-1 min-w-0"> */}
              <div className="hidden">
                <UserProfileDropdown />
              </div>

              {/* Mobile — Join Waitlist */}
              <Link
                href="/join-waitlist"
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium border border-[#F4951D] text-[#F4951D] hover:bg-[#F4951D] hover:text-white rounded-md transition-colors whitespace-nowrap"
              >
                <UserPlus className="mr-1 h-3 w-3" />
                Waitlist
              </Link>

              {/* Mobile — Become A Member (original, restored) */}
              <div className="relative" ref={mobileDropdownRef}>
                <button
                  onClick={() => setIsMobileRegDropdownOpen(!isMobileRegDropdownOpen)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium border border-[#00468E] text-[#00468E] hover:bg-[#00468E] hover:text-white rounded-md transition-colors whitespace-nowrap"
                >
                  <UserPlus className="mr-1 h-3 w-3" />
                  Join Membership
                  <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isMobileRegDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isMobileRegDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    {registrationOptions.map((option, i) => {
                      const Icon = option.icon;
                      return (
                        <Link
                          key={i}
                          href={option.href}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsMobileRegDropdownOpen(false)}
                        >
                          <Icon className="h-4 w-4 text-[#00468E] flex-shrink-0" />
                          <span className="text-sm text-gray-900">{option.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 p-1">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile drawer */}
            {isMenuOpen && (
              <div className="lg:hidden border-t border-gray-100 pb-2">
                {navItems.map((item, i) => (
                  <div key={i}>
                    {item.submenu ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.label)}
                          className="w-full text-left px-1 py-3 flex justify-between items-center text-sm font-medium text-gray-800 border-b border-gray-50"
                        >
                          {item.label}
                          <ChevronDown size={15} className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
                        </button>
                        {openDropdown === item.label && (
                          <div className="ml-4 border-l-2 border-[#00468E]/20 pl-3 mb-1">
                            {item.submenu.map((sub, j) => (
                              <Link
                                key={j}
                                href={sub.href}
                                className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                                onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-1 py-3 text-sm font-medium text-gray-800 hover:text-blue-600 border-b border-gray-50"
                        onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}