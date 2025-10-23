'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Package, Users, DollarSign, TrendingUp, LogOut, Search, BarChart3 } from 'lucide-react';
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
  payment_amount: number;
  guest_email: string;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      
      // Calculate stats
      const totalOrders = data?.length || 0;
      const totalRevenue = data?.reduce((sum, order) => sum + (order.payment_amount || 0), 0) || 0;
      const pendingOrders = data?.filter(o => o.status === 'pending_payment').length || 0;
      const completedOrders = data?.filter(o => o.status === 'completed').length || 0;

      setStats({
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
      });
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.guest_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#647287]">Total Orders</p>
              <Package size={20} className="text-[#2472e0]" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">{stats.totalOrders}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#647287]">Total Revenue</p>
              <DollarSign size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">${stats.totalRevenue}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#647287]">Pending</p>
              <TrendingUp size={20} className="text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">{stats.pendingOrders}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#647287]">Completed</p>
              <Users size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">{stats.completedOrders}</p>
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
                className="px-4 py-2 border border-[#dce0e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2472e0]"
              >
                <option value="all">All Status</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="paid">Paid</option>
                <option value="completed">Completed</option>
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
                      <td className="py-3 px-4 text-sm font-bold text-[#111417]">${order.payment_amount || 0}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'paid' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'paid' ? 'pending' : order.status.replace('_', ' ')}
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
