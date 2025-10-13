'use client';

import { Plane, FileText, CreditCard, Mail } from 'lucide-react';

const steps = [
  {
    icon: Plane,
    title: "Select Flight Type",
    description: "Choose between one-way or return flight tickets based on your needs"
  },
  {
    icon: FileText,
    title: "Fill Details",
    description: "Provide your flight and passenger information in our easy-to-use form"
  },
  {
    icon: CreditCard,
    title: "Make Payment",
    description: "Securely pay using Stripe or Flutterwave payment options"
  },
  {
    icon: Mail,
    title: "Receive Ticket",
    description: "Get your verifiable dummy flight ticket via email within 1 hour"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111417] mb-4">
            How It Works
          </h2>
          <p className="text-[#647287] text-lg max-w-2xl mx-auto">
            Get your dummy flight ticket in 4 simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                {/* Connector Line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#2472e0] to-transparent opacity-20"></div>
                )}

                <div className="relative bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 border border-[#dce0e5] hover:border-[#2472e0] group-hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#2472e0] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon size={32} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-[#111417] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#647287] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <a
            href="/book"
            className="inline-block px-8 py-4 bg-[#2472e0] text-white rounded-lg font-semibold hover:bg-[#1e5bb8] transition-all hover:shadow-lg hover:scale-105"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
}

