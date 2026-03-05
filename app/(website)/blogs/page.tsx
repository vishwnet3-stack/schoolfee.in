// app/(website)/blogs/page.tsx
// import BlogsClient from "./BlogsClient";
import BlogsClient from "./Blogsclient";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Educational Blogs | Schoolfee – Tips, Guides & Resources",
  description: "Explore expert articles on education financing, school fee management, parenting tips, and student success stories. Stay informed with Schoolfee's blog.",
  keywords: [
    "Education Blog",
    "School Fee Tips",
    "Education Financing Guide",
    "Parenting Resources",
    "Student Success Stories",
    "Education Financial Planning",
    "School Fee Management India"
  ],
  image: "/logo.jpg",
});

export default function BlogsPage() {
  return <BlogsClient />;
}