"use client";

import React from "react";

export default function PrivacyClient() {
    return (
        <>
            {/* Hero */}
            <section className="relative py-16 bg-gradient-to-br from-[#00468e] via-[#003366] to-[#002244] text-center">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-blue-100 text-lg">
                        How Schoolfee collects, uses, protects, and respects your information
                    </p>
                </div>
            </section>

            {/* Content */}
            <main className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4 space-y-12 text-gray-800">

                    <SimpleBlock title="1. Introduction">
                        Schoolfee ("we", "our", "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website https://schoolfee.in and our services.
                    </SimpleBlock>

                    <SimpleBlock title="2. Information We Collect">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Name, email, phone number</li>
                            <li>Student and school details</li>
                            <li>Application and support request information</li>
                            <li>Communication history with our team</li>
                            <li>Technical data such as IP address, browser type, and device information</li>
                        </ul>
                    </SimpleBlock>

                    <SimpleBlock title="3. How We Use Your Information">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Process applications and provide support services</li>
                            <li>Communicate important updates</li>
                            <li>Improve our platform and services</li>
                            <li>Ensure security and prevent misuse</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </SimpleBlock>

                    <SimpleBlock title="4. Data Protection & Security">
                        We implement strict technical and organizational security measures to protect your data against unauthorized access, misuse, or disclosure. Only authorized personnel can access personal information.
                    </SimpleBlock>

                    <SimpleBlock title="5. Sharing of Information">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Partner schools and financial institutions for processing support</li>
                            <li>Technology and service providers for platform operations</li>
                            <li>Legal authorities if required by law</li>
                        </ul>
                    </SimpleBlock>

                    <SimpleBlock title="6. Cookies and Tracking">
                        We use cookies to improve site performance and user experience. You can manage cookie settings through your browser.
                    </SimpleBlock>

                    <SimpleBlock title="7. Your Rights">
                        You have the right to access, correct, or request deletion of your personal data by contacting us at admin@schoolfee.in.
                    </SimpleBlock>

                    <SimpleBlock title="8. Changes to this Policy">
                        We may update this Privacy Policy from time to time. Updates will be posted on this page with the revised date.
                    </SimpleBlock>

                    <SimpleBlock title="9. Contact Us">
                        <p>Email: admin@schoolfee.in</p>
                        <p>Phone: +91 9355355233</p>
                        <p>Location: New Delhi, India</p>
                    </SimpleBlock>

                </div>
            </main>
        </>
    );
}

function SimpleBlock({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <div className="text-gray-700 leading-relaxed text-base md:text-lg">
                {children}
            </div>
        </section>
    );
}