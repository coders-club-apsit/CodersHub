import { DateTime } from 'luxon';
import { cn } from '@/lib/utils';
import { useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { SideHeader } from '@/components/sidebarhead';
import AddEventDialog from '@/components/AddEventDialog';
import { useSupabaseClient } from '@/utils/supabase';
import { toast } from 'sonner';

const EventCard = ({ event, onClick, isRegistered }) => (
  <div
    onClick={onClick}
    className={cn(
      'group p-6 rounded-xl shadow-lg transition-all duration-300',
      'bg-background/50 hover:bg-background/80 backdrop-blur-sm',
      'border border-primary/10 hover:border-primary/20',
      'cursor-pointer hover:shadow-xl transform hover:-translate-y-1'
    )}
  >
    <div className="flex items-start justify-between mb-4">
      <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 group-hover:to-blue-500">
        {event.title}
      </h2>
      {isRegistered && (
        <Badge variant="success" className="bg-green-500/10 text-green-500 border border-green-500/20">
          Registered
        </Badge>
      )}
    </div>
    
    <div className="space-y-3 text-muted-foreground/80">
      <div className="flex items-center group/item hover:text-primary transition-colors">
        <Calendar className="w-4 h-4 mr-3 text-primary/60 group-hover/item:text-primary" />
        <span>{DateTime.fromISO(event.start).toLocaleString(DateTime.DATE_MED)}</span>
      </div>
      
      <div className="flex items-center group/item hover:text-primary transition-colors">
        <Clock className="w-4 h-4 mr-3 text-primary/60 group-hover/item:text-primary" />
        <span>
          {DateTime.fromISO(event.start).toLocaleString(DateTime.TIME_SIMPLE)} - 
          {DateTime.fromISO(event.end_time).toLocaleString(DateTime.TIME_SIMPLE)}
        </span>
      </div>
      
      <div className="flex items-center group/item hover:text-primary transition-colors">
        <MapPin className="w-4 h-4 mr-3 text-primary/60 group-hover/item:text-primary" />
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

const EventDialog = ({ event, isOpen, onClose, onRegister, isRegistered }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent 
      className="sm:max-w-[600px] p-0" 
      aria-describedby="event-dialog-description"
    >
      <div className="relative p-6 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            {event.title}
          </DialogTitle>
          <DialogDescription id="event-dialog-description" className="sr-only">
            Details for the event {event.title}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <p className="mt-2 text-muted-foreground">{event.description}</p>

          <div className="space-y-3">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-5 h-5 mr-3 text-primary" />
              <span>{DateTime.fromISO(event.start).toLocaleString(DateTime.DATE_FULL)}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Clock className="w-5 h-5 mr-3 text-primary" />
              <span>
                {DateTime.fromISO(event.start).toLocaleString(DateTime.TIME_SIMPLE)} - 
                {DateTime.fromISO(event.end_time).toLocaleString(DateTime.TIME_SIMPLE)}
              </span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-5 h-5 mr-3 text-primary" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {event.tags && event.tags.map(tag => (
              <Badge 
                key={tag}
                variant="outline" 
                className="bg-primary/5 text-primary/70"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90" 
            onClick={() => onRegister(event.id)} 
            disabled={isRegistered}
          >
            {isRegistered ? 'Already Registered' : 'Register Now'}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const Events = () => {
  const supabase = useSupabaseClient();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [viewType, setViewType] = useState('dayGridMonth');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const upcomingEvents = events.filter(e => DateTime.fromISO(e.start) > DateTime.now());

  const fetchEvents = useCallback(async () => {
    if (!supabase) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const fetchRegistrations = useCallback(async () => {
    if (!supabase) return;

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) return;

      const userId = sessionData.session.user.id;
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching registrations:', error);
        return;
      }

      setRegisteredEvents(new Set(data.map(reg => reg.event_id)));
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }, [supabase]);

  const handleDateClick = useCallback(info => {
    console.log('Clicked on date:', info.dateStr);
  }, []);

  const handleEventClick = useCallback(info => {
    const clickedEvent = events.find(e => e.id === info.event.id);
    setSelectedEvent(clickedEvent);
  }, [events]);

  const handleAddEvent = useCallback((eventData) => {
    setEvents(prev => [...prev, eventData]);
  }, []);

  const handleRegister = async (eventId) => {
    if (!supabase) {
      toast.error('Supabase client not initialized');
      return;
    }
  
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Supabase session data:', sessionData, 'Error:', sessionError); // More detailed log
      if (sessionError) {
        console.error('Session fetch error:', sessionError);
        toast.error('Failed to verify session. Please try again.');
        return;
      }
      if (!sessionData.session) {
        console.warn('No active Supabase session');
        toast.error('Please sign in to register');
        return;
      }
  
      const userId = sessionData.session.user.id;
      console.log('Registering user:', userId, 'for event:', eventId);
  
      const { error: insertError } = await supabase
        .from('event_registrations')
        .insert([{ event_id: eventId, user_id: userId }]);
  
      if (insertError) {
        console.error('Registration insert error:', insertError);
        toast.error(`Failed to register: ${insertError.message}`);
        return;
      }
  
      const { data: eventData, error: fetchError } = await supabase
        .from('events')
        .select('registered')
        .eq('id', eventId)
        .single();
  
      if (fetchError) {
        console.error('Fetch event error:', fetchError);
        toast.error('Registered, but failed to update count');
        return;
      }
  
      const newRegisteredCount = (eventData.registered || 0) + 1;
      const { error: updateError } = await supabase
        .from('events')
        .update({ registered: newRegisteredCount })
        .eq('id', eventId);
  
      if (updateError) {
        console.error('Update registered count error:', updateError);
        toast.error('Registered, but failed to update event count');
        return;
      }
  
      setRegisteredEvents(prev => new Set(prev).add(eventId));
      setShowRegistrationSuccess(true);
      setSelectedEvent(null);
      toast.success('Successfully registered for the event!');
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast.error('An unexpected error occurred during registration');
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (supabase) {
      fetchEvents();
      fetchRegistrations();
    }
  }, [supabase, fetchEvents, fetchRegistrations]);

  useEffect(() => {
    if (showRegistrationSuccess) {
      const timer = setTimeout(() => setShowRegistrationSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showRegistrationSuccess]);

  if (!isMounted) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 bg-gradient-to-b from-background/80 via-background to-background/80">
          <div className="px-6 py-8 max-w-7xl mx-auto space-y-8">
            <SideHeader />
            
            <motion.div 
              className="space-y-4 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-blue-600 pb-4">
                Upcoming Events
              </h1>
              <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
                Discover and join upcoming workshops, contests, and seminars
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center items-center h-[50vh]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
                  <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-primary/10 bg-background/90 backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        Calendar View
                      </h3>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {events.length} Total Events
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
                        events={events.map(event => ({
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
                              isRegistered={registeredEvents.has(event.id)}
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

            <AnimatePresence>
              {showRegistrationSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
                >
                  Successfully registered for the event!
                </motion.div>
              )}
            </AnimatePresence>

            {selectedEvent && (
              <EventDialog
                event={selectedEvent}
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onRegister={handleRegister}
                isRegistered={registeredEvents.has(selectedEvent.id)}
              />
            )}

            <AddEventDialog 
              isOpen={showAddDialog}
              onClose={() => setShowAddDialog(false)}
              onSubmit={handleAddEvent}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Events;