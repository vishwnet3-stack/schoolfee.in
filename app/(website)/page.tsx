import type { Metadata } from "next";
import Hero from "./Hero";
import SchoolFeeContent from "./SchoolContent";
import CTASection from "./Cta";
import { generateSEO } from "@/lib/seo";
import OrganizationSchema from "./components/OrganizationSchema";

export const metadata = generateSEO({
  title: "Schoolfee – Interest-Free School Fees Support for Parents",
  description:
    "Schoolfee help middle-class families pay school fees on time with an interest-free repayment, ensuring uninterrupted education and mental well-being.",
  keywords: [
    "School Fee Support",
    "School Fees Help India",
    "Interest Free School Fees",
    "School Fee Funding Platform",
    "Education Financial Assistance",
    "Child Education Continuity",
  ],
  image: "/logo.jpg",
});


export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <Hero />
      <main className="flex flex-col w-full bg-white text-gray-800">
        <SchoolFeeContent />
        <CTASection />
      </main>
    </>
  );
}
