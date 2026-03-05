// app/admin-blog/categories/CategoriesList.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
  slug: string;
  featured_image?: string;
  meta_title?: string;
  created_at: string;
  created_by_name: string;
}

interface CategoriesListProps {
  categories: Category[];
}

export default function CategoriesList({ categories: initialCategories }: CategoriesListProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      alert('An error occurred while deleting the category');
    } finally {
      setDeleting(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 px-6">
        <div className="text-gray-400 mb-4">
          <FaImage className="text-6xl mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
        <p className="text-gray-500 mb-6">Get started by creating your first category</p>
        <a
          href="/admin-blog/categories/create"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Category
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Meta Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {category.featured_image ? (
                    <img
                      src={category.featured_image}
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded mr-3 flex items-center justify-center">
                      <FaImage className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <code className="bg-gray-100 px-2 py-1 rounded">/{category.slug}</code>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {category.meta_title || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {category.created_by_name || 'System'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(category.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => router.push(`/admin-blog/categories/${category.id}/edit`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    disabled={deleting === category.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Category"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}