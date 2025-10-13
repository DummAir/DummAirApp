import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

/**
 * GET - Fetch user notifications
 * Using service client with user_id from query parameter
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from query parameter (sent by client)
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    console.log(`📧 Fetching notifications for user: ${userId}`);

    const supabase = await createServiceClient();

    // Fetch notifications for the user
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (notificationsError) {
      console.error('❌ Failed to fetch notifications:', notificationsError);
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

    console.log(`✅ Fetched ${notifications?.length || 0} notifications for user ${userId}`);

    // Get unread count
    const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      unreadCount,
    });

  } catch (error: unknown) {
    console.error('❌ Error fetching notifications:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Mark notification(s) as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, markAllAsRead, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    if (markAllAsRead) {
      // Mark all notifications as read
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Failed to mark all notifications as read:', error);
        return NextResponse.json(
          { error: 'Failed to update notifications' },
          { status: 500 }
        );
      }

      console.log(`✅ Marked all notifications as read for user ${userId}`);

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } else if (notificationId) {
      // Mark single notification as read
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Failed to mark notification as read:', error);
        return NextResponse.json(
          { error: 'Failed to update notification' },
          { status: 500 }
        );
      }

      console.log(`✅ Marked notification ${notificationId} as read`);

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read',
      });
    } else {
      return NextResponse.json(
        { error: 'Missing notificationId or markAllAsRead parameter' },
        { status: 400 }
      );
    }

  } catch (error: unknown) {
    console.error('❌ Error updating notifications:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update notifications';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
