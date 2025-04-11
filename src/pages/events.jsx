import { DateTime } from 'luxon';
import { cn } from "@/lib/utils";
// Update imports
import { useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion, AnimatePresence } from 'framer-motion';
// Remove date-fns imports
import { Calendar, Clock, MapPin, Tag, Users, X } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import { AddEventDialog } from '@/components/AddEventDialog';

// Helper function for date formatting
const formatEventDate = (dateStr) => {
  const dt = DateTime.fromISO(dateStr);
  return dt.isValid ? dt.toFormat('MMMM d, yyyy') : 'Date TBD';
};

// Enhanced events data with proper ISO dates
const events = [
  {
    id: 1,
    title: 'DSA Workshop',
    start: '2024-04-15T14:00:00', // ISO format with time
    end: '2024-04-15T16:00:00',
    description: 'Deep dive into Graph Algorithms with practical examples and problem-solving sessions.',
    location: 'Computer Lab 1',
    time: '2:00 PM - 4:00 PM',
    type: 'workshop',
    capacity: 30,
    registered: 25,
    tags: ['DSA', 'Algorithms', 'Graphs'],
    color: '#3b82f6',
  },
  {
    id: 2,
    title: 'Competitive Programming Contest',
    start: '2024-04-20T18:00:00',
    end: '2024-04-20T20:00:00',
    description: 'Weekly programming contest featuring algorithmic problems and real-world coding challenges.',
    location: 'Online',
    time: '6:00 PM - 8:00 PM',
    type: 'contest',
    capacity: 100,
    registered: 45,
    tags: ['Competitive Programming', 'Algorithms', 'Problem Solving'],
    color: '#22c55e',
  },
  {
    id: 3,
    title: 'Web Development Seminar',
    start: '2024-04-25T15:00:00',
    end: '2024-04-25T17:00:00',
    description: 'Learn modern web development practices with React and Next.js.',
    location: 'Seminar Hall',
    time: '3:00 PM - 5:00 PM',
    type: 'seminar',
    capacity: 50,
    registered: 48,
    tags: ['Web Dev', 'React', 'Next.js'],
    color: '#a855f7',
  },
  {
    id: 4,
    title: 'Mock Interview Session',
    start: '2024-04-28T10:00:00',
    end: '2024-04-28T13:00:00',
    description: 'Practice technical interviews with industry professionals.',
    location: 'Online',
    time: '10:00 AM - 1:00 PM',
    type: 'workshop',
    capacity: 20,
    registered: 15,
    tags: ['Interview Prep', 'Career'],
    color: '#3b82f6',
  },
  {
    id: 5,
    title: 'Hackathon Kickoff',
    start: '2024-05-01T09:00:00',
    end: '2024-05-02T09:00:00',
    description: '24-hour coding challenge to build innovative solutions.',
    location: 'Main Hall',
    time: '9:00 AM - Next Day 9:00 AM',
    type: 'contest',
    capacity: 60,
    registered: 40,
    tags: ['Hackathon', 'Innovation', 'Team Building'],
    color: '#22c55e',
  },
];

// Event type badges
const TYPE_BADGES = {
  workshop: { label: 'Workshop', class: 'bg-blue-500/10 text-blue-500' },
  contest: { label: 'Contest', class: 'bg-green-500/10 text-green-500' },
  seminar: { label: 'Seminar', class: 'bg-purple-500/10 text-purple-500' },
};

const EventCard = ({ event, onClick, isRegistered }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className={cn(
      "bg-black/20 backdrop-blur-sm p-4 sm:p-6 rounded-xl border transition-all duration-300 cursor-pointer",
      isRegistered 
        ? "border-green-500/20 hover:border-green-500/40"
        : "border-primary/10 hover:border-primary/20"
    )}
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg sm:text-xl font-semibold text-primary">{event.title}</h3>
      {isRegistered && (
        <Badge className="bg-green-500/10 text-green-500">Registered</Badge>
      )}
    </div>
    <p className="text-sm sm:text-base text-muted-foreground mb-4">{event.description}</p>
    
    <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
        <span>{formatEventDate(event.start)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
        <span>{event.time}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
        <span>{event.location}</span>
      </div>
    </div>
  </motion.div>
);

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewType, setViewType] = useState('dayGridMonth');
  const [isMobile, setIsMobile] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleEventClick = useCallback((eventClickInfo) => {
    setSelectedEvent(eventClickInfo.event);
  }, []);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
  };

  const handleRegisterEvent = useCallback((eventId) => {
    setRegisteredEvents(prev => {
      const newSet = new Set(prev);
      newSet.add(eventId);
      return newSet;
    });
    setShowRegistrationSuccess(true);
    setTimeout(() => setShowRegistrationSuccess(false), 3000);
    setSelectedEvent(null);
  }, []);

  const handleAddEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const upcomingEvents = events.filter(event => {
    const eventDate = DateTime.fromISO(event.start);
    return eventDate.isValid && eventDate > DateTime.now();
  });

  // Add responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 640) {
        setViewType('dayGridMonth');
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update EventDialog to handle registration
  const EventDialog = ({ event, isOpen, onClose }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-xl border-primary/10">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">{event?.title}</h2>
              <Badge variant="outline" className={TYPE_BADGES[event?.type]?.class}>
                {TYPE_BADGES[event?.type]?.label}
              </Badge>
            </div>
            {/* <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button> */}
          </div>

          <p className="text-muted-foreground">{event?.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{event ? formatEventDate(event.start) : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{event?.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{event?.location}</span>
              </div>
            </div>

            {event?.capacity && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Registration Status
                </h3>
                <div className="text-2xl font-bold text-primary">
                  {event.registered}/{event.capacity}
                </div>
                <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary/30 rounded-full"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {event.capacity - event.registered} spots remaining
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <span className="font-semibold">Tags:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {event?.tags?.map(tag => (
                <Badge key={tag} variant="outline" className="bg-primary/5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            className={cn(
              "w-full transition-all duration-300",
              registeredEvents.has(event?.id)
                ? "bg-green-500 hover:bg-green-600"
                : "bg-primary hover:bg-primary/90"
            )}
            onClick={() => handleRegisterEvent(event?.id)}
            disabled={registeredEvents.has(event?.id)}
          >
            {registeredEvents.has(event?.id) ? 'Registered ✓' : 'Register for Event'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 bg-gradient-to-b from-background via-background/95 to-background relative">
          <SideHeader />
          
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />
            <div className="absolute top-0 left-0 size-[500px] rounded-full bg-primary/20 -z-10 blur-[100px]" />
            <div className="absolute bottom-0 right-0 size-[500px] rounded-full bg-blue-500/20 -z-10 blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 py-8 mt-4">
            <div className="flex justify-between items-center mb-8">
              <motion.h1
                className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Events Calendar
              </motion.h1>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-primary hover:bg-primary/90"
              >
                Add Event
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-2 bg-black/20 backdrop-blur-sm p-2 sm:p-6 rounded-xl border border-primary/10">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView={viewType}
                events={events.map(event => ({
                  ...event,
                  backgroundColor: registeredEvents.has(event.id) 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : `${event.color}15`,
                  borderColor: 'transparent',
                  textColor: registeredEvents.has(event.id) 
                    ? '#22c55e' 
                    : event.color,
                  className: 'backdrop-blur-sm'
                }))}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                eventContent={(arg) => (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "px-2 py-1 rounded-md flex items-center gap-1 w-full",
                      "bg-white/5 backdrop-blur-sm border border-white/10",
                      registeredEvents.has(arg.event.id) && "font-medium"
                    )}
                  >
                    {registeredEvents.has(arg.event.id) && (
                      <span className="text-[8px] sm:text-[10px] flex-shrink-0">✓</span>
                    )}
                    <span className="truncate text-[10px] sm:text-xs">{arg.event.title}</span>
                  </motion.div>
                )}
                headerToolbar={{
                  left: isMobile ? 'prev,next' : 'prev,next today',
                  center: 'title',
                  right: isMobile ? 'dayGridMonth' : 'dayGridMonth,dayGridWeek'
                }}
                height="auto"
                contentHeight="auto"
                aspectRatio={isMobile ? 1 : 1.5}
                fixedWeekCount={false}
                dayMaxEventRows={isMobile ? 2 : 3}
                dayMaxEvents={isMobile ? 2 : 3}
                expandRows={true}
                stickyHeaderDates={true}
                handleWindowResize={true}
                slotEventOverlap={false}
                eventDisplay="block"
                allDaySlot={false}
              />
              </div>

              {/* Mobile view: Show upcoming events above calendar on small screens */}
              <div className={`space-y-6 ${isMobile ? 'order-first' : ''}`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-semibold">Upcoming Events</h2>
                  <span className="text-sm text-muted-foreground">
                    {events.length} events
                  </span>
                </div>
                <div className="space-y-4">
                  {events.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onClick={() => handleEventClick({ event })}
                      isRegistered={registeredEvents.has(event.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventDialog 
        event={selectedEvent} 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)}
      />

      <AddEventDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddEvent={handleAddEvent}
      />

      {/* Show success toast */}
      <AnimatePresence>
        {showRegistrationSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Successfully registered for event!
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
};

export default Events;