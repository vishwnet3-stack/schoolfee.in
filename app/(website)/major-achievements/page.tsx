import { generateSEO } from "@/lib/seo";
import MajorAchievementsPage from "./MajorAchievementsPage";

export const metadata = generateSEO({
  title: "Major Achievements | Schoolfee Milestones, Recognition & Impact Across India",
  description:
    "Explore Schoolfee's major achievements, key milestones, national recognition, partnerships, financial impact, and community-driven education support initiatives across India.",
  keywords: [
    "Schoolfee Major Achievements",
    " Schoolfee Milestones",
    " Schoolfee Recognition",
    " Schoolfee Impact in India",
    " Schoolfee Education Finance Achievements",
    " Schoolfee National Partnerships",
    " Schoolfee Community Impact"
  ],
  image: "/logo.jpg",
});

export default function MajorAchievementsPageGlobal() {
  return <MajorAchievementsPage />;
}
