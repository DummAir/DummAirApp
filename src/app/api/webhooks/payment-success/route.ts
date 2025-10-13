import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db/orders';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, provider } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }

    // Update order status to paid
    await updateOrderStatus(orderId, 'paid');

    console.log(`✅ Order ${orderId} marked as paid via ${provider || 'unknown'}`);

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



