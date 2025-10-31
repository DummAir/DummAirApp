'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105">
              <Image
                src="/DummAir Logo Design.png"
                alt="DummAir Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl md:text-2xl font-bold text-[#111417] tracking-tight">
              DummAir
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#how-it-works"
              className="text-[#647287] hover:text-[#2472e0] font-medium transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-[#647287] hover:text-[#2472e0] font-medium transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-[#647287] hover:text-[#2472e0] font-medium transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/blog"
              className="text-[#647287] hover:text-[#2472e0] font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/book"
              className="px-6 py-2.5 bg-[#2472e0] text-white rounded-lg font-semibold hover:bg-[#1e5bb8] transition-all hover:shadow-lg hover:scale-105"
            >
              Book Now
            </Link>
            <Link
              href="/admin"
              className="flex items-center space-x-2 text-[#647287] hover:text-[#2472e0] transition-colors"
              title="Login / Signup"
            >
              <User size={20} />
              <span className="font-medium">Login</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#111417] hover:bg-[#f0f2f4] rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#dce0e5] animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              <Link
                href="#how-it-works"
                className="px-4 py-2 text-[#647287] hover:text-[#2472e0] hover:bg-[#f0f2f4] rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="px-4 py-2 text-[#647287] hover:text-[#2472e0] hover:bg-[#f0f2f4] rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#faq"
                className="px-4 py-2 text-[#647287] hover:text-[#2472e0] hover:bg-[#f0f2f4] rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/blog"
                className="px-4 py-2 text-[#647287] hover:text-[#2472e0] hover:bg-[#f0f2f4] rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/book"
                className="mx-4 px-6 py-2.5 bg-[#2472e0] text-white text-center rounded-lg font-semibold hover:bg-[#1e5bb8] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Now
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 flex items-center space-x-2 text-[#647287] hover:text-[#2472e0] hover:bg-[#f0f2f4] rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} />
                <span>Login / Signup</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

