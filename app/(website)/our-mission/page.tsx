import { generateSEO } from "@/lib/seo";
import SchoolfeeMissionPage from "./OurMission";

export const metadata = generateSEO({
  title: "Our Mission | Schoolfee – Education Continuity & Financial Inclusion",
  description:
    "Our mission at Schoolfee.org is to prevent financial strain from becoming a barrier to education, safeguarding children’s confidence and learning progression.",
  keywords: [
    "school fee support",
    " education continuity",
    " financial inclusion for education",
    " family financial resilience",
    " interest-free school fee assistance",
    " community-based education support",
    " student retention programs",
  ],

  image: "/logo.jpg",
});

export default function OurMissionPage() {
  return <SchoolfeeMissionPage />;
}
