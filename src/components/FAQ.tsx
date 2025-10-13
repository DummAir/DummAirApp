'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is a dummy flight ticket?",
    answer: "A dummy flight ticket is a verifiable flight reservation that looks and functions like a real airline ticket. It's commonly used for visa applications, proof of travel plans, or immigration purposes. It contains a valid PNR (booking reference) that can be verified on airline websites."
  },
  {
    question: "How quickly will I receive my ticket?",
    answer: "We deliver your dummy flight ticket within 1 hour after payment confirmation. In most cases, you'll receive it within 30 minutes. For urgent requests, please contact our WhatsApp support for expedited processing."
  },
  {
    question: "Is the ticket verifiable?",
    answer: "Yes! All our dummy flight tickets come with a genuine PNR (Passenger Name Record) that can be verified on the airline's website. This ensures your ticket is accepted by embassies, consulates, and immigration authorities."
  },
  {
    question: "Can I use this for visa applications?",
    answer: "Absolutely! Our dummy flight tickets are specifically designed for visa applications and are accepted by embassies worldwide. They meet all the requirements for proof of travel plans without requiring you to purchase an actual non-refundable ticket."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept payments through Stripe and Flutterwave. You can pay using credit/debit cards, and various local payment methods depending on your location. All transactions are secure and encrypted."
  },
  {
    question: "How long is the ticket valid?",
    answer: "The dummy flight ticket is typically valid for 48 hours to 2 weeks, depending on the airline. This gives you enough time to submit your visa application while ensuring the reservation remains verifiable."
  },
  {
    question: "What if my visa application is rejected?",
    answer: "Since our dummy tickets are temporary reservations and not actual flight purchases, you don't lose money on expensive non-refundable tickets. You only pay a small fee for the reservation service."
  },
  {
    question: "Can I modify the ticket details after booking?",
    answer: "Minor modifications like date changes can be requested within 24 hours of purchase by contacting our support team. Major changes may require a new booking. Please ensure all details are correct before finalizing your order."
  },
  {
    question: "Do you offer refunds?",
    answer: "Once a ticket has been issued and delivered, refunds are generally not available as the service has been provided. However, if there's an error on our part or the ticket is unverifiable, we'll issue a full refund or replacement."
  },
  {
    question: "Is this service legal?",
    answer: "Yes, using dummy flight tickets for visa applications is completely legal and widely accepted. Many embassies and consulates understand that travelers prefer not to purchase expensive tickets before visa approval. Our service provides a legitimate solution."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111417] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#647287] text-lg">
            Everything you need to know about our dummy flight ticket service
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#dce0e5] rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-[#f8f9fa] transition-colors"
              >
                <span className="text-[#111417] font-semibold pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-[#2472e0] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 pt-2">
                  <p className="text-[#647287] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-br from-[#f0f2f4] to-[#e9ecef] rounded-xl">
          <h3 className="text-xl font-semibold text-[#111417] mb-2">
            Still have questions?
          </h3>
          <p className="text-[#647287] mb-4">
            Our support team is available 24/7 to help you
          </p>
          <a
            href="https://wa.me/14099047084"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#1fb855] transition-all hover:shadow-lg hover:scale-105"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

