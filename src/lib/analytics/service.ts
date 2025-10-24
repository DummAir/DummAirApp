import { createServiceClient } from '@/lib/supabase/server';

export interface SessionData {
  sessionId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  isNewUser?: boolean;
}

export interface PageViewData {
  sessionId: string;
  userId?: string;
  pagePath: string;
  pageTitle?: string;
  referrer?: string;
  duration?: number;
}

export interface EventData {
  sessionId: string;
  userId?: string;
  eventType: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
  eventValue?: number;
  properties?: Record<string, unknown>;
}

export interface ConversionData {
  sessionId: string;
  userId?: string;
  orderId?: string;
  funnelStep: string;
  stepOrder: number;
  provider?: string;
  amount?: number;
  currency?: string;
  success?: boolean;
  errorMessage?: string;
}

export interface WhatsAppEventData {
  sessionId: string;
  userId?: string;
  orderId?: string;
  eventType: string;
  phoneNumber?: string;
  messageType?: string;
}

class AnalyticsService {
  private supabase = createServiceClient();

  // Session tracking
  async trackSession(data: SessionData): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('analytics_sessions')
        .upsert({
          session_id: data.sessionId,
          user_id: data.userId,
          ip_address: data.ipAddress,
          user_agent: data.userAgent,
          country: data.country,
          city: data.city,
          device_type: data.deviceType,
          browser: data.browser,
          os: data.os,
          referrer: data.referrer,
          utm_source: data.utmSource,
          utm_medium: data.utmMedium,
          utm_campaign: data.utmCampaign,
          is_new_user: data.isNewUser,
        }, {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('Analytics: Failed to track session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Analytics: Session tracking error:', error);
      return false;
    }
  }

  // Page view tracking
  async trackPageView(data: PageViewData): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('analytics_pageviews')
        .insert({
          session_id: data.sessionId,
          user_id: data.userId,
          page_path: data.pagePath,
          page_title: data.pageTitle,
          referrer: data.referrer,
          duration_seconds: data.duration,
        });

      if (error) {
        console.error('Analytics: Failed to track page view:', error);
        return false;
      }

      // Update session page view count
      const { data: sessionData } = await this.supabase
        .from('analytics_sessions')
        .select('page_views')
        .eq('session_id', data.sessionId)
        .single();

      if (sessionData) {
        await this.supabase
          .from('analytics_sessions')
          .update({ 
            page_views: (sessionData.page_views || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', data.sessionId);
      }

      return true;
    } catch (error) {
      console.error('Analytics: Page view tracking error:', error);
      return false;
    }
  }

  // Event tracking
  async trackEvent(data: EventData): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('analytics_events')
        .insert({
          session_id: data.sessionId,
          user_id: data.userId,
          event_type: data.eventType,
          event_category: data.eventCategory,
          event_action: data.eventAction,
          event_label: data.eventLabel,
          event_value: data.eventValue,
          properties: data.properties,
        });

      if (error) {
        console.error('Analytics: Failed to track event:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Analytics: Event tracking error:', error);
      return false;
    }
  }

  // Conversion funnel tracking
  async trackConversion(data: ConversionData): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('analytics_conversions')
        .insert({
          session_id: data.sessionId,
          user_id: data.userId,
          order_id: data.orderId,
          funnel_step: data.funnelStep,
          step_order: data.stepOrder,
          provider: data.provider,
          amount: data.amount,
          currency: data.currency || 'USD',
          success: data.success,
          error_message: data.errorMessage,
        });

      if (error) {
        console.error('Analytics: Failed to track conversion:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Analytics: Conversion tracking error:', error);
      return false;
    }
  }

  // WhatsApp event tracking
  async trackWhatsAppEvent(data: WhatsAppEventData): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('analytics_whatsapp_events')
        .insert({
          session_id: data.sessionId,
          user_id: data.userId,
          order_id: data.orderId,
          event_type: data.eventType,
          phone_number: data.phoneNumber,
          message_type: data.messageType,
        });

      if (error) {
        console.error('Analytics: Failed to track WhatsApp event:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Analytics: WhatsApp event tracking error:', error);
      return false;
    }
  }

  // End session
  async endSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('analytics_sessions')
        .update({ 
          ended_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Analytics: Failed to end session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Analytics: End session error:', error);
      return false;
    }
  }

  // Get analytics data for dashboard
  async getAnalyticsData(period: 'daily' | 'weekly' | 'monthly' | 'yearly', startDate?: string, endDate?: string) {
    try {
      const start = startDate || this.getPeriodStart(period);
      const end = endDate || new Date().toISOString();

      // Get revenue data
      const { data: revenueData, error: revenueError } = await this.supabase
        .from('analytics_revenue')
        .select('*')
        .eq('period_type', period)
        .gte('date', start)
        .lte('date', end)
        .order('date', { ascending: true });

      if (revenueError) {
        console.error('Analytics: Failed to fetch revenue data:', revenueError);
      }

      // Get session data
      const { data: sessionData, error: sessionError } = await this.supabase
        .from('analytics_sessions')
        .select('*')
        .gte('started_at', start)
        .lte('started_at', end);

      if (sessionError) {
        console.error('Analytics: Failed to fetch session data:', sessionError);
      }

      // Get page view data
      const { data: pageViewData, error: pageViewError } = await this.supabase
        .from('analytics_pageviews')
        .select('*')
        .gte('timestamp', start)
        .lte('timestamp', end);

      if (pageViewError) {
        console.error('Analytics: Failed to fetch page view data:', pageViewError);
      }

      // Get conversion data
      const { data: conversionData, error: conversionError } = await this.supabase
        .from('analytics_conversions')
        .select('*')
        .gte('timestamp', start)
        .lte('timestamp', end);

      if (conversionError) {
        console.error('Analytics: Failed to fetch conversion data:', conversionError);
      }

      return {
        revenue: revenueData || [],
        sessions: sessionData || [],
        pageViews: pageViewData || [],
        conversions: conversionData || [],
      };
    } catch (error) {
      console.error('Analytics: Failed to get analytics data:', error);
      return {
        revenue: [],
        sessions: [],
        pageViews: [],
        conversions: [],
      };
    }
  }

  private getPeriodStart(period: string): string {
    const now = new Date();
    
    switch (period) {
      case 'daily':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return weekStart.toISOString();
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      case 'yearly':
        return new Date(now.getFullYear(), 0, 1).toISOString();
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  }
}

export const analyticsService = new AnalyticsService();
