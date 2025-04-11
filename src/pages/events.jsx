import { DateTime } from 'luxon';
import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag, Users, X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import AddEventDialog from '@/components/AddEventDialog';

const sampleEvents = [
  {
    id: '1',
    title: 'Tech Talk: Future of AI',
    description: 'A deep dive into the future of Artificial Intelligence.',
    start: '2025-04-15T10:00:00',
    end: '2025-04-15T12:00:00',
    location: 'Auditorium A',
    tags: ['AI', 'Tech'],
    speakers: ['Dr. Smith'],
    color: '#4f46e5',
  },
  {
    id: '2',
    title: 'Web Development Bootcamp',
    description: 'Learn modern web development from scratch.',
    start: '2025-04-20T14:00:00',
    end: '2025-04-20T17:00:00',
    location: 'Lab 3',
    tags: ['Web', 'Bootcamp'],
    speakers: ['Jane Doe'],
    color: '#10b981',
  },
];

const EventCard = ({ event, onClick, isRegistered }) => (
  <div
    onClick={onClick}
    className={cn(
      "group p-6 rounded-xl shadow-lg transition-all duration-300",
      "bg-background/50 hover:bg-background/80 backdrop-blur-sm",
      "border border-primary/10 hover:border-primary/20",
      "cursor-pointer hover:shadow-xl transform hover:-translate-y-1"
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
          {DateTime.fromISO(event.end).toLocaleString(DateTime.TIME_SIMPLE)}
        </span>
      </div>
      
      <div className="flex items-center group/item hover:text-primary transition-colors">
        <MapPin className="w-4 h-4 mr-3 text-primary/60 group-hover/item:text-primary" />
        <span>{event.location}</span>
      </div>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {event.tags.map(tag => (
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
    <DialogContent className="sm:max-w-[600px] p-0">
      <div className="relative p-6 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            {event.title}
          </DialogTitle>
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
                {DateTime.fromISO(event.end).toLocaleString(DateTime.TIME_SIMPLE)}
              </span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-5 h-5 mr-3 text-primary" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Users className="w-5 h-5 mr-3 text-primary" />
              <span>Speakers: {event.speakers.join(', ')}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {event.tags.map(tag => (
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
            {isRegistered ? "Already Registered" : "Register Now"}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const Events = () => {
  const [events, setEvents] = useState(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [viewType, setViewType] = useState('dayGridMonth');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isMounted, setIsMounted] = useState(false);

  const upcomingEvents = events.filter(e => DateTime.fromISO(e.start) > DateTime.now());

  const handleDateClick = useCallback(info => {
    console.log('Clicked on date:', info.dateStr);
  }, []);

  const handleEventClick = useCallback(info => {
    const clickedEvent = events.find(e => e.id === info.event.id);
    setSelectedEvent(clickedEvent);
  }, [events]);

  const handleAddEvent = useCallback((eventData) => {
    const newEvent = {
      id: Date.now().toString(), // Temporary ID until we add backend
      title: eventData.title,
      description: eventData.description,
      start: eventData.start,
      end: eventData.end,
      location: eventData.location,
      type: eventData.type,
      tags: eventData.tags.split(',').map(tag => tag.trim()),
      speakers: [], // Add default or get from form if needed
      color: eventData.type === 'workshop' ? '#3b82f6' : 
             eventData.type === 'contest' ? '#22c55e' : '#a855f7',
    };
    
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const handleRegister = (eventId) => {
    setRegisteredEvents(prev => new Set(prev).add(eventId));
    setShowRegistrationSuccess(true);
    setSelectedEvent(null);
  };

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (showRegistrationSuccess) {
      const timer = setTimeout(() => setShowRegistrationSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showRegistrationSuccess]);

  if (!isMounted) return null; // Prevent SSR issues

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 bg-gradient-to-b from-background/80 via-background to-background/80">
          <div className="px-6 py-8 max-w-7xl mx-auto space-y-8">
            <SideHeader />
            
            {/* Enhanced Header Section */}
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

            {/* Enhanced Calendar and Events Layout */}
            <div className="flex flex-col xl:flex-row gap-6">
              <motion.div 
                className="w-full xl:w-[70%] rounded-2xl overflow-hidden shadow-xl border border-primary/10 bg-background/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Calendar Header */}
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

                {/* Calendar Container */}
                <div className="p-2 sm:p-4 md:p-6">
                  <div className="rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/10">
                    <style global="true">{`
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
                        end: event.end,
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
                      // moreLinkContent={(args) => (
                      //   <Badge 
                      //     variant="outline" 
                      //     className="bg-primary/5 text-primary hover:bg-primary/10 text-xs"
                      //   >
                      //     +{args.num} more
                      //   </Badge>
                      // )}
                      // eventClassNames={['rounded-md', 'border', 'shadow-sm', 'hover:shadow-md']}
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
                  {/* Enhanced sticky header - Adjusted padding */}
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

                  {/* Scrollable content with improved scrollbar */}
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

            {/* Responsive Floating Action Button */}
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

            {/* ...existing dialogs... */}
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
