import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServiceClient } from '@/lib/supabase/server';

/**
 * GET - Fetch user notifications
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClientComponentClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const serviceSupabase = await createServiceClient();

    // Fetch notifications for the user
    const { data: notifications, error: notificationsError } = await serviceSupabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50); // Limit to last 50 notifications

    if (notificationsError) {
      console.error('❌ Failed to fetch notifications:', notificationsError);
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

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
    const supabase = createClientComponentClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    const serviceSupabase = await createServiceClient();

    if (markAllAsRead) {
      // Mark all notifications as read
      const { error } = await serviceSupabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Failed to mark all notifications as read:', error);
        return NextResponse.json(
          { error: 'Failed to update notifications' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } else if (notificationId) {
      // Mark single notification as read
      const { error } = await serviceSupabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Failed to mark notification as read:', error);
        return NextResponse.json(
          { error: 'Failed to update notification' },
          { status: 500 }
        );
      }

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

