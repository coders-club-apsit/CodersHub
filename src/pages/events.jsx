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
import { useSupabaseClient } from '@/utils/supabase';

const EventCard = ({ event, onClick }) => (
  <div
    onClick={onClick}
    className={cn(
      'group p-6 rounded-xl shadow-lg transition-all duration-300',
      'bg-background/50 hover:bg-background/80 backdrop-blur-sm',
      'border border-primary/10 hover:border-primary/20',
      'cursor-pointer hover:shadow-xl transform hover:-translate-y-1'
    )}
  >
    <div className="mb-4">
      <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 group-hover:to-blue-500">
        {event.title}
      </h2>
    </div>
    
    <div className="space-y-3 text-muted-foreground/80">
      <div className="flex items-center group/item hover:text-primary transition-colors">
        <Calendar className="w-4 h-4 mr-3 text-primary/60 group-hover/item:text-primary" />
        <span>{DateTime.fromISO(event.start).toLocaleString(DateTime.DATE_MED)}</span>
      </div>
      
      <div className="flex items-center group/item hover:text-primary transition-colors">
        <Clock className="w-4 h-4 mr-3 text-primary/60 group-hover:item:text-primary" />
        <span>
          {DateTime.fromISO(event.start).toLocaleString(DateTime.TIME_SIMPLE)} - 
          {DateTime.fromISO(event.end_time).toLocaleString(DateTime.TIME_SIMPLE)}
        </span>
      </div>
      
      <div className="flex items-center group/item hover:text-primary transition-colors">
        <MapPin className="w-4 h-4 mr-3 text-primary/60 group-hover:item:text-primary" />
        <span>{event.location}</span>
      </div>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {event.tags && event.tags.map(tag => (
        <Badge 
          key={tag}
          variant="outline" 
          className="bg-primary/5 text-primary/70 hover:bg-primary/10 transition-colors"
        >
          {tag}
        </Badge>
      ))}
    </div>
  </div>
);

const EventDialog = ({ event, isOpen, onClose, isAdmin, onDelete }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent 
      className="max-w-[95vw] sm:max-w-[600px] p-0 overflow-hidden sm:mx-auto" 
      aria-describedby="event-dialog-description"
    >
      {/* Header with responsive gradient background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="relative p-4 sm:p-6 pb-2 sm:pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-blue-600 leading-tight">
              {event.title}
            </DialogTitle>
            <DialogDescription id="event-dialog-description" className="sr-only">
              Details for the event {event.title}
            </DialogDescription>
          </DialogHeader>
        </div>
      </div>

      {/* Responsive content with hover effects */}
      <div className="p-4 sm:p-6 pt-2 space-y-4 sm:space-y-6 bg-background/95 backdrop-blur-xl">
        {/* Description */}
        <motion.div 
          className="space-y-2 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="text-sm font-medium text-primary/70 group-hover:text-primary transition-colors">
            Description
          </h4>
          <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed">
            {event.description || 'No description provided'}
          </p>
        </motion.div>

        {/* Type with responsive badge */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-sm font-medium text-primary/70">Type</h4>
          <Badge 
            variant="outline" 
            className="text-xs sm:text-sm bg-primary/5 text-primary hover:bg-primary/10 transition-colors capitalize"
          >
            {event.type || 'General'}
          </Badge>
        </motion.div>

        {/* Date & Time with improved responsive layout */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-sm font-medium text-primary/70">Date & Time</h4>
          <div className="space-y-2 bg-primary/5 rounded-lg p-2 sm:p-3 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-4 h-4 text-primary/70 flex-shrink-0" />
              <span className="text-sm sm:text-base text-muted-foreground/90 font-medium">
                {DateTime.fromISO(event.start).toLocaleString(DateTime.DATE_FULL)}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="w-4 h-4 text-primary/70 flex-shrink-0" />
              <span className="text-sm sm:text-base text-muted-foreground/90">
                {DateTime.fromISO(event.start).toLocaleString(DateTime.TIME_SIMPLE)} - 
                {DateTime.fromISO(event.end_time).toLocaleString(DateTime.TIME_SIMPLE)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tags with responsive grid */}
        {event.tags && event.tags.length > 0 && (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-sm font-medium text-primary/70">Tags</h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {event.tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Badge 
                    variant="outline" 
                    className="text-xs sm:text-sm bg-primary/5 text-primary hover:bg-primary/10 transition-all hover:scale-105"
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Add admin controls */}
      {isAdmin && (
        <motion.div 
          className="p-4 sm:p-6 border-t border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="destructive"
            className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 group"
            onClick={async () => {
              console.log('Deleting event:', event); // Add this log
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

  const handleDeleteEvent = async (id) => {
    try {
      if (!id) {
        console.error('No event ID provided');
        toast.error('Unable to delete event: Invalid ID');
        return;
      }

      toast.loading('Deleting event...');
      await deleteEvent(id);
      setSelectedEvent(null);
      await refreshEvents(); // Use the new refresh function
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
        <Sidebar />
        <div className="flex-1 min-h-screen bg-gradient-to-b from-background/80 via-background to-background/80">
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
                <p className="text-lg text-muted-foreground/80 mb-4">
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
            ) : (
              <div className="flex flex-col xl:flex-row gap-6">
                <motion.div 
                  className="w-full xl:w-[70%] rounded-2xl overflow-hidden shadow-xl border border-primary/10 bg-background/50 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="px-4  py-4 sm:py-5 border-b border-primary/10 bg-background/90 backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        Event Calendar
                      </h3>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {events?.length || 0} Total Events
                        </Badge>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {upcomingEvents.length} Upcoming
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 sm:p-4 md:p-6">
                    <div className="rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/10">
                      <style>{`
                        .fc {
                          --fc-border-color: rgba(59, 130, 246, 0.1);
                          --fc-button-bg-color: rgba(59, 130, 246, 0.1);
                          --fc-button-border-color: rgba(59, 130, 246, 0.2);
                          --fc-button-hover-bg-color: rgba(59, 130, 246, 0.2);
                          --fc-button-hover-border-color: rgba(59, 130, 246, 0.3);
                          --fc-button-active-bg-color: rgba(59, 130, 246, 0.3);
                          --fc-today-bg-color: rgba(59, 130, 246, 0.05);
                          --fc-page-bg-color: transparent;
                          --fc-neutral-bg-color: transparent;
                          max-width: 100%;
                        }
                        .fc .fc-toolbar {
                          padding: 1rem;
                          margin-bottom: 0.5rem !important;
                          background: rgba(0, 0, 0, 0.04);
                          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
                        }
                        .fc .fc-toolbar-chunk,
                        .fc-button-group {
                          gap: 0.5rem;
                        }
                        .fc .fc-toolbar-chunk button,
                        .fc-button-group button {
                          padding: 0.5rem;
                          font-weight: 500;
                        }
                        @media (max-width: 640px) {
                          .fc {
                            font-size: 0.875rem;
                          }
                          .fc .fc-toolbar {
                            padding: 0.75rem;
                            flex-direction: column;
                            gap: 0.75rem;
                          }
                          .fc .fc-toolbar-title {
                            font-size: 1.25rem !important;
                          }
                          .fc .fc-button {
                            padding: 0.375rem 0.75rem !important;
                            font-size: 0.875rem;
                          }
                          .fc .fc-daygrid-day-number {
                            padding: 0.25rem;
                            font-size: 0.875rem;
                          }
                          .fc .fc-daygrid-event {
                            padding: 0.125rem 0.375rem;
                            font-size: 0.75rem;
                          }
                          .fc-view-harness {
                            min-height: 400px !important;
                            height: calc(100vh - 200px) !important;
                          }
                        }
                      `}</style>
                      <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView={viewType}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        events={events?.map(event => ({
                          id: event.id,
                          title: event.title,
                          start: event.start,
                          end: event.end_time,
                          backgroundColor: `${event.color}15`,
                          borderColor: event.color,
                          textColor: event.color,
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
                            dayMaxEvents: windowWidth < 640 ? 1 : 3,
                            dayMaxEventRows: windowWidth < 640 ? 1 : 3,
                          },
                          dayGridWeek: {
                            dayMaxEvents: windowWidth < 640 ? 2 : 4,
                          }
                        }}
                        moreLinkContent={(args) => (
                          <Badge 
                            variant="outline" 
                            className="bg-primary/5 text-primary hover:bg-primary/10 text-[10px] sm:text-xs py-0 px-1"
                          >
                            +{args.num} more
                          </Badge>
                        )}
                        dayMaxEvents={windowWidth < 640 ? 2 : 3}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="w-full xl:w-[30%] h-[600px] xl:h-[calc(100vh-12rem)] rounded-xl border border-primary/10 bg-background/50 backdrop-blur-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex flex-col h-full">
                    <div className="sticky top-0 z-20 px-6 py-5 bg-background/80 backdrop-blur-xl border-b border-primary/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                          Upcoming Events
                        </h3>
                        <Badge variant="outline" className="bg-primary/5 text-primary">
                          {upcomingEvents.length} Events
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent">
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
                          className="flex flex-col items-center justify-center h-full text-center text-muted-foreground/60"
                        >
                          <Calendar className="w-12 h-12 mb-4 text-primary/40" />
                          <p className="text-lg font-medium">No upcoming events</p>
                          <p className="text-sm">Check back later or create a new event</p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Only show Add button for admins */}
            {isAdmin && (
              <motion.div
                className="fixed bottom-6 right-6 z-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl rounded-full p-6"
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