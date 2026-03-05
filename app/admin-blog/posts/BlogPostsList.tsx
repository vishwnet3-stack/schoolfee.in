// app/admin-blog/posts/BlogPostsList.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaEye, FaClock, FaCheckCircle } from 'react-icons/fa';
import { Header } from '../components/Header';

interface Post {
  id: number;
  title: string;
  slug: string;
  category_name: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  created_at: string;
  created_by_name: string;
  featured_image?: string;
}

interface BlogPostsListProps {
  posts: Post[];
}

export default function BlogPostsList({ posts: initialPosts }: BlogPostsListProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [deleting, setDeleting] = useState<number | null>(null);

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };

    const icons = {
      draft: <FaClock className="inline mr-1" />,
      published: <FaCheckCircle className="inline mr-1" />,
      archived: <FaEye className="inline mr-1" />,
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6 py-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Published ({posts.filter(p => p.status === 'published').length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'draft'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Drafts ({posts.filter(p => p.status === 'draft').length})
            </button>
          </div>
        </div>

        {/* Posts List */}

        {filteredPosts.length === 0 ? (

          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts found</p>
            <a
              href="/admin-blog/posts/create"
              className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Post
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {post.featured_image && (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500">/{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.category_name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <FaEye className="inline mr-1" />
                      {post.views}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin-blog/posts/${post.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
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
        )}
      </div>
    </>

  );
}