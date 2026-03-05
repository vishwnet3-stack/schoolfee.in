import { generateSEO } from "@/lib/seo";
import LandingPage from "./InvitationSchoolfee";

export const metadata = generateSEO({
  title: "Protect India’s Future | Invitation to Schoolfee Program",
  description:
    "Activate a dignified, tech-driven education continuity model. Schoolfee prevents learning disruption from unpaid school fees.",
  keywords: [
    "Schoolfee Invitation Program",
    " Education Continuity India",
    " School Fee Distress Support",
    " 0% Interest School Fee Support",
    " Delhi Education Social Security Model",
    " Community Powered School Fee Assistance",
    " Direct School Fee Payment System",
    " School Fee Emergency Support India",
    " Education Financial Inclusion Program",
    " School Fee Protection Initiative Delhi"
  ],
  image: "/landing-page/education-continuity.jpg",
});

export default function InvitationSchoolfee() {
  return <LandingPage />;
}