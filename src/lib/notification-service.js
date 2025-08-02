import { supabase } from '../utils/supabase';

/**
 * Create a notification - handles both broadcast and single user notifications
 * @param {Object} params Notification parameters
 * @param {string} params.title Notification title
 * @param {string} params.message Notification message
 * @param {string} params.type Notification type
 * @param {Object} [params.metadata={}] Additional metadata
 * @param {boolean} [params.broadcast=false] Whether the notification is a broadcast
 * @param {string} [params.created_by] Creator of the notification
 */
export const createNotification = async ({
  title,
  message,
  type,
  metadata = {},
  created_by = null
}) => {
  try {
    // Validate required fields
    if (!title?.trim() || !message?.trim() || !type?.trim()) {
      throw new Error('Title, message and type are required');
    }

    // Ensure created_by is a string
    const notification = {
      title: title.trim(),
      message: message.trim(),
      type: type.trim(),
      metadata,
      unread: true,
      created_at: new Date().toISOString(),
      created_by
    };

    // Insert notification into the database
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();

    if (error) throw error;

    return { success: true, notification: data };
  } catch (error) {
    console.error('Notification creation failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const fetchNotifications = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, notifications: data || [] };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, error: error.message };
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ unread: false })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: error.message };
  }
};

export const markAllAsRead = async () => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ unread: false })
      .eq('unread', true);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking all as read:', error);
    return { success: false, error: error.message };
  }
};