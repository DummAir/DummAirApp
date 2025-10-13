import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/service';

/**
 * Test endpoint to verify email configuration
 * Usage: POST /api/test-email with body: { email: "test@example.com" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address required' },
        { status: 400 }
      );
    }

    console.log('🧪 Testing email configuration...');
    console.log('📧 Sending test email to:', email);
    console.log('🔑 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('📬 RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
    console.log('👤 ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

    const result = await sendEmail({
      to: email,
      subject: '🧪 DummAir Email Test',
      html: `
        <h1>✅ Email Configuration Working!</h1>
        <p>This is a test email from DummAir.</p>
        <p>If you received this, your email system is configured correctly.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Sent from: ${process.env.RESEND_FROM_EMAIL}<br>
          Admin email: ${process.env.ADMIN_EMAIL}
        </p>
      `,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
        config: {
          hasResendKey: !!process.env.RESEND_API_KEY,
          fromEmail: process.env.RESEND_FROM_EMAIL,
          adminEmail: process.env.ADMIN_EMAIL,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          config: {
            hasResendKey: !!process.env.RESEND_API_KEY,
            fromEmail: process.env.RESEND_FROM_EMAIL,
            adminEmail: process.env.ADMIN_EMAIL,
          },
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Test email failed:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send test email',
        config: {
          hasResendKey: !!process.env.RESEND_API_KEY,
          fromEmail: process.env.RESEND_FROM_EMAIL,
          adminEmail: process.env.ADMIN_EMAIL,
        },
      },
      { status: 500 }
    );
  }
}

