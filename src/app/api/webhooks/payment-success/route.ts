import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db/orders';
import { sendAndLogEmail } from '@/lib/email/service';
import { getPaymentConfirmationEmail, getPaymentReceiptEmail, getAdminNotificationEmail } from '@/lib/email/templates';
import { createNotification } from '@/lib/notifications/service';
import { createServiceClient } from '@/lib/supabase/server';
import { sendWhatsAppNotification, formatAdminOrderNotification } from '@/lib/whatsapp/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, provider, transactionId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }

    // Update order status to paid
    await updateOrderStatus(orderId, 'paid');

    console.log(`✅ Order ${orderId} marked as paid via ${provider || 'unknown'}`);

    // Fetch order details for email
    const supabase = await createServiceClient();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('❌ Failed to fetch order for email:', orderError);
      return NextResponse.json({ success: true }); // Still return success as payment is processed
    }

    const orderDetails = {
      orderNumber: order.order_number,
      flightFrom: order.flight_from,
      flightTo: order.flight_to,
      departDate: new Date(order.flight_depart_date).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }),
      returnDate: order.flight_return_date 
        ? new Date(order.flight_return_date).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
          })
        : undefined,
      numberOfTravelers: order.number_of_travelers,
      amount: order.payment_amount,
      flightType: order.flight_type,
    };

    // 1. Send payment confirmation email to client
    const clientEmail = order.guest_email;
    if (clientEmail) {
      await sendAndLogEmail(
        {
          to: clientEmail,
          subject: `Payment Confirmed - Order ${order.order_number}`,
          html: getPaymentConfirmationEmail(orderDetails, false),
        },
        {
          orderId: order.id,
          userId: order.user_id,
          emailType: 'payment_confirmation',
          recipient: clientEmail,
          subject: `Payment Confirmed - Order ${order.order_number}`,
        }
      );

      // Send payment receipt
      await sendAndLogEmail(
        {
          to: clientEmail,
          subject: `Payment Receipt - ${order.order_number}`,
          html: getPaymentReceiptEmail(orderDetails, transactionId || order.payment_reference || 'N/A'),
        },
        {
          orderId: order.id,
          userId: order.user_id,
          emailType: 'receipt',
          recipient: clientEmail,
          subject: `Payment Receipt - ${order.order_number}`,
        }
      );
    }

    // 2. Send URGENT notification to admin for swift processing
    const adminEmail = process.env.ADMIN_EMAIL || 'payment@dummair.com';
    
    console.log('🔍 Admin Email Configuration:');
    console.log('   ADMIN_EMAIL env var:', process.env.ADMIN_EMAIL);
    console.log('   Sending to:', adminEmail);
    console.log('   RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('   RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);

    const adminEmailResult = await sendAndLogEmail(
      {
        to: adminEmail,
        subject: `🚨 URGENT: New Paid Order ${order.order_number} - Action Required`,
        html: getAdminNotificationEmail({ ...orderDetails, orderId: order.id }, 'new_order'),
      },
      {
        orderId: order.id,
        emailType: 'admin_notification',
        recipient: adminEmail,
        subject: `New Order Received - ${order.order_number}`,
      }
    );

    if (adminEmailResult.success) {
      console.log(`✅ URGENT admin notification sent to ${adminEmail} for order ${order.order_number}`);
      console.log(`   Message ID: ${adminEmailResult.messageId}`);
    } else {
      console.error(`❌ Failed to send admin notification: ${adminEmailResult.error}`);
    }

    // 2b. Send WhatsApp notification to admin (if configured)
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
    if (adminPhone) {
      console.log('📱 Sending WhatsApp notification to admin...');
      
      const whatsappMessage = formatAdminOrderNotification({
        orderNumber: order.order_number,
        customerEmail: order.guest_email,
        route: `${order.flight_from} → ${order.flight_to}`,
        departDate: orderDetails.departDate,
        travelers: order.number_of_travelers,
        amount: order.payment_amount,
        adminDashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://dummair.com'}/admin/orders/${order.id}`,
      });

      const whatsappResult = await sendWhatsAppNotification({
        to: adminPhone,
        message: whatsappMessage,
      });

      if (whatsappResult.success) {
        console.log('✅ WhatsApp notification sent to admin');
      } else {
        console.log('ℹ️ WhatsApp notification not sent:', whatsappResult.error);
        // Not critical - continue even if WhatsApp fails
      }
    } else {
      console.log('ℹ️ ADMIN_WHATSAPP_NUMBER not configured. Skipping WhatsApp notification.');
    }

    // 3. Create in-app notification for registered users
    if (order.user_id) {
      await createNotification({
        userId: order.user_id,
        orderId: order.id,
        type: 'payment_confirmed',
        title: 'Payment Confirmed',
        message: `Your payment for order ${order.order_number} has been confirmed. Your ticket will be ready soon.`,
        actionUrl: '/dashboard',
      });
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('Error updating order status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}



