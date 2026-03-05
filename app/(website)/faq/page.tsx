import { generateSEO } from "@/lib/seo";
import FaqPage from "./FaqPage";

export const metadata = generateSEO({
  title: "Frequently Asked Questions About Schoolfee Support",
  description:
    "Schoolfee Frequently Asked Questions – answers on whether Schoolfee is a loan, who can apply, interest charges, repayment terms and application approval.",
  keywords: [
    "Schoolfee FAQ",
    " Schoolfee support questions",
    " Schoolfee India FAQs",
    " how Schoolfee works",
    " School fee Frequently Asked Questions.",
  ],
  image: "/logo.jpg",
});

export default function FaqPageGloabl() {
  return <FaqPage />;
}
