import { generateSEO } from "@/lib/seo";
import TeacherPackagePage from "./TeacherPackage";

export const metadata = generateSEO({
  title: "Teacher Support Package - No Interest, No Penalties | Schoolfee",
  description: "Apply for the Teacher Support Package, which offers 0% interest financial aid with flexible 2–3 month repayment. Confidential, transparent, and stress-free.",
  keywords: ["Teacher Support Package", " Interest Free Teacher Support", " Educator Wellbeing Funding", " CSR Funded Teacher Support", "  Teacher Hardship Support Program", "  Dignified Financial Help For Teachers"],
  image: "https://schoolfee.in/teacher/teacher-member.jpg",
});


export default function TeacherPackage() {
  return <TeacherPackagePage />;
}
