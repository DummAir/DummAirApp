/**
 * Post-Payment Survey Cron Job
 * Sends a feedback survey email to customers a few hours after payment confirmation.
 * Should be invoked by a scheduled job (e.g., Vercel Cron) using the shared CRON_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendAndLogEmail } from '@/lib/email/service';
import { getPostPaymentSurveyEmail } from '@/lib/email/templates';

const DEFAULT_SURVEY_DELAY_HOURS = 6;
const DEFAULT_SURVEY_LOOKBACK_DAYS = 14;
const MAX_ORDERS_PER_RUN = 50;
const FALLBACK_SURVEY_URL = 'https://forms.gle/9eFxvzsfT8hrj17QA';

function parsePositiveInteger(value: string | undefined | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const surveyDelayHours = parsePositiveInteger(
      process.env.POST_PAYMENT_SURVEY_DELAY_HOURS,
      DEFAULT_SURVEY_DELAY_HOURS
    );
    const surveyLookbackDays = parsePositiveInteger(
      process.env.POST_PAYMENT_SURVEY_LOOKBACK_DAYS,
      DEFAULT_SURVEY_LOOKBACK_DAYS
    );
    const surveyUrl = process.env.POST_PAYMENT_SURVEY_URL || FALLBACK_SURVEY_URL;

    const now = new Date();
    const delayCutoff = new Date(now);
    delayCutoff.setHours(delayCutoff.getHours() - surveyDelayHours);

    const lookbackCutoff = new Date(now);
    lookbackCutoff.setDate(lookbackCutoff.getDate() - surveyLookbackDays);

    const supabase = await createServiceClient();

    const { data: paidOrders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        guest_email,
        user_id,
        flight_from,
        flight_to,
        flight_depart_date,
        flight_return_date,
        number_of_travelers,
        payment_amount,
        flight_type,
        paid_at
      `)
      .eq('status', 'paid')
      .not('paid_at', 'is', null)
      .lt('paid_at', delayCutoff.toISOString())
      .gte('paid_at', lookbackCutoff.toISOString())
      .order('paid_at', { ascending: true })
      .limit(MAX_ORDERS_PER_RUN);

    if (ordersError) {
      console.error('❌ Failed to fetch paid orders for survey emails:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch paid orders' },
        { status: 500 }
      );
    }

    if (!paidOrders || paidOrders.length === 0) {
      console.log('ℹ️ No paid orders eligible for survey emails at this time.');
      return NextResponse.json({
        success: true,
        message: 'No eligible orders found',
        checked: 0,
        eligible: 0,
        sent: 0,
        errors: 0,
      });
    }

    const orderIds = paidOrders.map(order => order.id);

    const { data: surveyLogs, error: surveyLogsError } = await supabase
      .from('email_logs')
      .select('order_id')
      .eq('email_type', 'post_payment_survey')
      .in('order_id', orderIds);

    if (surveyLogsError) {
      console.error('❌ Failed to fetch survey email logs:', surveyLogsError);
      return NextResponse.json(
        { error: 'Failed to check existing survey emails' },
        { status: 500 }
      );
    }

    const surveySentOrderIds = new Set(
      (surveyLogs || [])
        .map(log => log.order_id)
        .filter((id): id is string => Boolean(id))
    );

    const eligibleOrders = paidOrders.filter(order => {
      if (!order.guest_email) {
        console.log(`ℹ️ Skipping order ${order.order_number} - no guest email available.`);
        return false;
      }

      if (surveySentOrderIds.has(order.id)) {
        console.log(`ℹ️ Survey email already sent for order ${order.order_number}.`);
        return false;
      }

      return true;
    });

    if (eligibleOrders.length === 0) {
      console.log('ℹ️ No new orders require survey emails.');
      return NextResponse.json({
        success: true,
        message: 'No survey emails needed',
        checked: paidOrders.length,
        eligible: 0,
        sent: 0,
        errors: 0,
      });
    }

    let sentCount = 0;
    let errorCount = 0;

    for (const order of eligibleOrders) {
      try {
        const recipientEmail = order.guest_email;

        if (!recipientEmail) {
          continue;
        }

        const orderDetails = {
          orderNumber: order.order_number,
          flightFrom: order.flight_from || 'N/A',
          flightTo: order.flight_to || 'N/A',
          departDate: order.flight_depart_date
            ? new Date(order.flight_depart_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'N/A',
          returnDate: order.flight_return_date
            ? new Date(order.flight_return_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : undefined,
          numberOfTravelers: order.number_of_travelers || 1,
          amount: order.payment_amount || 0,
          flightType: order.flight_type || 'one-way',
        };

        const subject = `How did we do on order ${order.order_number}?`;

        const result = await sendAndLogEmail(
          {
            to: recipientEmail,
            subject,
            html: getPostPaymentSurveyEmail(orderDetails, surveyUrl),
          },
          {
            orderId: order.id,
            userId: order.user_id,
            emailType: 'post_payment_survey',
            recipient: recipientEmail,
            subject,
          }
        );

        if (result.success) {
          sentCount++;
          console.log(`✅ Sent post-payment survey to ${recipientEmail} for order ${order.order_number}`);
        } else {
          errorCount++;
          console.error(`❌ Failed to send survey to ${recipientEmail} for order ${order.order_number}:`, result.error);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error sending survey for order ${order.order_number}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Survey emails processed',
      checked: paidOrders.length,
      eligible: eligibleOrders.length,
      sent: sentCount,
      errors: errorCount,
      delayHours: surveyDelayHours,
      lookbackDays: surveyLookbackDays,
    });
  } catch (error: unknown) {
    console.error('❌ Post-payment survey cron job failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process survey emails';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

