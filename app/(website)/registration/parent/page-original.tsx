import { generateSEO } from "@/lib/seo";
import ParentRegistrationPage from "./ParentRegistration";

export const metadata = generateSEO({
  title: "Parent Registration | Apply for School Fees Support - Schoolfee",
  description:
    "Register as a parent with Schoolfee to apply for structured, interest-free financial support and ensure uninterrupted education for your child.",
  keywords: ["Schoolfee Parent Registration", " School Fee Support Application", " Parent Sign Up Education Support", " Schoolfee Financial Help For Parents", " Schoolfee Family Registration Form."],
  image: "/logo.jpg",
});

export default function ParentRegistration() {
  return <ParentRegistrationPage />;
}
