"use client";

import React, { useState } from "react";

export default function FaqPage() {
  const faqs = [
    {
      q: "What is Schoolfee?",
      a: "Schoolfee is an interest-free school fee support platform that helps parents pay their child’s school fees on time during temporary financial gaps.",
    },
    {
      q: "Is Schoolfee a loan or a financial lender?",
      a: "No. Schoolfee does not provide loans, does not charge interest, and is not a financial institution. It provides short-term, interest-free fee support.",
    },
    {
      q: "Who can apply for Schoolfee support?",
      a: "Parents or legal guardians of students from Nursery to Class 9 who are facing temporary financial difficulty can apply.",
    },
    {
      q: "How long do I get to repay the supported amount?",
      a: "You are expected to repay the supported amount within 2 to 12 months, as agreed at the time of approval.",
    },
    {
      q: "Does applying guarantee approval?",
      a: "No. All applications are reviewed, and approval depends on eligibility, verification, and internal policies.",
    },
    {
      q: "Is there any interest or extra charge?",
      a: "No. Schoolfee support is completely interest-free and does not involve hidden charges.",
    },
    {
      q: "What happens if I am unable to repay on time?",
      a: "You should immediately contact the Schoolfee team. Failure to repay without communication may affect your eligibility for future support.",
    },
    {
      q: "How is my personal data used?",
      a: "Your data is used only for processing your request, providing services, and legal compliance, as described in our Privacy Policy.",
    },
    {
      q: "How can I contact Schoolfee?",
      a: "You can contact us at admin@schoolfee.in or call +91 9355355233.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-[#00468e] via-[#003366] to-[#002244] text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-blue-100 text-lg">
            Answers to common questions about Schoolfee
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-6 text-gray-800">

          {faqs.map((item, index) => (
            <FaqItem key={index} question={item.q} answer={item.a} />
          ))}

          <div className="pt-10 text-center">
            <p className="text-gray-700">
              Still have questions?
            </p>
            <p className="mt-1">
              Email us at <span className="font-medium">admin@schoolfee.in</span> or call <span className="font-medium">+91 9355355233</span>
            </p>
          </div>

        </div>
      </main>
    </>
  );
}

/* FAQ Item */

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex justify-between items-center py-2 focus:outline-none"
      >
        <span className="text-lg md:text-xl font-medium text-gray-900">
          {question}
        </span>
        <span className="text-xl text-gray-500">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="mt-2 text-gray-700 leading-relaxed text-base md:text-lg">
          {answer}
        </div>
      )}
    </div>
  );
}
