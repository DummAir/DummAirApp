import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - DummAir',
  description: 'Read the terms and conditions for using DummAir services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#111417] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-[#2472e0] hover:text-[#1e5bb8] mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-[#9ca3af]">Last Updated: January 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              Welcome to DummAir. By accessing or using our website and services, you agree to be bound by these Terms 
              of Service (&quot;Terms&quot;). Please read these Terms carefully before using our services.
            </p>
            <p className="text-[#647287] leading-relaxed">
              If you do not agree to these Terms, you may not access or use our services. Your continued use of DummAir 
              constitutes acceptance of these Terms and any future modifications.
            </p>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">2. Service Description</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              DummAir provides verifiable dummy flight ticket reservations for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Visa application documentation</li>
              <li>Proof of onward travel</li>
              <li>Travel planning and itinerary verification</li>
              <li>Immigration documentation at ports of entry</li>
              <li>Other legitimate travel documentation purposes</li>
            </ul>
            <p className="text-[#647287] leading-relaxed mb-4">
              <strong className="text-[#111417]">Important:</strong> Our dummy flight tickets are temporary reservations 
              and are NOT actual flight tickets. They are verifiable with airline PNR systems for a limited period 
              (typically 48-72 hours or as specified at booking).
            </p>
            <div className="bg-[#fff3cd] border border-[#ffc107] p-4 rounded-lg mb-6">
              <p className="text-[#856404] font-semibold mb-2">⚠️ Notice:</p>
              <p className="text-[#856404]">
                You must purchase an actual flight ticket before your travel date. Dummy tickets cannot be used for 
                actual boarding. DummAir is not responsible if you fail to purchase a valid ticket before travel.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">3. Eligibility</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              To use DummAir services, you must:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Be at least 18 years of age</li>
              <li>Have legal capacity to enter into binding contracts</li>
              <li>Provide accurate and truthful information</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Use services for lawful purposes only</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">4. Account Registration</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              When creating an account with DummAir, you agree to:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Not share your account credentials with others</li>
              <li>Not create multiple accounts to abuse our services</li>
            </ul>
            <p className="text-[#647287] leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
            </p>
          </section>

          {/* Booking and Payment */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">5. Booking and Payment</h2>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">5.1 Booking Process</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Select your desired travel route and dates</li>
              <li>Provide accurate passenger information</li>
              <li>Review pricing and service details</li>
              <li>Complete payment through our secure payment gateway</li>
              <li>Receive confirmation email with your dummy ticket</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">5.2 Pricing</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              All prices are clearly displayed on our website before purchase. Prices are subject to change without 
              notice. The price you pay is the price displayed at the time of booking completion.
            </p>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">5.3 Payment</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Payment must be completed before ticket generation</li>
              <li>We accept credit cards, debit cards, and other specified payment methods</li>
              <li>All payments are processed through secure, PCI-DSS compliant payment processors</li>
              <li>You authorize us to charge your payment method for all fees</li>
              <li>Currency conversion fees may apply depending on your location</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">5.4 Failed Payments</h3>
            <p className="text-[#647287] leading-relaxed">
              If a payment fails, we will notify you via email. You have 24 hours to retry payment before your booking 
              is automatically cancelled. Failed payments may result in temporary account restrictions.
            </p>
          </section>

          {/* Service Delivery */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">6. Service Delivery</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              Upon successful payment:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Registered users will receive an in-app notification when their ticket is ready</li>
              <li>All customers will receive an email with their dummy ticket within 24 hours (typically within 1-2 hours)</li>
              <li>Tickets include a valid PNR (Passenger Name Record) verifiable with airline systems</li>
              <li>Delivery time may vary based on booking complexity and airline response times</li>
              <li>For urgent requests, contact our support team for expedited processing</li>
            </ul>
            <p className="text-[#647287] leading-relaxed">
              <strong className="text-[#111417]">Delivery Guarantee:</strong> We guarantee ticket delivery within 24 hours 
              or provide a full refund (see Refund Policy for details).
            </p>
          </section>

          {/* Ticket Validity */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">7. Ticket Validity and Limitations</h2>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">7.1 Validity Period</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              Dummy flight tickets are valid for a limited period as specified at booking (typically 48-72 hours). 
              After this period, the PNR may expire and become unverifiable.
            </p>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">7.2 Verification</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              Tickets can be verified through:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Airline official websites using the provided PNR</li>
              <li>Airline customer service hotlines</li>
              <li>Embassy and consulate verification systems</li>
              <li>Immigration systems at ports of entry</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">7.3 Limitations</h3>
            <div className="bg-[#fff3cd] border border-[#ffc107] p-4 rounded-lg mb-6">
              <p className="text-[#856404] font-semibold mb-2">⚠️ Important Limitations:</p>
              <ul className="list-disc pl-6 text-[#856404] space-y-2">
                <li>Dummy tickets CANNOT be used for actual flight boarding</li>
                <li>They are ONLY for documentation and verification purposes</li>
                <li>You MUST purchase a real ticket before your travel date</li>
                <li>We are NOT liable if you attempt to board with a dummy ticket</li>
                <li>Misuse may result in legal consequences with airlines or immigration authorities</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">8. Prohibited Uses</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              You agree NOT to use DummAir services for:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Attempting to board a flight with a dummy ticket</li>
              <li>Defrauding airlines, immigration authorities, or other parties</li>
              <li>Illegal activities or purposes</li>
              <li>Violating any local, national, or international laws</li>
              <li>Misrepresenting your travel intentions</li>
              <li>Creating fake identities or using false information</li>
              <li>Reselling or redistributing our tickets without authorization</li>
              <li>Reverse engineering or scraping our website</li>
              <li>Interfering with our services or systems</li>
              <li>Harassing our staff or other customers</li>
            </ul>
            <p className="text-[#647287] leading-relaxed">
              Violation of these prohibitions may result in immediate account termination, legal action, and cooperation 
              with law enforcement authorities.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">9. Intellectual Property</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              All content on DummAir, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Website design, layout, and graphics</li>
              <li>Text, images, logos, and branding</li>
              <li>Software, code, and functionality</li>
              <li>Trademarks, service marks, and trade names</li>
            </ul>
            <p className="text-[#647287] leading-relaxed">
              are owned by DummAir or our licensors and are protected by intellectual property laws. You may not copy, 
              modify, distribute, or create derivative works without our written permission.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">10. Disclaimers and Warranties</h2>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">10.1 Service Availability</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              We strive to maintain service availability 24/7, but we do not guarantee uninterrupted access. Services 
              may be temporarily unavailable due to:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Scheduled maintenance</li>
              <li>Technical issues or system failures</li>
              <li>Third-party service disruptions (airlines, payment processors)</li>
              <li>Force majeure events beyond our control</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">10.2 No Warranties</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              Services are provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, either express or implied, 
              including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Accuracy, reliability, or timeliness of information</li>
              <li>Uninterrupted, error-free, or secure services</li>
              <li>Acceptance by airlines, embassies, or immigration authorities</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">10.3 Third-Party Acceptance</h3>
            <p className="text-[#647287] leading-relaxed">
              While our tickets are verifiable and accepted by most authorities, we cannot guarantee acceptance in all 
              cases. Visa approvals, immigration clearances, and other decisions are at the sole discretion of the 
              respective authorities.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">11. Limitation of Liability</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              To the fullest extent permitted by law, DummAir and its officers, directors, employees, and agents shall 
              not be liable for:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Visa rejections or immigration issues</li>
              <li>Travel disruptions or missed flights</li>
              <li>Third-party actions or decisions</li>
              <li>Any damages arising from your use or inability to use our services</li>
            </ul>
            <p className="text-[#647287] leading-relaxed">
              Our total liability for any claim shall not exceed the amount you paid for the specific service giving 
              rise to the claim, or $100, whichever is less.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">12. Indemnification</h2>
            <p className="text-[#647287] leading-relaxed">
              You agree to indemnify, defend, and hold harmless DummAir and its affiliates from any claims, damages, 
              losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Your use or misuse of our services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any laws or regulations</li>
              <li>Your violation of third-party rights</li>
              <li>Any content you submit to our platform</li>
            </ul>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">13. Termination</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              We reserve the right to suspend or terminate your account and access to services:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>For violation of these Terms</li>
              <li>For fraudulent or illegal activities</li>
              <li>For chargebacks or payment disputes</li>
              <li>At our sole discretion for any reason</li>
            </ul>
            <p className="text-[#647287] leading-relaxed">
              You may terminate your account at any time by contacting us. Upon termination, your right to use our 
              services ceases immediately, but these Terms shall survive termination.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">14. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">14.1 Informal Resolution</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              Before filing any formal claim, you agree to contact us at support@dummair.com to resolve the dispute 
              informally. We will work in good faith to resolve issues within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">14.2 Arbitration</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              If informal resolution fails, any disputes shall be resolved through binding arbitration in accordance 
              with applicable arbitration rules. Arbitration will be conducted individually, not as a class action.
            </p>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">14.3 Governing Law</h3>
            <p className="text-[#647287] leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to 
              conflict of law principles.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">15. Changes to Terms</h2>
            <p className="text-[#647287] leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective upon posting to our 
              website with an updated &quot;Last Updated&quot; date. Material changes will be communicated via email or 
              website notice. Continued use after changes constitutes acceptance of modified Terms.
            </p>
          </section>

          {/* Severability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">16. Severability</h2>
            <p className="text-[#647287] leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall 
              remain in full force and effect.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">17. Contact Information</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-[#f8f9fa] p-6 rounded-lg">
              <p className="text-[#111417] font-semibold mb-2">DummAir Legal Team</p>
              <p className="text-[#647287] mb-1">Email: <a href="mailto:support@dummair.com" className="text-[#2472e0] hover:text-[#1e5bb8]">support@dummair.com</a></p>
              <p className="text-[#647287] mb-1">WhatsApp: <a href="https://wa.me/14099047084" className="text-[#2472e0] hover:text-[#1e5bb8]">+1 (409) 904-7084</a></p>
              <p className="text-[#647287]">Response Time: Within 48 hours</p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="mb-12 bg-[#eff6ff] p-6 rounded-lg border border-[#2472e0]">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">Acknowledgment</h2>
            <p className="text-[#647287] leading-relaxed">
              By using DummAir services, you acknowledge that you have read, understood, and agree to be bound by these 
              Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>
        </div>

        {/* Back to Top */}
        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center text-[#2472e0] hover:text-[#1e5bb8] font-semibold transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

