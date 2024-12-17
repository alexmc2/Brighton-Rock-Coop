'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/members/ui/dialog';
import { Button } from '@/components/members/ui/button';
import { Input } from '@/components/members/ui/input';
import { Label } from '@/components/members/ui/label';
import { Textarea } from '@/components/members/ui/textarea';
import { Info, Plus } from 'lucide-react';
import { SocialEventCategory } from '@/types/members/social';
import { Checkbox } from '@/components/members/ui/checkbox';
import { Tooltip } from '@/components/members/ui/tooltip';
import { createSocialEventCalendarEvent } from '@/lib/members/actions/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/members/ui/select';

export default function NewSocialEventModal() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SocialEventCategory>('film_night');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [openToEveryone, setOpenToEveryone] = useState(true);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('film_night');
    setEventDate('');
    setStartTime('');
    setDuration('');
    setLocation('');
    setOpenToEveryone(true);
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
      } = await supabase.auth.getUser();
      if (!user) {
        setError('User not found');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (profileError) throw profileError;

      const durationInterval = duration ? `${duration} hours` : null;

      const eventData = {
        title: title.trim(),
        description: description.trim(),
        category,
        status: 'upcoming' as const,
        created_by: user.id,
        event_date: eventDate ? new Date(eventDate).toISOString() : null,
        start_time: startTime ? `${startTime}:00` : null,
        duration: durationInterval,
        location: location.trim() || null,
        open_to_everyone: openToEveryone,
      };

      const { data: newEvent, error: insertError } = await supabase
        .from('social_events')
        .insert(eventData)
        .select()
        .single();

      if (insertError) throw insertError;

      if (eventDate && newEvent) {
        const calendarData = {
          title,
          description,
          start_time: new Date(`${eventDate}T${startTime || '00:00'}`),
          end_time: new Date(`${eventDate}T${startTime || '00:00'}`),
          event_type: 'social_event' as const,
          reference_id: newEvent.id,
          created_by: user.id,
          category: 'Co-op Social',
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
      console.error('Error creating social event:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to create social event'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Add Social Event
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-lg p-4 sm:p-6 bg-white dark:bg-slate-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            New Social Event
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-3">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="col-span-1">
              <Label htmlFor="title" className="text-sm">Title</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 h-9"
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="category" className="text-sm">Category</Label>
              <Select
                value={category}
                onValueChange={(value: SocialEventCategory) =>
                  setCategory(value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 h-9">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="film_night">Film Night</SelectItem>
                  <SelectItem value="album_night">Album Night</SelectItem>
                  <SelectItem value="meal">Meal</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="board_games">Board Games</SelectItem>
                  <SelectItem value="tv">TV</SelectItem>
                  <SelectItem value="book_club">Book Club</SelectItem>
                  <SelectItem value="christmas_dinner">Christmas Dinner</SelectItem>
                  <SelectItem value="bike_ride">Bike Ride</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="hang_out">Hang Out</SelectItem>
                  <SelectItem value="beach">Beach</SelectItem>
                  <SelectItem value="writing_club">Writing Club</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="resize-none bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 h-20"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="event_date" className="text-sm">Date</Label>
              <Input
                id="event_date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                disabled={isSubmitting}
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 h-9"
              />
            </div>
            <div>
              <Label htmlFor="start_time" className="text-sm">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isSubmitting}
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 h-9"
              />
            </div>
          </div>

          {/* Duration & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Label htmlFor="duration" className="text-sm">Duration (hours)</Label>
                <Tooltip
                  content="Enter duration in steps of 0.5 hours (e.g., 1 = one hour, 1.5 = one and half hours)"
                  bg="dark"
                  size="md"
                  position="top"
                >
                  <Info className="h-4 w-4 text-slate-500" />
                </Tooltip>
              </div>
              <Input
                id="duration"
                type="number"
                min="0"
                step="0.5"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={isSubmitting}
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 h-9"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-sm">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isSubmitting}
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 h-9"
              />
            </div>
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
                className="ml-1"
              >
                <Info className="h-4 w-4 text-slate-500" />
              </Tooltip>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="default">
              {isSubmitting ? 'Creating...' : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Event
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
