'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  comment: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Chioma Okafor",
    location: "Lagos, Nigeria",
    image: "https://ui-avatars.com/api/?name=Chioma+Okafor&background=2472e0&color=fff&size=200&bold=true",
    rating: 5,
    comment: "Absolutely fantastic service! Got my dummy ticket within 30 minutes for my UK visa application. The process was very smooth and professional. Highly recommended!"
  },
  {
    id: 2,
    name: "Adebayo Adeleke",
    location: "Abuja, Nigeria",
    image: "https://ui-avatars.com/api/?name=Adebayo+Adeleke&background=10b981&color=fff&size=200&bold=true",
    rating: 5,
    comment: "Very professional and quick service! I needed a flight reservation for my Canadian visa, and DummAir delivered within an hour. The embassy accepted it without any issues!"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=f59e0b&color=fff&size=200&bold=true",
    rating: 5,
    comment: "Excellent service! The booking process was smooth, and customer support was very helpful. Got my ticket delivered on time for my Schengen visa."
  },
  {
    id: 4,
    name: "Ngozi Eze",
    location: "Port Harcourt, Nigeria",
    image: "https://ui-avatars.com/api/?name=Ngozi+Eze&background=8b5cf6&color=fff&size=200&bold=true",
    rating: 5,
    comment: "Best dummy ticket service I've used! Fast, reliable, and very affordable. Used it for my US visa application and it was verified successfully at the embassy. God bless DummAir!"
  },
  {
    id: 5,
    name: "Priya Patel",
    location: "Mumbai, India",
    image: "https://ui-avatars.com/api/?name=Priya+Patel&background=ec4899&color=fff&size=200&bold=true",
    rating: 5,
    comment: "Amazing experience! Got my flight reservation for visa application in just 20 minutes. Very professional and trustworthy service. Will definitely use again!"
  },
  {
    id: 6,
    name: "Oluwaseun Balogun",
    location: "Ibadan, Nigeria",
    image: "https://ui-avatars.com/api/?name=Oluwaseun+Balogun&background=3b82f6&color=fff&size=200&bold=true",
    rating: 5,
    comment: "Top-notch service! I was skeptical at first, but DummAir proved me wrong. The ticket looked completely authentic and my visa was approved. Thank you so much!"
  },
  {
    id: 7,
    name: "Mohammed Al-Rashid",
    location: "Dubai, UAE",
    image: "https://ui-avatars.com/api/?name=Mohammed+AlRashid&background=059669&color=fff&size=200&bold=true",
    rating: 5,
    comment: "Super fast delivery and excellent quality. The customer service team was very responsive to all my queries. Perfect for visa purposes and embassy requirements!"
  },
  {
    id: 8,
    name: "Blessing Okoro",
    location: "Enugu, Nigeria",
    image: "https://ui-avatars.com/api/?name=Blessing+Okoro&background=dc2626&color=fff&size=200&bold=true",
    rating: 5,
    comment: "Incredible service! The whole process was seamless from booking to delivery. I received my ticket in less than 1 hour and used it for my Dubai visa. Approved!"
  },
  {
    id: 9,
    name: "Emma Chen",
    location: "Singapore",
    image: "https://ui-avatars.com/api/?name=Emma+Chen&background=f97316&color=fff&size=200&bold=true",
    rating: 5,
    comment: "Very impressed with the quality and speed. Got my dummy ticket within an hour and it was perfect for my documentation needs. Will recommend to friends!"
  },
  {
    id: 10,
    name: "Emeka Nwosu",
    location: "Owerri, Nigeria",
    image: "https://ui-avatars.com/api/?name=Emeka+Nwosu&background=6366f1&color=fff&size=200&bold=true",
    rating: 5,
    comment: "Outstanding service! Professional, fast, and reliable. Used it for my UK visa interview and it was exactly what I needed. DummAir is the real deal!"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111417] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-[#647287] text-lg max-w-2xl mx-auto">
            Join thousands of satisfied travelers who trust DummAir for their dummy flight tickets
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2472e0] opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#2472e0] opacity-5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} size={24} className="text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Comment */}
              <blockquote className="text-center mb-8">
                <p className="text-[#111417] text-lg md:text-xl leading-relaxed italic">
                  &quot;{currentTestimonial.comment}&quot;
                </p>
              </blockquote>

              {/* Reviewer Info */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-4 ring-4 ring-[#2472e0] ring-opacity-20">
                  <Image
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-[#111417] font-semibold text-lg">
                  {currentTestimonial.name}
                </h4>
                <p className="text-[#647287] text-sm">
                  {currentTestimonial.location}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-[#f0f2f4] transition-all hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} className="text-[#111417]" />
            </button>

            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-[#2472e0] w-8'
                      : 'bg-[#dce0e5] hover:bg-[#9ca3af]'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-[#f0f2f4] transition-all hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} className="text-[#111417]" />
            </button>
          </div>

          {/* Counter */}
          <div className="text-center mt-6">
            <p className="text-[#647287] text-sm">
              {currentIndex + 1} / {testimonials.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

