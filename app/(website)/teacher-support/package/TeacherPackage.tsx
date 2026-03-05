import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  GraduationCap,
  Shield,
  Heart,
  Users,
  Building2,
  Sparkles,
} from "lucide-react"



export default function TeacherPackagePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation would be imported here */}
      
      <main className="pt-0">
        {/* Hero Section */}
        <section className="py-20 lg:py-14 bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <GraduationCap className="h-4 w-4" />
                Teacher Financial Package
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Teacher Stability & Wellbeing Support Package
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                A comprehensive <a href="https://schoolfee.in/teacher-support">Teacher Support</a> Package designed exclusively for educators, built on dignity, transparency, and zero financial burden.
              </p>
            </div>
          </div>
        </section>

        {/* Package Overview */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Support Details Card */}
              <div className="border-2 border-blue-600 bg-white rounded-lg shadow-lg overflow-hidden lg:col-span-1">
                <div className="bg-blue-600 text-white p-6">
                  <h2 className="text-2xl font-bold text-center">Support Details</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="text-center pb-6 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Support Amount</p>
                    <p className="text-4xl font-bold text-gray-900">Up to ₹50,000</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Interest Rate", value: "0% (Always)" },
                      { label: "Processing Fee", value: "None" },
                      { label: "Repayment Period", value: "2-3 Months" },
                      { label: "Late Fees", value: "None" },
                      { label: "Prepayment Penalty", value: "None" },
                      { label: "Credit Reporting", value: "None" },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <Link 
                    href="/registration/teacher"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                {/* Eligibility */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Eligibility Criteria
                    </h3>
                  </div>
                  <div className="p-6">
                    <ul className="grid md:grid-cols-2 gap-3">
                      {[
                        "Currently employed as a teacher",
                        "Working at a recognized school",
                        "Minimum 6 months in current position",
                        "Facing temporary financial hardship",
                        "First-time or returning applicant",
                        "Willing to complete brief application",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-900">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* What This Is / Is Not */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                    <div className="p-6 border-b border-blue-100">
                      <h4 className="text-lg font-bold text-blue-700">What This Is</h4>
                    </div>
                    <div className="p-6 space-y-3">
                      {[
                        "Financial assistance",
                        "Temporary support",
                        "Dignity-first aid",
                        "Interest-free help",
                        "Confidential program",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-900 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg shadow-sm border border-red-100">
                    <div className="p-6 border-b border-red-100">
                      <h4 className="text-lg font-bold text-red-700">What This Is NOT</h4>
                    </div>
                    <div className="p-6 space-y-3">
                      {[
                        "A loan or credit product",
                        "Salary advance scheme",
                        "Credit card or EMI",
                        "Debt trap mechanism",
                        "Employer benefit deduction",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-gray-900 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Repayment Structure */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Repayment Structure
              </h2>
              <p className="text-lg text-gray-600">
                Designed to be manageable and stress-free, with flexibility built in.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: "Fixed Installments",
                  description: "Equal monthly payments spread over your chosen repayment period. No surprises, no variable amounts.",
                },
                {
                  icon: Heart,
                  title: "Dignity-First Communication",
                  description: "Gentle reminders only. No aggressive collection calls, no harassment, no pressure tactics.",
                },
                {
                  icon: Shield,
                  title: "Hardship Extension",
                  description: "Facing difficulties? Request an extension through your dashboard. Genuine cases are always accommodated.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Example Calculation */}
            <div className="mt-12 border-2 border-blue-200 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 text-center">Example Repayment</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Support Amount</p>
                    <p className="text-xl font-bold text-gray-900">₹30,000</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Period</p>
                    <p className="text-xl font-bold text-gray-900">3 Months</p>
                  </div>
                  <div className="p-4 bg-blue-600 text-white rounded-lg">
                    <p className="text-sm opacity-90 mb-1">Monthly Payment</p>
                    <p className="text-xl font-bold">₹10,000</p>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Total repayment = ₹30,000 (exactly what you received, nothing more)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Funding Sources */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Where the Support Comes From
              </h2>
              <p className="text-lg text-gray-600">
                100% transparent funding from ethical sources dedicated to educator wellbeing.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Building2, title: "CSR Grants", description: "Corporate social responsibility funds" },
                { icon: Heart, title: "Foundation Grants", description: "Education-focused philanthropic organizations" },
                { icon: Users, title: "Teacher Welfare Corpus", description: "Dedicated fund for educator support" },
                { icon: GraduationCap, title: "School Programs", description: "Sponsored institutional initiatives" },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 text-center p-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto border border-gray-200">
              <p className="text-center text-sm text-gray-900">
                <strong>Important:</strong> No parent funds are used for teacher support. 
                No interest income is generated. This is pure assistance funded by dedicated grants.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Assurance */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Your Privacy & Dignity Assured
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We understand the sensitivity around financial matters. Every aspect of our 
                  program is designed to protect your privacy and maintain your dignity.
                </p>
                <ul className="space-y-4">
                  {[
                    "Your financial details are never shared with your employer",
                    "No public disclosure of assistance recipients",
                    "Secure, encrypted data handling",
                    "Right to request data deletion",
                    "No impact on your professional standing",
                    "Confidential communication channels",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
                <Shield className="h-24 w-24 text-blue-600 mx-auto mb-6" />
                <p className="text-center text-xl font-semibold text-gray-900 mb-2">
                  Your Trust is Sacred
                </p>
                <p className="text-center text-gray-600">
                  We treat every teacher's information with the utmost respect and confidentiality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready for Support?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              If you are a teacher facing temporary financial challenges, do not hesitate. 
              This support exists specifically for educators like you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/registration/teacher"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition shadow-lg"
              >
                Start Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/teacher-support/how-it-works"
                className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-600 transition"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}