import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db/orders';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }

    console.log('🔧 Admin marking order as completed:', orderId);

    // Update order status using service role (bypasses RLS)
    await updateOrderStatus(orderId, 'completed');

    console.log('✅ Order marked as completed:', orderId);

    return NextResponse.json({
      success: true,
      message: 'Order marked as completed',
    });

  } catch (error: unknown) {
    console.error('❌ Error marking order as completed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark order as completed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
