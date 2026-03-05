// app/admin-blog/posts/BlogPostForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaSearch, FaEye } from 'react-icons/fa';
import Script from 'next/script';

interface Category {
  id: number;
  name: string;
}

interface BlogPostFormProps {
  categories: Category[];
  post?: any;
  isEdit?: boolean;
}

export default function BlogPostForm({ categories, post, isEdit = false }: BlogPostFormProps) {
  const router = useRouter();
  const [summernoteLoaded, setSummernoteLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    category_id: post?.category_id ? String(post.category_id) : '',
    author: post?.author || 'Admin',
    short_description: post?.short_description || '',
    content: post?.content || '',
    featured_alt: post?.featured_alt || '',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    primary_keyword: post?.primary_keyword || '',
    status: post?.status || 'draft',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(post?.featured_image || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize Summernote after scripts load
  useEffect(() => {
    let mounted = true;
    let attempts = 0;

    const initSummernote = () => {
      if (typeof window === 'undefined') return false;
      const w = window as any;
      if (!w.$ || !w.$.fn || !w.$.fn.summernote) return false;

      try {
        const $ = w.$;
        const $el = $('#editor');

        if ($el && $el.length) {
          // Destroy existing instance if any
          try {
            if ($el.data && $el.data('summernote')) {
              $el.summernote('destroy');
            }
          } catch (e) {
            // ignore
          }

          $el.summernote({
            height: 450,
            placeholder: 'Write your blog content here...',
            toolbar: [
              ['style', ['style']],
              ['font', ['bold', 'italic', 'underline', 'clear']],
              ['fontstyle', ['strikethrough', 'superscript', 'subscript']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['table', ['table']],
              ['insert', ['link', 'video']],
              ['view', ['codeview', 'help']]
            ],
            callbacks: {
              onChange: (contents: string) => {
                setFormData((prev) => ({ ...prev, content: contents }));
              },
            },
          });

          if (post?.content) {
            try {
              $el.summernote('code', post.content);
            } catch (e) {
              // ignore
            }
          }
        }

        setSummernoteLoaded(true);
        return true;
      } catch (err) {
        console.error('Summernote init error:', err);
        return false;
      }
    };

    // Try immediate init, otherwise poll until available (max 15 attempts)
    if (!initSummernote()) {
      const interval = setInterval(() => {
        attempts += 1;
        if (!mounted) {
          clearInterval(interval);
          return;
        }
        if (initSummernote() || attempts >= 15) {
          clearInterval(interval);
        }
      }, 200);
    }

    return () => {
      mounted = false;
      if (typeof window !== 'undefined' && (window as any).$) {
        try {
          const $el = (window as any).$('#editor');
          if ($el && $el.length && $el.data && $el.data('summernote')) {
            $el.summernote('destroy');
          }
        } catch (err) {
          // ignore cleanup errors
        }
      }
    };
  }, [post]);

  // Auto-generate slug from title
  const makeSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // useEffect(() => {
  //   if (!isEdit && formData.title) {
  //     const slug = makeSlug(formData.title);
  //     setFormData(prev => ({ ...prev, slug }));
  //   }
   
    
     
      
       


  // }, [formData.title, isEdit]);

  useEffect(() => {
  if (!isEdit) return;
  if (typeof window === "undefined") return;

  const interval = setInterval(() => {
    const w = window as any;

    if (w.$ && w.$.fn && w.$.fn.summernote) {
      const $ = w.$;
      const $editor = $("#editor");

      if ($editor.length && !$editor.data("summernote")) {
        $editor.summernote({
          height: 450,
          placeholder: "Write your blog content here...",
          callbacks: {
            onChange: (contents: string) => {
              setFormData((prev) => ({ ...prev, content: contents }));
            },
          },
        });

        if (post?.content) {
          $editor.summernote("code", post.content);
        }
      }

      clearInterval(interval);
    }
  }, 200);

  return () => clearInterval(interval);

}, [isEdit]);


  // Auto-generate meta title from title
  useEffect(() => {
    if (formData.title && !formData.meta_title) {
      setFormData(prev => ({ ...prev, meta_title: formData.title }));
    }
  }, [formData.title]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent, publishNow: boolean = false) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Get content from Summernote
      let content = formData.content;
      if (typeof window !== 'undefined' && (window as any).$ && (window as any).$('#editor').data('summernote')) {
        content = (window as any).$('#editor').summernote('code');
      }

      const formDataToSend = new FormData();
      
      // Set status based on publish button
      const status = publishNow ? 'published' : formData.status;
      
      Object.entries({ ...formData, status, content }).forEach(([key, value]) => {
        // Append empty string for null/undefined to avoid passing undefined
        if (value === undefined || value === null) {
          formDataToSend.append(key, '');
        } else {
          formDataToSend.append(key, String(value));
        }
      });
      
      if (imageFile) {
        formDataToSend.append('featured_image', imageFile);
      }

      const url = isEdit 
        ? `/api/admin/posts/${post?.id}`
        : '/api/admin/posts';
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (err) {
        // ignore JSON parse errors
      }

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: publishNow 
            ? 'Blog post published successfully!' 
            : isEdit 
              ? 'Blog post updated successfully!' 
              : 'Blog post saved as draft!' 
        });
        
        setTimeout(() => {
          router.push('/admin-blog/posts');
          router.refresh();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: (data && data.error) || 'An error occurred' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const titleLength = formData.title.length;
  const shortDescLength = formData.short_description.length;
  const metaTitleLength = formData.meta_title.length;
  const metaDescLength = formData.meta_description.length;

  return (
    <>
      {/* Load jQuery */}
      <Script 
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
      
      {/* Load Summernote CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" 
        rel="stylesheet"
      />
      
      {/* Load Summernote JS */}
      <Script
        src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"
        strategy="afterInteractive"
        onLoad={() => setSummernoteLoaded(true)}
      />

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
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
              Blog Title *
            </label>
            <input
              type="text"
              required
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter blog title"
            />
            <small id="titleCount" className={`text-xs ${titleLength > 60 ? 'text-red-600' : 'text-gray-500'}`}>
              Characters: {titleLength} (ideal: 50-60)
            </small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              required
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="blog-url-slug"
            />
            <small className="text-xs text-gray-500">
              Preview: <span id="slugPreview">{formData.slug}</span>
            </small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Author name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            id="shortDesc"
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Brief description (shown in blog list)"
          />
          <small id="shortCount" className={`text-xs ${shortDescLength > 160 ? 'text-red-600' : 'text-gray-500'}`}>
            Characters: {shortDescLength} (ideal: 120-160)
          </small>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Content *
          </label>
          <textarea
            id="editor"
            name="content"
            className="w-full"
            defaultValue={formData.content}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="mt-2 w-full h-48 object-cover rounded-lg"
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
                id="metaTitle"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <small id="metaTitleCount" className={`text-xs ${metaTitleLength > 60 ? 'text-red-600' : 'text-gray-500'}`}>
                Characters: {metaTitleLength}/70 (ideal: 50-60)
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
                id="metaDesc"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Brief description for search engines"
              />
              <small id="metaDescCount" className={`text-xs ${metaDescLength > 155 ? 'text-red-600' : 'text-gray-500'}`}>
                Characters: {metaDescLength}/160 (ideal: 120-155)
              </small>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e as any, true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaEye />
            {loading ? 'Publishing...' : 'Publish Now'}
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
    </>
  );
}