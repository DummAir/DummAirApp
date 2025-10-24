'use client';

import { useState, useEffect } from 'react';
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
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma&backgroundColor=2472e0",
    rating: 5,
    comment: "Absolutely fantastic service! Got my dummy ticket within 30 minutes for my UK visa application. The immigration officer at Heathrow also accepted it as proof of return. Highly recommended!"
  },
  {
    id: 2,
    name: "Adebayo Adeleke",
    location: "Abuja, Nigeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo&backgroundColor=10b981",
    rating: 5,
    comment: "Very professional service! I used DummAir for my Canadian visa and also presented it at Toronto airport as proof of return. Immigration accepted it without any issues!"
  },
  {
    id: 3,
    name: "Ngozi Eze",
    location: "Port Harcourt, Nigeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ngozi&backgroundColor=8b5cf6",
    rating: 5,
    comment: "Best dummy ticket service! I used it for my US visa application and the embassy accepted it. Also showed it at the airport as proof of onward travel. God bless DummAir!"
  },
  {
    id: 4,
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=f59e0b",
    rating: 5,
    comment: "Excellent service! The booking process was smooth and customer support was very helpful. Used it as proof of return when entering Thailand. Immigration had no issues!"
  },
  {
    id: 5,
    name: "Oluwaseun Balogun",
    location: "Ibadan, Nigeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oluwaseun&backgroundColor=3b82f6",
    rating: 5,
    comment: "Top-notch service! I was skeptical at first, but DummAir delivered. Used it for my UK visa and also at Dubai airport for proof of return. Immigration accepted it immediately!"
  },
  {
    id: 6,
    name: "Blessing Okoro",
    location: "Enugu, Nigeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Blessing&backgroundColor=dc2626",
    rating: 5,
    comment: "Incredible service! Got my ticket in less than 1 hour and used it for Dubai visa. At the port of entry in Dubai, they checked my return ticket and DummAir's reservation was perfect!"
  },
  {
    id: 7,
    name: "Mohammed Al-Rashid",
    location: "Dubai, UAE",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed&backgroundColor=059669",
    rating: 5,
    comment: "Super fast delivery and excellent quality. Used it for embassy requirements and also as proof of onward journey. Immigration officers had no questions. Highly professional!"
  },
  {
    id: 8,
    name: "Emeka Nwosu",
    location: "Owerri, Nigeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka&backgroundColor=6366f1",
    rating: 5,
    comment: "Outstanding! Used it for my UK visa interview and also showed it at Heathrow as proof of return flight. Both embassy and immigration accepted it. DummAir is the real deal!"
  },
  {
    id: 9,
    name: "Priya Patel",
    location: "Mumbai, India",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ec4899",
    rating: 5,
    comment: "Amazing! Got my flight reservation in 20 minutes for Schengen visa. Also used it at Amsterdam airport immigration for proof of onward travel. Very professional service!"
  },
  {
    id: 10,
    name: "Tunde Bakare",
    location: "Kano, Nigeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde&backgroundColor=f97316",
    rating: 5,
    comment: "Excellent service! Used DummAir for my visa application and later presented it at the port of entry in London as proof of return. Immigration approved it instantly. Worth every kobo!"
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
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-4 ring-4 ring-[#2472e0] ring-opacity-20 bg-gradient-to-br from-[#2472e0] to-[#1e5bb8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
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

