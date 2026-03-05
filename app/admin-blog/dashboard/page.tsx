// app/admin-blog/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import DashboardContent from './DashboardContent';

async function getDashboardStats() {
  try {
    const [categoriesResult] = await db.execute<any[]>(
      'SELECT COUNT(*) as count FROM blog_categories WHERE is_active = TRUE'
    );
    const [postsResult] = await db.execute<any[]>(
      'SELECT COUNT(*) as count FROM blog_posts'
    );
    const [publishedResult] = await db.execute<any[]>(
      'SELECT COUNT(*) as count FROM blog_posts WHERE status = "published"'
    );
    const [draftsResult] = await db.execute<any[]>(
      'SELECT COUNT(*) as count FROM blog_posts WHERE status = "draft"'
    );

    return {
      categories: categoriesResult[0]?.count || 0,
      totalPosts: postsResult[0]?.count || 0,
      published: publishedResult[0]?.count || 0,
      drafts: draftsResult[0]?.count || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      categories: 0,
      totalPosts: 0,
      published: 0,
      drafts: 0,
    };
  }
}

export default async function DashboardPage() {
  try {
    const user = await requireAuth();
    const stats = await getDashboardStats();

    return <DashboardContent stats={stats} />;
  } catch (error) {
    redirect('/admin-blog/login');
  }
}