import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { createStripeCheckoutSession } from '@/lib/stripe';
import { initializeFlutterwavePayment } from '@/lib/flutterwave';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, provider } = body;

    if (!orderId || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and provider' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Fetch order with passengers
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        passengers (*)
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Only allow retry for pending_payment status
    if (order.status !== 'pending_payment') {
      return NextResponse.json(
        { error: 'Order is not in pending_payment status' },
        { status: 400 }
      );
    }

    // Get first passenger details for payment
    const firstPassenger = order.passengers[0];
    if (!firstPassenger) {
      return NextResponse.json(
        { error: 'No passenger details found' },
        { status: 400 }
      );
    }

    // Calculate amount (same logic as booking flow)
    const basePrice = order.flight_type === 'one-way' ? 25 : 45;
    const amount = basePrice * order.number_of_travelers;

    // Prepare flight details text
    const flightDetailsText = `${order.flight_from} to ${order.flight_to} - ${order.flight_type}`;

    let paymentResponse;

    // Initialize payment based on provider
    switch (provider) {
      case 'stripe':
        try {
          const session = await createStripeCheckoutSession({
            orderId,
            amount,
            customerEmail: firstPassenger.email,
            flightDetails: flightDetailsText,
          });

          paymentResponse = {
            payment_url: session.url,
            provider: 'stripe',
            session_id: session.id,
            orderId,
          };
        } catch (error: unknown) {
          console.error('Stripe error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown Stripe error';
          return NextResponse.json(
            { error: `Stripe error: ${errorMessage}` },
            { status: 500 }
          );
        }
        break;

      case 'flutterwave':
        try {
          const phone = firstPassenger.phone ? 
            `${firstPassenger.phone_country_code || ''}${firstPassenger.phone}` : 
            undefined;

          const flutterwaveData = await initializeFlutterwavePayment({
            orderId,
            amount,
            customerEmail: firstPassenger.email,
            customerName: firstPassenger.full_name,
            customerPhone: phone,
          });

          paymentResponse = {
            payment_url: flutterwaveData.payment_link,
            provider: 'flutterwave',
            tx_ref: flutterwaveData.tx_ref,
            orderId,
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Flutterwave error:', errorMessage);
          return NextResponse.json(
            { error: `Flutterwave error: ${errorMessage}` },
            { status: 500 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported payment provider. Use stripe or flutterwave' },
          { status: 400 }
        );
    }

    console.log(`✅ Payment retry initialized for order ${orderId} with ${provider}`);

    return NextResponse.json({
      success: true,
      ...paymentResponse,
    });

  } catch (error: unknown) {
    console.error('❌ Retry payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retry payment';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

