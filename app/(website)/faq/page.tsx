import { generateSEO } from "@/lib/seo";
import FaqPage from "./FaqPage";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Schoolfee?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Schoolfee is an interest-free school fee support platform that helps parents pay their child's school fees on time during temporary financial gaps."
      }
    },
    {
      "@type": "Question",
      "name": "Is Schoolfee a loan or a financial lender?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Schoolfee does not provide loans, does not charge interest, and is not a financial institution. It provides short-term, interest-free fee support."
      }
    },
    {
      "@type": "Question",
      "name": "Who can apply for Schoolfee support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Parents or legal guardians of students from Nursery to Class 9 who are facing temporary financial difficulty can apply."
      }
    },
    {
      "@type": "Question",
      "name": "How long do I get to repay the supported amount?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You are expected to repay the supported amount within 2 to 12 months, as agreed at the time of approval."
      }
    },
    {
      "@type": "Question",
      "name": "Does applying guarantee approval?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. All applications are reviewed, and approval depends on eligibility, verification, and internal policies."
      }
    },
    {
      "@type": "Question",
      "name": "Is there any interest or extra charge?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Schoolfee support is completely interest-free and does not involve hidden charges."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if I am unable to repay on time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You should immediately contact the Schoolfee team. Failure to repay without communication may affect your eligibility for future support."
      }
    },
    {
      "@type": "Question",
      "name": "How is my personal data used?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your data is used only for processing your request, providing services, and legal compliance, as described in our Privacy Policy."
      }
    },
    {
      "@type": "Question",
      "name": "How can I contact Schoolfee?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can contact us at admin@schoolfee.in or call +91 9355355233."
      }
    }
  ]
};

export const metadata = generateSEO({
  title: "Frequently Asked Questions About Schoolfee Support",
  description:
    "Schoolfee Frequently Asked Questions – answers on whether Schoolfee is a loan, who can apply, interest charges, repayment terms and application approval.",
  keywords: [
    "Schoolfee FAQ",
    " Schoolfee support questions",
    " Schoolfee India FAQs",
    " how Schoolfee works",
    " School fee Frequently Asked Questions.",
  ],
  image: "/logo.jpg",
});

export default function FaqPageGloabl() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqPage />
    </>
  );
}