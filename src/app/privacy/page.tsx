import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - DummAir',
  description: 'Learn how DummAir collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#111417] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-[#2472e0] hover:text-[#1e5bb8] mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-[#9ca3af]">Last Updated: January 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">1. Introduction</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              Welcome to DummAir. We are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
              our website and use our services.
            </p>
            <p className="text-[#647287] leading-relaxed">
              By using DummAir services, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">2.1 Personal Information</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Create an account on our platform</li>
              <li>Book a dummy flight ticket</li>
              <li>Contact our customer support</li>
              <li>Subscribe to our newsletter</li>
              <li>Make a payment for our services</li>
            </ul>
            <p className="text-[#647287] leading-relaxed mb-4">
              The personal information we collect may include:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Contact Information:</strong> Full name, email address, phone number</li>
              <li><strong>Travel Information:</strong> Departure city, destination city, travel dates, passenger details</li>
              <li><strong>Payment Information:</strong> Billing address (payment card details are processed securely by our payment processor)</li>
              <li><strong>Account Credentials:</strong> Username, password (encrypted)</li>
              <li><strong>Identification Documents:</strong> Passport details, visa information (when necessary for ticket generation)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">3. How We Use Your Information</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Service Delivery:</strong> To process your bookings and generate dummy flight tickets</li>
              <li><strong>Payment Processing:</strong> To process payments and prevent fraudulent transactions</li>
              <li><strong>Customer Support:</strong> To respond to your inquiries and provide technical support</li>
              <li><strong>Account Management:</strong> To create and manage your account</li>
              <li><strong>Communication:</strong> To send booking confirmations, receipts, and service updates</li>
              <li><strong>Improvement:</strong> To improve our website, services, and user experience</li>
              <li><strong>Marketing:</strong> To send promotional emails (you can opt-out at any time)</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              <li><strong>Security:</strong> To detect, prevent, and address security issues</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information 
              in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Service Providers:</strong> With trusted third-party service providers (payment processors, email services, cloud storage) who assist in operating our business</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulations</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit consent for any other purpose</li>
              <li><strong>Protection:</strong> To protect our rights, privacy, safety, or property, and that of our users</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">5. Data Security</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure payment processing through PCI-DSS compliant providers</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Encrypted storage of sensitive data</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-[#647287] leading-relaxed">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your 
              information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">6. Data Retention</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              We retain your personal information only as long as necessary to fulfill the purposes outlined in this 
              Privacy Policy, unless a longer retention period is required by law. Specifically:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Account Data:</strong> Retained while your account is active and for up to 2 years after account closure</li>
              <li><strong>Transaction Records:</strong> Retained for 7 years for accounting and tax purposes</li>
              <li><strong>Support Communications:</strong> Retained for 3 years for quality assurance</li>
              <li><strong>Marketing Data:</strong> Retained until you opt-out or request deletion</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">7. Your Privacy Rights</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
              <li><strong>Restriction:</strong> Request restriction of processing of your information</li>
              <li><strong>Objection:</strong> Object to processing of your information for certain purposes</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for processing where we rely on consent</li>
            </ul>
            <p className="text-[#647287] leading-relaxed">
              To exercise these rights, please contact us at <a href="mailto:support@dummair.com" className="text-[#2472e0] hover:text-[#1e5bb8]">support@dummair.com</a>. 
              We will respond to your request within 30 days.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our website. Types of cookies we use:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Essential Cookies:</strong> Required for website functionality (login, shopping cart)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing Cookies:</strong> Track your activity to deliver personalized advertisements</li>
            </ul>
            <p className="text-[#647287] leading-relaxed">
              You can control cookies through your browser settings. However, disabling cookies may affect website functionality.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">9. Third-Party Links</h2>
            <p className="text-[#647287] leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices 
              or content of these external sites. We encourage you to review their privacy policies before providing 
              any personal information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-[#647287] leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact us 
              immediately.
            </p>
          </section>

          {/* International Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">11. International Data Transfers</h2>
            <p className="text-[#647287] leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have different data protection laws. We ensure appropriate safeguards are in place 
              to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Updates */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">12. Policy Updates</h2>
            <p className="text-[#647287] leading-relaxed">
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated 
              &quot;Last Updated&quot; date. We will notify you of material changes by posting a notice on our website or sending 
              you an email. Your continued use of our services after such modifications constitutes acceptance of the 
              updated Privacy Policy.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">13. Contact Us</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              If you have any questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-[#f8f9fa] p-6 rounded-lg">
              <p className="text-[#111417] font-semibold mb-2">DummAir Privacy Team</p>
              <p className="text-[#647287] mb-1">Email: <a href="mailto:support@dummair.com" className="text-[#2472e0] hover:text-[#1e5bb8]">support@dummair.com</a></p>
              <p className="text-[#647287] mb-1">WhatsApp: <a href="https://wa.me/14099047084" className="text-[#2472e0] hover:text-[#1e5bb8]">+1 (409) 904-7084</a></p>
              <p className="text-[#647287]">Response Time: Within 48 hours</p>
            </div>
          </section>

          {/* Consent */}
          <section className="mb-12 bg-[#eff6ff] p-6 rounded-lg border border-[#2472e0]">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">Your Consent</h2>
            <p className="text-[#647287] leading-relaxed">
              By using our website and services, you acknowledge that you have read and understood this Privacy Policy 
              and agree to its terms. If you do not agree, please discontinue use of our services.
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

