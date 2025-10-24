'use client';

import { useState, useEffect, useRef } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PaymentPage() {
  const { state } = useBooking();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitiatedPayment = useRef(false);

  const selectedProvider = state.selectedPaymentProvider || 'stripe';

  console.log('PaymentPage loaded with provider:', selectedProvider);

  useEffect(() => {
    // Auto-initiate payment when page loads (only once using ref!)
    if (!hasInitiatedPayment.current && !isProcessing && !error) {
      hasInitiatedPayment.current = true;
      handlePayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const numberOfTravelers = state.flightDetails?.numberOfTravelers || 1;
      // 20% OFF Launch Promo: One-way $20 (was $25), Round-trip $36 (was $45)
      const basePrice = state.flightType === 'one-way' ? 20 : 36;
      const totalAmount = basePrice * numberOfTravelers;

      const firstPassenger = state.passengerDetails[0];
      if (!firstPassenger) {
        throw new Error('No passenger details found');
      }

      // Get current user ID
      const { data: sessionData } = await supabase.auth.getUser();
      const currentUserId = sessionData?.user?.id ?? null;
      
      console.log('🔑 Current User ID:', currentUserId);
      console.log('📧 User Email:', sessionData?.user?.email);

      // Track payment attempt
      if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).analytics) {
        const analytics = (window as unknown as Record<string, unknown>).analytics as Record<string, unknown>;
        if (typeof analytics.trackConversion === 'function') {
          (analytics.trackConversion as (step: string, order: number, provider?: string, amount?: number, success?: boolean, orderId?: string) => void)('payment_attempt', 3, selectedProvider, totalAmount, false);
        }
      }
      
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flight: state.flightDetails,
          passengers: state.passengerDetails,
          flightType: state.flightType,
          userId: currentUserId,
        }),
        credentials: 'same-origin',
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('❌ Order creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderData = await orderResponse.json();
      console.log('✅ Order created:', orderData);

      // Initialize payment with selected provider
      const flightDetailsText = `${state.flightDetails?.from} to ${state.flightDetails?.to} - ${state.flightType}`;
      
      console.log('Sending payment request with provider:', selectedProvider);
      console.log('Payment details:', {
        orderId: orderData.orderId,
        provider: selectedProvider,
        amount: totalAmount,
        customerEmail: firstPassenger.email,
      });
      
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          provider: selectedProvider,
          amount: totalAmount,
          customerEmail: firstPassenger.email,
          customerName: firstPassenger.name,
          customerPhone: firstPassenger.phone ? `${firstPassenger.phoneCountryCode || ''}${firstPassenger.phone}` : undefined,
          flightDetails: flightDetailsText,
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        console.error('Payment API error:', errorData);
        throw new Error(errorData.error || 'Failed to initialize payment');
      }

      const paymentData = await paymentResponse.json();
      console.log('✅ Payment response received:', paymentData);

      if (paymentData.payment_url) {
        console.log('🚀 Redirecting to payment gateway...');
        // Redirect immediately - don't update any state
        window.location.href = paymentData.payment_url;
        // Keep processing state true to prevent any error rendering
        return;
      } else {
        console.error('❌ No payment URL in response:', paymentData);
        throw new Error('Payment gateway did not return a URL');
      }
    } catch (error) {
      const err = error as Error;
      console.error('❌ Payment initialization error:', err.message);
      setError(err.message || 'Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const getTotalPrice = () => {
    const numberOfTravelers = state.flightDetails?.numberOfTravelers || 1;
    // 20% OFF Launch Promo: One-way $20 (was $25), Round-trip $36 (was $45)
    const basePrice = state.flightType === 'one-way' ? 20 : 36;
    return basePrice * numberOfTravelers;
  };

  const getProviderName = () => {
    switch(selectedProvider) {
      case 'stripe': return 'Stripe';
      case 'flutterwave': return 'Flutterwave';
      default: return 'Payment Gateway';
    }
  };

  // Don't show error during initial processing, only if redirect fails
  if (error && !isProcessing) {
    return (
      <div className="relative flex h-screen w-full flex-col bg-white justify-center items-center p-8">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-900 mb-4">
            Payment Error
          </h1>
          <p className="text-red-700 mb-6">
            {error}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#2472e0] text-white rounded-lg font-semibold hover:bg-[#1e5bb8] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] justify-center items-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl text-center">
        <div className="mb-6">
          <Loader2 size={64} className="text-[#2472e0] animate-spin mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold text-[#111417] mb-4">
          Redirecting to {getProviderName()}...
        </h1>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#647287]">Flight Type:</span>
            <span className="text-[#111417] font-medium">
              {state.flightType === 'one-way' ? 'One Way' : 'Round Trip'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-[#647287]">Route:</span>
            <span className="text-[#111417] font-medium">
              {state.flightDetails?.from} → {state.flightDetails?.to}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-[#647287]">Passengers:</span>
            <span className="text-[#111417] font-medium">
              {state.passengerDetails.length} {state.passengerDetails.length === 1 ? 'Traveler' : 'Travelers'}
            </span>
          </div>
          
          <hr className="border-[#f0f2f4]" />
          
          <div className="flex justify-between text-lg font-bold">
            <span className="text-[#111417]">Total:</span>
            <span className="text-[#2472e0]">${getTotalPrice()}</span>
          </div>
        </div>

        <p className="text-xs text-[#647287]">
          Please wait while we redirect you to the secure payment page...
        </p>

        <div className="mt-6 pt-6 border-t border-[#dce0e5]">
          <p className="text-xs text-[#647287]">
            🔒 Your payment is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
