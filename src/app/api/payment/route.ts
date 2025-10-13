import { NextRequest, NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripe';
import { initializeFlutterwavePayment } from '@/lib/flutterwave';
import { createPayment } from '@/lib/db/payments';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, provider, amount, customerEmail, customerName, customerPhone, flightDetails } = body;

    if (!orderId || !provider || !amount || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let paymentResponse;

    switch (provider) {
      case 'stripe':
        try {
          const session = await createStripeCheckoutSession({
            orderId,
            amount,
            customerEmail,
            flightDetails: flightDetails || 'Dummy Flight Ticket',
          });

          // Create payment record in database
          await createPayment({
            orderId,
            provider: 'stripe',
            reference: session.id,
            amount,
            currency: 'USD',
            transactionId: session.id,
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
          console.log('Attempting Flutterwave payment initialization...');
          const flutterwaveData = await initializeFlutterwavePayment({
            orderId,
            amount,
            customerEmail,
            customerName: customerName || 'Customer',
            customerPhone,
          });

          console.log('Flutterwave initialization successful:', flutterwaveData);

          // Create payment record in database
          await createPayment({
            orderId,
            provider: 'flutterwave',
            reference: flutterwaveData.tx_ref,
            amount,
            currency: 'USD',
          });

          paymentResponse = {
            payment_url: flutterwaveData.payment_link,
            provider: 'flutterwave',
            tx_ref: flutterwaveData.tx_ref,
            orderId,
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          const errorStack = error instanceof Error ? error.stack : undefined;
          console.error('Flutterwave error details:', {
            message: errorMessage,
            stack: errorStack,
            orderId,
          });
          return NextResponse.json(
            { error: `Flutterwave error: ${errorMessage}` },
            { status: 500 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported payment provider' },
          { status: 400 }
        );
    }

    console.log(`${provider} payment initialized for order ${orderId}`);

    return NextResponse.json({
      success: true,
      ...paymentResponse,
    });

  } catch (error: unknown) {
    console.error('Payment initialization error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
