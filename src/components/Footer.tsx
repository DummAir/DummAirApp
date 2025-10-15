'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Plane, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111417] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/DummAir Logo Design.png"
                  alt="DummAir Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">DummAir</span>
            </Link>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              Your trusted partner for verifiable dummy flight tickets. Fast, reliable, and professional service for visa applications and travel documentation.
            </p>
            <div className="flex items-center space-x-2 text-[#9ca3af]">
              <Plane size={16} />
              <span className="text-sm">Trusted by 10,000+ travelers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  Book a Ticket
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="mailto:support@dummair.com" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail size={16} className="text-[#2472e0] mt-1 flex-shrink-0" />
                <a href="mailto:support@dummair.com" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  support@dummair.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={16} className="text-[#2472e0] mt-1 flex-shrink-0" />
                <a href="https://wa.me/14099047084" target="_blank" rel="noopener noreferrer" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                  +1 (409) 904-7084
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-[#2472e0] mt-1 flex-shrink-0" />
                <span className="text-[#9ca3af] text-sm">
                  Available 24/7 Worldwide
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#374151]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#9ca3af] text-sm">
              © {currentYear} DummAir. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="#" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                Facebook
              </Link>
              <Link href="#" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                Twitter
              </Link>
              <Link href="#" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                Instagram
              </Link>
              <Link href="#" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

