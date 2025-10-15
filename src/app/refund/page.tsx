import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';

export const metadata = {
  title: 'Refund Policy - DummAir',
  description: 'Learn about DummAir refund policy, cancellation terms, and how to request a refund.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#111417] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-[#2472e0] hover:text-[#1e5bb8] mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Refund Policy</h1>
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
              At DummAir, we are committed to providing high-quality dummy flight ticket services for visa applications 
              and travel documentation. This Refund Policy outlines the circumstances under which refunds are issued 
              and the process for requesting a refund.
            </p>
            <p className="text-[#647287] leading-relaxed">
              We encourage you to carefully review this policy before making a purchase. By completing a booking, you 
              acknowledge and agree to the terms of this Refund Policy.
            </p>
          </section>

          {/* Quick Summary */}
          <section className="mb-12">
            <div className="bg-[#eff6ff] border border-[#2472e0] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#111417] mb-4">Quick Summary</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-[#111417] mb-1">Full Refund</h3>
                    <p className="text-sm text-[#647287]">If service not delivered within 24 hours or technical issues</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="text-[#ffc107] flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-[#111417] mb-1">Partial Refund</h3>
                    <p className="text-sm text-[#647287]">Cancellation within 2 hours of payment (50% refund)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-[#111417] mb-1">No Refund</h3>
                    <p className="text-sm text-[#647287]">After ticket is delivered or 2 hours post-payment</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Eligible Refunds */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">2. Eligible Refunds (100% Money Back)</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              You are eligible for a <strong className="text-[#111417]">full refund (100%)</strong> in the following situations:
            </p>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">2.1 Service Not Delivered</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>24-Hour Guarantee:</strong> If we fail to deliver your dummy ticket within 24 hours of successful payment</li>
              <li><strong>No Response:</strong> If our team does not respond to your support request within 48 hours</li>
              <li><strong>Service Unavailable:</strong> If the service becomes unavailable after payment but before delivery</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">2.2 Technical Issues</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Invalid PNR:</strong> If the provided PNR is not verifiable with the airline system</li>
              <li><strong>Wrong Details:</strong> If the ticket contains incorrect information due to our error (not your input error)</li>
              <li><strong>System Failure:</strong> If our system fails to generate a ticket despite successful payment</li>
              <li><strong>Quality Issues:</strong> If the ticket does not meet the quality standards described on our website</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">2.3 Double Payment</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>If you are charged twice for the same booking due to payment processing errors</li>
              <li>Duplicate charges will be refunded within 5-7 business days</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">2.4 Service Cancellation by DummAir</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>If we are unable to fulfill your order for any reason</li>
              <li>If we terminate the service before delivery</li>
            </ul>

            <div className="bg-[#d1fae5] border border-[#10b981] p-4 rounded-lg mt-6">
              <p className="text-[#065f46] font-semibold mb-2">✅ 24-Hour Delivery Guarantee</p>
              <p className="text-[#065f46]">
                We guarantee delivery within 24 hours or you get a <strong>full refund</strong>. Most tickets are 
                delivered within 1-2 hours, but we allow up to 24 hours for complex bookings.
              </p>
            </div>
          </section>

          {/* Partial Refunds */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">3. Partial Refunds (50%)</h2>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">3.1 Early Cancellation</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              You may cancel your order within <strong className="text-[#111417]">2 hours of payment</strong> and 
              receive a <strong className="text-[#111417]">50% refund</strong> if:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>The ticket has NOT yet been generated or delivered</li>
              <li>You contact us within 2 hours of payment confirmation</li>
              <li>You provide a valid reason for cancellation</li>
              <li>Our team has not yet started processing your order</li>
            </ul>

            <div className="bg-[#fff3cd] border border-[#ffc107] p-4 rounded-lg">
              <p className="text-[#856404] font-semibold mb-2">⏰ Time-Sensitive</p>
              <p className="text-[#856404]">
                The 2-hour window starts from the moment you receive payment confirmation, not from when you place the 
                order. After 2 hours or after ticket delivery, cancellations are not accepted.
              </p>
            </div>
          </section>

          {/* Non-Refundable */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">4. Non-Refundable Situations</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              <strong className="text-[#111417]">No refunds will be issued</strong> in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">4.1 Successful Service Delivery</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Ticket Delivered:</strong> Once your dummy ticket is successfully generated and sent to your email</li>
              <li><strong>Verifiable PNR:</strong> When the PNR is live and verifiable with the airline</li>
              <li><strong>Access Granted:</strong> When registered users access/download the ticket from their dashboard</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">4.2 Customer Error</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Wrong Information:</strong> If you provided incorrect passenger details, travel dates, or routes</li>
              <li><strong>Spelling Mistakes:</strong> Name misspellings or other input errors on your part</li>
              <li><strong>Missed Email:</strong> If you did not check your email or spam folder for the ticket</li>
              <li><strong>Changed Mind:</strong> If you simply changed your mind after delivery</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">4.3 Third-Party Decisions</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Visa Rejection:</strong> If your visa application is rejected by the embassy (our tickets are verifiable, but visa approval is not guaranteed)</li>
              <li><strong>Immigration Issues:</strong> If immigration officers reject the ticket (though rare, decisions are at their discretion)</li>
              <li><strong>Airline Changes:</strong> If the airline cancels or modifies the route after ticket issuance</li>
              <li><strong>Policy Changes:</strong> If embassy or immigration policies change after your purchase</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">4.4 Late Cancellation</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Cancellation requests made more than 2 hours after payment</li>
              <li>Cancellation requests made after ticket delivery</li>
              <li>Cancellation due to personal travel plan changes</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">4.5 Misuse of Service</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>If you attempted to use the dummy ticket for actual flight boarding</li>
              <li>If you violated our Terms of Service</li>
              <li>If you engaged in fraudulent activity</li>
              <li>If you abuse the refund policy (repeated false claims)</li>
            </ul>

            <div className="bg-[#fee2e2] border border-[#ef4444] p-4 rounded-lg mt-6">
              <p className="text-[#991b1b] font-semibold mb-2">🚫 Important Notice</p>
              <p className="text-[#991b1b]">
                Visa rejections and immigration decisions are beyond our control. Our dummy tickets are verifiable and 
                accepted by most authorities, but we cannot guarantee visa approval or entry clearance. Therefore, 
                refunds are not issued for visa rejections.
              </p>
            </div>
          </section>

          {/* Refund Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">5. How to Request a Refund</h2>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">5.1 Contact Us</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              To request a refund, contact our support team via:
            </p>
            <div className="bg-[#f8f9fa] p-6 rounded-lg mb-6">
              <ul className="space-y-2 text-[#647287]">
                <li><strong>Email:</strong> <a href="mailto:support@dummair.com" className="text-[#2472e0] hover:text-[#1e5bb8]">support@dummair.com</a> (Subject: Refund Request - Order #[your_order_number])</li>
                <li><strong>WhatsApp:</strong> <a href="https://wa.me/14099047084" className="text-[#2472e0] hover:text-[#1e5bb8]">+1 (409) 904-7084</a></li>
                <li><strong>Response Time:</strong> Within 24-48 hours</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">5.2 Information Required</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              Please provide the following information in your refund request:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Order number or transaction ID</li>
              <li>Email address used for booking</li>
              <li>Reason for refund request</li>
              <li>Supporting evidence (if applicable)</li>
              <li>Screenshots or documentation of the issue</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">5.3 Review Process</h3>
            <ol className="list-decimal pl-6 text-[#647287] space-y-3 mb-6">
              <li><strong>Submission:</strong> You submit a refund request with required information</li>
              <li><strong>Acknowledgment:</strong> We acknowledge receipt within 24 hours</li>
              <li><strong>Review:</strong> Our team reviews your request within 2-3 business days</li>
              <li><strong>Verification:</strong> We verify your order details and refund eligibility</li>
              <li><strong>Decision:</strong> You receive a decision (approved/denied) via email</li>
              <li><strong>Processing:</strong> If approved, refund is processed to your original payment method</li>
            </ol>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">5.4 Refund Timeline</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Decision Time:</strong> 2-3 business days from request submission</li>
              <li><strong>Processing Time:</strong> 5-7 business days after approval</li>
              <li><strong>Bank Processing:</strong> Additional 3-10 business days depending on your bank</li>
              <li><strong>Total Time:</strong> Up to 14-20 business days for refund to appear in your account</li>
            </ul>

            <div className="bg-[#e0f2fe] border border-[#0ea5e9] p-4 rounded-lg">
              <p className="text-[#075985] font-semibold mb-2">💡 Pro Tip</p>
              <p className="text-[#075985]">
                For faster resolution, include your order number in the subject line and provide detailed information 
                about the issue. Screenshots and evidence expedite the review process.
              </p>
            </div>
          </section>

          {/* Refund Methods */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">6. Refund Methods</h2>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">6.1 Original Payment Method</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              Refunds are issued to the <strong className="text-[#111417]">original payment method</strong> used for the booking:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Credit/Debit Card:</strong> Refund appears as a credit on your card statement (5-10 business days)</li>
              <li><strong>PayPal:</strong> Refund to your PayPal account (3-5 business days)</li>
              <li><strong>Bank Transfer:</strong> Direct refund to your bank account (7-14 business days)</li>
              <li><strong>Mobile Money:</strong> Refund to your mobile wallet (1-3 business days)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">6.2 Store Credit (Optional)</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              In some cases, we may offer <strong className="text-[#111417]">store credit</strong> as an alternative:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li><strong>Faster Processing:</strong> Instant credit to your DummAir account</li>
              <li><strong>Bonus Credit:</strong> Sometimes includes extra 10-20% bonus credit</li>
              <li><strong>No Expiration:</strong> Can be used for future bookings anytime</li>
              <li><strong>Your Choice:</strong> You decide whether to accept store credit or original payment method refund</li>
            </ul>
          </section>

          {/* Disputes and Chargebacks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">7. Disputes and Chargebacks</h2>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">7.1 Contact Us First</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              <strong className="text-[#111417]">Before initiating a chargeback,</strong> please contact us to resolve 
              the issue. We are committed to fair resolutions and most issues can be resolved quickly through direct communication.
            </p>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">7.2 Chargeback Policy</h3>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Chargebacks without prior contact may result in account suspension</li>
              <li>We will provide transaction evidence to your bank/card issuer</li>
              <li>Fraudulent chargebacks may result in permanent account termination</li>
              <li>Chargeback fees may be charged if the dispute is resolved in our favor</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">7.3 Dispute Resolution</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              We prefer to resolve disputes amicably:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Contact our support team within 30 days of purchase</li>
              <li>Provide detailed explanation and evidence</li>
              <li>We will investigate and respond within 3 business days</li>
              <li>If unresolved, escalate to our management team</li>
              <li>Final decisions will be made within 7 business days</li>
            </ul>

            <div className="bg-[#fff3cd] border border-[#ffc107] p-4 rounded-lg">
              <p className="text-[#856404] font-semibold mb-2">⚠️ Chargeback Warning</p>
              <p className="text-[#856404]">
                Chargebacks should be a last resort. They incur fees for both parties and can result in account 
                restrictions. We encourage open communication to resolve any issues fairly and quickly.
              </p>
            </div>
          </section>

          {/* Exceptions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">8. Special Circumstances</h2>
            
            <h3 className="text-xl font-semibold text-[#111417] mb-3">8.1 Force Majeure</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              In case of events beyond our control (natural disasters, pandemics, government actions, war, etc.), 
              we will work with you to find a fair solution, which may include:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Rescheduling your booking to a later date</li>
              <li>Issuing store credit for future use</li>
              <li>Partial or full refund at our discretion</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">8.2 Service Updates</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              If we make changes to our service that materially affect your order:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>You will be notified via email immediately</li>
              <li>You may choose to accept the changes or request a full refund</li>
              <li>Refund must be requested within 48 hours of notification</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#111417] mb-3">8.3 Medical Emergencies</h3>
            <p className="text-[#647287] leading-relaxed mb-4">
              In case of medical emergencies or family bereavement:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2 mb-6">
              <li>Contact us with supporting documentation (medical certificate, death certificate, etc.)</li>
              <li>We will review on a case-by-case basis</li>
              <li>Partial or full refund may be considered</li>
              <li>Store credit for future use is always available</li>
            </ul>
          </section>

          {/* Policy Changes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">9. Policy Changes</h2>
            <p className="text-[#647287] leading-relaxed">
              We reserve the right to modify this Refund Policy at any time. Changes will be effective upon posting 
              to our website with an updated &quot;Last Updated&quot; date. Material changes will be communicated via email. 
              The policy in effect at the time of your purchase governs your transaction.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">10. Contact Information</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              For refund requests, questions, or concerns about this policy, please contact us:
            </p>
            <div className="bg-[#f8f9fa] p-6 rounded-lg">
              <p className="text-[#111417] font-semibold mb-2">DummAir Customer Support</p>
              <p className="text-[#647287] mb-1">Email: <a href="mailto:support@dummair.com" className="text-[#2472e0] hover:text-[#1e5bb8]">support@dummair.com</a></p>
              <p className="text-[#647287] mb-1">Subject Line: Refund Request - Order #[your_order_number]</p>
              <p className="text-[#647287] mb-1">WhatsApp: <a href="https://wa.me/14099047084" className="text-[#2472e0] hover:text-[#1e5bb8]">+1 (409) 904-7084</a></p>
              <p className="text-[#647287] mb-1">Available: 24/7</p>
              <p className="text-[#647287]">Response Time: Within 24-48 hours</p>
            </div>
          </section>

          {/* Summary */}
          <section className="mb-12 bg-[#eff6ff] p-6 rounded-lg border border-[#2472e0]">
            <h2 className="text-2xl font-bold text-[#111417] mb-4">Summary</h2>
            <p className="text-[#647287] leading-relaxed mb-4">
              At DummAir, we stand behind our services with:
            </p>
            <ul className="list-disc pl-6 text-[#647287] space-y-2">
              <li><strong className="text-[#111417]">24-Hour Delivery Guarantee:</strong> Full refund if not delivered within 24 hours</li>
              <li><strong className="text-[#111417]">Quality Assurance:</strong> Refund for technical issues or invalid tickets</li>
              <li><strong className="text-[#111417]">Fair Policy:</strong> Clear refund conditions and transparent process</li>
              <li><strong className="text-[#111417]">Responsive Support:</strong> Quick response to all refund requests</li>
              <li><strong className="text-[#111417]">Customer First:</strong> We work to resolve issues fairly and promptly</li>
            </ul>
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

