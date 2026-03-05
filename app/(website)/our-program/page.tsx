import { generateSEO } from "@/lib/seo";
import SchoolfeeProgramsPage from "./OurProgram";

export const metadata = generateSEO({
  title: "Our Program – Interest Free School Fees Support | Schoolfee",
  description:
    "Our Program Schoolfee offers zero-interest school fee support with fast 24–48 hour approval and direct payments to schools across India.",
  keywords: [
    "Our Program school fee support",
    "Education continuity India",
    "Interest free school fees",
    "Emergency education support",
    "Health linked fee support",
    "Zero interest education funding",
    "School fee assistance platform",
    "Family financial inclusion",
  ],
  image: "/logo.jpg",
});

export default function SchoolfeeProgram() {
  return <SchoolfeeProgramsPage />;
}