import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCheck, 
  X, 
  Calendar, 
  BookOpen, 
  FileText, 
  Folder, 
  PenTool, 
  Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from "@clerk/clerk-react";

// Notification types configuration
const NOTIFICATION_CONFIG = {
  event_upcoming: {
    icon: Clock,
    color: '#f97316',
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/20'
  },
  event_new: {
    icon: Calendar,
    color: '#3b82f6',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/20'
  },
  resource_new: {
    icon: FileText,
    color: '#22c55e',
    bgClass: 'bg-green-500/10',
    borderClass: 'border-green-500/20'
  },
  note_new: {
    icon: PenTool,
    color: '#a855f7',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/20'
  },
  blog_new: {
    icon: BookOpen,
    color: '#ec4899',
    bgClass: 'bg-pink-500/10',
    borderClass: 'border-pink-500/20'
  },
  project_new: {
    icon: Folder,
    color: '#6366f1',
    bgClass: 'bg-indigo-500/10',
    borderClass: 'border-indigo-500/20'
  }
};

// Demo notifications
const demoNotifications = [
  {
    id: 'demo-1',
    title: 'New Resource Available',
    message: 'A new JavaScript algorithms resource has been added to help you ace your coding interviews.',
    type: 'resource_new',
    unread: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    metadata: { category: 'Algorithms' }
  },
  {
    id: 'demo-2',
    title: 'Upcoming Event Reminder',
    message: 'Don\'t forget! The "React Best Practices" workshop starts in 30 minutes.',
    type: 'event_upcoming',
    unread: true,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    metadata: { eventId: 'workshop-123' }
  }
];

const NotificationItem = ({ notification }) => {
  const config = NOTIFICATION_CONFIG[notification.type] || NOTIFICATION_CONFIG.event_new;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "p-3 md:p-4 border-b border-primary/5 hover:bg-primary/5 transition-all duration-300 cursor-pointer group relative overflow-hidden",
        notification.unread && config.bgClass
      )}
    >
      {notification.unread && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${config.color}20 0%, transparent 100%)`
          }}
        />
      )}
      
      <div className="relative flex items-start gap-3">
        <div 
          className={cn("p-2 rounded-full", config.bgClass)}
          style={{ borderColor: config.color, borderWidth: '1px' }}
        >
          <Icon 
            className="w-4 h-4" 
            style={{ color: config.color }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-xs md:text-sm group-hover:text-primary transition-colors pr-2">
              {notification.title}
            </h4>
            <span className="text-[10px] md:text-xs text-muted-foreground px-2 py-1 rounded-full flex-shrink-0 bg-primary/5">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {notification.message}
          </p>
          {notification.unread && (
            <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: config.color }} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications); // Initialize with demo notifications
  const [unreadCount, setUnreadCount] = useState(2); // Set initial unread count
  const dropdownRef = useRef(null);
  const { user } = useUser();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (!user) return;

    // Comment out for now to show demo notifications
    // fetchNotifications();

    // Set up realtime subscription
    const channel = supabase
      .channel('custom-notification-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new, ...prev]);
            if (payload.new.unread) {
              setUnreadCount(count => count + 1);
            }
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev =>
              prev.map(notif =>
                notif.id === payload.new.id ? payload.new : notif
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Merge with demo notifications for now
      const allNotifications = [...demoNotifications, ...(data || [])];
      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => n.unread).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      // Mark demo notifications as read locally
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, unread: false }))
      );
      setUnreadCount(0);

      // Also update database notifications
      const { error } = await supabase
        .from('notifications')
        .update({ unread: false })
        .eq('user_id', user.id)
        .eq('unread', true);

      if (error) throw error;

      setIsOpen(false);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <div 
      className="relative"
      ref={dropdownRef}
      onMouseEnter={!isMobile ? () => setIsOpen(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsOpen(false) : undefined}
      onClick={() => isMobile && setIsOpen(!isOpen)}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="relative group"
        >
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-[calc(100vw-2rem)] md:w-96 rounded-xl border border-primary/10 bg-background/95 shadow-2xl z-50 overflow-hidden max-w-[400px]"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              right: isMobile ? '-160%' : '0',
            }}
          >
            <div className="p-3 md:p-4 border-b border-primary/10 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
              <h3 className="font-semibold text-base md:text-lg">Notifications</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-8 md:w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <Bell className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">No notifications yet</p>
                  <p className="text-xs text-muted-foreground/60">
                    We'll notify you when something new happens
                  </p>
                </motion.div>
              )}
            </div>

            {notifications.length > 0 && (
              <motion.div 
                className="p-3 md:p-4 border-t border-primary/10 bg-gradient-to-r from-transparent to-primary/5"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="ghost"
                  className="w-full text-xs md:text-sm font-medium text-muted-foreground hover:text-primary group"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="w-3 h-3 md:w-4 md:h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Mark all as read
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;