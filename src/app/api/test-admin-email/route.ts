import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/service';
import { getAdminNotificationEmail } from '@/lib/email/templates';

/**
 * Test endpoint specifically for admin email notifications
 * This helps verify admin email configuration is working
 */
export async function POST() {
  try {
    console.log('🧪 Testing admin email notification...');

    // Check environment variables
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

    console.log('📋 Environment Variables Check:');
    console.log('   RESEND_API_KEY:', RESEND_API_KEY ? '✅ SET (length: ' + RESEND_API_KEY.length + ')' : '❌ NOT SET');
    console.log('   ADMIN_EMAIL:', ADMIN_EMAIL || '❌ NOT SET (using default: payment@dummair.com)');
    console.log('   RESEND_FROM_EMAIL:', FROM_EMAIL || '❌ NOT SET (using default: support@dummair.com)');

    if (!RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY environment variable not set',
        help: 'Add RESEND_API_KEY in Vercel → Settings → Environment Variables',
        config: {
          hasResendKey: false,
          adminEmail: ADMIN_EMAIL,
          fromEmail: FROM_EMAIL,
        },
      }, { status: 500 });
    }

    const adminEmail = ADMIN_EMAIL || 'payment@dummair.com';
    
    // Create test order details
    const testOrderDetails = {
      orderId: 'test-order-id',
      orderNumber: 'DUM-TEST-' + Date.now(),
      flightFrom: 'New York (JFK)',
      flightTo: 'London (LHR)',
      departDate: 'October 20, 2025',
      numberOfTravelers: 2,
      amount: 50,
      flightType: 'return',
    };

    console.log('📧 Attempting to send test email to admin:', adminEmail);

    // Send test admin email
    const result = await sendEmail({
      to: adminEmail,
      subject: `🧪 TEST: Admin Email Configuration - ${testOrderDetails.orderNumber}`,
      html: getAdminNotificationEmail(testOrderDetails, 'new_order'),
    });

    if (result.success) {
      console.log('✅ Test admin email sent successfully!');
      console.log('   Message ID:', result.messageId);
      console.log('   Sent to:', adminEmail);

      return NextResponse.json({
        success: true,
        message: 'Test admin email sent successfully!',
        details: {
          recipient: adminEmail,
          messageId: result.messageId,
          subject: `TEST: Admin Email Configuration - ${testOrderDetails.orderNumber}`,
        },
        config: {
          hasResendKey: true,
          adminEmail: adminEmail,
          fromEmail: FROM_EMAIL,
        },
      });
    } else {
      console.error('❌ Failed to send test admin email:', result.error);

      return NextResponse.json({
        success: false,
        error: result.error,
        details: {
          recipient: adminEmail,
          attemptedSubject: `TEST: Admin Email Configuration`,
        },
        config: {
          hasResendKey: true,
          adminEmail: adminEmail,
          fromEmail: FROM_EMAIL,
        },
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Test admin email failed with exception:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

