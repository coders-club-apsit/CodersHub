import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { NOTIFICATION_CONFIG } from '@/config/notifications';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead 
} from '@/lib/notification-service';
import { supabase } from '@/lib/supabase';


const NotificationItem = ({ notification, onMarkAsRead }) => {
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
      onClick={onMarkAsRead}
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const { success, notifications, error } = await fetchNotifications();
      if (success) {
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => n.unread).length);
      } else {
        console.error('Error loading notifications:', error);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new, ...prev]);
            if (payload.new.unread) {
              setUnreadCount(count => count + 1);
              new Audio('/notification.mp3').play().catch(() => {});
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const { success } = await markAsRead(notificationId);
      if (success) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { success } = await markAllAsRead();
      if (success) {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        setUnreadCount(0);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDropdownClick = () => {
    if (isMobile) {
      setIsOpen(prev => !prev);
    }
  };

  return (
    <div 
      className="relative"
      ref={dropdownRef}
      onMouseEnter={!isMobile ? () => setIsOpen(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsOpen(false) : undefined}
      onClick={handleDropdownClick}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="relative group"
          onClick={() => setIsOpen(!isOpen)}
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
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mb-2 opacity-20" />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <motion.div 
                className="p-4 border-t border-primary/10 bg-gradient-to-r from-transparent to-primary/5"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="ghost"
                  className="w-full text-sm font-medium text-muted-foreground hover:text-primary group"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
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