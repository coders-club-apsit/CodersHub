import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseClient } from '@/utils/supabase';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Tags } from 'lucide-react';
import { DateTime } from 'luxon';

const EVENT_TYPES = {
  workshop: { label: 'Workshop', color: '#3b82f6', icon: '🖥️' },
  contest: { label: 'Contest', color: '#22c55e', icon: '🏆' },
  seminar: { label: 'Seminar', color: '#a855f7', icon: '📚' }
};

export default function AddEventDialog({ isOpen, onClose, onSubmit }) {
  const supabase = useSupabaseClient();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    location: '',
    type: 'workshop',
    capacity: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        start: '',
        end: '',
        location: '',
        type: 'workshop',
        capacity: '',
        tags: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.start) {
      newErrors.start = 'Start date is required';
    }

    if (!formData.end) {
      newErrors.end = 'End date is required';
    }

    if (formData.start && formData.end) {
      const startDate = DateTime.fromISO(formData.start);
      const endDate = DateTime.fromISO(formData.end);
      
      if (endDate < startDate) {
        newErrors.end = 'End time must be after start time';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.capacity && (isNaN(formData.capacity) || Number(formData.capacity) < 1)) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!supabase) {
      toast.error('Authentication required. Please sign in.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        start: new Date(formData.start).toISOString(),
        end_time: new Date(formData.end).toISOString(),
        location: formData.location.trim(),
        type: formData.type,
        capacity: parseInt(formData.capacity) || null,
        registered: 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        color: EVENT_TYPES[formData.type]?.color || '#3b82f6',
      };

      const { data, error } = await supabase
        .from('events')
        .insert([formattedData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Event added successfully!');
      onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error(error.message || 'Failed to add event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (label, icon, children) => (
    <div className="space-y-1.5 sm:space-y-2">
      <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
        {icon}
        {label}
      </label>
      {children}
      {errors[label.toLowerCase()] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] sm:text-xs text-red-500 mt-0.5 sm:mt-1"
        >
          {errors[label.toLowerCase()]}
        </motion.p>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] p-4 sm:p-6 bg-background/95 backdrop-blur-xl border-primary/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-lg sm:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Add New Event
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground/80">
            Fill in the details below to create a new event.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="space-y-3 overflow-y-auto">
            {renderField('Title', null,
              <Input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="h-8 sm:h-9 text-sm bg-black/20 border-primary/20 focus:border-primary/40"
                error={errors.title}
              />
            )}

            {renderField('Description', null,
              <Textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[60px] sm:min-h-[80px] text-sm bg-black/20 border-primary/20"
                error={errors.description}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField('Start', <Clock className="w-3 h-3" />,
                <Input
                  type="datetime-local"
                  value={formData.start}
                  onChange={e => setFormData({ ...formData, start: e.target.value })}
                  className="h-8 sm:h-9 text-xs sm:text-sm bg-black/20 border-primary/20"
                  error={errors.start}
                />
              )}

              {renderField('End', <Clock className="w-3 h-3" />,
                <Input
                  type="datetime-local"
                  value={formData.end}
                  onChange={e => setFormData({ ...formData, end: e.target.value })}
                  className="h-8 sm:h-9 text-xs sm:text-sm bg-black/20 border-primary/20"
                  error={errors.end}
                />
              )}
            </div>

            {renderField('Location', <MapPin className="w-3 h-3" />,
              <Input
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="h-8 sm:h-9 text-sm bg-black/20 border-primary/20"
                error={errors.location}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField('Type', null,
                <Select
                  value={formData.type}
                  onValueChange={value => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-8 sm:h-9 text-sm bg-black/20 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-sm">
                    {Object.entries(EVENT_TYPES).map(([value, { label, icon }]) => (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-1.5">
                          {icon} {label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {renderField('Capacity', <Users className="w-3 h-3" />,
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                  className="h-8 sm:h-9 text-sm bg-black/20 border-primary/20"
                  error={errors.capacity}
                  min="1"
                />
              )}
            </div>

            {renderField('Tags', <Tags className="w-3 h-3" />,
              <Input
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                className="h-8 sm:h-9 text-sm bg-black/20 border-primary/20"
                placeholder="e.g. coding, web, design (comma separated)"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-primary/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 sm:h-9 text-xs sm:text-sm border-primary/20 hover:bg-primary/10"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-8 sm:h-9 text-xs sm:text-sm bg-primary hover:bg-primary/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}