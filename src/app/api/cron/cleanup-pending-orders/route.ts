/**
 * Cleanup Cron Job
 * Deletes pending payment orders that are older than 48 hours to keep
 * the admin dashboard focused on actionable data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

const PENDING_LIFESPAN_HOURS = 48;
const MAX_ORDERS_PER_RUN = 100;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - PENDING_LIFESPAN_HOURS);

    const supabase = await createServiceClient();

    const { data: staleOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, order_number, created_at')
      .eq('status', 'pending_payment')
      .lt('created_at', cutoffDate.toISOString())
      .order('created_at', { ascending: true })
      .limit(MAX_ORDERS_PER_RUN);

    if (fetchError) {
      console.error('❌ Failed to fetch stale pending orders:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch stale pending orders' },
        { status: 500 }
      );
    }

    if (!staleOrders || staleOrders.length === 0) {
      console.log('ℹ️ No pending orders require cleanup.');
      return NextResponse.json({
        success: true,
        message: 'No stale pending orders found',
        checked: 0,
        deleted: 0,
      });
    }

    const staleOrderIds = staleOrders.map(order => order.id);

    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .in('id', staleOrderIds);

    if (deleteError) {
      console.error('❌ Failed to delete stale pending orders:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete stale pending orders' },
        { status: 500 }
      );
    }

    console.log(`🧹 Deleted ${staleOrders.length} stale pending orders.`);

    return NextResponse.json({
      success: true,
      message: 'Stale pending orders cleaned up',
      checked: staleOrders.length,
      deleted: staleOrders.length,
      cutoff: cutoffDate.toISOString(),
    });
  } catch (error: unknown) {
    console.error('❌ Pending order cleanup failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cleanup failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

