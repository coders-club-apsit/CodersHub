import { DateTime } from 'luxon';
import { cn } from '@/lib/utils';
import { useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { SideHeader } from '@/components/sidebarhead';
import AddEventDialog from '@/components/AddEventDialog';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useUser } from '@clerk/clerk-react';
import { getEvents, deleteEvent } from '@/api/api-events';
import useFetch from '@/hooks/use-fetch';
import { ADMIN_EMAILS } from "@/config/admin";
import { useAuth } from "@clerk/clerk-react";
import { useSupabaseClient } from '@/utils/supabase';

const EventCard = ({ event, onClick }) => {
  // Get the event color for styling
  const eventColor = event.color || '#3b82f6';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group p-5 rounded-2xl shadow-2xl transition-all duration-300',
        'bg-black/80 hover:bg-black/90 backdrop-blur-sm',
        'border border-gray-800/60 hover:border-gray-700/80',
        'cursor-pointer hover:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.8)] transform hover:-translate-y-1',
        'relative overflow-hidden'
      )}
      style={{
        borderColor: `${eventColor}30`,
      }}
    >
      {/* Subtle gradient overlay with event color */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${eventColor}10 0%, transparent 50%, ${eventColor}05 100%)`
        }}
      />

      <div className="relative z-10">
        <div className="mb-4">
          <h2
            className="text-lg font-bold leading-tight transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${eventColor} 0%, ${eventColor}CC 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {event.title}
          </h2>
        </div>

        <div className="space-y-3 text-gray-400">
          <div className="flex items-center group/item hover:text-white transition-colors">
            <Calendar
              className="w-4 h-4 mr-3 transition-colors"
              style={{ color: `${eventColor}80` }}
            />
            <span className="text-sm font-medium">{DateTime.fromISO(event.start).toLocaleString(DateTime.DATE_MED)}</span>
          </div>

          <div className="flex items-center group/item hover:text-white transition-colors">
            <Clock
              className="w-4 h-4 mr-3 transition-colors"
              style={{ color: `${eventColor}80` }}
            />
            <span className="text-sm">
              {DateTime.fromISO(event.start).toLocaleString(DateTime.TIME_SIMPLE)} -
              {DateTime.fromISO(event.end_time).toLocaleString(DateTime.TIME_SIMPLE)}
            </span>
          </div>

          <div className="flex items-center group/item hover:text-white transition-colors">
            <MapPin
              className="w-4 h-4 mr-3 transition-colors"
              style={{ color: `${eventColor}80` }}
            />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {event.tags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="text-gray-300 border transition-all text-xs px-2 py-0.5"
                style={{
                  backgroundColor: `${eventColor}20`,
                  borderColor: `${eventColor}40`,
                  color: eventColor
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Update the EventDialog component
const EventDialog = ({ event, isOpen, onClose, isAdmin, onDelete }) => {
  const eventColor = event.color || '#3b82f6';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-[600px] p-0 overflow-hidden sm:mx-auto bg-black/95 border-gray-800/60 shadow-[0_25px_100px_-12px_rgba(0,0,0,0.8)]"
        style={{
          borderColor: `${eventColor}30`,
          boxShadow: `0 25px 50px -12px ${eventColor}15`
        }}
      >
        {/* Enhanced header with event color */}
        <div className="relative">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `linear-gradient(135deg, ${eventColor}20 0%, transparent 100%)`
            }}
          />
          <div className="relative p-6">
            <DialogHeader>
              <DialogTitle
                className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{
                  background: `linear-gradient(135deg, ${eventColor} 0%, ${eventColor}90 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {event.title}
              </DialogTitle>
              <DialogDescription className="text-gray-400 mt-2">
                {event.type && (
                  <Badge
                    variant="outline"
                    className="capitalize text-sm"
                    style={{
                      backgroundColor: `${eventColor}15`,
                      borderColor: `${eventColor}30`,
                      color: eventColor
                    }}
                  >
                    {event.type}
                  </Badge>
                )}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Styled content */}
        <div className="p-6 pt-2 space-y-6 bg-black/95 backdrop-blur-xl">
          {/* Description */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4
              className="text-sm font-medium"
              style={{ color: `${eventColor}90` }}
            >
              Description
            </h4>
            <p className="text-gray-300 leading-relaxed">
              {event.description || 'No description provided'}
            </p>
          </motion.div>

          {/* Date & Time with color accent */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4
              className="text-sm font-medium"
              style={{ color: `${eventColor}90` }}
            >
              Date & Time
            </h4>
            <div
              className="space-y-3 rounded-lg p-4 transition-colors"
              style={{
                backgroundColor: `${eventColor}10`,
                borderLeft: `3px solid ${eventColor}`
              }}
            >
              <div className="flex items-center gap-3">
                <Calendar
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: eventColor }}
                />
                <span className="text-gray-300 font-medium">
                  {DateTime.fromISO(event.start).toLocaleString(DateTime.DATE_FULL)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: eventColor }}
                />
                <span className="text-gray-300">
                  {DateTime.fromISO(event.start).toLocaleString(DateTime.TIME_SIMPLE)} -
                  {DateTime.fromISO(event.end_time).toLocaleString(DateTime.TIME_SIMPLE)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Location with color accent */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4
              className="text-sm font-medium"
              style={{ color: `${eventColor}90` }}
            >
              Location
            </h4>
            <div className="flex items-center gap-3">
              <MapPin
                className="w-4 h-4"
                style={{ color: eventColor }}
              />
              <span className="text-gray-300">{event.location}</span>
            </div>
          </motion.div>

          {/* Tags with event color */}
          {event.tags && event.tags.length > 0 && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4
                className="text-sm font-medium"
                style={{ color: `${eventColor}90` }}
              >
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Badge
                      variant="outline"
                      className="text-xs transition-all hover:scale-105"
                      style={{
                        backgroundColor: `${eventColor}15`,
                        borderColor: `${eventColor}30`,
                        color: eventColor
                      }}
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Admin controls with color accent */}
        {isAdmin && (
          <motion.div
            className="p-6 border-t border-gray-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="destructive"
              className="w-full group transition-all duration-300"
              style={{
                backgroundColor: `${eventColor}15`,
                borderColor: `${eventColor}30`,
                color: eventColor
              }}
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this event?')) {
                  try {
                    await onDelete(event.id);
                  } catch (error) {
                    console.error('Delete button error:', error);
                    toast.error('Failed to delete event');
                  }
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Delete Event
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Events = () => {
  const { user, isLoaded } = useUser();
  const supabase = useSupabaseClient();
  const [isAdmin, setIsAdmin] = useState(false);

  // Add admin check
  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const {
    loading: loadingEvents,
    data: events,
    fn: fetchEvents
  } = useFetch(getEvents);

  const refreshEvents = useCallback(async () => {
    try {
      const updatedEvents = await fetchEvents();
      console.log('Events refreshed:', updatedEvents);
    } catch (error) {
      console.error('Error refreshing events:', error);
    }
  }, [fetchEvents]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewType, setViewType] = useState('dayGridMonth');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isMounted, setIsMounted] = useState(false);

  const upcomingEvents = events?.filter(e => DateTime.fromISO(e.start) > DateTime.now()) || [];

  useEffect(() => {
    if (isLoaded) {
      fetchEvents().then(data => {
        console.log('Event data:', data); // Check the data structure
      });
    }
  }, [isLoaded]);

  const handleDateClick = useCallback(info => {
    console.log('Clicked on date:', info.dateStr);
  }, []);

  const handleEventClick = useCallback(info => {
    const clickedEvent = events.find(e => e.id === info.event.id);
    setSelectedEvent(clickedEvent);
  }, [events]);

  const handleAddEvent = useCallback((eventData) => {
    fetchEvents();
  }, [fetchEvents]);

  
  const { getToken } = useAuth();

  const handleDeleteEvent = async (id) => {
    try {
      if (!id) {
        toast.error('Invalid ID');
        return;
      }

      toast.loading("Deleting event...");

      const token = await getToken();
      await deleteEvent(id);               

      setSelectedEvent(null);
      await refreshEvents();
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete event: ' + error.message);
    }
  };



  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />        <div className="flex-1 min-h-screen bg-black">
          <div className="mx-auto px-4 sm:px-6 py-8">
            <SideHeader />

            <div className="w-[100%] flex items-center justify-center mx-auto">
              <motion.div
                className="space-y-4 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-blue-600 pb-4">
                  Upcoming Events
                </h1>
                <p className="text-lg text-muted-foreground/80 mb-4 pb-4">
                  Discover and join upcoming workshops, contests, and seminars
                </p>
              </motion.div>
            </div>

            {loadingEvents ? (
              <div className="flex justify-center items-center h-[50vh]">
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                />
              </div>
            ) : (<div className="flex flex-col xl:flex-row gap-6">
              <motion.div
                className="w-full xl:w-[70%] rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 bg-gray-900/95 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="px-6 py-5 border-b border-gray-700/40 bg-gray-900/90 backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                      <h3 className="text-xl font-semibold text-white">
                        Event Calendar
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20">
                        {events?.length || 0} Total Events
                      </Badge>
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20">
                        {upcomingEvents.length} Upcoming
                      </Badge>
                    </div>
                  </div>
                </div><div className="p-0">
                  <div className="overflow-hidden bg-gray-900/95 backdrop-blur-sm border-0 rounded-none">                      <style>{`
                        .fc {
                          --fc-border-color: rgba(55, 65, 81, 0.3);
                          --fc-button-bg-color: rgba(31, 41, 55, 0.9);
                          --fc-button-border-color: rgba(55, 65, 81, 0.6);
                          --fc-button-hover-bg-color: rgba(55, 65, 81, 0.8);
                          --fc-button-hover-border-color: rgba(75, 85, 99, 0.8);
                          --fc-button-active-bg-color: rgba(59, 130, 246, 0.9);
                          --fc-today-bg-color: rgba(59, 130, 246, 0.1);
                          --fc-page-bg-color: transparent;
                          --fc-neutral-bg-color: transparent;
                          --fc-list-event-hover-bg-color: rgba(55, 65, 81, 0.3);
                          max-width: 100%;
                          background: black;
                          color: rgb(243, 244, 246);
                          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        }
                          /* Toolbar styling */
                        .fc .fc-toolbar {
                          padding: 1.5rem 1.5rem 1rem 1.5rem;
                          margin-bottom: 0 !important;
                          background: black;
                          border-bottom: 1px solid rgba(55, 65, 81, 0.3);
                          border-radius: 0;
                        }
                        
                        .fc .fc-toolbar-title {
                          font-size: 1.75rem !important;
                          font-weight: 600 !important;
                          color: rgb(243, 244, 246) !important;
                          letter-spacing: -0.025em;
                        }
                        
                        .fc .fc-toolbar-chunk {
                          gap: 1rem;
                          display: flex;
                          align-items: center;
                        }
                        
                        /* Enhanced button group spacing */
                        .fc .fc-button-group {
                          gap: 0.5rem !important;
                        }
                        
                        .fc .fc-button-group .fc-button {
                          margin: 0 0.25rem !important;
                        }
                        
                        /* Navigation buttons spacing */
                        .fc .fc-prev-button {
                          margin-right: 0.75rem !important;
                        }
                        
                        .fc .fc-next-button {
                          margin-left: 0.75rem !important;
                          margin-right: 1.5rem !important;
                        }
                        
                        .fc .fc-today-button {
                          margin-right: 1.5rem !important;
                        }
                        
                        /* Modern button styling */
                        .fc .fc-button-primary {
                          background: rgba(31, 41, 55, 0.9) !important;
                          border: 1px solid rgba(55, 65, 81, 0.6) !important;
                          color: rgb(229, 231, 235) !important;
                          font-weight: 500 !important;
                          border-radius: 0.75rem !important;
                          padding: 0.625rem 1.25rem !important;
                          transition: all 0.3s ease !important;
                          backdrop-filter: blur(10px) !important;
                          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3) !important;
                        }
                        
                        .fc .fc-button-primary:hover {
                          background: rgba(55, 65, 81, 0.9) !important;
                          border-color: rgba(75, 85, 99, 0.8) !important;
                          transform: translateY(-2px) !important;
                          box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.4) !important;
                        }
                        
                        .fc .fc-button-primary:disabled {
                          background: rgba(17, 24, 39, 0.6) !important;
                          border-color: rgba(31, 41, 55, 0.4) !important;
                          color: rgba(107, 114, 128, 0.6) !important;
                        }
                        
                        .fc .fc-button-active {
                          background: rgba(59, 130, 246, 0.9) !important;
                          border-color: rgba(59, 130, 246, 1) !important;
                          color: rgb(255, 255, 255) !important;
                          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
                        }
                        
                        /* Calendar grid styling */
                        .fc .fc-scrollgrid {
                          border: none !important;
                        }
                        
                        .fc .fc-col-header-cell {
                          background: black !important;
                          border-color: rgba(55, 65, 81, 0.2) !important;
                          font-weight: 600 !important;
                          color: rgb(156, 163, 175) !important;
                          text-transform: uppercase !important;
                          font-size: 0.75rem !important;
                          letter-spacing: 0.05em !important;
                          padding: 1rem 0.5rem !important;
                        }
                        
                        .fc .fc-daygrid-day {
                          background: black !important;
                          border-color: rgba(55, 65, 81, 0.15) !important;
                          min-height: 120px !important;
                        }
                        
                        .fc .fc-daygrid-day:hover {
                          background: rgba(17, 24, 39, 0.8) !important;
                        }
                        
                        .fc .fc-daygrid-day-number {
                          color: rgb(229, 231, 235) !important;
                          font-weight: 500 !important;
                          font-size: 0.9rem !important;
                          padding: 0.75rem !important;
                        }
                        
                        .fc .fc-day-today {
                          background: rgba(59, 130, 246, 0.08) !important;
                        }
                        
                        .fc .fc-day-today .fc-daygrid-day-number {
                          background: rgba(59, 130, 246, 0.9) !important;
                          color: white !important;
                          border-radius: 0.5rem !important;
                          width: 2rem !important;
                          height: 2rem !important;
                          display: flex !important;
                          align-items: center !important;
                          justify-content: center !important;
                          margin: 0.5rem !important;
                          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
                        }
                          /* Modern event styling */
                        .fc .fc-daygrid-event {
                          border-radius: 0.5rem !important;
                          border: none !important;
                          margin: 0.125rem !important;
                          padding: 0.375rem 0.625rem !important;
                          font-size: 0.75rem !important;
                          font-weight: 500 !important;
                          backdrop-filter: blur(10px) !important;
                          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
                          transition: all 0.3s ease !important;
                          min-height: 28px !important;
                          overflow: visible !important;
                        }
                        
                        /* Event content styling to prevent text cutoff */
                        .fc .fc-event-title-container {
                          overflow: visible !important;
                          white-space: nowrap !important;
                        }
                        
                        .fc .fc-event-title {
                          overflow: visible !important;
                          text-overflow: unset !important;
                          white-space: nowrap !important;
                          font-size: 0.75rem !important;
                          line-height: 1.2 !important;
                        }
                        
                        .fc .fc-event-time {
                          overflow: visible !important;
                          text-overflow: unset !important;
                          white-space: nowrap !important;
                          font-size: 0.7rem !important;
                          opacity: 0.9 !important;
                          margin-right: 0.25rem !important;
                        }
                        
                        .fc .fc-daygrid-event-harness {
                          overflow: visible !important;
                          position: relative !important;
                        }
                        
                        .fc .fc-daygrid-event .fc-event-main {
                          overflow: visible !important;
                          padding: 0 !important;
                        }
                        
                        .fc .fc-daygrid-event:hover {
                          filter: brightness(1.2) !important;
                          transform: translateY(-2px) scale(1.02) !important;
                          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
                          z-index: 10 !important;
                        }
                        
                        .fc .fc-daygrid-more-link {
                          color: rgb(59, 130, 246) !important;
                          font-weight: 500 !important;
                          font-size: 0.75rem !important;
                          text-decoration: none !important;
                          padding: 0.25rem 0.5rem !important;
                          border-radius: 0.375rem !important;
                          background: rgba(59, 130, 246, 0.15) !important;
                          border: 1px solid rgba(59, 130, 246, 0.3) !important;
                          margin: 0.125rem !important;
                          position: relative !important;
                          cursor: pointer !important;
                          transition: all 0.3s ease !important;
                          backdrop-filter: blur(8px) !important;
                        }
                        
                        .fc .fc-daygrid-more-link:hover {
                          background: rgba(59, 130, 246, 0.25) !important;
                          border-color: rgba(59, 130, 246, 0.5) !important;
                          transform: translateY(-1px) !important;
                          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
                        }
                        
                        /* Enhanced popover styling */
                        .fc .fc-popover {
                          background: rgba(0, 0, 0, 0.95) !important;
                          border: 1px solid rgba(55, 65, 81, 0.4) !important;
                          border-radius: 1rem !important;
                          backdrop-filter: blur(20px) !important;
                          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important;
                          z-index: 1000 !important;
                        }
                        
                        .fc .fc-popover-header {
                          background: rgba(17, 24, 39, 0.9) !important;
                          border-bottom: 1px solid rgba(55, 65, 81, 0.4) !important;
                          border-radius: 1rem 1rem 0 0 !important;
                          padding: 1rem 1.25rem !important;
                          color: rgb(243, 244, 246) !important;
                          font-weight: 600 !important;
                          font-size: 0.875rem !important;
                        }
                        
                        .fc .fc-popover-body {
                          padding: 0.75rem !important;
                          max-height: 300px !important;
                          overflow-y: auto !important;
                        }
                        
                        .fc .fc-popover .fc-daygrid-event {
                          margin: 0.25rem !important;
                          padding: 0.625rem 0.875rem !important;
                          border-radius: 0.625rem !important;
                          font-size: 0.8rem !important;
                          font-weight: 500 !important;
                          cursor: pointer !important;
                          transition: all 0.3s ease !important;
                          backdrop-filter: blur(10px) !important;
                        }
                        
                        .fc .fc-popover .fc-daygrid-event:hover {
                          transform: translateY(-1px) scale(1.02) !important;
                          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
                          filter: brightness(1.2) !important;
                        }
                        
                        .fc .fc-popover-close {
                          color: rgb(156, 163, 175) !important;
                          font-size: 1.25rem !important;
                          padding: 0.25rem !important;
                          border-radius: 0.375rem !important;
                          transition: all 0.3s ease !important;
                        }
                        
                        .fc .fc-popover-close:hover {
                          background: rgba(55, 65, 81, 0.4) !important;
                          color: rgb(243, 244, 246) !important;
                          transform: scale(1.1) !important;
                        }
                        
                        /* Responsive adjustments */
                        @media (max-width: 640px) {
                          .fc .fc-toolbar {
                            padding: 1rem;
                            flex-direction: column;
                            gap: 1rem;
                          }
                          
                          .fc .fc-toolbar-chunk {
                            gap: 0.75rem;
                            justify-content: center;
                          }
                          
                          .fc .fc-button-group {
                            gap: 0.5rem !important;
                          }
                          
                          .fc .fc-prev-button,
                          .fc .fc-next-button,
                          .fc .fc-today-button {
                            margin: 0 0.25rem !important;
                          }
                          
                          .fc .fc-toolbar-title {
                            font-size: 1.5rem !important;
                          }
                          
                          .fc .fc-button {
                            padding: 0.5rem 1rem !important;
                            font-size: 0.875rem !important;
                          }
                          
                          .fc .fc-daygrid-day {
                            min-height: 80px !important;
                          }
                          
                          .fc .fc-daygrid-day-number {
                            padding: 0.5rem !important;
                            font-size: 0.8rem !important;
                          }
                          
                          .fc .fc-daygrid-event {
                            font-size: 0.65rem !important;
                            padding: 0.25rem 0.5rem !important;
                          }
                        }
                      `}</style><FullCalendar
                      plugins={[dayGridPlugin, interactionPlugin]}
                      initialView={viewType}
                      dateClick={handleDateClick}
                      eventClick={handleEventClick}
                      moreLinkClick="popover"
                      eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: 'short'
                      }}
                      eventDisplay="block"
                      displayEventTime={true}
                      className="calendar-custom"
                      events={events?.map(event => ({
                        id: event.id,
                        title: event.title,
                        start: event.start,
                        end: event.end_time,
                        backgroundColor: `${event.color}15`,
                        borderColor: event.color,
                        textColor: event.color,
                        classNames: ['calendar-event']
                      }))}
                      height="auto"
                      aspectRatio={windowWidth < 640 ? 0.8 : 1.35}
                      expandRows={true}
                      headerToolbar={{
                        left: windowWidth < 640 ? 'prev,next' : 'prev,next today',
                        center: 'title',
                        right: windowWidth < 640 ? 'dayGridMonth' : 'dayGridMonth,dayGridWeek'
                      }}
                      views={{
                        dayGridMonth: {
                          dayMaxEvents: windowWidth < 640 ? 2 : 3,
                          dayMaxEventRows: windowWidth < 640 ? 2 : 3,
                        },
                        dayGridWeek: {
                          dayMaxEvents: windowWidth < 640 ? 3 : 5,
                        }
                      }}
                      moreLinkContent={(args) => (
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 text-[10px] sm:text-xs py-0 px-1"
                        >
                          +{args.num} more
                        </Badge>
                      )}
                    />
                  </div>
                </div>
              </motion.div>                {/* Upcoming Events Panel with proper height matching */}
              <motion.div
                className="w-full xl:w-[30%] h-[600px] xl:h-[calc(100vh-12rem)] rounded-2xl border border-gray-800/60 bg-black/90 backdrop-blur-sm shadow-[0_25px_100px_-12px_rgba(0,0,0,0.6)]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col h-full">
                  <div className="sticky top-0 z-20 px-6 py-5 bg-black/95 backdrop-blur-xl border-b border-gray-800/60 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-6 bg-gradient-to-b from-white via-gray-300 to-gray-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-white">
                          Upcoming Events
                        </h3>
                      </div>
                      <Badge variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-gray-700/50 hover:text-white hover:border-gray-600/70 transition-all">
                        {upcomingEvents.length} Events
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700/60 hover:scrollbar-thumb-gray-600/80 scrollbar-track-transparent">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: 0.1 * index }
                          }}
                          whileHover={{ scale: 1.02 }}
                          className="transition-all"
                        >
                          <EventCard
                            event={event}
                            onClick={() => setSelectedEvent(event)}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full text-center text-gray-500"
                      >
                        <Calendar className="w-12 h-12 mb-4 text-gray-600/60" />
                        <p className="text-lg font-medium text-gray-400">No upcoming events</p>
                        <p className="text-sm text-gray-600">Check back later or create a new event</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
            )}            {/* Modern floating Add button for admins */}
            {isAdmin && (
              <motion.div
                className="fixed bottom-8 right-8 z-50"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95, rotate: 45 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 h-14 w-14 border-2 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                  size="lg"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </motion.div>
            )}

            {selectedEvent && (
              <EventDialog
                event={selectedEvent}
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                isAdmin={isAdmin}
                onDelete={handleDeleteEvent}
              />
            )}

            {/* Only show AddEventDialog for admins */}
            {isAdmin && showAddDialog && (
              <AddEventDialog
                isOpen={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                onSubmit={handleAddEvent}
              />
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

const EventsPage = () => {
  return (
    <ErrorBoundary>
      <Events />
    </ErrorBoundary>
  );
};

export default EventsPage;