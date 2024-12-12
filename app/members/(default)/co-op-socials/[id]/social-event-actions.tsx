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
} from '@/components/members/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/members/ui/alert-dialog';
import { Button } from '@/components/members/ui/button';
import { Input } from '@/components/members/ui/input';
import { Textarea } from '@/components/members/ui/textarea';
import { Label } from '@/components/members/ui/label';
import { Edit, Info, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/members/ui/checkbox';
import {
  SocialEventWithDetails,
  SocialEventCategory,
  SocialEventStatus,
} from '@/types/members/social';
import { Tooltip } from '@/components/members/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/members/ui/select';

interface SocialEventActionsProps {
  event: SocialEventWithDetails;
  onEventUpdate?: (updatedEvent: SocialEventWithDetails) => void;
}

export default function SocialEventActions({
  event,
  onEventUpdate,
}: SocialEventActionsProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form state
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || '');
  const [category, setCategory] = useState<SocialEventCategory>(event.category);
  const [status, setStatus] = useState<SocialEventStatus>(event.status);
  const [eventDate, setEventDate] = useState(
    event.event_date
      ? new Date(event.event_date).toISOString().slice(0, 10)
      : ''
  );
  const [startTime, setStartTime] = useState(
    event.start_time
      ? event.start_time.slice(0, 5) // Convert "HH:mm:ss" to "HH:mm"
      : ''
  );
  const [duration, setDuration] = useState(
    event.duration ? event.duration.split(' ')[0] : ''
  );
  const [location, setLocation] = useState(event.location || '');
  const [openToEveryone, setOpenToEveryone] = useState(event.open_to_everyone);

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Optimistic UI update for deletion
      onEventUpdate?.(null as any); // Signal deletion to parent

      // Delete associated calendar events first
      await supabase
        .from('calendar_events')
        .delete()
        .eq('reference_id', event.id)
        .eq('event_type', 'social_event')
        .throwOnError();

      // Delete the social event and related data
      await supabase
        .rpc('delete_social_event', { p_event_id: event.id })
        .throwOnError();

      router.refresh(); // Refresh the server components
      router.push('/members/co-op-socials');
    } catch (error) {
      console.error('Error deleting event:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to delete event'
      );
      // Revert optimistic update on error
      onEventUpdate?.(event);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get current user and profile
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // Prepare update data
      const durationInterval = duration ? `${duration} hours` : null;
      const timeWithSeconds = startTime ? `${startTime}:00` : null;

      const updateData = {
        title: title.trim(),
        description: description.trim(),
        category,
        status,
        event_date: eventDate ? new Date(eventDate).toISOString() : null,
        start_time: timeWithSeconds,
        duration: duration ? `${parseFloat(duration)} hours` : null,
        location: location.trim() || null,
        open_to_everyone: openToEveryone,
        updated_at: new Date().toISOString(),
      };

      // Create optimistic event update
      const optimisticEvent: SocialEventWithDetails = {
        ...event,
        ...updateData,
      };

      // Optimistic UI update
      onEventUpdate?.(optimisticEvent);

      // First update
      const { error: updateError } = await supabase
        .from('social_events')
        .update(updateData)
        .eq('id', event.id);

      if (updateError) throw updateError;

      // Then fetch the updated data
      const { data: updatedEvent, error: fetchError } = await supabase
        .from('social_events')
        .select(
          `
          *,
          created_by_user:profiles!social_events_created_by_fkey (
            email,
            full_name
          ),
          comments:social_event_comments (
            *,
            user:profiles (
              email,
              full_name
            )
          ),
          participants:social_event_participants (
            *,
            user:profiles (
              id,
              email,
              full_name
            )
          )
        `
        )
        .eq('id', event.id)
        .single();

      if (fetchError) throw fetchError;
      if (!updatedEvent) {
        throw new Error('Failed to retrieve updated event data');
      }

      // Handle calendar event
      if (eventDate) {
        // Delete existing calendar event
        await supabase
          .from('calendar_events')
          .delete()
          .eq('reference_id', event.id)
          .eq('event_type', 'social_event');

        // Create new calendar event
        const calendarData = {
          title,
          description,
          start_time: new Date(`${eventDate}T${startTime || '00:00'}`),
          end_time: new Date(`${eventDate}T${startTime || '00:00'}`),
          event_type: 'social_event' as const,
          reference_id: event.id,
          created_by: user.id,
          category: 'Co-op Social',
          subcategory: category,
          full_name: profile?.full_name,
        };

        await supabase
          .from('calendar_events')
          .insert(calendarData)
          .throwOnError();
      }

      // Update UI with server response
      onEventUpdate?.(updatedEvent);

      setIsEditDialogOpen(false);
      router.refresh(); // Refresh server components
    } catch (error) {
      console.error('Error updating event:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to update event'
      );
      // Revert optimistic update on error
      onEventUpdate?.(event);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsEditDialogOpen(true)}
          disabled={isSubmitting}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>

        <DialogContent className="w-full max-w-lg bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-100">
              Edit Event
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleEdit} className="space-y-4">
            {/* Title & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="title">Title</Label>
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
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value: SocialEventCategory) => setCategory(value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: SocialEventStatus) => setStatus(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_date">Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Duration & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  value={duration}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Ensure we're storing the numeric value
                    setDuration(value !== '' ? value : '');
                  }}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
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
                  className="ml-2"
                >
                  <Info className="h-4 w-4 text-slate-500" />
                </Tooltip>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="default">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isSubmitting}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              event and remove all associated data including participants and
              comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 dark:bg-red-600"
            >
              {isSubmitting ? 'Deleting...' : 'Delete Event'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
