// app/admin-blog/categories/CategoryForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaSearch } from 'react-icons/fa';

interface CategoryFormProps {
  category?: {
    id: number;
    name: string;
    slug: string;
    featured_image?: string;
    featured_alt?: string;
    meta_title?: string;
    meta_description?: string;
    primary_keyword?: string;
  };
  isEdit?: boolean;
}

export default function CategoryForm({ category, isEdit = false }: CategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    featured_alt: category?.featured_alt || '',
    meta_title: category?.meta_title || '',
    meta_description: category?.meta_description || '',
    primary_keyword: category?.primary_keyword || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(category?.featured_image || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit && formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, isEdit]);

  // Auto-generate meta title from name
  useEffect(() => {
    if (formData.name && !formData.meta_title) {
      setFormData(prev => ({ ...prev, meta_title: formData.name }));
    }
  }, [formData.name]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      if (imageFile) {
        formDataToSend.append('featured_image', imageFile);
      }

      const url = isEdit 
        ? `/api/admin/categories/${category?.id}`
        : '/api/admin/categories';
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: isEdit ? 'Category updated successfully!' : 'Category created successfully!' 
        });
        
        setTimeout(() => {
          router.push('/admin-blog/categories');
          router.refresh();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'An error occurred' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const metaTitleLength = formData.meta_title.length;
  const metaDescLength = formData.meta_description.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL) *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="category-url-slug"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {previewUrl && (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image ALT Text
          </label>
          <input
            type="text"
            value={formData.featured_alt}
            onChange={(e) => setFormData({ ...formData, featured_alt: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the image"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaSearch className="text-blue-600" />
          SEO Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <small className={`text-xs ${metaTitleLength > 60 ? 'text-red-600' : 'text-gray-500'}`}>
              {metaTitleLength}/70 characters (ideal: 50-60)
            </small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Keyword
            </label>
            <input
              type="text"
              value={formData.primary_keyword}
              onChange={(e) => setFormData({ ...formData, primary_keyword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Main SEO keyword"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Brief description for search engines"
            />
            <small className={`text-xs ${metaDescLength > 155 ? 'text-red-600' : 'text-gray-500'}`}>
              {metaDescLength}/160 characters (ideal: 120-155)
            </small>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSave />
          {loading ? 'Saving...' : isEdit ? 'Update Category' : 'Save Category'}
        </button>
          
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}