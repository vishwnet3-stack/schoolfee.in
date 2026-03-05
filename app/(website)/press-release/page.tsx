import { generateSEO } from "@/lib/seo";
import MediaPage from "./PressReleasePage";

export const metadata = generateSEO({
  title: "Press Releases | Schoolfee News, Media Coverage & Announcements",
  description:
    "Read official press releases, media coverage, partnerships, milestones, and financial updates from Schoolfee. Stay informed about India's first interest-free school fee support platform.",
  keywords: [
    "Schoolfee Press Release",
    " Schoolfee News",
    " Schoolfee Media Coverage",
    " Schoolfee Launch Announcement",
    " Schoolfee Education Finance Updates",
    " Schoolfee Partnerships",
    " Schoolfee Recognition",
    " Interest Free School Fee Platform India"
  ],
  image: "/logo.jpg",
});

export default function MediaPageGlobal() {
  return <MediaPage />;
}
