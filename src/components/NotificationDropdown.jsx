import React, { useState } from 'react';
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

  return (
    <div className="relative">
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
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-0 mt-2 w-96 rounded-xl border border-primary/10 bg-background/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 border-b border-primary/10 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className={cn(
                      "p-4 border-b border-primary/5 hover:bg-primary/5 transition-all duration-300 cursor-pointer group",
                      notification.unread && "bg-primary/5"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded-full">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notification.message}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="p-4 border-t border-primary/10 bg-gradient-to-r from-transparent to-primary/5"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="ghost"
                  className="w-full text-sm font-medium text-muted-foreground hover:text-primary group"
                  onClick={() => {
                    setUnreadCount(0);
                    setIsOpen(false);
                  }}
                >
                  <CheckCheck className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Mark all as read
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;