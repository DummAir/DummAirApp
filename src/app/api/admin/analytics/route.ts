import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' | 'yearly' || 'daily';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabase = await createServiceClient();

    // Get date range
    const now = new Date();
    let start: string, end: string;

    if (startDate && endDate) {
      start = startDate;
      end = endDate;
    } else {
      switch (period) {
        case 'daily':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          end = now.toISOString();
          break;
        case 'weekly':
          start = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000).toISOString();
          end = now.toISOString();
          break;
        case 'monthly':
          start = new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString();
          end = now.toISOString();
          break;
        case 'yearly':
          start = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString();
          end = now.toISOString();
          break;
        default:
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          end = now.toISOString();
      }
    }

    // Get revenue data
    const { data: revenueData } = await supabase
      .from('analytics_revenue')
      .select('*')
      .eq('period_type', period)
      .gte('date', start.split('T')[0])
      .lte('date', end.split('T')[0])
      .order('date', { ascending: true });

    // Get session analytics
    const { data: sessionData } = await supabase
      .from('analytics_sessions')
      .select('*')
      .gte('started_at', start)
      .lte('started_at', end);

    // Get page view analytics
    const { data: pageViewData } = await supabase
      .from('analytics_pageviews')
      .select('*')
      .gte('timestamp', start)
      .lte('timestamp', end);

    // Get conversion funnel data
    const { data: conversionData } = await supabase
      .from('analytics_conversions')
      .select('*')
      .gte('timestamp', start)
      .lte('timestamp', end);

    // Get orders data
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', start)
      .lte('created_at', end);

    // Get WhatsApp events
    const { data: whatsappEvents } = await supabase
      .from('analytics_whatsapp_events')
      .select('*')
      .gte('timestamp', start)
      .lte('timestamp', end);

    // Calculate metrics
    const relevantOrders = (ordersData || []).filter(order => order.status !== 'pending_payment');
    const totalRevenue = revenueData?.reduce((sum, item) => sum + Number(item.total_revenue), 0) || 0;
    const totalOrders = relevantOrders.length;
    const successfulOrders = relevantOrders.filter(order =>
      ['paid', 'processing', 'completed'].includes(order.status)
    ).length || 0;
    const conversionRate = totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;
    const averageOrderValue = successfulOrders > 0 ? totalRevenue / successfulOrders : 0;

    // Page views by page
    const pageViewsByPage = pageViewData?.reduce((acc: Record<string, number>, view) => {
      acc[view.page_path] = (acc[view.page_path] || 0) + 1;
      return acc;
    }, {}) || {};

    // Sessions by country
    const sessionsByCountry = sessionData?.reduce((acc: Record<string, number>, session) => {
      if (session.country) {
        acc[session.country] = (acc[session.country] || 0) + 1;
      }
      return acc;
    }, {}) || {};

    // Sessions by device
    const sessionsByDevice = sessionData?.reduce((acc: Record<string, number>, session) => {
      if (session.device_type) {
        acc[session.device_type] = (acc[session.device_type] || 0) + 1;
      }
      return acc;
    }, {}) || {};

    // New vs returning users
    const newUsers = sessionData?.filter(session => session.is_new_user).length || 0;
    const returningUsers = sessionData?.filter(session => !session.is_new_user).length || 0;

    // Conversion funnel
    const funnelSteps = ['landing', 'checkout_start', 'payment_attempt', 'payment_success'];
    const funnelData = funnelSteps.map(step => {
      const stepData = conversionData?.filter(conv => conv.funnel_step === step) || [];
      return {
        step,
        count: stepData.length,
        successRate: stepData.length > 0 ? (stepData.filter(c => c.success).length / stepData.length) * 100 : 0
      };
    });

    // Revenue by provider
    const stripeRevenue = relevantOrders
      .filter(order =>
        order.payment_provider === 'stripe' &&
        ['paid', 'processing', 'completed'].includes(order.status)
      )
      .reduce((sum, order) => sum + Number(order.payment_amount), 0) || 0;
    const flutterwaveRevenue = relevantOrders
      .filter(order =>
        order.payment_provider === 'flutterwave' &&
        ['paid', 'processing', 'completed'].includes(order.status)
      )
      .reduce((sum, order) => sum + Number(order.payment_amount), 0) || 0;

    // WhatsApp metrics
    const whatsappClicks = whatsappEvents?.filter(event => event.event_type === 'click').length || 0;

    // Refunds
    const refunds = relevantOrders?.filter(order => order.status === 'refunded').length || 0;
    const refundAmount = relevantOrders?.filter(order => order.status === 'refunded')
      .reduce((sum, order) => sum + Number(order.payment_amount), 0) || 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          totalOrders,
          successfulOrders,
          conversionRate: Math.round(conversionRate * 100) / 100,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
          newUsers,
          returningUsers,
          refunds,
          refundAmount,
        },
        revenue: {
          total: totalRevenue,
          stripe: stripeRevenue,
          flutterwave: flutterwaveRevenue,
          byPeriod: revenueData || [],
        },
        sessions: {
          total: sessionData?.length || 0,
          byCountry: sessionsByCountry,
          byDevice: sessionsByDevice,
          newVsReturning: {
            new: newUsers,
            returning: returningUsers,
          },
        },
        pageViews: {
          total: pageViewData?.length || 0,
          byPage: pageViewsByPage,
        },
        conversions: {
          funnel: funnelData,
          totalAttempts: conversionData?.length || 0,
          successRate: conversionData && conversionData.length > 0 ? 
            (conversionData.filter(c => c.success).length / conversionData.length) * 100 : 0,
        },
        whatsapp: {
          clicks: whatsappClicks,
        },
        period,
        dateRange: {
          start,
          end,
        },
      },
    });

  } catch (error: unknown) {
    console.error('Analytics API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
