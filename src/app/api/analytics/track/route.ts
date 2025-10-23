import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/analytics/service';

// Track page views
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'pageview':
        const success = await analyticsService.trackPageView(data);
        return NextResponse.json({ success });
      
      case 'event':
        const eventSuccess = await analyticsService.trackEvent(data);
        return NextResponse.json({ success: eventSuccess });
      
      case 'conversion':
        const conversionSuccess = await analyticsService.trackConversion(data);
        return NextResponse.json({ success: conversionSuccess });
      
      case 'session':
        const sessionSuccess = await analyticsService.trackSession(data);
        return NextResponse.json({ success: sessionSuccess });
      
      case 'whatsapp_event':
        const whatsappSuccess = await analyticsService.trackWhatsAppEvent(data);
        return NextResponse.json({ success: whatsappSuccess });
      
      case 'end_session':
        const endSessionSuccess = await analyticsService.endSession(data.sessionId);
        return NextResponse.json({ success: endSessionSuccess });
      
      default:
        return NextResponse.json(
          { error: 'Invalid tracking type' },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    console.error('Analytics tracking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Tracking failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
