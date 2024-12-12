// app/(default)/development/[id]/event-actions.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  DevelopmentInitiativeWithDetails,
  DevelopmentStatus,
  DevelopmentPriority,
  DevelopmentCategory,
} from '@/types/members/development';
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
import { Edit, Info, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/members/ui/checkbox';
import { createDevelopmentEvent } from '@/lib/members/actions/calendar';
import { Tooltip } from '@/components/members/ui/tooltip';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/members/ui/select';

interface EventActionsProps {
  initiative: DevelopmentInitiativeWithDetails;
}

export default function EventActions({ initiative }: EventActionsProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const supabase = createClientComponentClient();

  // Form state for events
  const [title, setTitle] = useState(initiative.title);
  const [description, setDescription] = useState(initiative.description || '');
  const [category, setCategory] = useState<DevelopmentCategory>(
    initiative.category
  );
  const [priority, setPriority] = useState<DevelopmentPriority>(
    initiative.priority
  );
  const [status, setStatus] = useState<DevelopmentStatus>(initiative.status);
  const [eventDate, setEventDate] = useState(
    initiative.event_date
      ? new Date(initiative.event_date).toISOString().slice(0, 10)
      : ''
  );
  const [startTime, setStartTime] = useState(initiative.start_time || '');
  const [duration, setDuration] = useState(() => {
    if (initiative.duration) {
      return initiative.duration.split(' ')[0];
    }
    return '';
  });
  const [location, setLocation] = useState(initiative.location || '');
  const [openToEveryone, setOpenToEveryone] = useState(
    initiative.open_to_everyone
  );

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // Delete associated calendar events first
      await supabase
        .from('calendar_events')
        .delete()
        .eq('reference_id', initiative.id)
        .eq('event_type', 'development_event');

      // Then delete the initiative
      const { data, error } = await supabase.rpc('delete_initiative', {
        p_initiative_id: initiative.id,
      });

      if (error) {
        throw error;
      }

      if (data === true) {
        router.push('/members/development');
      } else {
        throw new Error('Failed to delete initiative');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to delete event'
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        durationInterval = `${duration} hours`;
      }

      const data = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status,
        event_date: eventDate ? new Date(eventDate).toISOString() : null,
        start_time: startTime || null,
        duration: durationInterval,
        location: location.trim() || null,
        max_participants: openToEveryone ? 12 : null,
        open_to_everyone: openToEveryone,
      };

      const { error: updateError } = await supabase
        .from('development_initiatives')
        .update(data)
        .eq('id', initiative.id);

      if (updateError) throw updateError;

      // Update calendar event if date is set
      if (eventDate) {
        // Delete existing calendar event
        await supabase
          .from('calendar_events')
          .delete()
          .eq('reference_id', initiative.id)
          .eq('event_type', 'development_event');

        // Create new calendar event with correct category structure
        const calendarData = {
          title,
          description,
          start_time: new Date(`${eventDate}T${startTime || '00:00'}`),
          end_time: new Date(`${eventDate}T${startTime || '00:00'}`),
          event_type: 'development_event' as const,
          reference_id: initiative.id,
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

      setIsEditDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating event:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to update event'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            disabled={isSubmitting || isDeleting}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-lg bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
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
                  disabled={isSubmitting}
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

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="status"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as DevelopmentStatus)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  disabled={isSubmitting}
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
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="event_date"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Date
                </Label>
                <Input
                  id="event_date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
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
                  id="start_time"
                  type="time"
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
                <div className="flex items-center space-x-2 mb-2">
                  <Label
                    htmlFor="duration"
                    className="text-slate-900 dark:text-slate-300"
                  >
                    Duration (hours)
                  </Label>
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
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <Label
                  htmlFor="location"
                  className="text-slate-900 dark:text-slate-300"
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
            </div>

            <div className="flex items-center">
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

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditDialogOpen(false)}
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
