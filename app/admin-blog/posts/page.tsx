// app/admin-blog/posts/page.tsx
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import BlogPostsList from './BlogPostsList';
import { Header } from '../components/Header';

async function getBlogPosts() {
  try {
    const [posts] = await db.execute<any[]>(
      `SELECT p.*, c.name as category_name, u.username as created_by_name 
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       LEFT JOIN admin_users u ON p.created_by = u.id
       ORDER BY p.created_at DESC`
    );
    return posts || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPostsPage() {
  try {
    const user = await requireAuth();
    const posts = await getBlogPosts();

    return (
      <> 
      <Header /> 
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
              <a
                href="/admin-blog/posts/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Create Post
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BlogPostsList posts={posts} />
        </main>
      </div>
      </>
    );
  } catch (error) {
    redirect('/admin-blog/login');
  }
}