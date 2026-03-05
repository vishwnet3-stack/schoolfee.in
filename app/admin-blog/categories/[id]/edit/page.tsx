// app/admin-blog/categories/[id]/edit/page.tsx
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import AdminLayout from '../../../components/AdminLayout';
import CategoryForm from '../../CategoryForm';

async function getCategory(id: string) {
  try {
    const [categories] = await db.execute<any[]>(
      'SELECT * FROM blog_categories WHERE id = ?',
      [id]
    );
    return categories && categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    const category = await getCategory(params.id);

    if (!category) {
      redirect('/admin-blog/categories');
    }
    
    return (
      <AdminLayout user={user}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Category</h2>
            <CategoryForm category={category} isEdit={true} />
          </div>
        </div>
      </AdminLayout>
    );
  } catch (error) {
    redirect('/admin-blog/login');
  }
}