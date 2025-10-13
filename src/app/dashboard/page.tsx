'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Package, LogOut, User, CheckCircle, Clock, Download, CreditCard, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  order_number: string;
  status: string;
  flight_from: string;
  flight_to: string;
  flight_type: string;
  created_at: string;
  number_of_travelers: number;
  ticket_url?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setUser(user);
    fetchOrders(user.id);
  };

  const fetchOrders = async (userId: string) => {
    try {
      console.log('📊 Dashboard: Fetching orders for user:', userId);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Dashboard: Error fetching orders:', error);
        throw error;
      }
      
      console.log('📦 Dashboard: Orders found:', data?.length || 0);
      console.log('📦 Dashboard: Order IDs:', data?.map(o => o.id) || []);
      console.log('📦 Dashboard: Order Numbers:', data?.map(o => o.order_number) || []);
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleRetryPayment = (order: Order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const processRetryPayment = async (provider: 'stripe' | 'flutterwave') => {
    if (!selectedOrder) return;

    setIsProcessingPayment(true);
    try {
      const response = await fetch('/api/retry-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          provider,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to retry payment');
      }

      if (data.payment_url) {
        // Redirect to payment gateway
        window.location.href = data.payment_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Retry payment error:', error);
      alert(error instanceof Error ? error.message : 'Failed to retry payment. Please try again.');
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending_payment':
        return <Clock size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2472e0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex justify-between items-center gap-2">
            {/* Logo */}
            <Link href="/" className="text-lg md:text-2xl font-bold text-[#2472e0] flex-shrink-0">
              DummAir
            </Link>
            
            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href="/tickets"
                className="px-2 py-1.5 md:px-4 md:py-2 bg-[#2472e0] text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-[#1e5bb8] transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:inline">My </span>Tickets
              </Link>
              <Link
                href="/book"
                className="px-2 py-1.5 md:px-4 md:py-2 border border-[#2472e0] text-[#2472e0] rounded-lg text-xs md:text-sm font-semibold hover:bg-[#f0f2f4] transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:inline">Book </span>Flight
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 md:gap-2 text-[#647287] hover:text-[#111417] transition-colors p-1.5 md:p-2"
              >
                <LogOut size={18} className="md:w-5 md:h-5" />
                <span className="hidden lg:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#2472e0] to-[#1e5bb8] rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <p className="text-white/80">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#111417]">Your Orders</h2>
            <button
              onClick={() => user && fetchOrders(user.id)}
              className="text-sm text-[#2472e0] hover:underline font-semibold"
            >
              Refresh
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <p className="text-[#647287]">
              You have {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </p>
            <Link
              href="/tickets"
              className="text-[#2472e0] font-semibold hover:underline"
            >
              View All Tickets →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-[#dce0e5] mb-4" />
              <h3 className="text-xl font-semibold text-[#111417] mb-2">No orders yet</h3>
              <p className="text-[#647287] mb-6">Start by booking your first dummy ticket</p>
              <Link
                href="/book"
                className="inline-block bg-[#2472e0] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e5bb8] transition-colors"
              >
                Book Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-[#dce0e5] rounded-xl p-6 hover:border-[#2472e0] transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-[#647287]">Order Number</p>
                      <p className="text-lg font-bold text-[#111417]">{order.order_number}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#647287]">Route</p>
                      <p className="font-semibold text-[#111417]">
                        {order.flight_from} → {order.flight_to}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#647287]">Type</p>
                      <p className="font-semibold text-[#111417] capitalize">
                        {order.flight_type.replace('-', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#647287]">Travelers</p>
                      <p className="font-semibold text-[#111417]">
                        {order.number_of_travelers}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#647287]">Date</p>
                      <p className="font-semibold text-[#111417]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.status === 'completed' && order.ticket_url && (
                    <div className="mt-4 pt-4 border-t border-[#dce0e5]">
                      <a
                        href={order.ticket_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                      >
                        <Download size={18} />
                        Download Ticket
                      </a>
                    </div>
                  )}
                  
                  {/* Retry Payment Button for Pending Orders */}
                  {order.status === 'pending_payment' && (
                    <div className="mt-4 pt-4 border-t border-[#dce0e5]">
                      <button
                        onClick={() => handleRetryPayment(order)}
                        className="w-full flex items-center justify-center gap-2 bg-[#2472e0] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#1e5bb8] transition-all transform hover:scale-105"
                      >
                        <CreditCard size={18} />
                        Complete Payment
                      </button>
                      <p className="text-xs text-[#647287] text-center mt-2">
                        Click to retry payment for this order
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Provider Selection Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#111417] mb-2">
              Complete Payment
            </h3>
            <p className="text-[#647287] mb-6">
              Order: <span className="font-semibold text-[#111417]">{selectedOrder.order_number}</span>
            </p>

            <p className="text-sm text-[#647287] mb-4">
              Select your preferred payment method to complete this order:
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => processRetryPayment('stripe')}
                disabled={isProcessingPayment}
                className="w-full flex items-center justify-between p-4 border-2 border-[#dce0e5] rounded-xl hover:border-[#2472e0] hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-[#2472e0]" size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#111417]">Stripe</p>
                    <p className="text-xs text-[#647287]">Credit/Debit Card</p>
                  </div>
                </div>
                {isProcessingPayment && <RefreshCw className="animate-spin" size={20} />}
              </button>

              <button
                onClick={() => processRetryPayment('flutterwave')}
                disabled={isProcessingPayment}
                className="w-full flex items-center justify-between p-4 border-2 border-[#dce0e5] rounded-xl hover:border-[#2472e0] hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-orange-600" size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#111417]">Flutterwave</p>
                    <p className="text-xs text-[#647287]">Multiple payment options</p>
                  </div>
                </div>
                {isProcessingPayment && <RefreshCw className="animate-spin" size={20} />}
              </button>
            </div>

            <button
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedOrder(null);
              }}
              disabled={isProcessingPayment}
              className="w-full px-4 py-2 border border-[#dce0e5] text-[#647287] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

