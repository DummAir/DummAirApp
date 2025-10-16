import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, txRef, transactionId, sessionId, orderId } = body;

    console.log('🔍 Payment verification request:', {
      provider,
      orderId,
      txRef,
      transactionId,
      sessionId,
    });

    if (!provider || !orderId) {
      return NextResponse.json(
        { error: 'Missing provider or orderId', verified: false },
        { status: 400 }
      );
    }

    let verified = false;
    let paymentStatus = 'unknown';
    let amount = 0;

    // VERIFY STRIPE PAYMENT
    if (provider === 'stripe') {
      if (!sessionId) {
        return NextResponse.json(
          { error: 'Missing sessionId for Stripe verification', verified: false },
          { status: 400 }
        );
      }

      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecretKey) {
        console.error('❌ STRIPE_SECRET_KEY not set');
        return NextResponse.json(
          { error: 'Stripe not configured', verified: false },
          { status: 500 }
        );
      }

      try {
        const stripe = new Stripe(stripeSecretKey, {
          apiVersion: '2025-09-30.clover',
        });

        console.log('🔵 Stripe: Retrieving session:', sessionId);
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log('🔵 Stripe: Session status:', session.payment_status);
        console.log('🔵 Stripe: Amount:', session.amount_total);

        if (session.payment_status === 'paid') {
          verified = true;
          paymentStatus = 'paid';
          amount = session.amount_total ? session.amount_total / 100 : 0;
          console.log('✅ Stripe: Payment verified!');
        } else {
          console.error('❌ Stripe: Payment not paid. Status:', session.payment_status);
        }
      } catch (error) {
        console.error('❌ Stripe verification error:', error);
        return NextResponse.json(
          { error: 'Failed to verify Stripe payment', verified: false },
          { status: 500 }
        );
      }
    }

    // VERIFY FLUTTERWAVE PAYMENT
    else if (provider === 'flutterwave') {
      if (!txRef && !transactionId) {
        return NextResponse.json(
          { error: 'Missing txRef or transactionId for Flutterwave verification', verified: false },
          { status: 400 }
        );
      }

      const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
      if (!flutterwaveSecretKey) {
        console.error('❌ FLUTTERWAVE_SECRET_KEY not set');
        return NextResponse.json(
          { error: 'Flutterwave not configured', verified: false },
          { status: 500 }
        );
      }

      try {
        // Use transaction ID if available, otherwise use tx_ref
        const verifyId = transactionId || txRef;
        const verifyUrl = `https://api.flutterwave.com/v3/transactions/${verifyId}/verify`;

        console.log('🟣 Flutterwave: Verifying transaction:', verifyId);

        const response = await fetch(verifyUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${flutterwaveSecretKey}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        console.log('🟣 Flutterwave: Verification response:', result);

        if (result.status === 'success' && result.data) {
          const txStatus = result.data.status;
          const txAmount = result.data.amount;
          const txCurrency = result.data.currency;

          console.log('🟣 Flutterwave: Transaction status:', txStatus);
          console.log('🟣 Flutterwave: Amount:', txAmount, txCurrency);

          if (txStatus === 'successful') {
            verified = true;
            paymentStatus = 'paid';
            amount = txAmount;
            console.log('✅ Flutterwave: Payment verified!');
          } else {
            console.error('❌ Flutterwave: Payment not successful. Status:', txStatus);
          }
        } else {
          console.error('❌ Flutterwave: Invalid response:', result);
        }
      } catch (error) {
        console.error('❌ Flutterwave verification error:', error);
        return NextResponse.json(
          { error: 'Failed to verify Flutterwave payment', verified: false },
          { status: 500 }
        );
      }
    }

    // Unsupported provider
    else {
      return NextResponse.json(
        { error: `Unsupported provider: ${provider}`, verified: false },
        { status: 400 }
      );
    }

    // Return verification result
    return NextResponse.json({
      verified,
      paymentStatus,
      amount,
      provider,
      orderId,
    });

  } catch (error: unknown) {
    console.error('❌ Payment verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
    return NextResponse.json(
      { error: errorMessage, verified: false },
      { status: 500 }
    );
  }
}

