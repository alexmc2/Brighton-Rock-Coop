'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/members/ui/dialog';
import { Button } from '@/components/members/ui/button';
import { Input } from '@/components/members/ui/input';
import { Textarea } from '@/components/members/ui/textarea';
import { Label } from '@/components/members/ui/label';
import { Plus, Check, Info } from 'lucide-react';
import { DevelopmentCategory, DevelopmentPriority } from '@/types/members/development';
import { Checkbox } from '@/components/members/ui/checkbox';
import { createDevelopmentEvent } from '@/lib/members/actions/calendar';
import { Tooltip } from '@/components/members/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/members/ui/select';

export default function NewEventModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DevelopmentCategory>('general');
  const [priority, setPriority] = useState<DevelopmentPriority>('medium');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [openToEveryone, setOpenToEveryone] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('general');
    setPriority('medium');
    setEventDate('');
    setStartTime('');
    setDuration('');
    setLocation('');
    setOpenToEveryone(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Get user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (profileError) throw profileError;

      // Parse duration to interval
      let durationInterval: string | null = null;
      if (duration) {
        if (duration === '24') {
          durationInterval = '24 hours';
        } else {
          durationInterval = `${duration} hours`;
        }
      }

      const data = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        initiative_type: 'event' as const,
        created_by: user.id,
        event_date: eventDate ? new Date(eventDate).toISOString() : null,
        start_time: startTime || null,
        duration: durationInterval,
        location: location.trim() || null,
        max_participants: openToEveryone ? 12 : null,
        open_to_everyone: openToEveryone,
      };

      // Insert the development initiative
      const { data: newInitiative, error: insertError } = await supabase
        .from('development_initiatives')
        .insert(data)
        .select()
        .single();

      if (insertError) throw insertError;

      // Create calendar event if date is set
      if (eventDate && newInitiative) {
        const calendarData = {
          title,
          description,
          start_time: new Date(`${eventDate}T${startTime || '00:00'}`),
          end_time: new Date(`${eventDate}T${startTime || '00:00'}`),
          event_type: 'development_event' as const,
          reference_id: newInitiative.id,
          created_by: user.id,
          category: 'Development',
          subcategory: category,
          full_name: profile?.full_name,
        };

        const { error: calendarError } = await supabase
          .from('calendar_events')
          .insert(calendarData);

        if (calendarError) throw calendarError;
      }

      resetForm();
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error creating event:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to create event'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)} variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-lg bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>New Event</DialogTitle>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label
                  htmlFor="title"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label
                  htmlFor="category"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as DevelopmentCategory)}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="development_meeting">Development Meeting</SelectItem>
                    <SelectItem value="social">Social Event</SelectItem>
                    <SelectItem value="outreach">Outreach</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="text-slate-900 dark:text-slate-300"
              >
                Description
              </Label>
              <Textarea
                id="description"
                required
                className="resize-none bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Date, Time & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label
                  htmlFor="event_date"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Date
                </Label>
                <Input
                  type="date"
                  id="event_date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 [&::-webkit-calendar-picker-indicator]:dark:invert"
                />
              </div>
              <div>
                <Label
                  htmlFor="start_time"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Start Time
                </Label>
                <Input
                  type="time"
                  id="start_time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 [&::-webkit-calendar-picker-indicator]:dark:invert"
                />
              </div>
              <div>
                <Label
                  htmlFor="duration"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Duration (hours)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2"
                />
              </div>
            </div>

            {/* Location & Open to Everyone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="location"
             
                >
                  Location
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="openToEveryone"
                    label="Open to everyone"
                    checked={openToEveryone}
                    onChange={setOpenToEveryone}
                    disabled={isSubmitting}
                  />
                  <Tooltip
                    content="Check this box to invite all co-op members and create an event participant list"
                    bg="dark"
                    size="md"
                    position="top"
                    className="ml-2"
                  >
                    <Info className="h-4 w-4 text-slate-500" />
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Priority */}
            <div>
              <Label
                htmlFor="priority"
                className="text-slate-900 dark:text-slate-300"
              >
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as DevelopmentPriority)}
              >
                <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
   
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
