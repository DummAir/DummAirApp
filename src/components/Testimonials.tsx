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
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
    comment: "Absolutely fantastic service! Got my dummy ticket within 30 minutes. Perfect for my visa application. Highly recommended!"
  },
  {
    id: 2,
    name: "Mohammed Al-Rashid",
    location: "Dubai, UAE",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5,
    comment: "Very professional and quick. The ticket looked authentic and was accepted by the embassy without any issues. Will use again!"
  },
  {
    id: 3,
    name: "Emma Chen",
    location: "Singapore",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 5,
    comment: "Excellent service! The booking process was smooth, and customer support was very helpful. Got my ticket delivered on time."
  },
  {
    id: 4,
    name: "Carlos Rodriguez",
    location: "Madrid, Spain",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    rating: 5,
    comment: "Best dummy ticket service I've used. Fast, reliable, and affordable. The ticket was verified successfully at the consulate."
  },
  {
    id: 5,
    name: "Priya Patel",
    location: "Mumbai, India",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    rating: 5,
    comment: "Amazing experience! Got my flight reservation for visa application in just 20 minutes. Very professional and trustworthy service."
  },
  {
    id: 6,
    name: "James Williams",
    location: "London, UK",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    rating: 5,
    comment: "Top-notch service! The ticket looked completely authentic and was accepted without any questions. Will definitely recommend to friends."
  },
  {
    id: 7,
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    rating: 5,
    comment: "Super fast delivery and excellent quality. The customer service team was very responsive to all my queries. Perfect for visa purposes!"
  },
  {
    id: 8,
    name: "David Miller",
    location: "Sydney, Australia",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    rating: 5,
    comment: "Incredible service! The whole process was seamless from booking to delivery. My visa application was approved with their ticket."
  },
  {
    id: 9,
    name: "Sofia Martinez",
    location: "Mexico City, Mexico",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    rating: 5,
    comment: "Very impressed with the quality and speed. Got my dummy ticket within an hour and it was perfect for my documentation needs."
  },
  {
    id: 10,
    name: "Ahmed Hassan",
    location: "Cairo, Egypt",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 5,
    comment: "Outstanding service! Professional, fast, and reliable. The ticket was exactly what I needed for my visa interview. Thank you DummAir!"
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

