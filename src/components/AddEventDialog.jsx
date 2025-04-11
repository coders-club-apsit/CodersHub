import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabaseAnon } from "@/utils/supabase";
import { toast } from 'sonner';
import React from 'react';

export default function AddEventDialog({ isOpen, onClose, onSubmit }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString(),
        location: formData.location.trim(),
        type: formData.type,
        capacity: parseInt(formData.capacity) || 0,
        registered: 0,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        color:
          formData.type === 'workshop' ? '#3b82f6' :
          formData.type === 'contest' ? '#22c55e' : '#a855f7',
      };

      const { data, error } = await supabaseAnon
        .from('events')
        .insert([formattedData])
        .select()
        .single();

      if (error) {
        toast.error('Failed to add event');
        console.error('Supabase error:', error);
        return;
      }

      toast.success('Event added successfully!');
      onSubmit(data);
      onClose();
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
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-primary/10"
        aria-describedby="add-event-dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Add New Event
          </DialogTitle>
          <DialogDescription id="add-event-dialog-description" className="text-muted-foreground/80">
            Fill in the details below to create a new event.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Add event form">
          <Input
            placeholder="Event Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
            className="bg-black/20 border-primary/20 focus:border-primary/40 focus:ring-primary/30"
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
            className="bg-black/20 border-primary/20 min-h-[100px] focus:border-primary/40 focus:ring-primary/30"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Start Date & Time</label>
              <Input
                type="datetime-local"
                value={formData.start}
                onChange={e => setFormData({ ...formData, start: e.target.value })}
                required
                className="bg-black/20 border-primary/20 focus:border-primary/40 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">End Date & Time</label>
              <Input
                type="datetime-local"
                value={formData.end}
                onChange={e => setFormData({ ...formData, end: e.target.value })}
                required
                className="bg-black/20 border-primary/20 focus:border-primary/40 focus:ring-primary/30"
              />
            </div>
          </div>
          <Input
            placeholder="Location"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            required
            className="bg-black/20 border-primary/20 focus:border-primary/40 focus:ring-primary/30"
          />
          <Select
            value={formData.type}
            onValueChange={value => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="bg-black/20 border-primary/20">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="contest">Contest</SelectItem>
              <SelectItem value="seminar">Seminar</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Capacity (optional)"
            value={formData.capacity}
            onChange={e => setFormData({ ...formData, capacity: e.target.value })}
            className="bg-black/20 border-primary/20 focus:border-primary/40 focus:ring-primary/30"
          />
          <Input
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={e => setFormData({ ...formData, tags: e.target.value })}
            className="bg-black/20 border-primary/20 focus:border-primary/40 focus:ring-primary/30"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-primary/20 hover:bg-primary/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-white shadow-md"
            >
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
