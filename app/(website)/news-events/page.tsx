import { generateSEO } from "@/lib/seo";
import NewEventsPage from "./NewEventsPage";

export const metadata = generateSEO({
  title: "Events & Updates | Schoolfee Education Programmes & Community Initiatives",
  description:
    "Stay updated with Schoolfee's latest events, education initiatives, school partnerships, community programmes, and nationwide engagement activities supporting uninterrupted education across India.",
  keywords: [
    "Schoolfee Events",
    " Schoolfee Education Programmes",
    " Schoolfee Community Initiatives",
    " Schoolfee School Partnerships",
    " Indian Education Events",
    " Schoolfee Launch Events",
    " Schoolfee Public Announcements"
  ],
  image: "/logo.jpg",
});

export default function NewEventsPageGlobal() {
  return <NewEventsPage />;
}
