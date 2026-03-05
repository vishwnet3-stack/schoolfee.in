import { generateSEO } from "@/lib/seo";
import SurveyPage from "./SurveyPage"

export const metadata = generateSEO({
  title: "Family Survey | Schoolfee Student Education Support",
  description:
    "Complete the Schoolfee Family Survey to assess eligibility for structured, interest-free school fee support and ensure uninterrupted education.  ",
  keywords: ["Schoolfee Family Survey", " School Fee Support Survey", " School Fee Financial Stress Survey", " Family School Fee Help Form", " Parent Survey School Fees", " Education Continuity Survey."],
  image: "/logo.jpg",
});

export default function SurveyPageGlobal() {
  return <SurveyPage />;
} 
