import Link from "next/link"
import {
    FaArrowRight,
    FaBuilding,
    FaBriefcase,
    FaHeart,
    FaLandmark,
    FaCheckCircle,
} from "react-icons/fa"

export const metadata = {
    title: "Partners - Schoolfee",
    description:
        "Partner with Schoolfee as a school, corporate, foundation, or government institution to support education continuity.",
}

const partnerTypes = [
    {
        icon: FaBuilding,
        title: "Schools",
        description:
            "Partner schools receive timely fee payments while supporting families in need.",
        benefits: [
            "Direct fee payments to school accounts",
            "Reduced administrative burden",
            "Stronger family relationships",
            "Social impact recognition",
            "Dashboard access for tracking",
        ],
        stats: "523+ schools across 12 states",
        cta: "Become a Partner School",
        href: "/registration/school",
    },
    {
        icon: FaBriefcase,
        title: "Corporates & CSR",
        description:
            "Meet your CSR objectives with measurable education impact and compliance.",
        benefits: [
            "Schedule VII CSR compliance",
            "Detailed utilization reports",
            "Employee engagement options",
            "Branded program sponsorship",
            "Impact measurement & certificates",
        ],
        stats: "45+ corporate partners",
        cta: "Partner as Corporate",
        href: "/donate",
    },
    {
        icon: FaHeart,
        title: "Foundations",
        description:
            "Amplify your foundation's education mission through our proven model.",
        benefits: [
            "Aligned with education goals",
            "Transparent fund utilization",
            "Co-branded initiatives",
            "Research & impact data",
            "Strategic partnership options",
        ],
        stats: "12 foundation partners",
        cta: "Foundation Partnership",
        href: "/donate",
    },
    {
        icon: FaLandmark,
        title: "Government & Institutions",
        description:
            "Collaborate on large-scale education continuity programs.",
        benefits: [
            "Scale across districts/states",
            "Policy-aligned programs",
            "Comprehensive reporting",
            "Public-private models",
            "Regulatory compliance",
        ],
        stats: "3 state-level partnerships",
        cta: "Institutional Partnership",
        href: "/contact-us",
    },
]

const currentPartners = {
    schools: [
        "Delhi Public School - Multiple Branches",
        "Kendriya Vidyalaya Network",
        "Ryan International Group",
        "DAV Public Schools",
        "Mother's International School",
    ],
    corporates: [
        "Technology companies",
        "Financial services firms",
        "Manufacturing corporates",
        "Healthcare organizations",
        "Media conglomerates",
    ],
}

export default function PartnersPage() {
    return (
        <main className="bg-[#F6F5F1] min-h-screen">

            {/* HERO */}
            <section className="pt-10 pb-16 md:pt-10 md:pb-10">
                <div className="max-w-7xl mx-auto px-5 md:px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-semibold text-[#0B4C8A] mb-6">
                            Our Partners
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Schoolfee collaborates with schools, corporates, foundations, and government bodies to ensure education continuity through transparent, scalable, and impact-driven partnerships.
                        </p>
                    </div>
                </div>
            </section>


            {/* PARTNER TYPES */}
            <section className="pb-16 md:pb-24">
                <div className="max-w-7xl mx-auto px-5 md:px-6">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">

                        {partnerTypes.map((partner) => (
                            <div
                                key={partner.title}
                                className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 hover:border-[#0B4C8A]/40 transition"
                            >
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-[#0B4C8A]/10 flex items-center justify-center flex-shrink-0">
                                        <partner.icon className="w-6 h-6 text-[#0B4C8A]" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold text-[#0B4C8A]">
                                            {partner.title}
                                        </h2>
                                        <p className="text-sm text-[#F9A11B] mt-1">
                                            {partner.stats}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 mb-6">
                                    {partner.description}
                                </p>

                                {/* Benefits */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-[#0B4C8A] mb-3">
                                        Partnership Benefits
                                    </h3>
                                    <ul className="space-y-2">
                                        {partner.benefits.map((benefit) => (
                                            <li
                                                key={benefit}
                                                className="flex items-start gap-2 text-sm text-gray-600"
                                            >
                                                <FaCheckCircle className="w-4 h-4 text-[#F9A11B] mt-0.5 flex-shrink-0" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA */}
                                <Link
                                    href={partner.href}
                                    className="inline-flex items-center justify-center w-full bg-[#0B4C8A] text-white py-3 rounded-md text-sm font-medium hover:opacity-90 transition"
                                >
                                    {partner.cta}
                                    <FaArrowRight className="ml-2 w-4 h-4" />
                                </Link>

                            </div>
                        ))}

                    </div>
                </div>
            </section>



            {/* CTA */}
            <section className="py-10 md:py-10">
                <div className="max-w-7xl mx-auto px-5 md:px-6 text-center">

                    <h2 className="text-3xl md:text-4xl font-semibold text-[#0B4C8A] mb-6">
                        Ready to Partner With Us?
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Whether you're a school, corporate, foundation, or government body,
                        we’d love to explore collaboration.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">

                        <Link
                            href="/contact-us"
                            className="bg-[#F9A11B] text-white px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition"
                        >
                            Contact Our Team
                        </Link>

                        <Link
                            href="/how-it-works"
                            className="border border-[#0B4C8A] text-[#0B4C8A] px-6 py-3 rounded-md text-sm font-medium hover:bg-[#0B4C8A] hover:text-white transition"
                        >
                            Learn How It Works
                        </Link>

                    </div>

                </div>
            </section>

        </main>
    )
}
