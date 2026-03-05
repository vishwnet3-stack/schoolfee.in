"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaCalendar, FaUser, FaArrowRight, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  featured_image?: string;
  featured_alt?: string;
  author: string;
  created_at: string;
  category_name: string;
  category_slug: string;
}

export default function BlogsClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/public/posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category_slug === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[30vh] md:min-h-[30vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#00468e] via-[#003366] to-[#002244]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="absolute top-10 left-10 w-48 h-48 md:w-64 md:h-64 bg-[#f4951d] rounded-full blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 md:w-80 md:h-80 bg-[#0cab47] rounded-full blur-[100px] opacity-30 animate-pulse"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-6 md:py-12">
          <div className="inline-block mb-6 animate-fadeIn">
            <span className="text-sm font-bold tracking-widest text-[#f4951d] uppercase bg-white/10 backdrop-blur-md px-6 py-2 rounded-full">
              Educational Resources
            </span>
          </div>

          <h1 className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight animate-fadeIn">
            Explore Our Blogs
          </h1>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-3 md:py-3 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full md:w-1/2 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-4 md:py-6 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="text-4xl text-[#00468e] animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  {/* Featured Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.featured_alt || post.title}
                        className="w-full h-full object-cover transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00468e] to-[#003366]">
                        <span className="text-white text-4xl font-bold opacity-50">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Link href={`/category/${post.category_slug}`}>
                        <span className="bg-[#f4951d] text-white px-3 py-1 rounded-full text-xs font-bold">
                          {post.category_name}
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <FaCalendar />
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUser />
                        {post.author}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#00468e] mb-3 line-clamp-2 group-hover:text-[#f4951d] transition-colors">
                      {post.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {post.short_description}
                    </p>

                    {/* Read More Link */}
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-2 text-[#00468e] font-semibold hover:text-[#f4951d] transition-colors group"
                    >
                      Read More
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}