'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CreditCard, 
  MessageCircle,
  Eye,
  RefreshCw,
  Calendar,
  Filter,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    successfulOrders: number;
    conversionRate: number;
    averageOrderValue: number;
    newUsers: number;
    returningUsers: number;
    refunds: number;
    refundAmount: number;
  };
  revenue: {
    total: number;
    stripe: number;
    flutterwave: number;
    byPeriod: Array<{
      date: string;
      total_revenue: number;
      total_orders: number;
    }>;
  };
  sessions: {
    total: number;
    byCountry: Record<string, number>;
    byDevice: Record<string, number>;
    newVsReturning: {
      new: number;
      returning: number;
    };
  };
  pageViews: {
    total: number;
    byPage: Record<string, number>;
  };
  conversions: {
    funnel: Array<{
      step: string;
      count: number;
      successRate: number;
    }>;
    totalAttempts: number;
    successRate: number;
  };
  whatsapp: {
    clicks: number;
  };
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export default function AnalyticsDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [period, user]);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Only allow specific email as admin
    if (user.email !== 'abiolayoung229@gmail.com') {
      router.push('/dashboard');
      return;
    }

    setUser(user);
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-[#2472e0] mx-auto mb-4" />
          <p className="text-[#647287]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="flex items-center gap-2 text-[#647287] hover:text-[#111417] transition-colors">
                  <ArrowLeft size={20} />
                  <span>Back to Admin</span>
                </Link>
                <Link href="/" className="text-2xl font-bold text-[#2472e0]">
                  DummAir Analytics
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
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Analytics</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-[#647287] hover:text-[#111417] transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Admin</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#111417]">Analytics Dashboard</h1>
                <p className="text-[#647287]">Comprehensive business insights and metrics</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Period Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-[#647287]" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as any)}
                  className="px-3 py-2 border border-[#dce0e5] rounded-lg focus:ring-2 focus:ring-[#2472e0] focus:border-transparent bg-white text-[#111417]"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
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
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#647287]">Total Revenue</p>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">{formatCurrency(data.overview.totalRevenue)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#647287]">Total Orders</p>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">{formatNumber(data.overview.totalOrders)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#647287]">Conversion Rate</p>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">{formatPercentage(data.overview.conversionRate)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#647287]">Average Order Value</p>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-[#111417]">{formatCurrency(data.overview.averageOrderValue)}</p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#111417] mb-4">Revenue by Provider</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-[#647287]">Stripe</span>
                </div>
                <span className="font-semibold text-[#111417]">{formatCurrency(data.revenue.stripe)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-[#647287]">Flutterwave</span>
                </div>
                <span className="font-semibold text-[#111417]">{formatCurrency(data.revenue.flutterwave)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#111417] mb-4">User Analytics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-[#647287]">New Users</span>
                </div>
                <span className="font-semibold text-[#111417]">{formatNumber(data.sessions.newVsReturning.new)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-[#647287]">Returning Users</span>
                </div>
                <span className="font-semibold text-[#111417]">{formatNumber(data.sessions.newVsReturning.returning)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span className="text-[#647287]">Total Page Views</span>
                </div>
                <span className="font-semibold text-[#111417]">{formatNumber(data.pageViews.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-[#111417] mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {data.conversions.funnel.map((step, index) => (
              <div key={step.step} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#2472e0] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-[#111417] capitalize">{step.step.replace('_', ' ')}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-[#111417]">{formatNumber(step.count)}</div>
                  <div className="text-sm text-[#647287]">{formatPercentage(step.successRate)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Country Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#111417] mb-4">Sessions by Device</h3>
            <div className="space-y-3">
              {Object.entries(data.sessions.byDevice).map(([device, count]) => (
                <div key={device} className="flex justify-between items-center">
                  <span className="text-[#647287] capitalize">{device}</span>
                  <span className="font-semibold text-[#111417]">{formatNumber(count)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#111417] mb-4">Top Pages</h3>
            <div className="space-y-3">
              {Object.entries(data.pageViews.byPage)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([page, count]) => (
                  <div key={page} className="flex justify-between items-center">
                    <span className="text-[#647287] text-sm truncate">{page}</span>
                    <span className="font-semibold text-[#111417]">{formatNumber(count)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* WhatsApp Analytics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#111417] mb-4">WhatsApp Analytics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span className="text-[#647287]">WhatsApp Clicks</span>
              </div>
              <span className="font-semibold text-[#111417]">{formatNumber(data.whatsapp.clicks)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-orange-500" />
                <span className="text-[#647287]">Refunds</span>
              </div>
              <span className="font-semibold text-[#111417]">{formatNumber(data.overview.refunds)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-red-500" />
                <span className="text-[#647287]">Refund Amount</span>
              </div>
              <span className="font-semibold text-[#111417]">{formatCurrency(data.overview.refundAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
