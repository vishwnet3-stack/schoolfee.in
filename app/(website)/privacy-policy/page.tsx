import { generateSEO } from "@/lib/seo";
import PrivacyClient from "./PrivacyClient";

export const metadata = generateSEO({
  title: "Privacy Policy | User Data Protection Policy - Schoolfee",
  description:
    "Schoolfee Privacy Policy to understand how we collect, use, store, and protect your personal data with transparency and regulatory compliance",
  keywords: ["Schoolfee Privacy Policy", " Data Protection Policy", " User Data Security", " Schoolfee Data Privacy", " Schoolfee User Privacy Terms", " Personal Data Protection."],
  image: "/logo.jpg",
});

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}
