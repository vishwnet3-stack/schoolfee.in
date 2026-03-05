import TermsConditionPage from "./TermsCondition";

import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Official Terms & Conditions - Schoolfee",
  description: "Read the official Terms & Conditions of Schoolfee, offering interest-free school fee support and transparent repayment plans for parents",
  keywords: ["Schoolfee terms and conditions", " Fee repayment policy", " Education financial support terms", " Schoolfee legal policy", " Schoolfee user agreement."],
  image: "/logo.jpg",
});

export default function TermsCondition() {
  return <TermsConditionPage />;
}