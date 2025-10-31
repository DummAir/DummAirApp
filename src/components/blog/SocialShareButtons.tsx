'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react';
import type { BlogPost } from '@/lib/blog/posts';

interface SocialShareButtonsProps {
  post: BlogPost;
}

export function SocialShareButtons({ post }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(post.title);
  const encodedDescription = encodeURIComponent(post.excerpt);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[#647287] font-medium text-sm md:text-base">Share:</span>
      <div className="flex items-center gap-2">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-white border border-[#dce0e5] hover:bg-[#1E73E8] hover:text-white hover:border-[#1E73E8] transition-all group"
          aria-label="Share on Twitter"
        >
          <Twitter size={18} className="group-hover:scale-110 transition-transform" />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-white border border-[#dce0e5] hover:bg-[#1E73E8] hover:text-white hover:border-[#1E73E8] transition-all group"
          aria-label="Share on Facebook"
        >
          <Facebook size={18} className="group-hover:scale-110 transition-transform" />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-white border border-[#dce0e5] hover:bg-[#1E73E8] hover:text-white hover:border-[#1E73E8] transition-all group"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
        </a>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-white border border-[#dce0e5] hover:bg-[#1E73E8] hover:text-white hover:border-[#1E73E8] transition-all group"
          aria-label="Copy link"
        >
          {copied ? (
            <Check size={18} className="text-green-500 group-hover:text-white transition-colors" />
          ) : (
            <Copy size={18} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
}

