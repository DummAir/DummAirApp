'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Package, LogOut, ArrowLeft, Filter, Download, Calendar } from 'lucide-react';
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
  flight_depart_date: string;
  flight_return_date?: string;
  payment_amount: number;
  ticket_url?: string;
}

export default function TicketsPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, orders]);

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
      console.log('🎫 Fetching orders for user:', userId);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching orders:', error);
        throw error;
      }
      
      console.log('📦 Orders found:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('✅ First order:', {
          id: data[0].id,
          orderNumber: data[0].order_number,
          userId: data[0].user_id,
        });
      }
      
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="bg-gradient-to-r from-[#2472e0] to-[#1e5bb8] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-white hover:opacity-80 transition-opacity">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">My Tickets</h1>
                <p className="text-white/80 text-sm">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-[#647287]" />
              <span className="text-sm font-semibold text-[#111417]">Filter by status:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-[#2472e0] text-white'
                    : 'bg-white border border-[#dce0e5] text-[#647287] hover:border-[#2472e0]'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-green-500 text-white'
                    : 'bg-white border border-[#dce0e5] text-[#647287] hover:border-green-500'
                }`}
              >
                Completed ({orders.filter(o => o.status === 'completed').length})
              </button>
              <button
                onClick={() => setStatusFilter('paid')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  statusFilter === 'paid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-[#dce0e5] text-[#647287] hover:border-blue-500'
                }`}
              >
                Paid ({orders.filter(o => o.status === 'paid').length})
              </button>
              <button
                onClick={() => setStatusFilter('pending_payment')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  statusFilter === 'pending_payment'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white border border-[#dce0e5] text-[#647287] hover:border-yellow-500'
                }`}
              >
                Pending ({orders.filter(o => o.status === 'pending_payment').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#f0f2f4] rounded-full mb-6">
              <Package size={40} className="text-[#647287]" />
            </div>
            <h3 className="text-2xl font-bold text-[#111417] mb-2">
              {statusFilter === 'all' ? 'No tickets yet' : `No ${statusFilter.replace('_', ' ')} tickets`}
            </h3>
            <p className="text-[#647287] mb-6">
              {statusFilter === 'all' 
                ? "Start by booking your first dummy ticket" 
                : `You don't have any ${statusFilter.replace('_', ' ')} tickets`}
            </p>
            {statusFilter === 'all' && (
              <Link
                href="/book"
                className="inline-block bg-[#2472e0] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e5bb8] transition-colors"
              >
                Book Now
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-[#dce0e5] hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-[#2472e0] to-[#1e5bb8] p-4 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white/70 text-xs">Order Number</p>
                      <p className="font-mono font-bold text-sm">{order.order_number}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)} bg-white`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-[#647287]">Route</p>
                    <p className="font-bold text-[#111417] text-lg">
                      {order.flight_from} → {order.flight_to}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-[#647287]">Type</p>
                      <p className="font-semibold text-[#111417] capitalize">
                        {order.flight_type.replace('-', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#647287]">Travelers</p>
                      <p className="font-semibold text-[#111417]">
                        {order.number_of_travelers}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#647287] mb-1">Travel Date</p>
                    <p className="text-sm font-semibold text-[#111417]">
                      {new Date(order.flight_depart_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#f0f2f4] flex justify-between items-center">
                    <div>
                      <p className="text-xs text-[#647287]">Amount</p>
                      <p className="text-lg font-bold text-[#2472e0]">${order.payment_amount || 0}</p>
                    </div>
                    {order.status === 'completed' && order.ticket_url ? (
                      <a
                        href={order.ticket_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                      >
                        <Download size={16} />
                        Download
                      </a>
                    ) : order.status === 'completed' ? (
                      <span className="text-xs text-[#647287]">Ticket pending</span>
                    ) : null}
                  </div>

                  <div className="text-xs text-[#647287] pt-2">
                    <Calendar size={12} className="inline mr-1" />
                    Booked {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

