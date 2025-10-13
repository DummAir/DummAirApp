/**
 * Notification Service for DummAir
 * Handles in-app notifications for users
 */

import { createServiceClient } from '@/lib/supabase/server';

export interface NotificationData {
  userId: string;
  orderId?: string;
  type: 'order_created' | 'payment_confirmed' | 'ticket_ready' | 'ticket_uploaded' | 'payment_reminder' | 'order_completed' | 'admin_message';
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a notification in the database
 */
export async function createNotification(data: NotificationData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: data.userId,
        order_id: data.orderId,
        type: data.type,
        title: data.title,
        message: data.message,
        action_url: data.actionUrl,
        metadata: data.metadata || {},
        is_read: false,
      });

    if (error) {
      console.error('❌ Failed to create notification:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Notification created for user:', data.userId);
    return { success: true };

  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Failed to mark notification as read:', error);
      return { success: false };
    }

    return { success: true };

  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    return { success: false };
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('❌ Failed to mark all notifications as read:', error);
      return { success: false };
    }

    return { success: true };

  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    return { success: false };
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const supabase = await createServiceClient();

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('❌ Failed to get unread count:', error);
      return 0;
    }

    return count || 0;

  } catch (error) {
    console.error('❌ Error getting unread count:', error);
    return 0;
  }
}

