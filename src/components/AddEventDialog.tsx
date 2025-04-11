import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabaseAnon } from "@/utils/supabase";

interface AddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export function AddEventDialog({ isOpen, onClose, onSubmit }: AddEventDialogProps) {
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

  const resetForm = () => {
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
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (error || !data) {
        console.error('Supabase error:', error);
        alert('Failed to add event. Please check console.');
        return;
      }

      console.log('Successfully added event:', data);
      onSubmit(data);
      handleClose();
    } catch (error) {
      console.error('Detailed error:', error);
      alert('Unexpected error occurred. Check console for details.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-primary/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Event Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
            className="bg-black/20 border-primary/20"
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
            className="bg-black/20 border-primary/20 min-h-[100px]"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Start</label>
              <Input
                type="datetime-local"
                value={formData.start}
                onChange={e => setFormData({ ...formData, start: e.target.value })}
                required
                className="bg-black/20 border-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">End</label>
              <Input
                type="datetime-local"
                value={formData.end}
                onChange={e => setFormData({ ...formData, end: e.target.value })}
                required
                className="bg-black/20 border-primary/20"
              />
            </div>
          </div>
          <Input
            placeholder="Location"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            required
            className="bg-black/20 border-primary/20"
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
            placeholder="Capacity"
            value={formData.capacity}
            onChange={e => setFormData({ ...formData, capacity: e.target.value })}
            className="bg-black/20 border-primary/20"
          />
          <Input
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={e => setFormData({ ...formData, tags: e.target.value })}
            className="bg-black/20 border-primary/20"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
