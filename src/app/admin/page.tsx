'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Package, Users, DollarSign, TrendingUp, LogOut, Search, BarChart3, Filter } from 'lucide-react';
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
  payment_amount: number | null;
  guest_email: string;
  paid_at?: string | null;
  completed_at?: string | null;
  status_updated_at?: string | null;
}

type RevenuePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState<RevenuePeriod>('weekly');

  useEffect(() => {
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPeriodStart = (period: RevenuePeriod) => {
    const now = new Date();
    switch (period) {
      case 'daily': {
        const start = new Date(now);
        start.setDate(now.getDate() - 1);
        return start;
      }
      case 'weekly': {
        const start = new Date(now);
        start.setDate(now.getDate() - 7);
        return start;
      }
      case 'monthly': {
        const start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        return start;
      }
      case 'yearly': {
        const start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
        return start;
      }
      default:
        return now;
    }
  };

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    console.log('Checking admin access for:', user.email);

    // Only allow specific email as admin
    if (user.email !== 'abiolayoung229@gmail.com') {
      console.log('❌ Not admin, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }

    console.log('✅ Admin access granted');
    setUser(user);
    fetchOrders();
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .neq('status', 'pending_payment')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const sanitizedOrders = (data || []).map(order => ({
        ...order,
        payment_amount: order.payment_amount !== null ? Number(order.payment_amount) : null,
      }));

      setOrders(sanitizedOrders);
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

  const periodStart = useMemo(() => getPeriodStart(selectedPeriod), [selectedPeriod]);

  const ordersWithinPeriod = useMemo(() => {
    return orders.filter(order => {
      const relevantDate = order.paid_at || order.completed_at || order.status_updated_at || order.created_at;
      return new Date(relevantDate) >= periodStart;
    });
  }, [orders, periodStart]);

  const summary = useMemo(() => {
    const paidOrders = ordersWithinPeriod.filter(order =>
      ['paid', 'processing', 'completed'].includes(order.status)
    );
    const completedOrders = ordersWithinPeriod.filter(order => order.status === 'completed');

    const periodRevenue = paidOrders.reduce(
      (sum, order) => sum + (Number(order.payment_amount) || 0),
      0
    );

    return {
      periodOrders: ordersWithinPeriod.length,
      periodRevenue,
      paidOrders: paidOrders.length,
      completedOrders: completedOrders.length,
    };
  }, [ordersWithinPeriod]);

  const filteredOrders = ordersWithinPeriod.filter(order => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const periodLabels: Record<RevenuePeriod, string> = {
    daily: 'Last 24 hours',
    weekly: 'Last 7 days',
    monthly: 'Last 30 days',
    yearly: 'Last 365 days',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-2xl font-bold text-[#2472e0]">
                DummAir Admin
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#647287]">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[#647287] hover:text-[#111417] transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/admin/analytics"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2472e0] text-white rounded-lg hover:bg-[#1e5bb8] transition-colors"
          >
            <BarChart3 size={20} />
            <span>View Analytics Dashboard</span>
          </Link>
        </div>

        {/* Period Filter */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f1ff] text-[#1e5bb8]">
                <Filter size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111417]">Dashboard Period Filter</p>
                <p className="text-xs text-[#647287]">
                  Adjusts revenue, paid, and completed order insights for the selected timeframe.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className="text-xs uppercase tracking-wide text-[#94a3b8] sm:text-right">View data for</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as RevenuePeriod)}
                className="w-full sm:w-52 px-3 py-2 border border-[#dce0e5] rounded-lg text-sm text-[#111417] focus:outline-none focus:ring-2 focus:ring-[#2472e0] bg-white"
              >
                <option value="daily">Daily (last 24 hrs)</option>
                <option value="weekly">Weekly (last 7 days)</option>
                <option value="monthly">Monthly (last 30 days)</option>
                <option value="yearly">Yearly (last 365 days)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#647287]">Orders ({periodLabels[selectedPeriod]})</p>
              <Package size={20} className="text-[#2472e0]" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">{summary.periodOrders}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#647287]">Revenue ({periodLabels[selectedPeriod]})</p>
              <DollarSign size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">
              {formatCurrency(summary.periodRevenue)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#647287]">Paid Orders ({periodLabels[selectedPeriod]})</p>
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">{summary.paidOrders}</p>
            <p className="text-xs text-[#94a3b8] mt-1">Includes paid, processing & completed statuses</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#647287]">Completed Orders ({periodLabels[selectedPeriod]})</p>
              <Users size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">{summary.completedOrders}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[#111417]">All Orders</h2>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#647287]" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border border-[#dce0e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2472e0]"
                />
              </div>

              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-[#dce0e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2472e0] text-[#111417] bg-white"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-[#dce0e5] mb-4" />
              <p className="text-[#647287]">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#dce0e5]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#647287]">Order #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#647287]">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#647287]">Route</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#647287]">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#647287]">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#647287]">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#647287]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#f0f2f4] hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm text-[#111417] font-semibold">{order.order_number}</td>
                      <td className="py-3 px-4 text-sm text-[#111417]">{order.guest_email}</td>
                      <td className="py-3 px-4 text-sm text-[#111417] font-medium">{order.flight_from} → {order.flight_to}</td>
                      <td className="py-3 px-4 text-sm font-bold text-[#111417]">
                        {formatCurrency(Number(order.payment_amount || 0))}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(order.status)}`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#111417]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-[#2472e0] hover:underline text-sm font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusStyles(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
    case 'paid':
      return 'bg-blue-100 text-blue-800';
    case 'failed':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
