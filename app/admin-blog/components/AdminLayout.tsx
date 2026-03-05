// app/admin-blog/components/AdminLayout.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FaHome, 
  FaFolder, 
  FaFileAlt, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaPlus,
  FaList
} from 'react-icons/fa';
import { useState } from 'react';
import { Header } from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: {
    username: string;
    email: string;
    full_name?: string | null;
  };
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin-blog/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin-blog/dashboard', icon: FaHome },
    { 
      name: 'Categories', 
      icon: FaFolder,
      subItems: [
        { name: 'All Categories', href: '/admin-blog/categories', icon: FaList },
        { name: 'Add New', href: '/admin-blog/categories/create', icon: FaPlus },
      ]
    },
    { 
      name: 'Blog Posts', 
      icon: FaFileAlt,
      subItems: [
        { name: 'All Posts', href: '/admin-blog/posts', icon: FaList },
        { name: 'Add New', href: '/admin-blog/posts/create', icon: FaPlus },
      ]
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <Header />

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-14 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <nav className="p-4 space-y-2 overflow-y-auto h-full">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-2 text-gray-700 font-medium">
                      <item.icon className="text-lg" />
                      <span>{item.name}</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                            isActive(subItem.href)
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <subItem.icon className="text-sm" />
                          <span className="text-sm">{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="text-lg" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'ml-0'
          }`}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}