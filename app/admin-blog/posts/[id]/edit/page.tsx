// app/admin-blog/posts/[id]/edit/page.tsx
export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import BlogPostForm from '../../BlogPostForm';
import Script from "next/script";
import { Header } from '@/app/admin-blog/components/Header';

async function getPost(id?: string | string[]) {
  try {
    const idStr = Array.isArray(id) ? id[0] : id;
    if (!idStr) return null;
    const [posts] = await db.execute<any[]>(
      `SELECT p.*, c.name as category_name, u.username as created_by_name
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       LEFT JOIN admin_users u ON p.created_by = u.id
       WHERE p.id = ?`,
      [idStr]
    );

    const post = posts && posts.length > 0 ? posts[0] : null;
    console.log('getPost fetched:', post);
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getCategories() {
  try {
    const [categories] = await db.execute<any[]>(
      'SELECT id, name FROM blog_categories WHERE is_active = TRUE ORDER BY name ASC'
    );
    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function EditBlogPostPage({ params }: { params: { id?: string | string[] } | Promise<{ id?: string | string[] }> }) {
  try {
    const resolvedParams = await params;
    await requireAuth();
    const idStr = Array.isArray(resolvedParams?.id) ? resolvedParams.id[0] : resolvedParams?.id;
    if (!idStr) {
      redirect('/admin-blog/posts');
    }

    const post = await getPost(idStr);
    const categories = await getCategories();

    console.log('Edit page data:', { id: idStr, post, categoriesCount: categories.length });

    if (!post) {
      redirect('/admin-blog/posts');
      return null;
    }
    
    return (
      <>
      
      <Header />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <BlogPostForm categories={categories} post={post} isEdit={true} />
          </div>
        </main>
      </div>
      </>
    );
  } catch (error) {
    redirect('/admin-blog/login');
  }
}