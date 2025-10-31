import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog/posts';
import { SocialShareButtons } from '@/components/blog/SocialShareButtons';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found - DummAir Blog',
    };
  }

  return {
    title: `${post.title} - DummAir Blog`,
    description: post.excerpt,
    keywords: post.category ? `${post.category}, travel tips, visa application` : 'travel tips, visa application',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F9FBFF]">
      <Header />
      
      {/* Back to Blog Link */}
      <div className="bg-white border-b border-[#dce0e5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#1E73E8] hover:text-[#1e5bb8] font-medium transition-colors group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-64 md:h-96 lg:h-[500px] overflow-hidden">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <div className="mb-4">
              <span className="px-4 py-2 bg-[#1E73E8] text-white text-sm font-semibold rounded-full inline-block">
                {post.category}
              </span>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3B3F46] mb-6 font-heading leading-tight">
            {post.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-[#647287] mb-8 pb-8 border-b border-[#dce0e5]">
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {post.readingTime && (
              <div className="flex items-center space-x-2">
                <Clock size={18} />
                <span>{post.readingTime} min read</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <span>By {post.author}</span>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="mb-8">
            <SocialShareButtons post={post} />
          </div>
        </header>

        {/* Article Body */}
        <div
          className="prose prose-lg max-w-none text-[#111417]
            prose-headings:font-heading prose-headings:text-[#111417] prose-headings:font-bold
            prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-6 prose-h1:text-[#111417]
            prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-[#1E73E8] prose-h2:font-heading
            prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-[#111417] prose-h3:font-heading
            prose-p:text-[#111417] prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base prose-p:font-sans
            prose-ul:text-[#111417] prose-ul:mb-4 prose-ul:font-sans
            prose-ol:text-[#111417] prose-ol:mb-4 prose-ol:font-sans
            prose-li:mb-2 prose-li:leading-relaxed prose-li:text-[#111417] prose-li:font-sans
            prose-strong:text-[#111417] prose-strong:font-bold prose-strong:font-sans
            prose-em:text-[#111417] prose-em:italic prose-em:font-sans
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:w-full prose-img:h-auto
            prose-a:text-[#1E73E8] prose-a:no-underline prose-a:font-semibold hover:prose-a:underline prose-a:font-sans
            prose-blockquote:border-l-4 prose-blockquote:border-[#1E73E8] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#647287] prose-blockquote:font-sans
          "
          style={{ fontFamily: 'var(--font-inter), Inter, Arial, sans-serif' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom Social Share & Back Link */}
        <div className="mt-12 pt-8 border-t border-[#dce0e5]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-[#1E73E8] hover:text-[#1e5bb8] font-semibold transition-colors group"
            >
              <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              View All Posts
            </Link>
            <SocialShareButtons post={post} />
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

