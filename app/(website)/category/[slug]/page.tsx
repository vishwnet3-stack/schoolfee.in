// app/(website)/category/[slug]/page.tsx
import { notFound } from 'next/navigation';
// import CategoryClient from "./CategoryClient";
import CategoryClient from './Categoryclient';
import { generateSEO } from "@/lib/seo";
import { db } from '@/lib/db';

async function getCategory(slug: string) {
  try {
    const [categories] = await db.execute<any[]>(
      'SELECT * FROM blog_categories WHERE slug = ? AND is_active = TRUE',
      [slug]
    );
    return categories && categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);
  
  if (!category) {
    return generateSEO({
      title: "Category Not Found | Schoolfee",
      description: "The requested category could not be found.",
    });
  }

  return generateSEO({
    title: category.meta_title || `${category.name} | Schoolfee Blog`,
    description: category.meta_description || `Explore articles about ${category.name}`,
    keywords: category.primary_keyword ? [category.primary_keyword] : [],
    image: category.featured_image || "/logo.jpg",
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  return <CategoryClient category={category} />;
}