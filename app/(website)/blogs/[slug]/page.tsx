// app/(website)/blogs/[slug]/page.tsx
import { notFound } from 'next/navigation';
import BlogDetailsClient from "./BlogDetailsClient";
import { generateSEO } from "@/lib/seo";
import { db } from '@/lib/db';

async function getPost(slug: string) {
  try {
    const [posts] = await db.execute<any[]>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              p.published_at, p.updated_at
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.status = 'published'`,
      [slug]
    );
    return posts && posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    return generateSEO({
      title: "Blog Post Not Found | Schoolfee",
      description: "The requested blog post could not be found.",
    });
  }

  return generateSEO({
    title: post.meta_title || `${post.title} | Schoolfee Blog`,
    description: post.meta_description || post.short_description,
    keywords: post.primary_keyword ? [post.primary_keyword] : [],
    image: post.featured_image || "/logo.jpg",
  });
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailsClient post={post} />;
}