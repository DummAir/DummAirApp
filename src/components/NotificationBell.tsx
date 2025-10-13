'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get current user and fetch notifications
    const initializeNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchNotifications(user.id);
        setupRealtimeSubscription(user.id);
      } else {
        setIsLoading(false);
      }
    };

    initializeNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupRealtimeSubscription = (uid: string) => {
    // Set up real-time subscription
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${uid}`,
        },
        () => {
          fetchNotifications(uid);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchNotifications = async (uid: string) => {
    try {
      const response = await fetch(`/api/notifications?userId=${uid}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } else {
        console.error('Failed to fetch notifications:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!userId) return;

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, userId }),
      });

      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true, userId }),
      });

      // Update local state
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-[#647287] md:w-6 md:h-6" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 md:top-0 md:right-0 min-w-[18px] h-[18px] md:min-w-[20px] md:h-5 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel - Responsive */}
      {isOpen && (
        <>
          {/* Mobile: Full Screen Overlay */}
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)}></div>
          
          {/* Notification Panel */}
          <div className="fixed inset-x-0 bottom-0 md:absolute md:right-0 md:top-auto md:bottom-auto md:left-auto md:inset-x-auto mt-0 md:mt-2 w-full md:w-96 bg-white rounded-t-3xl md:rounded-lg shadow-2xl border-t md:border border-gray-200 z-50 max-h-[85vh] md:max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-4 border-b border-gray-200 flex-shrink-0">
              {/* Mobile: Add drag indicator */}
              <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full"></div>
              
              <h3 className="text-base md:text-lg font-semibold text-[#111417] mt-3 md:mt-0">Notifications</h3>
              <div className="flex items-center gap-2 mt-3 md:mt-0">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#2472e0] hover:underline font-medium whitespace-nowrap"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={18} className="text-[#647287]" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 md:p-8 text-center">
                  <Bell size={40} className="mx-auto text-gray-300 mb-3 md:w-12 md:h-12" />
                  <p className="text-[#647287] text-sm md:text-base">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 md:p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.is_read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      {notification.action_url ? (
                        <Link
                          href={notification.action_url}
                          onClick={() => handleNotificationClick(notification)}
                          className="block"
                        >
                          <NotificationContent notification={notification} />
                        </Link>
                      ) : (
                        <div onClick={() => handleNotificationClick(notification)}>
                          <NotificationContent notification={notification} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 md:p-3 border-t border-gray-200 text-center flex-shrink-0">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-[#2472e0] hover:underline font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function NotificationContent({ notification }: { notification: Notification }) {
  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      order_created: '📝',
      payment_confirmed: '✅',
      ticket_ready: '🎫',
      ticket_uploaded: '📤',
      payment_reminder: '⏰',
      order_completed: '✓',
      admin_message: '📧',
    };
    return iconMap[type] || '📬';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-start gap-2 md:gap-3">
      <div className="text-xl md:text-2xl flex-shrink-0">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-[#111417] text-sm md:text-sm leading-tight">
            {notification.title}
          </p>
          {!notification.is_read && (
            <div className="w-2 h-2 bg-[#2472e0] rounded-full flex-shrink-0 mt-1"></div>
          )}
        </div>
        <p className="text-[#647287] text-xs md:text-sm mb-1 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <p className="text-[10px] md:text-xs text-[#9ca3af]">
          {formatTime(notification.created_at)}
        </p>
      </div>
    </div>
  );
}

