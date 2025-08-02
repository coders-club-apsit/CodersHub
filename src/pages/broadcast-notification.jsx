import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { NOTIFICATION_CONFIG } from '@/config/notifications';
import { createNotification } from '@/lib/notification-service';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { SideHeader } from '@/components/sidebarhead';


export default function BroadcastNotification() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: '',
    metadata: {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Show loading toast
    const toastId = toast.loading('Broadcasting notification...', {
      description: 'Please wait while we send your notification.'
    });

    try {
      const result = await createNotification({
        ...formData,
        created_by: user?.id
      });

      if (result.success) {
        toast.success('Notification sent!', {
          description: 'Your notification has been broadcast successfully.'
        });
        setFormData({ title: '', message: '', type: '', metadata: {} });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      toast.error('Broadcast failed', {
        description: error.message || 'Failed to send notification. Please try again.'
      });
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex bg-background text-foreground w-full relative">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <SideHeader/>

          <main className="flex-1 p-6 relative">
            <div className=" mx-auto px-4 sm:px-6 py-16">
              <motion.div
                className="relative max-w-4xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Gradient Orbs */}
                <div className="absolute -top-[150px] -right-[150px] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -top-[150px] -left-[150px] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Page Header */}
                <motion.div 
                  className="relative z-10 mb-8 text-center space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-gray-700/30">
                    <span className="text-sm font-medium text-gray-300 px-3 py-1">
                      📢 Broadcast Center
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                      Broadcast Notification
                    </span>
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Send important updates and announcements to all users in the system
                  </p>
                </motion.div>

                {/* Main Content */}
                <div className="relative z-10">
                  <motion.div
                    className="space-y-6 bg-black/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Notification Type</label>
                          <Select
                            value={formData.type}
                            onValueChange={value => setFormData({ ...formData, type: value })}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select notification type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(NOTIFICATION_CONFIG).map(([type, config]) => (
                                <SelectItem key={type} value={type}>
                                  <div className="flex items-center gap-2">
                                    <config.icon 
                                      className="w-4 h-4" 
                                      style={{ color: config.color }} 
                                    />
                                    <span>{type.split('_').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="h-11"
                            placeholder="Enter notification title"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Message</label>
                          <Textarea
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            className="min-h-[100px] resize-none"
                            placeholder="Enter notification message"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-11"
                        disabled={isLoading || !formData.type || !formData.title || !formData.message}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Broadcasting...
                          </div>
                        ) : (
                          'Broadcast Notification'
                        )}
                      </Button>
                    </form>

                    {/* Preview Section */}
                    <div className="mt-8 border-t border-gray-800/50 pt-6">
                      <h2 className="text-lg font-semibold mb-4 text-gray-200">Preview</h2>
                      {formData.type && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border border-gray-800/50 rounded-xl p-4 bg-gray-900/50"
                        >
                          <NotificationPreview notification={{
                            ...formData,
                            unread: true,
                            created_at: new Date().toISOString()
                          }} />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function NotificationPreview({ notification }) {
  const config = NOTIFICATION_CONFIG[notification.type];
  const Icon = config?.icon;

  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div 
          className={`p-2 rounded-full ${config.bgClass}`}
          style={{ borderColor: config.color, borderWidth: '1px' }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </div>
      )}
      <div className="flex-1">
        <h4 className="font-medium text-sm">{notification.title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
      </div>
    </div>
  );
}