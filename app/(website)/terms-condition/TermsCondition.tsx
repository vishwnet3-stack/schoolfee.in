"use client";

import React from "react";

export default function TermsConditionPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative py-14 md:py-20 bg-gradient-to-br from-[#00468e] via-[#003366] to-[#002244] text-center">
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    {/* H1 */}
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-blue-100 text-sm md:text-lg">
                        Date: 6 Feb 2026
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="bg-white py-12 md:py-16">
                <article className="max-w-6xl mx-auto px-4 space-y-12 text-gray-800 leading-7 md:leading-8 text-sm md:text-base">

                    {/* H2 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                            Welcome to Schoolfee
                        </h2>
                        <p>
                            Schoolfee is a social-impact, interest-free school fee support platform
                            designed to help parents and guardians manage temporary financial
                            difficulties. By accessing or using our website and services,
                            you agree to comply with the following Terms & Conditions.
                        </p>
                    </section>

                    {/* H3 Sections */}

                    <Section title="1. About Schoolfee">
                        <p>
                            Schoolfee operates through Care Pay, India’s Digital Health Wallet,
                            enabling structured, interest-free school fee support with
                            transparent repayment options and zero hidden charges.
                        </p>
                        <ul>
                            <li>&bull; Provides interest-free support</li>
                            <li>&bull; No processing fees or penalty interest</li>
                            <li>&bull; Structured repayment based on participation duration</li>
                        </ul>
                        <p>
                            Schoolfee is not a traditional lender or NBFC unless explicitly partnered
                            with a regulated financial institution for specific services.
                        </p>
                    </Section>

                    <Section title="2. Eligibility Criteria">
                        <p>Applicants must:</p>
                        <ul>
                            <li>&bull; Be a parent or legal guardian</li>
                            <li> &bull;Have a student studying from Nursery to Class 9</li>
                            <li>&bull; Provide accurate personal and school details</li>
                            <li>&bull; Submit required verification documents</li>
                            <li>&bull; Agree to transparent repayment commitments</li>
                            <li>&bull; Use funds strictly for school fee payments</li>
                        </ul>
                        <p>
                            Schoolfee reserves the right to approve or reject applications
                            based on internal eligibility assessment.
                        </p>
                    </Section>

                    <Section title="3. Interest-Free Repayment Structure">
                        <p>
                            Repayment tenure depends on continuous participation
                            through the Schoolfee platform.
                        </p>

                        <h4 className="font-semibold mt-6">A. 6 Months Participation</h4>
                        <p>
                            Continuous participation for 6 months allows repayment
                            within 2–3 months, interest-free.
                        </p>

                        <h4 className="font-semibold mt-6">B. 8 Months Participation</h4>
                        <p>
                            Continuous participation for 8 months allows repayment
                            within 4–5 months, interest-free.
                        </p>

                        <h4 className="font-semibold mt-6">C. 12 Months Participation</h4>
                        <p>
                            Continuous participation for 12 months allows repayment
                            within 6–7 months, interest-free.
                        </p>

                        <h4 className="font-semibold mt-6">
                            D. 24 Months Participation (Severe Financial Hardship Support)
                        </h4>
                        <p>
                            Continuous participation for 24 months allows repayment
                            within 28–30 months, interest-free.
                        </p>
                        <p className="text-red-600 font-medium">
                            Extended tenure is available only for verified severe financial hardship cases.
                        </p>
                    </Section>

                    <Section title="4. Nature of Support">
                        <ul>
                            <li>&bull; Trust-based social responsibility model</li>
                            <li>&bull; No interest or hidden charges</li>
                            <li>&bull; No prepayment penalties</li>
                            <li>&bull; Repayment timelines must be honored</li>
                        </ul>
                        <p>
                            Non-repayment may result in suspension of future eligibility.
                        </p>
                    </Section>

                    <Section title="5. Verification & Documentation">
                        <p>Schoolfee may request:</p>
                        <ul>
                            <li>&bull; Parent ID proof</li>
                            <li>&bull; Student and school information</li>
                            <li>&bull; Income declaration</li>
                            <li>&bull; Emergency justification (if applicable)</li>
                            <li>&bull; Bank statements</li>
                        </ul>
                        <p>
                            False or misleading information may lead to termination
                            and potential legal action.
                        </p>
                    </Section>

                    <Section title="6. Repayment Commitment">
                        <ul>
                            <li>&bull; Repay within approved tenure</li>
                            <li>&bull; Maintain communication if facing difficulty</li>
                            <li>&bull; Acknowledge limited community-backed funding</li>
                        </ul>
                    </Section>

                    <Section title="7. Default & Misuse">
                        <p>In case of fraud, misuse, or intentional default, Schoolfee may:</p>
                        <ul>
                            <li>&bull; Terminate services</li>
                            <li>&bull; Initiate legal recovery</li>
                            <li>&bull; Report fraudulent activity</li>
                            <li>&bull; Blacklist future applications</li>
                        </ul>
                    </Section>

                    <Section title="8. Data Protection">
                        <p>
                            Personal information is collected to process applications,
                            provide support, maintain compliance, and improve platform services.
                            We implement reasonable technical safeguards to protect user data.
                        </p>
                        <p>Please refer to our Privacy Policy for full details.</p>
                    </Section>

                    <Section title="9. Limitation of Liability">
                        <ul>
                            <li>&bull; No guarantee of school admission</li>
                            <li>&bull; Not responsible for school policy decisions</li>
                            <li>&bull; Not liable for school-related disputes</li>
                            <li>&bull; Support subject to availability of funds</li>
                        </ul>
                    </Section>

                    <Section title="10. Modifications to Terms">
                        <p>
                            Schoolfee may update eligibility criteria, repayment models,
                            or participation terms at any time.
                            Updated Terms will be published with a revised effective date.
                        </p>
                    </Section>

                    <Section title="11. Governing Law">
                        <p>
                            These Terms are governed by the laws of India.
                            Disputes shall fall under the jurisdiction of appropriate courts in India.
                        </p>
                    </Section>

                    <Section title="12. Contact Information">
                        <p>
                            Email: admin@schoolfee.in <br />
                            Phone: +91 9355355233 <br />
                            Location: New Delhi, India
                        </p>
                    </Section>

                </article>
            </main>
        </>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                {title}
            </h3>
            <div className="space-y-3">{children}</div>
        </section>
    );
}
