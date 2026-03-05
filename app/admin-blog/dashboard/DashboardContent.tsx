// app/admin-blog/dashboard/DashboardContent.tsx
'use client';

import { FaFolder, FaFileAlt, FaCheckCircle, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import { Header } from '../components/Header';
interface DashboardProps {
  stats: {
    categories: number;
    totalPosts: number;
    published: number;
    drafts: number;
  };
}

export default function DashboardContent({ stats }: DashboardProps) {
  
  return (
    <>
    <Header/>
    <div className="space-y-10 px-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Categories</p>
              <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaFolder className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaFileAlt className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Published</p>
              <p className="text-3xl font-bold text-gray-900">{stats.published}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Drafts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.drafts}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaEdit className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin-blog/categories/create"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <FaFolder className="text-2xl text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Create Category</h3>
              <p className="text-sm text-gray-600">Add a new category</p>
            </div>
          </Link>

          <Link
            href="/admin-blog/categories"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <FaFolder className="text-2xl text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Manage Categories</h3>
              <p className="text-sm text-gray-600">View and edit</p>
            </div>
          </Link>

          <Link
            href="/admin-blog/posts/create"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <FaFileAlt className="text-2xl text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Create Post</h3>
              <p className="text-sm text-gray-600">Write new post</p>
            </div>
          </Link>

          <Link
            href="/admin-blog/posts"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            <FaFileAlt className="text-2xl text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Manage Posts</h3>
              <p className="text-sm text-gray-600">View and edit</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}