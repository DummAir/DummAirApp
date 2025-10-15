'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passengerEmail, setPassengerEmail] = useState<string>('');
  
  const orderId = searchParams.get('orderId');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const provider = searchParams.get('provider') || 'stripe';

  useEffect(() => {
    checkAuthentication();
    updateOrderStatus();
    fetchOrderEmail();
    fetchOrderNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrderNumber = async () => {
    // First try to get from URL
    const urlOrderNumber = searchParams.get('orderNumber');
    if (urlOrderNumber) {
      setOrderNumber(urlOrderNumber);
      return;
    }

    // If not in URL, fetch from database using orderId
    if (orderId) {
      try {
        const { data } = await supabase
          .from('orders')
          .select('order_number')
          .eq('id', orderId)
          .single();

        if (data) {
          setOrderNumber(data.order_number);
        }
      } catch (error) {
        console.error('Error fetching order number:', error);
      }
    }
  };

  const fetchOrderEmail = async () => {
    if (orderId) {
      try {
        const { data } = await supabase
          .from('passengers')
          .select('email')
          .eq('order_id', orderId)
          .order('passenger_number', { ascending: true })
          .limit(1)
          .single();

        if (data) {
          setPassengerEmail(data.email);
        }
      } catch (error) {
        console.error('Error fetching order email:', error);
      }
    }
  };

  const updateOrderStatus = async () => {
    if (!orderId) return;

    try {
      // First check if order is already paid to prevent duplicate emails
      console.log('🔍 Checking order status before sending emails...');
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('status, order_number')
        .eq('id', orderId)
        .single();

      if (orderError) {
        console.error('❌ Failed to fetch order:', orderError);
        return;
      }

      if (orderData.status === 'paid' || orderData.status === 'completed') {
        console.log('ℹ️ Order already marked as paid. Skipping webhook to prevent duplicate emails.');
        console.log('   Current status:', orderData.status);
        return;
      }

      console.log('🔄 Order status is:', orderData.status);
      console.log('🔄 Calling payment-success webhook...');
      console.log('   Order ID:', orderId);
      console.log('   Provider:', provider);
      
      const response = await fetch('/api/webhooks/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          provider,
          status: 'paid',
        }),
      });

      const data = await response.json();
      
      console.log('✅ Webhook response:', response.status, data);
      
      if (!response.ok) {
        console.error('❌ Webhook failed:', data);
      } else {
        console.log('✅ Order status updated to paid');
        console.log('✅ Confirmation emails sent (client + admin)!');
      }
    } catch (error) {
      console.error('❌ Failed to update order status:', error);
    }
  };

  const checkAuthentication = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const handleHomeClick = () => {
    window.location.href = isAuthenticated ? '/dashboard' : '/';
  };

  const handleWhatsAppClick = () => {
    const supportNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+14099047084';
    const message = encodeURIComponent(`Hi! I just booked a ticket (order ${orderNumber || 'DUM-xxxx'})`);
    window.open(`https://wa.me/${supportNumber}?text=${message}`, '_blank');
  };

  const handleResendEmail = async () => {
    setIsResendingEmail(true);
    try {
      const response = await fetch('/api/resend-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          email: passengerEmail,
        }),
      });

      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Resend email error:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleHomeClick}
            className="text-[#647287] hover:text-[#111417] transition-colors flex items-center gap-2"
            title={isAuthenticated ? 'Go to Dashboard' : 'Go to Home'}
          >
            <Home size={20} />
            <span className="text-sm font-medium">{isAuthenticated ? 'Dashboard' : 'Home'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 animate-bounce-slow">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111417] mb-3">
            Payment Successful!
          </h1>
          <p className="text-lg text-[#647287] max-w-2xl mx-auto">
            Your dummy ticket is being processed and will be delivered within 1 hour.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Order Number */}
            <div>
              <p className="text-sm text-[#647287] mb-1">Order Number</p>
              <p className="text-2xl font-bold text-[#111417] font-mono">
                {orderNumber || 'Loading...'}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-[#647287] mb-1">Ticket will be sent to</p>
              <p className="text-lg font-semibold text-[#111417] break-all">
                {passengerEmail || 'Loading...'}
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-[#111417]">
              <strong>What&apos;s next?</strong> Check your email inbox (and spam folder) for your dummy flight ticket. 
              The ticket will arrive within 1 hour and is valid for visa applications and travel documentation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleResendEmail}
            disabled={isResendingEmail}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
              isResendingEmail
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#111417] border-2 border-[#dce0e5] hover:border-[#2472e0] hover:bg-gray-50'
            }`}
          >
            <Mail size={20} />
            {isResendingEmail ? 'Sending...' : 'Resend Email'}
          </button>

          <button
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
          >
            <MessageCircle size={20} />
            Contact Support
          </button>
        </div>

        {/* Next Steps */}
        {isAuthenticated && (
          <div className="text-center">
            <button
              onClick={handleHomeClick}
              className="inline-flex items-center gap-2 text-[#2472e0] hover:text-[#1e5bb8] font-semibold transition-colors"
            >
              View My Orders
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2472e0]"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
