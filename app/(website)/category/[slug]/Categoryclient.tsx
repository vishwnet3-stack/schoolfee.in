"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaCalendar, FaUser, FaArrowRight, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  featured_image?: string;
  featured_alt?: string;
  meta_description?: string;
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
}

export default function CategoryClient({ category }: { category: Category }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [category.id]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/public/posts?category=${category.slug}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#00468e] via-[#003366] to-[#002244]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {category.featured_image && (
          <>
            <img
              src={category.featured_image}
              alt={category.featured_alt || category.name}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00468e]/90 to-[#00468e]/50"></div>
          </>
        )}

        <div className="absolute top-10 left-10 w-48 h-48 md:w-64 md:h-64 bg-[#f4951d] rounded-full blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 md:w-80 md:h-80 bg-[#0cab47] rounded-full blur-[100px] opacity-30 animate-pulse"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 md:py-20">
          <div className="inline-block mb-6 animate-fadeIn">
            <span className="text-sm font-bold tracking-widest text-[#f4951d] uppercase bg-white/10 backdrop-blur-md px-6 py-2 rounded-full">
              Category
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-6 leading-tight animate-fadeIn">
            {category.name}
          </h1>

          {category.meta_description && (
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto animate-fadeIn">
              {category.meta_description}
            </p>
          )}

          {/* Back to Blog Link */}
          <div className="mt-8">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-white hover:text-[#f4951d] transition-colors"
            >
              <FaArrowLeft />
              Back to All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full md:w-1/2 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles in this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Posts Count */}
            <div className="text-gray-600">
              <span className="font-semibold">{filteredPosts.length}</span> article{filteredPosts.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="text-4xl text-[#00468e] animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <FaSearch className="text-4xl text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? "No articles match your search criteria in this category."
                  : "No articles have been published in this category yet."}
              </p>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00468e] text-white rounded-full font-semibold hover:bg-[#003366] transition-colors"
              >
                <FaArrowLeft />
                View All Articles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  {/* Featured Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.featured_alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00468e] to-[#003366]">
                        <span className="text-white text-4xl font-bold opacity-50">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
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

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#00468e] to-[#003366]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Explore More Categories
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Discover more insights and resources across different topics
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#f4951d] text-white rounded-full font-bold hover:bg-[#e38a1a] transition-colors shadow-xl hover:shadow-2xl"
          >
            View All Articles
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}