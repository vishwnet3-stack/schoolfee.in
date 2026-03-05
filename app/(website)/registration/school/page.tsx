import { generateSEO } from "@/lib/seo";
import SchoolRegistrationPage from "./SchoolRegistration";

export const metadata = generateSEO({
  title: "School Registration | Partner with Schoolfee",
  description:
    "Register your school with Schoolfee to ensure timely fee collection, reduce administrative burden, and prevent dropouts due to unpaid fees.",
  keywords: ["Schoolfee School Registration", " School Partnership Program Education", " Digital Fee Management Schools", " Schoolfee Financial Services For Schools", " School Fee Collection Support System."],
  image: "/logo.jpg",
});

export default function SchoolRegistration() {
  return <SchoolRegistrationPage />;
}