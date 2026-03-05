import { generateSEO } from "@/lib/seo";
import PartnersPage from "./PartnerPage";

export const metadata = generateSEO({
  title: "Our Partners | Schools, Foundation, CSR, And Government",
  description: "Schoolfee partners with schools, Corporates & CSR, foundations, and government bodies to ensure education continuity through transparent and scalable models.",
  keywords: ["Schoolfee Partners", " Education Continuity Partnership", " Partner With Schoolfee", " Schoolfee Collaboration", " Government Education Partnership", " Schoolfee Corporate Partners."],
  image: "https://schoolfee.in/teacher/teacher-member.jpg",
});

export default function PartnerPagegloabl() {
  return <PartnersPage />;
}
