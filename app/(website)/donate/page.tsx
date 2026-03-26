import { generateSEO } from "@/lib/seo";
import DonatePage from "./DonatePage";

export const metadata = generateSEO({
  title: "Donate to Schoolfee | Support a Child’s Education",
  description:
    "Your contribution helps families pay school fees on time, protecting children from dropping out and emotional stress during financial crises. Donate Now",
  keywords: ["Donate Schoolfee", " Education Donation India", " Sponsor School Fees", " Support Child Education India", " Donate For School Fees", " Donate To Education Platform", " Help Families With School Fees", " Contribute School Fees."],
  image: "/logo.jpg",
});

export default function DonatePageGlobal() {
  return <DonatePage />;
}