import { generateSEO } from "@/lib/seo";
import KeyDevelopmentsPage from "./KeyDevelopmentsPage";

export const metadata = generateSEO({
  title: "Key Developments | Schoolfee Platform Growth, Expansion & Strategic Updates",
  description:
    "Discover key developments at Schoolfee including platform growth, strategic partnerships, financial expansion, education support innovations, and nationwide scaling initiatives across India.",
  keywords: [
    "Schoolfee Key Developments",
    " Schoolfee Platform Growth",
    " Schoolfee Expansion Updates",
    " Schoolfee Strategic Partnerships",
    " Schoolfee Education Finance Innovation",
    " Schoolfee Nationwide Expansion",
    " Schoolfee Organisational Updates"
  ],
  image: "/logo.jpg",
});

export default function KeyDevelopmentsPageGlobal() {
  return <KeyDevelopmentsPage />;
}
