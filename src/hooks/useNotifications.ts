import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: number;
  gencode: string;
  refid: number;
  notification_type: 'APPROVAL' | 'REJECTION' | 'RETURN' | 'CANCEL' | 'SUBMISSION' | 'BOS_SUBMISSION';
  action: 'APPROVED' | 'RETURNED' | 'CANCELLED' | 'SUBMITTED' | 'PENDING';
  actor_userid: string;
  actor_name: string;
  recipient_userid?: string;
  recipient_name?: string;
  approval_level?: 'FIRST_APPROVER' | 'SECOND_APPROVER' | 'THIRD_APPROVER' | 'COMPLIANCE_FINAL';
  custtype: string;
  title: string;
  message: string;
  remarks?: string;
  is_read: boolean;
  is_sent_email: boolean;
  read_at?: string;
  form_data?: any;
  previous_status?: string;
  new_status: string;
  created_at: string;
  updated_at: string;
}

interface CreateNotificationParams {
  gencode: string;
  refid: number;
  notification_type: 'APPROVAL' | 'REJECTION' | 'RETURN' | 'CANCEL' | 'SUBMISSION' | 'BOS_SUBMISSION';
  action: 'APPROVED' | 'RETURNED' | 'CANCELLED' | 'SUBMITTED' | 'PENDING';
  actor_userid: string;
  actor_name: string;
  recipient_userid?: string;
  recipient_name?: string;
  approval_level?: 'FIRST_APPROVER' | 'SECOND_APPROVER' | 'THIRD_APPROVER' | 'COMPLIANCE_FINAL';
  custtype: string;
  title: string;
  message: string;
  remarks?: string;
  previous_status?: string;
  new_status: string;
  form_data?: any;
}

export const useNotifications = (userid?: string, autoSubscribe: boolean = false) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ==================== REALTIME SUBSCRIPTION ====================
  useEffect(() => {
    if (!autoSubscribe || !userid) return;

    // Initial fetch
    getUserNotifications(userid);
    getUnreadCount(userid).then(count => setUnreadCount(count));

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_userid=eq.${userid}`,
        },
        (payload) => {
          console.log('New notification received:', payload);
          const newNotification = payload.new as Notification;
          
          // Add to notifications list
          setNotifications(prev => [newNotification, ...prev]);
          
          // Update unread count
          setUnreadCount(prev => prev + 1);
          
          // Show toast notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
            duration: 5000,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_userid=eq.${userid}`,
        },
        (payload) => {
          console.log('Notification updated:', payload);
          const updatedNotification = payload.new as Notification;
          
          // Update in notifications list
          setNotifications(prev =>
            prev.map(notif =>
              notif.id === updatedNotification.id ? updatedNotification : notif
            )
          );
          
          // Update unread count if read status changed
          if (updatedNotification.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userid, autoSubscribe]);

  // ==================== CREATE NOTIFICATION ====================
  const createNotification = async (params: CreateNotificationParams): Promise<Notification | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .insert([params])
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return null;
      }

      console.log('Notification created:', data);
      return data;
    } catch (err) {
      console.error('Error in createNotification:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==================== GET USER NOTIFICATIONS ====================
  const getUserNotifications = async (userId: string, limit: number = 50): Promise<Notification[]> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_userid', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      setNotifications(data || []);
      return data || [];
    } catch (err) {
      console.error('Error in getUserNotifications:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ==================== GET UNREAD COUNT ====================
  const getUnreadCount = async (userId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_userid', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
      }

      setUnreadCount(count || 0);
      return count || 0;
    } catch (err) {
      console.error('Error in getUnreadCount:', err);
      return 0;
    }
  };

  // ==================== MARK AS READ ====================
  const markAsRead = async (notificationId: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));

      return true;
    } catch (err) {
      console.error('Error in markAsRead:', err);
      return false;
    }
  };

  // ==================== MARK ALL AS READ ====================
  const markAllAsRead = async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('recipient_userid', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          is_read: true, 
          read_at: new Date().toISOString() 
        }))
      );

      // Reset unread count
      setUnreadCount(0);

      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });

      return true;
    } catch (err) {
      console.error('Error in markAllAsRead:', err);
      return false;
    }
  };

  // ==================== DELETE NOTIFICATION ====================
  const deleteNotification = async (notificationId: number): Promise<boolean> => {
    try {
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }

      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // Update unread count if deleted notification was unread
      if (notificationToDelete && !notificationToDelete.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast({ 
        title: 'Success', 
        description: 'Notification deleted successfully' 
      });

      return true;
    } catch (err) {
      console.error('Error in deleteNotification:', err);
      return false;
    }
  };

  // ==================== DELETE ALL READ NOTIFICATIONS ====================
  const deleteAllRead = async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('recipient_userid', userId)
        .eq('is_read', true);

      if (error) {
        console.error('Error deleting read notifications:', error);
        return false;
      }

      // Update local state
      setNotifications(prev => prev.filter(notif => !notif.is_read));

      toast({
        title: 'Success',
        description: 'All read notifications deleted',
      });

      return true;
    } catch (err) {
      console.error('Error in deleteAllRead:', err);
      return false;
    }
  };

  // ==================== GET NOTIFICATIONS BY GENCODE ====================
  const getNotificationsByGencode = async (gencode: string): Promise<Notification[]> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('gencode', gencode)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications by gencode:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getNotificationsByGencode:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ==================== GET NOTIFICATIONS BY TYPE ====================
  const getNotificationsByType = async (
    userId: string,
    notificationType: Notification['notification_type']
  ): Promise<Notification[]> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_userid', userId)
        .eq('notification_type', notificationType)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications by type:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getNotificationsByType:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ==================== HELPER: GET USER NAME BY USERID ====================
  const getUserNameByUserId = async (userId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('fullname')
        .eq('userid', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user name:', error);
        return '';
      }
      
      return data?.fullname || '';
    } catch (err) {
      console.error('Error in getUserNameByUserId:', err);
      return '';
    }
  };

  // ==================== REFRESH NOTIFICATIONS ====================
  const refreshNotifications = async (userId: string) => {
    await getUserNotifications(userId);
    await getUnreadCount(userId);
  };

  return {
    loading,
    notifications,
    unreadCount,
    createNotification,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    getNotificationsByGencode,
    getNotificationsByType,
    getUserNameByUserId,
    refreshNotifications,
  };
};