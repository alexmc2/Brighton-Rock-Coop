// app/(default)/garden/task/[id]/task-actions.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  GardenTaskPriority,
  GardenTaskStatus,
  GardenTaskWithDetails,
} from '@/types/members/garden';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Edit, Trash2 } from 'lucide-react';
import { createGardenTaskEvent } from '@/lib/members/actions/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/members/ui/select';

interface TaskActionsProps {
  task: GardenTaskWithDetails;
}

export default function TaskActions({ task }: TaskActionsProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const supabase = createClientComponentClient();

  const fetchAreas = useCallback(async () => {
    const { data, error } = await supabase
      .from('garden_areas')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching areas:', error);
      return;
    }

    setAreas(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      setError(null);
      const formData = new FormData(e.currentTarget);

      // Get current user
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

      // Prepare duration
      const durationValue = formData.get('duration') as string;
      let durationInterval: string | null = null;
      if (durationValue) {
        if (durationValue === '24') {
          durationInterval = '24 hours';
        } else {
          durationInterval = `${durationValue} hours`;
        }
      }

      // Update garden task
      const { data: updatedTask, error: updateError } = await supabase
        .from('garden_tasks')
        .update({
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          area_id: formData.get('area_id') as string,
          priority: formData.get('priority') as GardenTaskPriority,
          due_date: (formData.get('due_date') as string) || null,
          scheduled_time: (formData.get('scheduled_time') as string) || null,
          assigned_to: (formData.get('assigned_to') as string) || 'Everyone',
          status: formData.get('status') as GardenTaskStatus,
          duration: durationInterval,
        })
        .eq('id', task.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Handle calendar event
      if (formData.get('due_date')) {
        await createGardenTaskEvent(
          formData.get('title') as string,
          formData.get('description') as string,
          formData.get('due_date') as string,
          (formData.get('scheduled_time') as string) || null,
          durationValue,
          user.id,
          profile.full_name,
          task.id
        );
      }

      setIsEditDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating task:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to update task'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // First delete all comments
      const { error: commentsError } = await supabase
        .from('garden_comments')
        .delete()
        .eq('task_id', task.id);

      if (commentsError) throw commentsError;

      // Then delete the task
      const { error: deleteError } = await supabase
        .from('garden_tasks')
        .delete()
        .eq('id', task.id);

      if (deleteError) throw deleteError;

      router.push('/members/garden');
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Helper function to parse duration for default value
  const parseDurationToValue = (duration: string | null): string => {
    if (!duration) return '';
    if (duration === '24 hours') return '24';
    const hoursMatch = duration.match(/([\d.]+)\s*hours?/);
    if (hoursMatch) {
      return hoursMatch[1];
    }
    return '';
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            disabled={isUpdating || isDeleting}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-lg bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-100">
              Edit Job
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-slate-900 dark:text-slate-300">Title</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={task.title}
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-900 dark:text-slate-300">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                defaultValue={task.description}
                rows={4}
                className="resize-none bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area_id" className="text-slate-900 dark:text-slate-300">Area</Label>
                <Select name="area_id" defaultValue={task.area_id}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select an area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority" className="text-slate-900 dark:text-slate-300">Priority</Label>
                <Select name="priority" defaultValue={task.priority}>
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

              <div>
                <Label htmlFor="status" className="text-slate-900 dark:text-slate-300">Status</Label>
                <Select name="status" defaultValue={task.status}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assigned_to" className="text-slate-900 dark:text-slate-300">Assigned To</Label>
                <Input
                  id="assigned_to"
                  name="assigned_to"
                  defaultValue={task.assigned_to ?? ''}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="due_date" className="text-slate-900 dark:text-slate-300">Date</Label>
                <Input
                  type="date"
                  id="due_date"
                  name="due_date"
                  defaultValue={task.due_date ?? ''}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 [&::-webkit-calendar-picker-indicator]:dark:invert"
                />
              </div>

              <div>
                <Label htmlFor="scheduled_time" className="text-slate-900 dark:text-slate-300">Time</Label>
                <Input
                  type="time"
                  id="scheduled_time"
                  name="scheduled_time"
                  defaultValue={task.scheduled_time ?? ''}
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 [&::-webkit-calendar-picker-indicator]:dark:invert"
                />
              </div>

              <div>
                <Label htmlFor="duration" className="text-slate-900 dark:text-slate-300">Duration</Label>
                <Select name="duration" defaultValue={parseDurationToValue(task.duration)}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">Half an hour</SelectItem>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="24">All day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditDialogOpen(false)}
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} variant="default">
                {isUpdating ? 'Saving...' : 'Save Changes'}
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
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              task and remove all associated data including comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 dark:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete Task'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
