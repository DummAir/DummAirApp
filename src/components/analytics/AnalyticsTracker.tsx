'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AnalyticsTrackerProps {
  children: React.ReactNode;
}

export function AnalyticsTracker({ children }: AnalyticsTrackerProps) {
  const [sessionId, setSessionId] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Initialize session
    initializeSession();
  }, [initializeSession]);

  useEffect(() => {
    // Track page view when pathname changes
    if (sessionId && isTracking) {
      trackPageView();
    }
  }, [pathname, searchParams, sessionId, isTracking, trackPageView]);

  useEffect(() => {
    // Track checkout events
    if (pathname.includes('/book') && searchParams.get('step') === '4') {
      trackEvent('checkout_start', 'ecommerce', 'checkout', 'booking_review');
    }
  }, [pathname, searchParams, trackEvent]);

  const initializeSession = useCallback(async () => {
    try {
      // Get or create session ID
      let currentSessionId = localStorage.getItem('analytics_session_id');
      
      if (!currentSessionId) {
        currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        localStorage.setItem('analytics_session_id', currentSessionId);
      }

      setSessionId(currentSessionId);

      // Get user info
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get device and location info
      const userAgent = navigator.userAgent;
      const deviceType = getDeviceType(userAgent);
      const browser = getBrowser(userAgent);
      const os = getOS(userAgent);

      // Track session
      await trackSession({
        sessionId: currentSessionId,
        userId: user?.id,
        userAgent,
        deviceType,
        browser,
        os,
        isNewUser: !localStorage.getItem('analytics_user_visited'),
      });

      // Mark user as visited
      if (!localStorage.getItem('analytics_user_visited')) {
        localStorage.setItem('analytics_user_visited', 'true');
      }

      setIsTracking(true);
    } catch (error) {
      console.error('Analytics: Failed to initialize session:', error);
    }
  }, [supabase.auth]);

  const trackSession = async (data: Record<string, unknown>) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'session',
          data,
        }),
      });
    } catch (error) {
      console.error('Analytics: Failed to track session:', error);
    }
  };

  const trackPageView = useCallback(async () => {
    try {
      const pagePath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'pageview',
          data: {
            sessionId,
            pagePath,
            pageTitle: document.title,
            referrer: document.referrer,
          },
        }),
      });
    } catch (error) {
      console.error('Analytics: Failed to track page view:', error);
    }
  }, [sessionId, pathname, searchParams]);

  const trackEvent = useCallback(async (eventType: string, category?: string, action?: string, label?: string, value?: number) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'event',
          data: {
            sessionId,
            eventType,
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            eventValue: value,
          },
        }),
      });
    } catch (error) {
      console.error('Analytics: Failed to track event:', error);
    }
  }, [sessionId]);

  const trackConversion = useCallback(async (funnelStep: string, stepOrder: number, provider?: string, amount?: number, success?: boolean, orderId?: string) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'conversion',
          data: {
            sessionId,
            funnelStep,
            stepOrder,
            provider,
            amount,
            success,
            orderId,
          },
        }),
      });
    } catch (error) {
      console.error('Analytics: Failed to track conversion:', error);
    }
  }, [sessionId]);

  const trackWhatsAppClick = useCallback(async (orderId?: string, messageType?: string) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'whatsapp_event',
          data: {
            sessionId,
            eventType: 'click',
            orderId,
            messageType,
          },
        }),
      });
    } catch (error) {
      console.error('Analytics: Failed to track WhatsApp click:', error);
    }
  }, [sessionId]);

  // Expose tracking functions to window for global access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as Record<string, unknown>).analytics = {
        trackEvent,
        trackConversion,
        trackWhatsAppClick,
      };
    }
  }, [sessionId, trackEvent, trackConversion, trackWhatsAppClick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'end_session',
            data: { sessionId },
          }),
        }).catch(console.error);
      }
    };
  }, [sessionId]);

  return <>{children}</>;
}

// Utility functions
function getDeviceType(userAgent: string): string {
  if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'mobile';
  } else if (/Tablet|iPad/i.test(userAgent)) {
    return 'tablet';
  }
  return 'desktop';
}

function getBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function getOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}
