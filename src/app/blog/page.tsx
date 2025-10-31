import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllBlogPosts } from '@/lib/blog/posts';

export const metadata: Metadata = {
  title: 'Blog - DummAir | Travel Tips & Visa Application Hacks',
  description: 'Discover smart travel tips, visa application hacks, and money-saving strategies for travelers. Learn how to save thousands on visa applications and travel smarter.',
  keywords: 'travel tips, visa application tips, travel hacks, visa requirements, travel documentation',
  openGraph: {
    title: 'Blog - DummAir | Travel Tips & Visa Application Hacks',
    description: 'Discover smart travel tips, visa application hacks, and money-saving strategies for travelers.',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-[#F9FBFF]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E73E8] via-[#2472e0] to-[#1e5bb8] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading">
              DummAir Blog
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Smart travel tips, visa application hacks, and money-saving strategies for savvy travelers
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#3B3F46] text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#dce0e5] group"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    {/* Featured Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-[#1E73E8] text-white text-sm font-semibold rounded-full">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-xl md:text-2xl font-bold text-[#3B3F46] mb-3 font-heading group-hover:text-[#1E73E8] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-[#647287] mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-sm text-[#647287] mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          {post.readingTime && (
                            <div className="flex items-center space-x-1">
                              <Clock size={16} />
                              <span>{post.readingTime} min read</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Read More Link */}
                      <div className="flex items-center text-[#1E73E8] font-semibold group-hover:gap-2 transition-all">
                        <span>Read More</span>
                        <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

