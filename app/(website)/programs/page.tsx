import Link from "next/link"
import {
  FaBookOpen,
  FaExclamationCircle,
  FaBuilding,
  FaStethoscope,
  FaUsers,
  FaBullseye,
  FaRupeeSign,
  FaArrowRight,
} from "react-icons/fa"

const programs = [
  {
    icon: FaBookOpen,
    title: "Fee Support Program",
    description:
      "Our flagship program provides short-term, interest-free support for families facing temporary fee payment challenges.",
    objective:
      "Enable families to pay school fees on time without financial stress or borrowing from predatory sources.",
    whoHelps:
      "Middle-class and lower-income families facing temporary income disruptions, job transitions, or cash flow challenges.",
    fundsUsed:
      "Directly paid to schools as tuition and mandatory fees. Families repay in flexible, interest-free installments.",
    impact:
      "15,000+ children have continued their education without interruption through this program.",
    href: "/programs/fee-support",
  },
  {
    icon: FaExclamationCircle,
    title: "Emergency Education Support",
    description:
      "Immediate assistance for families hit by unexpected crises that threaten their children's education.",
    objective:
      "Provide rapid response support when families face sudden emergencies like job loss, accidents, or natural disasters.",
    whoHelps:
      "Families experiencing acute crises: sudden unemployment, medical emergencies, natural disasters, or loss of breadwinner.",
    fundsUsed:
      "Fast-tracked fee payments within 24-48 hours of verification. Extended repayment terms for crisis situations.",
    impact:
      "Helped 2,500+ families maintain education continuity during their most challenging moments.",
    href: "/programs/emergency",
  },
  {
    icon: FaBuilding,
    title: "School Partnership Program",
    description:
      "Partner schools receive timely fee payments while building stronger relationships with families.",
    objective:
      "Create a win-win partnership where schools get timely payments and families get understanding support.",
    whoHelps:
      "Schools seeking to support families without losing fee revenue. Families at partner schools with fee challenges.",
    fundsUsed:
      "Schools receive full fee payments directly. Reduced administrative burden of fee collection and follow-ups.",
    impact:
      "500+ partner schools across 12 states, supporting thousands of families each year.",
    href: "/programs/school-partnership",
  },
  {
    icon: FaStethoscope,
    title: "Health-Linked Education Continuity",
    description:
      "Specialized support for families where health emergencies have impacted their ability to pay school fees.",
    objective:
      "Address the health-education linkage by supporting families dealing with medical crises.",
    whoHelps:
      "Families where a member is hospitalized, undergoing treatment, or recovering from serious illness.",
    fundsUsed:
      "School fees paid while families focus on health recovery. Extended repayment aligned with recovery timelines.",
    impact:
      "1,800+ families supported at the intersection of health challenges and education needs.",
    href: "/programs/health-linked",
  },
]

export default function ProgramsPage() {
  return (
    <main className="bg-[#F6F5F1] min-h-screen">

      {/* HERO */}
      <section className="pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-[#0B4C8A] mb-6">
              Our Programs
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Comprehensive programs designed to address different aspects of
              education continuity challenges faced by families across India.
              Each program is tailored to specific needs while maintaining our
              core principles of dignity, transparency, and zero interest.
            </p>
          </div>
        </div>
      </section>


      {/* PROGRAM LIST */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="space-y-14">

            {programs.map((program, index) => (
              <div
                key={program.title}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
              >
                <div className="p-6 md:p-10">

                  <div className="flex flex-col lg:flex-row gap-10">

                    {/* LEFT */}
                    <div className="lg:w-1/3">

                      <div className="w-14 h-14 rounded-lg bg-[#0B4C8A]/10 flex items-center justify-center mb-6">
                        <program.icon className="w-6 h-6 text-[#0B4C8A]" />
                      </div>

                      <h2 className="text-2xl md:text-3xl font-semibold text-[#0B4C8A] mb-4">
                        {program.title}
                      </h2>

                      <p className="text-gray-600 leading-relaxed mb-6">
                        {program.description}
                      </p>

                      <Link
                        href={program.href}
                        className="inline-flex items-center text-[#F9A11B] font-medium text-sm hover:underline"
                      >
                        Learn More
                        <FaArrowRight className="ml-2 w-4 h-4" />
                      </Link>

                    </div>


                    {/* RIGHT DETAILS */}
                    <div className="lg:w-2/3 grid md:grid-cols-2 gap-6">

                      <div className="p-5 rounded-xl border border-[#E5E7EB]">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0B4C8A] mb-3">
                          <FaBullseye className="w-4 h-4" />
                          Objective
                        </div>
                        <p className="text-sm text-gray-600">
                          {program.objective}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl border border-[#E5E7EB]">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0B4C8A] mb-3">
                          <FaUsers className="w-4 h-4" />
                          Who It Helps
                        </div>
                        <p className="text-sm text-gray-600">
                          {program.whoHelps}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl border border-[#E5E7EB]">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0B4C8A] mb-3">
                          <FaRupeeSign className="w-4 h-4" />
                          How Funds Are Used
                        </div>
                        <p className="text-sm text-gray-600">
                          {program.fundsUsed}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl bg-[#0B4C8A] text-white">
                        <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                          <FaStethoscope className="w-4 h-4" />
                          Impact
                        </div>
                        <p className="text-sm text-white/90">
                          {program.impact}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

    </main>
  )
}
