import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Calendar, Users, Bell, RefreshCw } from "lucide-react";
import { createNotification, fetchRecentNotifications, deleteNotification } from '@/lib/notification-service';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { SideHeader } from '@/components/sidebarhead';
import { ADMIN_EMAILS } from '@/config/admin';


export default function BroadcastNotification() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: '',
    metadata: {}
  });

  // Check if user is admin
  useEffect(() => {
    if (user && user.email) {
      const email = user.email.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email));
    }
  }, [user]);

  // Fetch recent notifications
  useEffect(() => {
    const loadRecentNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const notifications = await fetchRecentNotifications();
        setRecentNotifications(notifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
        toast.error('Failed to load recent notifications');
      } finally {
        setLoadingNotifications(false);
      }
    };

    loadRecentNotifications();
  }, []);

  const handleDeleteNotification = async (notificationId) => {
    if (!isAdmin) {
      toast.error('Unauthorized', {
        description: 'Only admins can delete notifications.'
      });
      return;
    }

    try {
      await deleteNotification(notificationId);
      setRecentNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const refreshNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const notifications = await fetchRecentNotifications();
      setRecentNotifications(notifications);
      toast.success('Notifications refreshed');
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      toast.error('Failed to refresh notifications');
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !isAdmin) {
      toast.error('Unauthorized', {
        description: 'You must be an admin to broadcast notifications.'
      });
      return;
    }

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Validation Error', {
        description: 'Please fill in all required fields.'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const toastId = toast.loading('Broadcasting notification...', {
        description: 'Please wait while we send your notification.'
      });

      const result = await createNotification({
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type || 'info',
        metadata: {
          ...formData.metadata,
          broadcastBy: user.email,
          broadcastAt: new Date().toISOString()
        },
        created_by: user?.id
      });

      if (result.success) {
        toast.success('Notification sent!', {
          description: 'Your notification has been broadcast successfully.'
        });
        
        // Reset form
        setFormData({
          title: '',
          message: '',
          type: '',
          metadata: {}
        });

        // Refresh notifications list
        await refreshNotifications();
      } else {
        throw new Error(result.error);
      }

      toast.dismiss(toastId);
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      toast.error('Broadcast failed', {
        description: error.message || 'Failed to send notification. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex bg-background text-foreground w-full relative mt-16">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <SideHeader/>

          <main className="flex-1 p-6 relative">
            <div className="mx-auto px-4 sm:px-6 py-8">
              <motion.div
                className="relative max-w-6xl mx-auto space-y-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Header */}
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Notification Center
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Broadcast important updates and announcements to all users
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Broadcast Form */}
                  <Card className="h-fit">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Create Notification
                      </CardTitle>
                      <CardDescription>
                        Send a notification to all registered users
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            type="text"
                            placeholder="Enter notification title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Enter notification message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={4}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="type">Type</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select notification type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading || !isAdmin}
                          className="w-full"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Broadcasting...
                            </>
                          ) : (
                            <>
                              <Bell className="mr-2 h-4 w-4" />
                              Broadcast Notification
                            </>
                          )}
                        </Button>

                        {!isAdmin && (
                          <p className="text-sm text-destructive text-center">
                            Only administrators can broadcast notifications
                          </p>
                        )}
                      </form>
                    </CardContent>
                  </Card>

                  {/* Recent Notifications */}
                  <Card className="h-fit">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Recent Notifications
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={refreshNotifications}
                          disabled={loadingNotifications}
                        >
                          {loadingNotifications ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <CardDescription>
                        View and manage recent broadcast notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ScrollArea className="h-[400px] pr-4">
                        {loadingNotifications ? (
                          <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="p-3 border rounded-lg animate-pulse">
                                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                                <div className="h-3 bg-muted rounded w-2/3"></div>
                              </div>
                            ))}
                          </div>
                        ) : recentNotifications.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No notifications yet</p>
                            <p className="text-sm">Broadcast your first notification above</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {recentNotifications.map((notification) => (
                              <div
                                key={notification.id}
                                className="p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant={notification.type || 'info'} className="text-xs">
                                        {notification.type || 'info'}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(notification.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <h4 className="font-medium text-sm truncate">
                                      {notification.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                  </div>
                                  {isAdmin && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteNotification(notification.id)}
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}