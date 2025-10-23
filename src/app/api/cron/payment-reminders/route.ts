/**
 * Payment Reminder Cron Job
 * This endpoint should be called periodically (e.g., daily) via Vercel Cron or external scheduler
 * It sends reminder emails to users with pending payment orders
 * 
 * LIMIT: Only sends maximum 2 reminders per order within 24 hours
 * After 2 reminders, no more emails are sent for that order
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendAndLogEmail } from '@/lib/email/service';
import { getPaymentReminderEmail } from '@/lib/email/templates';
import { createNotification } from '@/lib/notifications/service';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Running payment reminder cron job...');

    const supabase = await createServiceClient();

    // Find orders with pending payments created more than 24 hours ago
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const { data: pendingOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending_payment')
      .lt('created_at', oneDayAgo.toISOString())
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('❌ Failed to fetch pending orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch pending orders' },
        { status: 500 }
      );
    }

    if (!pendingOrders || pendingOrders.length === 0) {
      console.log('✅ No pending orders found');
      return NextResponse.json({
        success: true,
        message: 'No pending orders to remind',
        count: 0,
      });
    }

    console.log(`📧 Found ${pendingOrders.length} pending orders to check for reminders (max 2 per order in 24h)`);

    let sentCount = 0;
    let errorCount = 0;

    // Process each pending order
    for (const order of pendingOrders) {
      try {
        // Check how many reminders have been sent in the last 24 hours
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { data: recentReminders, error: reminderError } = await supabase
          .from('email_logs')
          .select('*')
          .eq('order_id', order.id)
          .eq('email_type', 'payment_reminder')
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .order('created_at', { ascending: false });

        if (reminderError) {
          console.error(`❌ Failed to check reminders for order ${order.order_number}:`, reminderError);
          continue;
        }

        // Only send if less than 2 reminders sent in last 24 hours
        if (recentReminders && recentReminders.length >= 2) {
          console.log(`⏭️ Maximum reminders (2) already sent for order ${order.order_number} in last 24 hours`);
          continue;
        }

        // Check if reminder was already sent today (to prevent duplicate sends in same day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayReminder = recentReminders?.find(reminder => 
          new Date(reminder.created_at) >= today
        );

        if (todayReminder) {
          console.log(`⏭️ Reminder already sent today for order ${order.order_number}`);
          continue;
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

        // Generate payment URL - user should complete payment from dashboard or direct link
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dummair.com';
        const paymentUrl = order.user_id 
          ? `${appUrl}/dashboard`
          : `${appUrl}/book?retry=${order.id}`;

        // Send reminder email
        const result = await sendAndLogEmail(
          {
            to: order.guest_email,
            subject: `Payment Reminder - Complete Your Order ${order.order_number}`,
            html: getPaymentReminderEmail(orderDetails, paymentUrl),
          },
          {
            orderId: order.id,
            userId: order.user_id,
            emailType: 'payment_reminder',
            recipient: order.guest_email,
            subject: `Payment Reminder - Complete Your Order ${order.order_number}`,
          }
        );

        if (result.success) {
          sentCount++;
          console.log(`✅ Reminder sent for order ${order.order_number}`);

          // Create in-app notification for registered users
          if (order.user_id) {
            await createNotification({
              userId: order.user_id,
              orderId: order.id,
              type: 'payment_reminder',
              title: 'Payment Reminder',
              message: `Your order ${order.order_number} is waiting for payment. Complete your payment to get your ticket.`,
              actionUrl: '/dashboard',
            });
          }
        } else {
          errorCount++;
          console.error(`❌ Failed to send reminder for order ${order.order_number}:`, result.error);
        }

      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing order ${order.order_number}:`, error);
      }
    }

    console.log(`✅ Payment reminder job completed: ${sentCount} sent, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      message: 'Payment reminders processed',
      totalPending: pendingOrders.length,
      sent: sentCount,
      errors: errorCount,
    });

  } catch (error: unknown) {
    console.error('❌ Payment reminder cron job failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process reminders';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}

