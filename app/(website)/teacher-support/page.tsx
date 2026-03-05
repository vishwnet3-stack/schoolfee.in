import { generateSEO } from "@/lib/seo";
import TeacherSupportPage from "./ClientTeacherSupport";

export const metadata = generateSEO({
  title: "Teacher Support - Interest-Free Financial Program | Schoolfee",
  description: "Schoolfee offers up to 6–7 months of zero-interest assistance for teachers facing short-term financial stress, with complete privacy and respect.",
  keywords: ["Teacher Financial Support India", " Interest-free Assistance For Teachers", " Teacher Emergency Financial Help", " Zero Interest Teacher Support", " choolfee Teacher Membership", "  Education Continuity Support India", " Dignified Financial Help For Teachers"],
  image: "https://schoolfee.in/teacher/teacher-member.jpg",
});


export default function TeacherSuppor() {
  return <TeacherSupportPage />;
}