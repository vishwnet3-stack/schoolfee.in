// app/admin-blog/posts/create/page.tsx
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import BlogPostForm from '../BlogPostForm';
import { Header } from '../../components/Header';

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

export default async function CreateBlogPostPage() {
  try {
    await requireAuth();
    const categories = await getCategories();

    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-2xl font-bold text-gray-900">Create Blog Post</h1>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow p-6">
              <BlogPostForm categories={categories} />
            </div>
          </main>
        </div>
      </>
    );
  } catch (error) {
    redirect('/admin-blog/login');
  }
}