import { generateSEO } from "@/lib/seo";
import CommunityPointsPage from "./CommunityPoints";

export const metadata = generateSEO({
  title: "Community Points Program – Earn and Redeem Rewards",
  description:
    "Join the Schoolfee Community Points Program to earn rewards for fee payment, referrals, and participation. Redeem points for school fees, books, and uniforms.",
  keywords: [
    "Schoolfee Community Points Program",
    " Education Reward Points System",
    " Earn Points for School Fees",
    " Schoolfee Rewards Program",
    " Education Support Points",
    " Points Redemption for Education",
  ],
  image: "/logo.jpg",
});

export default function ComuunitypointPage() {
  return <CommunityPointsPage />;
}
