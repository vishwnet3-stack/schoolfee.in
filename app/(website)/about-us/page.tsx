import AboutUsClient from "./AboutUsClient";

import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "About Us | Schoolfee – Building Continuity in Education",
  description: "Learn about Schoolfee, a Community Health Mission initiative ensuring uninterrupted education through interest-free school fee support for families.",
  keywords: ["About Us Schoolfee", " School Fee Support Initiative", " Interest Free Education Support", " Education Financial Help", " School Fee Funding", " Middle Class Education Support", " School Fee Assistance India"],
  image: "/logo.jpg",
});


export default function AboutUsPage() {
  return <AboutUsClient />;
}