'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shield, Clock, CheckCircle, Globe, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';

export default function Home() {
  const handleWhatsAppClick = () => {
    const supportNumber = '+14099047084';
    const message = encodeURIComponent('Hi! I need help with booking a dummy flight ticket.');
    window.open(`https://wa.me/${supportNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2472e0] via-[#1e5bb8] to-[#1a4d9e] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-white space-y-8 animate-fadeIn">
              <div className="inline-block">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  ✈️ Trusted by 10,000+ Travelers
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Get Your Verifiable Dummy Flight Ticket in{' '}
                <span className="text-yellow-300">Minutes</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Perfect for visa applications, proof of travel, and documentation purposes. 
                Fast, reliable, and accepted by embassies worldwide.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-yellow-300 flex-shrink-0" />
                  <span className="text-white/90">Delivered in 1 hour</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-yellow-300 flex-shrink-0" />
                  <span className="text-white/90">100% Verifiable PNR</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-yellow-300 flex-shrink-0" />
                  <span className="text-white/90">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-yellow-300 flex-shrink-0" />
                  <span className="text-white/90">Secure Payment</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/book"
                  className="px-8 py-4 bg-white text-[#2472e0] rounded-lg font-bold text-lg hover:bg-gray-100 transition-all hover:shadow-xl hover:scale-105 text-center"
                >
                  Book Now - From $25
                </Link>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-bold text-lg hover:bg-white/20 transition-all text-center"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative lg:block animate-slideInRight">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80"
                  alt="Flight Travel"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                {/* Overlay Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#647287] text-sm mb-1">Starting from</p>
                      <p className="text-[#2472e0] text-3xl font-bold">$25</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#647287] text-sm mb-1">Delivery time</p>
                      <p className="text-[#111417] text-2xl font-bold">≤1 Hour</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111417] mb-4">
              Why Choose DummAir?
            </h2>
            <p className="text-[#647287] text-lg max-w-2xl mx-auto">
              We provide the most reliable and professional dummy flight ticket service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group p-6 rounded-xl bg-gradient-to-br from-[#f8f9fa] to-white hover:shadow-xl transition-all duration-300 border border-[#dce0e5] hover:border-[#2472e0] hover:-translate-y-2">
              <div className="w-14 h-14 mb-4 bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#111417] mb-2">
                Fast Delivery
              </h3>
              <p className="text-[#647287] leading-relaxed">
                Receive your dummy ticket within 1 hour. Most orders delivered in 30 minutes or less.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-xl bg-gradient-to-br from-[#f8f9fa] to-white hover:shadow-xl transition-all duration-300 border border-[#dce0e5] hover:border-[#2472e0] hover:-translate-y-2">
              <div className="w-14 h-14 mb-4 bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#111417] mb-2">
                100% Verifiable
              </h3>
              <p className="text-[#647287] leading-relaxed">
                All tickets come with genuine PNR that can be verified on airline websites.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-xl bg-gradient-to-br from-[#f8f9fa] to-white hover:shadow-xl transition-all duration-300 border border-[#dce0e5] hover:border-[#2472e0] hover:-translate-y-2">
              <div className="w-14 h-14 mb-4 bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#111417] mb-2">
                Secure & Safe
              </h3>
              <p className="text-[#647287] leading-relaxed">
                Your data is encrypted and protected. We use industry-standard security measures.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-xl bg-gradient-to-br from-[#f8f9fa] to-white hover:shadow-xl transition-all duration-300 border border-[#dce0e5] hover:border-[#2472e0] hover:-translate-y-2">
              <div className="w-14 h-14 mb-4 bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#111417] mb-2">
                Global Acceptance
              </h3>
              <p className="text-[#647287] leading-relaxed">
                Accepted by embassies and consulates worldwide for visa applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#1fb855] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 animate-bounce-slow group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
      </button>
    </div>
  );
}
