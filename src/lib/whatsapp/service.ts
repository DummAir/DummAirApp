/**
 * WhatsApp Notification Service
 * Sends WhatsApp messages for admin notifications
 */

export interface WhatsAppMessage {
  to: string; // Phone number in E.164 format (e.g., +1234567890)
  message: string;
}

/**
 * Send WhatsApp message using Twilio
 */
export async function sendWhatsAppViaTwilio(payload: WhatsAppMessage): Promise<{ success: boolean; error?: string }> {
  try {
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g., whatsapp:+14155238886

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
      console.log('ℹ️ Twilio WhatsApp not configured, skipping...');
      return { success: false, error: 'Twilio WhatsApp not configured' };
    }

    console.log('📱 Sending WhatsApp via Twilio...');
    console.log('   To:', payload.to);

    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: TWILIO_WHATSAPP_FROM,
          To: `whatsapp:${payload.to}`,
          Body: payload.message,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Twilio WhatsApp error:', data);
      return {
        success: false,
        error: data.message || 'Failed to send WhatsApp message',
      };
    }

    console.log('✅ WhatsApp sent via Twilio:', data.sid);

    return {
      success: true,
    };

  } catch (error) {
    console.error('❌ WhatsApp sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send WhatsApp message using Fonnte (Alternative - Simple)
 */
export async function sendWhatsAppViaFonnte(payload: WhatsAppMessage): Promise<{ success: boolean; error?: string }> {
  try {
    const FONNTE_API_KEY = process.env.FONNTE_API_KEY;

    if (!FONNTE_API_KEY) {
      console.log('ℹ️ Fonnte WhatsApp not configured, skipping...');
      return { success: false, error: 'Fonnte not configured' };
    }

    console.log('📱 Sending WhatsApp via Fonnte...');
    console.log('   To:', payload.to);

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': FONNTE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: payload.to,
        message: payload.message,
        countryCode: '1', // US country code, adjust as needed
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== 'success') {
      console.error('❌ Fonnte WhatsApp error:', data);
      return {
        success: false,
        error: data.message || 'Failed to send WhatsApp message',
      };
    }

    console.log('✅ WhatsApp sent via Fonnte');

    return {
      success: true,
    };

  } catch (error) {
    console.error('❌ WhatsApp sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Main function: Send WhatsApp notification (tries configured provider)
 */
export async function sendWhatsAppNotification(payload: WhatsAppMessage): Promise<{ success: boolean; error?: string }> {
  // Try Twilio first (most reliable)
  const twilioResult = await sendWhatsAppViaTwilio(payload);
  if (twilioResult.success) {
    return twilioResult;
  }

  // Fallback to Fonnte if Twilio not configured
  const fonnteResult = await sendWhatsAppViaFonnte(payload);
  if (fonnteResult.success) {
    return fonnteResult;
  }

  // Both failed or not configured
  console.log('ℹ️ No WhatsApp provider configured. Skipping WhatsApp notification.');
  return { success: false, error: 'No WhatsApp provider configured' };
}

/**
 * Format order notification message for WhatsApp
 */
export function formatAdminOrderNotification(orderDetails: {
  orderNumber: string;
  customerEmail: string;
  route: string;
  departDate: string;
  travelers: number;
  amount: number;
  adminDashboardUrl: string;
}): string {
  return `🚨 *NEW PAID ORDER*

📋 *Order Details:*
• Order #: ${orderDetails.orderNumber}
• Customer: ${orderDetails.customerEmail}
• Route: ${orderDetails.route}
• Departure: ${orderDetails.departDate}
• Travelers: ${orderDetails.travelers}
• Amount: $${orderDetails.amount}

⚡ *Action Required:*
Process this order within 1 hour for swift service!

🔗 View in dashboard:
${orderDetails.adminDashboardUrl}

---
DummAir Admin Alert`;
}

