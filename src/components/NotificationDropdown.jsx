import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const notifications = [
  {
    id: 1,
    title: 'New Resource Added',
    message: 'Check out the new DSA practice problems!',
    time: '2m ago',
    unread: true,
    type: 'info',
  },
  {
    id: 2,
    title: 'Upcoming Contest',
    message: 'Weekly coding contest starts in 1 hour',
    time: '1h ago',
    unread: true,
    type: 'event',
  },
];

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const dropdownRef = useRef(null);

  // Add check for mobile device
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Handle hover interactions
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div 
      className="relative"
      ref={dropdownRef}
      onMouseEnter={!isMobile ? handleMouseEnter : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
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
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className={cn(
                    "p-3 md:p-4 border-b border-primary/5 hover:bg-primary/5 transition-all duration-300 cursor-pointer group",
                    notification.unread && "bg-primary/5"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-xs md:text-sm group-hover:text-primary transition-colors">
                      {notification.title}
                    </h4>
                    <span className="text-[10px] md:text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded-full">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="p-3 md:p-4 border-t border-primary/10 bg-gradient-to-r from-transparent to-primary/5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                variant="ghost"
                className="w-full text-xs md:text-sm font-medium text-muted-foreground hover:text-primary group"
                onClick={() => {
                  setUnreadCount(0);
                  setIsOpen(false);
                }}
              >
                <CheckCheck className="w-3 h-3 md:w-4 md:h-4 mr-2 group-hover:scale-110 transition-transform" />
                Mark all as read
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;