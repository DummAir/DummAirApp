'use client';

import { useSearchParams } from 'next/navigation';
import { XCircle, Home, ArrowLeft } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const orderId = searchParams.get('orderId');
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    checkAuthentication();
    fetchOrderNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrderNumber = async () => {
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

  const checkAuthentication = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const handleRetryPayment = () => {
    if (orderId) {
      router.push(`/dashboard`);
    } else {
      router.push('/book');
    }
  };

  const handleGoHome = () => {
    router.push(isAuthenticated ? '/dashboard' : '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleGoHome}
            className="text-[#647287] hover:text-[#111417] transition-colors flex items-center gap-2"
          >
            <Home size={20} />
            <span className="text-sm font-medium">{isAuthenticated ? 'Dashboard' : 'Home'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-6">
            <XCircle size={48} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111417] mb-3">
            Payment Cancelled
          </h1>
          <p className="text-lg text-[#647287] max-w-2xl mx-auto">
            Your payment was not completed. Your order is still pending.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {orderNumber && (
            <div className="mb-6">
              <p className="text-sm text-[#647287] mb-1">Order Number</p>
              <p className="text-2xl font-bold text-[#111417] font-mono">
                {orderNumber}
              </p>
            </div>
          )}

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-6">
            <p className="text-sm text-[#111417]">
              <strong>What happened?</strong> Your payment was cancelled or declined. 
              Your order has been saved and is marked as &quot;Pending Payment&quot;.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-[#111417]">
              <strong>What&apos;s next?</strong> You can retry the payment from your dashboard, 
              or contact support if you need help completing your order.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleRetryPayment}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-[#2472e0] text-white rounded-xl font-semibold hover:bg-[#1e5bb8] transition-all"
          >
            <ArrowLeft size={20} />
            {isAuthenticated ? 'Go to Dashboard' : 'Try Again'}
          </button>

          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-[#111417] border-2 border-[#dce0e5] rounded-xl font-semibold hover:border-[#2472e0] hover:bg-gray-50 transition-all"
          >
            <Home size={20} />
            {isAuthenticated ? 'Dashboard' : 'Home'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    }>
      <PaymentCancelledContent />
    </Suspense>
  );
}

