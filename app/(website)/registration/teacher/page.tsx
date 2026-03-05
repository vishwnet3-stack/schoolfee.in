import { generateSEO } from "@/lib/seo";
import TeacherRegistrationPage from "./TeacherRegistration";

export const metadata = generateSEO({
  title: "Teacher Registration | Join Schoolfee as a Teacher Membership",
  description: "ARegister as a teacher with Schoolfee and become part of India’s first education continuity social financing community, supporting families with dignity.",
  keywords: ["Schoolfee Teacher Registration", " Teacher Partner Program", " Teacher Sign Up Portal", " Schoolfee Teaching Community", " Schoolfee Program Teachers", " Zero Interest Fee Support."],
  image: "https://schoolfee.in/teacher/teacher-member.jpg",
});

export default function TeacherRegistration() {
  return <TeacherRegistrationPage />;
}
