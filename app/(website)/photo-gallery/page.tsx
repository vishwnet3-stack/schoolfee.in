import { generateSEO } from "@/lib/seo";
import PhotoGalleryPage from "./PhotoGalleryPage";

export const metadata = generateSEO({
  title: "Photo Gallery | Schoolfee Events, School Partnerships & Community Moments",
  description:
    "Explore Schoolfee's official photo gallery featuring school partnerships, launch events, community programmes, education support initiatives, and impactful moments across India.",
  keywords: [
    "Schoolfee Photo Gallery",
    " Schoolfee Events",
    " Schoolfee School Partnerships",
    " Schoolfee Community Programme Photos",
    " Indian School Education Events",
    " Schoolfee Launch Event Images",
    " Schoolfee Education Support Initiative"
  ],
  image: "/logo.jpg",
});

export default function PhotoGalleryPageGlobal() {
  return <PhotoGalleryPage />;
}
