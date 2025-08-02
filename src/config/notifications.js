import { 
  Clock, 
  Calendar, 
  FileText, 
  PenTool, 
  BookOpen, 
  Folder,
  Bell,
  Users,
  Star,
  Flag
} from 'lucide-react';

export const NOTIFICATION_CONFIG = {
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
  },
  announcement: {
    icon: Bell,
    color: '#dc2626',
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/20'
  },
  community: {
    icon: Users,
    color: '#0ea5e9',
    bgClass: 'bg-sky-500/10',
    borderClass: 'border-sky-500/20'
  },
  achievement: {
    icon: Star,
    color: '#eab308',
    bgClass: 'bg-yellow-500/10',
    borderClass: 'border-yellow-500/20'
  },
  important: {
    icon: Flag,
    color: '#ef4444',
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/20'
  }
};

export const getNotificationConfig = (type) => {
  return NOTIFICATION_CONFIG[type] || NOTIFICATION_CONFIG.announcement;
};