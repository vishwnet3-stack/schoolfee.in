import { generateSEO } from "@/lib/seo";
import ClientRegister from "./ClientRegister";

export const metadata = generateSEO({
  title: "Registration | Schoolfee.in - Student Fee Support",
  description: "Registration with Schoolfee helps families manage temporary school fee challenges and ensures uninterrupted education for children.",
  keywords: ["Registration Schoolfee", " School Fee Registration", " Education Fee Support", " School Fee Assistance", " Student Education Help", " Family Fee Support", " School Fee Payment Help", " Schoolfee Platform"],
  image: "/logo.jpg",
});

export default function Registration() {
  return <ClientRegister />
}