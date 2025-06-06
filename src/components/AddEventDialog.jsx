import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseClient } from '@/utils/supabase';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Tags, Palette } from 'lucide-react';
import { DateTime } from 'luxon';

const EVENT_TYPES = {
  workshop: { label: 'Workshop', color: '#3b82f6', icon: '🖥️' },
  contest: { label: 'Contest', color: '#22c55e', icon: '🏆' },
  seminar: { label: 'Seminar', color: '#a855f7', icon: '📚' }
};

const ETIQUETTE_COLORS = {
  blue: { label: 'Professional Blue', value: '#3b82f6', bg: 'bg-blue-500', ring: 'ring-blue-500' },
  purple: { label: 'Creative Purple', value: '#a855f7', bg: 'bg-purple-500', ring: 'ring-purple-500' },
  green: { label: 'Success Green', value: '#22c55e', bg: 'bg-green-500', ring: 'ring-green-500' },
  red: { label: 'Important Red', value: '#ef4444', bg: 'bg-red-500', ring: 'ring-red-500' },
  orange: { label: 'Warning Orange', value: '#f97316', bg: 'bg-orange-500', ring: 'ring-orange-500' },
  indigo: { label: 'Deep Indigo', value: '#6366f1', bg: 'bg-indigo-500', ring: 'ring-indigo-500' },
  pink: { label: 'Creative Pink', value: '#ec4899', bg: 'bg-pink-500', ring: 'ring-pink-500' },
  teal: { label: 'Fresh Teal', value: '#14b8a6', bg: 'bg-teal-500', ring: 'ring-teal-500' }
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
    color: '#3b82f6', // Default blue color
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
        color: '#3b82f6',
      });
      setErrors({});
    }
  }, [isOpen]);

  // Get the selected color for dynamic theming
  const selectedColor = formData.color || '#3b82f6';
  const isDefaultTheme = selectedColor === '#3b82f6';

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
        type: formData.type,        capacity: parseInt(formData.capacity) || null,
        registered: 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        color: formData.color,
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
  const renderField = (label, icon, children, className = "") => (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
        {icon}
        {label}
      </label>
      {children}
      {errors[label.toLowerCase()] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 mt-1"
        >
          {errors[label.toLowerCase()]}
        </motion.p>
      )}
    </div>
  );
  const ColorPicker = () => (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
        <Palette className="w-4 h-4" />
        Event Color
      </label>
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(ETIQUETTE_COLORS).map(([key, color]) => (
          <motion.button
            key={key}
            type="button"
            onClick={() => setFormData({ ...formData, color: color.value })}
            className={`
              relative w-8 h-8 rounded-full border-2 transition-all duration-300 flex-shrink-0
              ${formData.color === color.value 
                ? 'border-white/80 ring-2 ring-white/40 ring-offset-2 ring-offset-black scale-110' 
                : 'border-gray-600/40 hover:border-gray-400/60 hover:scale-105'
              }
              shadow-lg
            `}
            style={{ backgroundColor: color.value }}
            whileHover={{ scale: formData.color === color.value ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {formData.color === color.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center">
        {ETIQUETTE_COLORS[Object.keys(ETIQUETTE_COLORS).find(key => ETIQUETTE_COLORS[key].value === formData.color)]?.label || 'Custom Color'}
      </p>
    </div>
  );return (
    <Dialog open={isOpen} onOpenChange={onClose}>      <DialogContent 
        className="max-w-2xl p-0 bg-black/95 backdrop-blur-xl border-gray-800/50 max-h-[90vh] overflow-hidden"
        style={{
          borderColor: isDefaultTheme ? 'rgba(107, 114, 128, 0.5)' : `${selectedColor}60`,
          boxShadow: isDefaultTheme 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            : `0 25px 50px -12px ${selectedColor}30`
        }}
      >        {/* Header without calendar icon */}
        <div 
          className="p-6 border-b border-gray-800/60 bg-black/80 relative"
          style={{
            background: `linear-gradient(135deg, ${selectedColor}20, black)`
          }}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle 
              className="text-2xl font-bold leading-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}dd)`
              }}
            >
              Add New Event
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 mt-2">
              Fill in the details below to create a new event. Choose a color theme that matches your event style.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        {/* Content with improved spacing */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              
              {renderField('Title', null,                  <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className={`h-11 text-sm bg-black/50 border-gray-700/50 focus:border-white/60 text-white placeholder:text-gray-500 ${
                      errors.title ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter event title..."
                    error={errors.title}
                  />
              )}

              {renderField('Description', null,                <Textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={`min-h-[100px] text-sm bg-black/50 border-gray-700/50 focus:border-white/60 text-white placeholder:text-gray-500 resize-none ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  placeholder="Describe your event..."
                  error={errors.description}
                />
              )}
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                {renderField('Start', <Clock className="w-4 h-4" />,                  <Input
                    type="datetime-local"
                    value={formData.start}
                    onChange={e => setFormData({ ...formData, start: e.target.value })}
                    className={`h-11 text-sm bg-black border-gray-700/50 focus:border-white/60 text-white ${
                      errors.start ? 'border-red-500' : ''
                    }`}
                    error={errors.start}
                  />
                )}

                {renderField('End', <Clock className="w-4 h-4" />,                  <Input
                    type="datetime-local"
                    value={formData.end}
                    onChange={e => setFormData({ ...formData, end: e.target.value })}
                    className={`h-11 text-sm bg-black border-gray-700/50 focus:border-white/60 text-white ${
                      errors.end ? 'border-red-500' : ''
                    }`}
                    error={errors.end}
                  />
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Event Details</h3>
                {renderField('Location', <MapPin className="w-4 h-4" />,                <Input
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className={`h-11 text-sm bg-black/50 border-gray-700/50 focus:border-white/60 text-white placeholder:text-gray-500 ${
                    errors.location ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter event location..."
                  error={errors.location}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Type', null,
                  <Select
                    value={formData.type}
                    onValueChange={value => setFormData({ ...formData, type: value })}
                  >                    <SelectTrigger className="h-11 text-sm bg-black/50 border-gray-700/50 text-white focus:border-white/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 border-gray-700/60 text-white backdrop-blur-xl">
                      {Object.entries(EVENT_TYPES).map(([value, { label, icon }]) => (
                        <SelectItem key={value} value={value} className="text-white hover:bg-gray-800/60 focus:bg-gray-800/60">
                          <span className="flex items-center gap-2">
                            {icon} {label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}                {renderField('Capacity', <Users className="w-4 h-4" />,                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                    className={`h-11 text-sm bg-black/50 border-gray-700/50 focus:border-white/60 text-white placeholder:text-gray-500 ${
                      errors.capacity ? 'border-red-500' : ''
                    }`}
                    placeholder="Max participants..."
                    error={errors.capacity}
                    min="1"
                  />
                )}
              </div>

              {renderField('Tags', <Tags className="w-4 h-4" />,                <Input
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  className="h-11 text-sm bg-black/50 border-gray-700/50 focus:border-white/60 text-white placeholder:text-gray-500"
                  placeholder="e.g. coding, web, design (comma separated)"
                />
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Theme & Style</h3>
              <ColorPicker />
            </div>            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-800/60">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 px-6 text-sm border-gray-700/60 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600/60 bg-black/30"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 px-8 text-sm text-white font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: selectedColor,
                  borderColor: selectedColor,
                  boxShadow: `0 4px 14px 0 ${selectedColor}40`
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  'Add Event'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}