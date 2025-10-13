import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db/orders';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { flight, passengers, flightType, userId } = body;

    if (!flight || !passengers || !flightType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('📝 Received order creation request');
    console.log('🔑 User ID from client:', userId);
    console.log('📧 Guest Email:', passengers[0]?.email);

    // Calculate payment amount
    const basePrice = flightType === 'one-way' ? 25 : 45;
    const numberOfTravelers = flight.numberOfTravelers || 1;
    const paymentAmount = basePrice * numberOfTravelers;

    // Create order in Supabase
    const orderData = await createOrder({
      flightType,
      flightDetails: flight,
      passengers,
      userId: userId || null,
      guestEmail: passengers[0]?.email,
      paymentAmount,
    });

    console.log('✅ Order created in API:');
    console.log('   Order ID:', orderData.orderId);
    console.log('   Order Number:', orderData.orderNumber);
    console.log('   User ID saved:', userId || 'NULL (guest)');
    console.log('   Status:', orderData.status);

    return NextResponse.json({
      orderId: orderData.orderId,
      orderNumber: orderData.orderNumber,
      status: orderData.status,
      message: 'Order created successfully',
    });

  } catch (error: unknown) {
    console.error('❌ Error creating order:', error);
    console.error('❌ Full error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
