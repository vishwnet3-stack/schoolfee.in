// app/admin-blog/categories/page.tsx
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import AdminLayout from '../components/AdminLayout';
import CategoriesList from './CategoriesList';

async function getCategories() {
  try {
    const [categories] = await db.execute<any[]>(
      `SELECT c.*, u.username as created_by_name 
       FROM blog_categories c
       LEFT JOIN admin_users u ON c.created_by = u.id
       WHERE c.is_active = TRUE
       ORDER BY c.created_at DESC`
    );
    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function ManageCategoriesPage() {
  try {
    const user = await requireAuth();
    const categories = await getCategories();

    return (
      <AdminLayout user={user}>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Manage Categories</h2>
              <a
                href="/admin-blog/categories/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add New Category
              </a>
            </div>
          </div>
          <CategoriesList categories={categories} />
        </div>
      </AdminLayout>
    );
  } catch (error) {
    redirect('/admin-blog/login');
  }
}