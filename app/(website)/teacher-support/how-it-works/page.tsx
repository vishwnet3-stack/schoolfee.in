import { generateSEO } from "@/lib/seo";

import TeacherHowItWorksPage from "./HowItWork";

export const metadata = generateSEO({
  title: "How Teacher Financial Support Works | Schoolfee",
  description: "Apply online in 15 minutes. Get verified and receive up to ₹50,000 interest-free teacher support within 3–5 days—confidential, simple, and penalty-free process.",
  keywords: ["How Teacher Support Works", " Teacher Financial Assistance Process", " Interest Free Support For Teachers", " Teacher Emergency Funding India", "  Confidential Teacher Support", "  Teacher Repayment Without Penalty", " Fast Teacher Financial Help."],
  image: "https://schoolfee.in/teacher/teacher-member.jpg",
});


export default function TeacherHowItWorkpageSupport() {
  return <TeacherHowItWorksPage />;
}
