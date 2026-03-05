"use client";

import { useState, useEffect } from 'react';
import { FaCalendar, FaUser, FaTag, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    short_description: string;
    featured_image?: string;
    featured_alt?: string;
    author: string;
    created_at: string;
    category_name: string;
    category_slug: string;
    primary_keyword?: string;
}

interface RecentPost {
    id: number;
    title: string;
    slug: string;
    featured_image?: string;
    featured_alt?: string;
    created_at: string;
    category_name?: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface RelatedPost {
    id: number;
    title: string;
    slug: string;
    featured_image?: string;
    featured_alt?: string;
    created_at: string;
    category_name?: string;
}

export default function BlogDetailsClient({ post }: { post: BlogPost }) {
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
    const [recentCategories, setRecentCategories] = useState<Category[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

    useEffect(() => {
        fetchRecentPosts();
        fetchRecentCategories();
        fetchRelatedPosts();
    }, [post.id]);

    // Fetch recent 5 posts (not related, just newest)
    const fetchRecentPosts = async () => {
        try {
            const response = await fetch(`/api/public/posts?limit=5&exclude=${post.id}`);
            const data = await response.json();
            setRecentPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching recent posts:', error);
        }
    };

    // Fetch recent 5 categories
    const fetchRecentCategories = async () => {
        try {
            const response = await fetch(`/api/public/categories?limit=5`);
            const data = await response.json();
            setRecentCategories(data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch related posts for bottom section (same category)
    const fetchRelatedPosts = async () => {
        try {
            const response = await fetch(`/api/public/posts?category=${post.category_slug}&limit=4&exclude=${post.id}`);
            const data = await response.json();
            setRelatedPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching related posts:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post.title;

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
    };

    return (
        <div className="w-full bg-gray-50">
            <style jsx global>{`
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 1.5rem 0;
        }
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #00468E;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .blog-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #00468E;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p {
          color: #374151;
          line-height: 1.75;
          margin-bottom: 1rem;
        }
        .blog-content ul, .blog-content ol {
          color: #374151;
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        .blog-content a {
          color: #00468E;
          text-decoration: none;
        }
        .blog-content a:hover {
          color: #F4951D;
          text-decoration: underline;
        }
        .blog-content strong {
          color: #111827;
          font-weight: 600;
        }
        .blog-content blockquote {
          border-left: 4px solid #F4951D;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4B5563;
        }
        @media (max-width: 640px) {
          .blog-content {
            font-size: 0.9375rem;
          }
          .blog-content h2 {
            font-size: 1.375rem;
          }
          .blog-content h3 {
            font-size: 1.125rem;
          }
        }
      `}</style>

            {/* Breadcrumb Navigation */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <Link href="/" className="hover:text-[#00468E] transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/blogs" className="hover:text-[#00468E] transition-colors">Blog</Link>
                        <span>/</span>
                        <Link href={`/category/${post.category_slug}`} className="hover:text-[#00468E] transition-colors">
                            {post.category_name}
                        </Link>
                        <span>/</span>
                        <span className="text-gray-400 truncate">{post.title.substring(0, 30)}...</span>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

                    {/* Main Article Column */}
                    <div className="lg:col-span-8">
                        {/* Article Card */}
                        <article className="bg-white rounded-[10px] p-4 sm:p-6 lg:p-8">
                            {/* Category Badge */}
                            <Link href={`/category/${post.category_slug}`}>
                                <span className="inline-block bg-[#F4951D] text-white px-3 py-1 rounded-[10px] text-xs font-semibold uppercase mb-3 hover:bg-[#e38a1a] transition-colors">
                                    {post.category_name}
                                </span>
                            </Link>

                            {/* Title */}
                            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                                {post.title}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                    <FaUser className="text-[#00468E]" />
                                    <span className="font-medium">{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                    <FaCalendar className="text-[#00468E]" />
                                    <span>{formatDate(post.created_at)}</span>
                                </div>
                            </div>

                            {/* Featured Image */}
                            {post.featured_image && (
                                <div className="mb-5 sm:mb-6">
                                    <img
                                        src={post.featured_image}
                                        alt={post.featured_alt || post.title}
                                        className="w-full h-auto object-cover rounded-[10px]"
                                        loading="eager"
                                    />
                                </div>
                            )}

                            {/* Main Content */}
                            <div
                                className="blog-content mb-6 sm:mb-8"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Social Share */}
                            <div className="pt-5 sm:pt-6 border-t border-gray-200">
                                <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                                    <span className="text-sm sm:text-base font-semibold text-gray-900">Share this article:</span>
                                    <div className="flex gap-2 sm:gap-3">
                                        <a
                                            href={shareLinks.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-105 text-sm sm:text-base"
                                            aria-label="Share on Facebook"
                                        >
                                            <FaFacebook />
                                        </a>
                                        <a
                                            href={shareLinks.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-all hover:scale-105 text-sm sm:text-base"
                                            aria-label="Share on Twitter"
                                        >
                                            <FaTwitter />
                                        </a>
                                        
                                        <a
                                            href={shareLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-all hover:scale-105 text-sm sm:text-base"
                                            aria-label="Share on LinkedIn"
                                        >
                                            <FaLinkedin />
                                        </a>

                                        <a
                                            href={shareLinks.whatsapp}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-all hover:scale-105 text-sm sm:text-base"
                                            aria-label="Share on WhatsApp"
                                        >
                                            <FaWhatsapp />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sticky Sidebar */}
                    <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 lg:self-start">

                        {/* Recent Posts */}
                        {recentPosts.length > 0 && (
                            <div className="bg-white rounded-[10px] p-4 sm:p-5">
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Recent Posts</h2>
                                <div className="space-y-3 sm:space-y-4">
                                    {recentPosts.map((recentPost) => (
                                        <Link
                                            key={recentPost.id}
                                            href={`/blogs/${recentPost.slug}`}
                                            className="flex gap-3 group border border-gray-200 rounded-[10px] p-2 hover:shadow-sm transition-all"
                                        >
                                            <div className="w-20 h-16 sm:w-24 sm:h-20 flex-shrink-0 bg-gray-200 overflow-hidden rounded-[10px]">
                                                {recentPost.featured_image ? (
                                                    <img
                                                        src={recentPost.featured_image}
                                                        alt={recentPost.featured_alt || recentPost.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#00468E]">
                                                        <span className="text-white text-sm font-bold">
                                                            {recentPost.title.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#00468E] transition-colors line-clamp-2 mb-1">
                                                    {recentPost.title}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(recentPost.created_at)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Categories Widget */}
                        {recentCategories.length > 0 && (
                            <div className="bg-white rounded-[10px] p-4 sm:p-5">
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Recent Categories</h2>
                                <div className="space-y-2">
                                    {recentCategories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/category/${category.slug}`}
                                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-[10px] group"
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-8 h-8 bg-[#00468E] rounded-[10px] flex items-center justify-center flex-shrink-0">
                                                    <FaTag className="text-white text-xs" />
                                                </div>
                                                <span className="text-xs sm:text-sm font-medium text-gray-700">{category.name}</span>
                                            </div>
                                            <FaArrowRight className="text-[#F4951D] text-xs group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                    </aside>
                </div>

                {/* Related Posts Section - Bottom (Category-based) */}
                {relatedPosts.length > 0 && (
                    <div className="mt-8 sm:mt-10 lg:mt-12">
                        <div className="bg-white rounded-[10px] p-5 sm:p-6 lg:p-8">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-5 sm:mb-6 lg:mb-8">Related Articles</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={`/blogs/${relatedPost.slug}`}
                                        className="group bg-white border border-gray-200 rounded-[10px] overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        <div className="relative h-40 sm:h-48 bg-gray-200 overflow-hidden">
                                            {relatedPost.featured_image ? (
                                                <img
                                                    src={relatedPost.featured_image}
                                                    alt={relatedPost.featured_alt || relatedPost.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00468E] to-[#003366]">
                                                    <span className="text-white text-3xl font-bold opacity-50">
                                                        {relatedPost.title.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            {relatedPost.category_name && (
                                                <span className="absolute top-3 left-3 bg-[#F4951D] text-white px-2 py-1 rounded-[10px] text-xs font-semibold">
                                                    {relatedPost.category_name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-[#00468E] transition-colors line-clamp-2 mb-2">
                                                {relatedPost.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <FaCalendar className="text-[#00468E]" />
                                                <span>{formatDate(relatedPost.created_at)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Back to Blog Button */}
                <div className="mt-6 sm:mt-8 text-center">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#00468E] text-white rounded-[10px] text-sm sm:text-base font-semibold hover:bg-[#003366] transition-colors"
                    >
                        <FaArrowLeft />
                        <span>Back to All Articles</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}