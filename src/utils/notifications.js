import { supabase } from '@/lib/supabase';

export const createNotification = async ({ userId, title, message, type = 'info', metadata = {} }) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        metadata,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error };
  }
};