/**
 * Email Service for DummAir
 * Uses Resend for reliable email delivery with custom domain support
 */

import { createServiceClient } from '@/lib/supabase/server';
import { analyticsService } from '@/lib/analytics/service';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  replyTo?: string;
}

interface EmailLogData {
  orderId?: string;
  userId?: string;
  emailType: string;
  recipient: string;
  subject: string;
}

/**
 * Send email using Resend API
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'support@dummair.com';
    const FROM_NAME = process.env.RESEND_FROM_NAME || 'DummAir Support';

    console.log('📧 Email Service Configuration:');
    console.log('   API Key:', RESEND_API_KEY ? `✅ SET (${RESEND_API_KEY.substring(0, 10)}...)` : '❌ NOT SET');
    console.log('   From:', `${FROM_NAME} <${FROM_EMAIL}>`);
    console.log('   To:', payload.to);
    console.log('   Subject:', payload.subject);

    if (!RESEND_API_KEY) {
      const error = 'RESEND_API_KEY not configured in environment variables';
      console.error('❌', error);
      return {
        success: false,
        error: error,
      };
    }

    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.to)) {
      const error = `Invalid email address: ${payload.to}`;
      console.error('❌', error);
      return {
        success: false,
        error: error,
      };
    }

    // Prepare email data
    const emailData: Record<string, unknown> = {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    };

    if (payload.replyTo) {
      emailData.reply_to = payload.replyTo;
    }

    if (payload.attachments && payload.attachments.length > 0) {
      emailData.attachments = payload.attachments.map(att => ({
        filename: att.filename,
        content: typeof att.content === 'string' 
          ? Buffer.from(att.content).toString('base64')
          : att.content.toString('base64'),
      }));
      console.log(`   Attachments: ${payload.attachments.length} file(s)`);
    }

    console.log('🚀 Calling Resend API...');

    // Send via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    console.log('📬 Resend Response:', {
      status: response.status,
      statusText: response.statusText,
      data: data,
    });

    if (!response.ok) {
      const errorMsg = data.message || data.error || JSON.stringify(data);
      console.error('❌ Resend API error:', errorMsg);
      console.error('   Full response:', data);
      return {
        success: false,
        error: errorMsg,
      };
    }

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', data.id);
    console.log('   To:', payload.to);

    return {
      success: true,
      messageId: data.id,
    };

  } catch (error) {
    console.error('❌ Email sending failed with exception:', error);
    console.error('   Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('   Error message:', error instanceof Error ? error.message : String(error));
    console.error('   Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Log email to database
 */
export async function logEmail(data: EmailLogData & { 
  status: 'sent' | 'failed'; 
  providerId?: string; 
  errorMessage?: string;
}) {
  try {
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from('email_logs')
      .insert({
        order_id: data.orderId,
        user_id: data.userId,
        email_type: data.emailType,
        recipient: data.recipient,
        subject: data.subject,
        status: data.status,
        provider: 'resend',
        provider_message_id: data.providerId,
        error_message: data.errorMessage,
        sent_at: data.status === 'sent' ? new Date().toISOString() : null,
      });

    if (error) {
      console.error('❌ Failed to log email:', error);
    } else {
      console.log('✅ Email logged successfully');
    }
  } catch (error) {
    console.error('❌ Error logging email:', error);
  }
}

/**
 * Send email and log the attempt
 */
export async function sendAndLogEmail(
  payload: EmailPayload,
  logData: EmailLogData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const result = await sendEmail(payload);

  // Log the email attempt
  const logResult = await logEmail({
    ...logData,
    status: result.success ? 'sent' : 'failed',
    providerId: result.messageId,
    errorMessage: result.error,
  });

  // Track email event in analytics
  if (result.success && result.messageId) {
    try {
      await analyticsService.trackEmailEvent({
        emailLogId: result.messageId, // Using messageId as reference
        eventType: 'sent',
        recipientEmail: logData.recipient,
        emailType: logData.emailType,
      });
    } catch (error) {
      console.error('Analytics: Failed to track email event:', error);
    }
  }

  return result;
}

