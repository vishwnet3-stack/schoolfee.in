import Link from "next/link";
import {
  Heart,
  Shield,
  Users,
  BookOpen,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  FileCheck,
  UserCheck,
  HandHeart,
  Lock,
  Eye,
  Handshake,
} from "lucide-react";

export default function TeacherSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation would be imported here */}

      <main className="pt-0">
        {/* Hero Section */}
        <section className="relative py-10 md:py-12 lg:py-6 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium mb-4">
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                  Teacher Financial Support Program
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                  Supporting Teachers, Strengthening Education
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mb-3 leading-relaxed">
                  At Schoolfee.in, we believe that teachers are not merely educators — they are nation builders, social stabilizers, and the moral backbone of India's future.
                </p>
                <p className="text-base sm:text-lg text-gray-600 mb-3 leading-relaxed">
                  When a family faces financial distress, it is often the teacher who first notices the silent struggle of a child — declining performance, absenteeism, emotional withdrawal. Teachers stand at the frontline of social reality.
                </p>
                <p className="text-base sm:text-lg text-gray-600 mb-5 leading-relaxed">
                  Schoolfee.in envisions teachers as trusted social validators within the education ecosystem, playing a vital role in safeguarding uninterrupted education through responsible social financing. 
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/registration/teacher"
                    className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Apply for Membership
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/teacher-support/how-it-works"
                    className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm sm:text-base rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    How It Works
                  </Link>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <img src="/teacher/teacher-member.jpg" className="rounded" alt="Supporting Teachers" />
              </div>
            </div>
          </div>
        </section>

        {/* Why Teacher Wellbeing Matters */}
        <section className="py-10 md:py-12 lg:py-14 bg-white" aria-labelledby="wellbeing-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto mb-8 md:mb-9">
              <h2 id="wellbeing-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Teacher Wellbeing Matters
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                When teachers face financial stress, it affects not just them
                but every student in their classroom.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {[
                {
                  icon: Heart,
                  title: "Mental Peace",
                  description:
                    "Teachers free from financial worry can focus entirely on nurturing young minds.",
                  borderColor: "border-rose-200",
                  bgColor: "bg-rose-50",
                  iconColor: "text-rose-600",
                },
                {
                  icon: BookOpen,
                  title: "Classroom Continuity",
                  description:
                    "Stable teachers mean stable learning environments for children.",
                  borderColor: "border-blue-200",
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-600",
                },
                {
                  icon: Users,
                  title: "Student Success",
                  description:
                    "Teacher wellbeing directly correlates with student academic outcomes.",
                  borderColor: "border-purple-200",
                  bgColor: "bg-purple-50",
                  iconColor: "text-purple-600",
                },
                {
                  icon: Sparkles,
                  title: "Quality Education",
                  description:
                    "Supported teachers deliver better, more engaged instruction.",
                  borderColor: "border-amber-200",
                  bgColor: "bg-amber-50",
                  iconColor: "text-amber-600",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`bg-white border-2 ${item.borderColor} rounded-xl p-6 text-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className={`w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Role of Teachers in Social Financing Model */}
        <section className="py-10 md:py-12 lg:py-14 bg-gradient-to-br from-blue-50 to-purple-50" aria-labelledby="role-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto mb-8 md:mb-9">
              <h2 id="role-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Role of Teachers in Social Financing
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Teachers are the cornerstone of our trust-based education financing ecosystem.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                {
                  icon: Shield,
                  title: "Trust Anchors",
                  description:
                    "Identifying genuine cases of financial stress with integrity and fairness.",
                },
                {
                  icon: UserCheck,
                  title: "Social Credit Mentors",
                  description:
                    "Supporting qualitative trust assessment beyond traditional credit scores.",
                },
                {
                  icon: Target,
                  title: "Continuity Protectors",
                  description:
                    "Ensuring no child's education is disrupted due to temporary hardship.",
                },
                {
                  icon: Users,
                  title: "Community Bridges",
                  description:
                    "Connecting parents, schools, and support systems.",
                },
                {
                  icon: Award,
                  title: "Nation Builders",
                  description:
                    "Strengthening short-term human capital development.",
                },
                {
                  icon: HandHeart,
                  title: "Compassionate Guides",
                  description:
                    "Providing empathetic support during families' difficult times.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-2 text-base">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust-Based Education Continuity Framework */}
        <section className="py-10 md:py-12 lg:py-14 bg-white" aria-labelledby="framework-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto mb-8 md:mb-9">
              <h2 id="framework-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Trust-Based Continuity Framework
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                A structured social financing framework built on trust, guidance, and student wellbeing.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: FileCheck,
                  title: "Teacher Validation",
                  description:
                    "Financial assistance is supported by teacher validation, ensuring genuine need and family commitment.",
                },
                {
                  icon: TrendingUp,
                  title: "Mentorship-Driven Repayment",
                  description:
                    "Repayment discipline is encouraged through mentorship, not pressure, fostering responsibility.",
                },
                {
                  icon: HandHeart,
                  title: "Guidance Over Judgment",
                  description:
                    "Families feel guided rather than judged, creating a supportive environment for recovery.",
                },
                {
                  icon: Target,
                  title: "Student Security",
                  description:
                    "Students remain academically secure and emotionally supported throughout the process.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-2 text-base">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ethical Governance Principles */}
        <section className="py-10 md:py-12 lg:py-14 bg-gray-50" aria-labelledby="governance-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto mb-8 md:mb-9">
              <h2 id="governance-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Ethical Governance Principles
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Clear ethical guidelines to protect all stakeholders in our social financing model.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: Eye,
                  title: "Transparency in Identification",
                  description:
                    "Clear, objective criteria for identifying families in need and making recommendations.",
                },
                {
                  icon: Shield,
                  title: "No Financial Liability",
                  description:
                    "Teachers face no financial liability or obligation in the assistance process.",
                },
                {
                  icon: Users,
                  title: "Clear Separation of Roles",
                  description:
                    "Academic evaluation remains completely separate from financial assessment.",
                },
                {
                  icon: Lock,
                  title: "Confidential Handling",
                  description:
                    "All family financial information is handled with strict confidentiality protocols.",
                },
                {
                  icon: TrendingUp,
                  title: "Periodic Review",
                  description:
                    "Regular reviews and transparent impact reporting ensure accountability.",
                },
                {
                  icon: Handshake,
                  title: "Ethical Standards",
                  description:
                    "Maintaining highest standards of integrity and professional conduct.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-2 text-base">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-10 md:py-12 lg:py-14 bg-white" aria-labelledby="package-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 id="package-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-5">
                  Teacher Support Package
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-7">
                  Comprehensive support designed to help teachers navigate temporary financial challenges with dignity.
                </p>
                <ul className="space-y-4 mb-8"  role="list">
                  {[
                    "Interest-free financial assistance",
                    "Transparent repayment over 2-12 months",
                    "No penalties or late fees",
                    "No credit scoring or reporting",
                    "No impact on employment",
                    "Complete confidentiality assured",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-900 text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/teacher-support/package"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  View Full Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                {[
                  { 
                    label: "Support Range", 
                    value: "Up to ₹50,000",
                    icon: Target,
                  },
                  { 
                    label: "Repayment Period 6-7 Months", 
                    value: "2-12 Months",
                    icon: TrendingUp,
                  },
                  { 
                    label: "Interest Rate", 
                    value: "0%",
                    icon: Sparkles,
                  },
                  { 
                    label: "Processing Fee", 
                    value: "None",
                    icon: Award,
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-xl p-5 md:p-6 text-center hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Eligible Use Cases */}
        <section className="py-10 md:py-12 lg:py-14 bg-gray-50" aria-labelledby="usecases-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto mb-8 md:mb-9">
              <h2 id="usecases-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Eligible Use Cases
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Our support covers various temporary financial disruptions.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {[
                {
                  title: "Medical Expenses",
                  description:
                    "Health emergencies for self or immediate family members",
                  icon: Heart,
                  borderColor: "border-red-200",
                  iconBg: "bg-red-50",
                  iconColor: "text-red-600",
                },
                {
                  title: "Children's Education",
                  description:
                    "School fees and educational expenses for your own children",
                  icon: GraduationCap,
                  borderColor: "border-blue-200",
                  iconBg: "bg-blue-50",
                  iconColor: "text-blue-600",
                },
                {
                  title: "Emergency Household",
                  description:
                    "Urgent home repairs or essential household needs",
                  icon: Shield,
                  borderColor: "border-green-200",
                  iconBg: "bg-green-50",
                  iconColor: "text-green-600",
                },
                {
                  title: "Income Disruption",
                  description:
                    "Temporary income gaps due to delayed salaries",
                  icon: Users,
                  borderColor: "border-purple-200",
                  iconBg: "bg-purple-50",
                  iconColor: "text-purple-600",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`bg-white border-2 ${item.borderColor} rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className={`w-14 h-14 ${item.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Program Safeguards */}
        <section className="py-10 md:py-12 lg:py-14 bg-white" aria-labelledby="commitment-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto mb-8 md:mb-9">
              <h2 id="commitment-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Commitment to You
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Every aspect designed with teacher dignity and wellbeing at the center.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {[
                {
                  icon: Shield,
                  title: "Not a Loan",
                  description:
                    "This is financial assistance, not credit. No debt traps, no compound interest, no hidden fees.",
                },
                {
                  icon: Lock,
                  title: "Complete Privacy",
                  description:
                    "Your financial matters remain confidential. We never share information with employers without consent.",
                },
                {
                  icon: Handshake,
                  title: "Dignity-First Approach",
                  description:
                    "No harassment, no aggressive follow-ups. We communicate with respect and understanding.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-blue-100 rounded-xl p-6 md:p-7 hover:shadow-xl hover:border-blue-300 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-14 lg:py-16 bg-gradient-to-r from-blue-600 to-indigo-600" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-4">
                  <GraduationCap className="h-7 w-7 text-blue-600" />
                </div>
                
                <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Ready to Apply for Membership?
                </h2>
                
                <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                  If you are a teacher facing temporary financial challenges, we are here to help. The process is simple, confidential, and dignified.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                  <Link
                    href="/registration/teacher/"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-base"
                  >
                    Start Your Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  
                  <Link
                    href="/contact-us"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all duration-200 text-base"
                  >
                    Speak with Our Team
                  </Link>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">100% Confidential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">0% Interest Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Quick Approval</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer would be imported here */}
    </div>
  );
}