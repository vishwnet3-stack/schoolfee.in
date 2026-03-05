import { generateSEO } from "@/lib/seo";
import ContactClient from "./ContactClient";

export const metadata = generateSEO({
  title: "Contact Us | Schoolfee.in - initiative of Community Health Mission.",
  description: "Contact Schoolfee to get support for timely school fees payment. We help middle-class families manage short-term financial stress. Get Now registration",
  keywords: ["Contact Us Schoolfee", "School Fee Support", "Education Fee Assistance", "School Fees Help", "Middle Class Education Support", "Student Fee Relief", "Education Financial Help", "School Fee Problems", "Child Education Support", "School Fee Delay Help"],
  image: "/logo.jpg",
});

export default function ContactPage() {
  return <ContactClient />;
}
