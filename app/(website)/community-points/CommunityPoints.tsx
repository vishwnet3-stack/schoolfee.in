"use client"

import Link from "next/link"
import Image from "next/image"
import {
  FaCoins,
  FaGift,
  FaHeart,
  FaUsers,
  FaTrophy,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaGraduationCap,
  FaHandHoldingHeart,
  FaChartLine,
  FaAward,
  FaBook,
  FaChild,
  FaUserFriends,
  FaCalendarCheck,
  FaShieldAlt,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa"
import { MdCardGiftcard, MdSchool, MdVolunteerActivism } from "react-icons/md"

const earnPointsWays = [
  {
    icon: FaCalendarCheck,
    title: "Regular Fee Payments",
    points: "10-50",
    description: "Earn points every time you pay school fees through CarePay via Schoolfee platform",
    color: "bg-[#0B4C8A]",
  },
  {
    icon: FaUsers,
    title: "Community Participation",
    points: "25-100",
    description: "Active participation in community events, workshops, and parent meetings",
    color: "bg-[#F9A11B]",
  },
  {
    icon: FaUserFriends,
    title: "Referral Rewards",
    points: "100-200",
    description: "Refer other parents to join Schoolfee and earn bonus points when they enroll",
    color: "bg-[#0B4C8A]",
  },
  {
    icon: FaHandHoldingHeart,
    title: "Helping Others",
    points: "50-150",
    description: "Assist fellow parents in need by sharing resources or providing mentorship",
    color: "bg-[#F9A11B]",
  },
  {
    icon: FaChartLine,
    title: "Consistent Repayment",
    points: "20-75",
    description: "Timely repayment of fee support generates reward points for responsible behavior",
    color: "bg-[#0B4C8A]",
  },
  {
    icon: FaStar,
    title: "Milestone Achievements",
    points: "200-500",
    description: "Reach participation milestones (6, 12, 24 months) and earn special bonus points",
    color: "bg-[#F9A11B]",
  },
]

const redemptionOptions = [
  {
    icon: FaGraduationCap,
    title: "School Fee Support",
    pointsRequired: "500+",
    description: "Use points to cover partial or full school fees for your child or support other families",
    benefit: "Direct fee payment to school",
  },
  {
    icon: FaBook,
    title: "Books & Stationery",
    pointsRequired: "200-400",
    description: "Redeem points for textbooks, notebooks, and essential school supplies",
    benefit: "Free educational materials",
  },
  {
    icon: MdSchool,
    title: "Uniform Assistance",
    pointsRequired: "300-500",
    description: "Get school uniforms, shoes, and bags for your children using accumulated points",
    benefit: "Complete uniform sets",
  },
  {
    icon: FaGift,
    title: "Enroll New Members",
    pointsRequired: "400+",
    description: "Donate points to help other parents join the Schoolfee community platform",
    benefit: "Community expansion",
  },
  {
    icon: FaHandHoldingHeart,
    title: "Emergency Support Pool",
    pointsRequired: "100-300",
    description: "Contribute points to emergency fund for families facing sudden financial hardships",
    benefit: "Help families in crisis",
  },
  {
    icon: FaAward,
    title: "Educational Courses",
    pointsRequired: "600-1000",
    description: "Access skill development programs, tutoring sessions, and graduation courses",
    benefit: "Future opportunities",
  },
]

const membershipTiers = [
  {
    tier: "Bronze Member",
    pointsRange: "0-500",
    icon: FaStar,
    color: "from-[#CD7F32] to-[#A0522D]",
    benefits: [
      "Basic point earning (1x multiplier)",
      "Access to fee support after 6 months",
      "Community forum access",
      "Monthly newsletter updates",
    ],
  },
  {
    tier: "Silver Member",
    pointsRange: "500-1,500",
    icon: FaAward,
    color: "from-[#C0C0C0] to-[#808080]",
    benefits: [
      "Enhanced earning (1.25x multiplier)",
      "Priority support processing",
      "Free financial counseling (1 session/quarter)",
      "Early access to new benefits",
    ],
  },
  {
    tier: "Gold Member",
    pointsRange: "1,500-3,000",
    icon: FaTrophy,
    color: "from-[#FFD700] to-[#FFA500]",
    benefits: [
      "Premium earning (1.5x multiplier)",
      "Express fee payment processing",
      "Free workshops & training (unlimited)",
      "Exclusive community events",
    ],
  },
  {
    tier: "Life Member",
    pointsRange: "3,000+",
    icon: FaRocket,
    color: "from-[#0B4C8A] to-[#094076]",
    benefits: [
      "Maximum earning (2x multiplier)",
      "Lifetime platform benefits",
      "Special recognition & awards",
      "Founding member privileges",
      "Mentorship opportunities",
    ],
    special: true,
  },
]

const faqs = [
  {
    question: "How long do points remain valid?",
    answer: "Points earned through regular participation remain valid as long as you maintain active membership. Bonus points from special promotions may have specific expiry dates.",
  },
  {
    question: "Can I transfer points to another parent?",
    answer: "Yes! You can donate points to help other parents join the platform or support their children's education. This feature strengthens our community bonds.",
  },
  {
    question: "What happens if I miss a payment?",
    answer: "Missing occasional payments won't delete your points, but consistent participation is key to earning more. We'll work with you to get back on track.",
  },
  {
    question: "Can I combine points with other benefits?",
    answer: "Absolutely! Points can be used alongside your fee support plan to maximize benefits and reduce financial burden.",
  },
]

export default function CommunityPointsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ================= HERO SECTION ================= */}
      <section className="pt-16 pb-8 md:pt-20 md:pb-10 text-white relative overflow-hidden" style={{
        background: `url('/pattern/2.jpg')`,
      }}>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F9A11B]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block bg-[#F9A11B]/20 text-[#F9A11B] px-3 py-1 rounded-full text-xs font-medium mb-3">
                Reward & Recognition System
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                Community Points Program
              </h1>
              <p className="text-base sm:text-lg text-white/90 mb-5 leading-relaxed">
                Earn points for every positive action in the Schoolfee ecosystem. Redeem them to support your child's education, help other families, and unlock exclusive benefits. The more you participate, the more you earn!
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-xl lg:text-2xl font-bold text-[#F9A11B]">100+</div>
                  <div className="text-xs text-white/80">Ways to Earn</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-xl lg:text-2xl font-bold text-[#F9A11B]">50+</div>
                  <div className="text-xs text-white/80">Redemptions</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-xl lg:text-2xl font-bold text-[#F9A11B]">∞</div>
                  <div className="text-xs text-white/80">Impact</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/registration/parent"
                  className="inline-flex items-center justify-center bg-[#F9A11B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#E69010] transition"
                >
                  Start Earning Points
                  <FaArrowRight className="ml-2 text-xs" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white hover:text-[#0B4C8A] transition"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-4">
                  <FaCoins className="text-6xl text-[#F9A11B] mx-auto mb-3" />
                  <h2 className="text-xl font-bold mb-1">Your Point Balance</h2>
                  <p className="text-sm text-white/80">Track and redeem anytime</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <FaGraduationCap className="text-2xl text-[#F9A11B] mx-auto mb-2" />
                    <div className="text-xs text-white/80">Fee Support</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <FaBook className="text-2xl text-[#F9A11B] mx-auto mb-2" />
                    <div className="text-xs text-white/80">Books & Supplies</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <FaGift className="text-2xl text-[#F9A11B] mx-auto mb-2" />
                    <div className="text-xs text-white/80">Help Others</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <FaAward className="text-2xl text-[#F9A11B] mx-auto mb-2" />
                    <div className="text-xs text-white/80">Courses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW TO EARN POINTS ================= */}
      <section id="how-it-works" className="py-8 md:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-[#F9A11B]/10 text-[#F9A11B] px-3 py-1 rounded-full text-xs font-medium mb-2">
              Multiple Ways to Earn
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0B4C8A] mb-2">
              How to Earn Community Points
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
              Every positive action in the Schoolfee ecosystem rewards you with points. Build your balance through regular participation, helping others, and staying committed to your child's education.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnPointsWays.map((way, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-[#F6F5F1] border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`${way.color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <way.icon className="text-white text-lg" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#0B4C8A] mb-1">
                      {way.title}
                    </h3>
                    <div className="inline-block bg-[#F9A11B]/20 text-[#F9A11B] px-2 py-0.5 rounded text-xs font-semibold">
                      {way.points} points
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {way.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-[#0B4C8A] to-[#094076] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FaLightbulb className="text-3xl text-[#F9A11B] flex-shrink-0" />
              <div className="text-white">
                <h4 className="text-base font-bold mb-1">Pro Tip</h4>
                <p className="text-sm text-white/90">
                  Combine multiple earning activities each month to maximize your points! Regular fee payments + referrals + community help = faster tier upgrades and more benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REDEMPTION OPTIONS ================= */}
      <section className="py-8 md:py-10 lg:py-12 bg-gradient-to-br from-[#F6F5F1] to-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-[#0B4C8A]/10 text-[#0B4C8A] px-3 py-1 rounded-full text-xs font-medium mb-2">
              Flexible Redemption
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0B4C8A] mb-2">
              Redeem Your Points
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
              Your points, your choice. Use accumulated points for school fees, supplies, helping others, or accessing premium educational resources.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {redemptionOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 border-2 border-[#E5E7EB] hover:border-[#F9A11B] hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#F9A11B]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#F9A11B] transition-all">
                    <option.icon className="text-2xl text-[#F9A11B] group-hover:text-white transition-all" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#0B4C8A] mb-1">
                      {option.title}
                    </h3>
                    <div className="inline-block bg-[#0B4C8A]/10 text-[#0B4C8A] px-2 py-0.5 rounded text-xs font-semibold">
                      {option.pointsRequired} pts
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                  {option.description}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-[#E5E7EB]">
                  <FaCheckCircle className="text-green-600 text-sm" />
                  <span className="text-xs font-medium text-gray-700">{option.benefit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/registration/parent"
              className="inline-flex items-center bg-[#F9A11B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#E69010] transition"
            >
              Start Redeeming Points
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= MEMBERSHIP TIERS ================= */}
      <section className="py-8 md:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-[#F9A11B]/10 text-[#F9A11B] px-3 py-1 rounded-full text-xs font-medium mb-2">
              Tier Benefits
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0B4C8A] mb-2">
              Membership Tier System
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
              Progress through membership tiers as you accumulate points. Each tier unlocks enhanced benefits, earning multipliers, and exclusive opportunities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {membershipTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative rounded-xl p-4 text-white overflow-hidden ${tier.special ? 'ring-2 ring-[#F9A11B]' : ''
                  }`}
                style={{
                  background: `url('/pattern/2.jpg')`,
                }}
              >
                {tier.special && (
                  <div className="absolute top-2 right-2 bg-[#F9A11B] text-white px-2 py-1 rounded text-xs font-bold">
                    EXCLUSIVE
                  </div>
                )}

                <div className="text-center mb-3">
                  <tier.icon className="text-4xl mx-auto mb-2 opacity-90" />
                  <h3 className="text-lg font-bold mb-1">{tier.tier}</h3>
                  <div className="text-sm opacity-90">{tier.pointsRange} pts</div>
                </div>

                <ul className="space-y-2">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <FaCheckCircle className="flex-shrink-0 mt-0.5 opacity-80" />
                      <span className="opacity-90">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-[#F6F5F1] to-[#E8E6E0] rounded-xl p-4 border border-[#E5E7EB]">
            <div className="flex items-start gap-3">
              <FaRocket className="text-3xl text-[#F9A11B] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-bold text-[#0B4C8A] mb-1">
                  Tier Progression Rewards
                </h4>
                <p className="text-sm text-gray-600">
                  As you move up tiers, you unlock point multipliers that help you earn even faster. Life Members enjoy 2x points on all activities, plus exclusive access to mentorship programs, special events, and priority support services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY IMPACT ================= */}
      <section className="py-8 md:py-10 text-white relative overflow-hidden" style={{
        background: `url('/pattern/2.jpg')`,
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <div className="inline-block bg-[#F9A11B]/20 text-[#F9A11B] px-3 py-1 rounded-full text-xs font-medium mb-3">
                Collective Power
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                Your Points, Our Community's Strength
              </h2>
              <p className="text-base text-white/90 mb-4 leading-relaxed">
                The Community Points system isn't just about individual rewards—it's about building a support network where everyone thrives. When you donate points to help another parent, when you contribute to the emergency fund, or when you use points to enroll new members, you're strengthening the entire ecosystem.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <MdVolunteerActivism className="text-2xl text-[#F9A11B] flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Pay It Forward</h3>
                    <p className="text-sm text-white/80">
                      Points you donate help other families access education support, creating a virtuous cycle of assistance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <FaUsers className="text-2xl text-[#F9A11B] flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Grow Together</h3>
                    <p className="text-sm text-white/80">
                      As more members earn and redeem points, the community fund grows, benefiting everyone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <FaHeart className="text-2xl text-[#F9A11B] flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Create Impact</h3>
                    <p className="text-sm text-white/80">
                      Every point redeemed translates to real educational support—books, fees, uniforms, and opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <h2 className="text-xl font-bold mb-4 text-center">Building Our Community Together</h2>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <FaUsers className="text-4xl text-[#F9A11B] mx-auto mb-2" />
                  <h3 className="font-bold text-lg mb-1">Join the Movement</h3>
                  <p className="text-sm text-white/80">
                    Be among the first families to experience the power of community-driven educational support
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <FaCoins className="text-4xl text-[#F9A11B] mx-auto mb-2" />
                  <h3 className="font-bold text-lg mb-1">Earn & Redeem</h3>
                  <p className="text-sm text-white/80">
                    Start earning points from day one and redeem them for educational benefits
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <FaHeart className="text-4xl text-[#F9A11B] mx-auto mb-2" />
                  <h3 className="font-bold text-lg mb-1">Make a Difference</h3>
                  <p className="text-sm text-white/80">
                    Your participation helps build a stronger support network for all families
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS TIMELINE ================= */}
      <section className="py-8 md:py-10 bg-gradient-to-b from-[#F6F5F1] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0B4C8A] mb-2">
              Your Points Journey
            </h2>
            <p className="text-sm lg:text-base text-gray-600">
              From enrollment to redemption—here's how it works
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-[#0B4C8A] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1 bg-white rounded-lg p-3 border border-[#E5E7EB]">
                <h3 className="font-bold text-[#0B4C8A] mb-1">Join Schoolfee</h3>
                <p className="text-sm text-gray-600">
                  Register on the platform and receive 50 welcome bonus points immediately
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-[#0B4C8A] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1 bg-white rounded-lg p-3 border border-[#E5E7EB]">
                <h3 className="font-bold text-[#0B4C8A] mb-1">Make Payments</h3>
                <p className="text-sm text-gray-600">
                  Pay school fees through CarePay and earn 10-50 points per transaction
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-[#0B4C8A] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1 bg-white rounded-lg p-3 border border-[#E5E7EB]">
                <h3 className="font-bold text-[#0B4C8A] mb-1">Participate & Earn</h3>
                <p className="text-sm text-gray-600">
                  Attend events, refer friends, help others, and watch your balance grow
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-[#F9A11B] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div className="flex-1 bg-gradient-to-r from-[#F9A11B]/10 to-transparent rounded-lg p-3 border-2 border-[#F9A11B]">
                <h3 className="font-bold text-[#0B4C8A] mb-1">Redeem Benefits</h3>
                <p className="text-sm text-gray-600">
                  Use points for fees, books, uniforms, or help other families in need
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-8 md:py-10 bg-white" >
        <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0B4C8A] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-600">
              Common questions about the Community Points program
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#F6F5F1] to-white rounded-xl p-4 border border-[#E5E7EB]"
              >
                <h3 className="font-bold text-[#0B4C8A] mb-2 flex items-start gap-2">
                  <FaCheckCircle className="text-[#F9A11B] flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-10 md:py-12 text-white relative overflow-hidden" style={{
        background: `url('/pattern/2.jpg')`,
      }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6 text-center">
          <FaCoins className="text-5xl text-[#F9A11B] mx-auto mb-4" />
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Ready to Start Earning Points?
          </h2>
          <p className="text-base text-white/90 mb-5 max-w-2xl mx-auto">
            Join our community support program and start building a better future. Every payment, every action, every connection earns rewards that help your child's education.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/registration/parent"
              className="inline-flex items-center justify-center bg-[#F9A11B] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#E69010] transition"
            >
              Join Now & Get 50 Bonus Points
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white hover:text-[#0B4C8A] transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}