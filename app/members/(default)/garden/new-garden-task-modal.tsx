// app/(default)/garden/new-garden-task-modal.tsx

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
import { GardenTaskPriority } from '@/types/members/garden';
import { Plus } from 'lucide-react';
import { createGardenTaskEvent } from '@/lib/members/actions/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/members/ui/select';

export default function NewGardenTaskModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);
  const supabase = createClientComponentClient();

  const fetchAreas = async () => {
    const { data, error } = await supabase
      .from('garden_areas')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching areas:', error);
      return;
    }

    setAreas(data || []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
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
        .select('email, full_name')
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

      // Insert garden task
      const { data: newTask, error: insertError } = await supabase
        .from('garden_tasks')
        .insert({
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          area_id: formData.get('area_id') as string,
          priority: formData.get('priority') as GardenTaskPriority,
          due_date: (formData.get('due_date') as string) || null,
          scheduled_time: (formData.get('scheduled_time') as string) || null,
          assigned_to: (formData.get('assigned_to') as string) || 'Everyone',
          status: 'pending',
          duration: durationInterval,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Create calendar event if due date is set
      if (formData.get('due_date') && newTask) {
        await createGardenTaskEvent(
          newTask.title,
          newTask.description,
          newTask.due_date,
          newTask.scheduled_time,
          durationValue,
          user.id,
          profile.full_name,
          newTask.id
        );
      }

      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to create task'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setIsOpen(true);
              fetchAreas();
            }}
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-lg bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>New Garden Job</DialogTitle>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="title"
                className="text-slate-900 dark:text-slate-300"
              >
                Title
              </Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Enter job title"
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-slate-900 dark:text-slate-300"
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Enter job description"
                className="resize-none bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="area_id"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Area
                </Label>
                <Select name="area_id" required>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select an area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id || 'default'}>
                        {area.name}
                      </SelectItem>
                    ))}
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
                <Select name="priority" defaultValue="medium">
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
                <Label
                  htmlFor="assigned_to"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Assigned To
                </Label>
                <Input
                  id="assigned_to"
                  name="assigned_to"
                  placeholder="Enter any name"
                  defaultValue="Everyone"
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <Label
                  htmlFor="due_date"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Date
                </Label>
                <Input
                  type="date"
                  id="due_date"
                  name="due_date"
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 [&::-webkit-calendar-picker-indicator]:dark:invert"
                />
              </div>

              <div>
                <Label
                  htmlFor="scheduled_time"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Time
                </Label>
                <Input
                  type="time"
                  id="scheduled_time"
                  name="scheduled_time"
                  className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-700 [&::-webkit-calendar-picker-indicator]:dark:invert"
                />
              </div>

              <div>
                <Label
                  htmlFor="duration"
                  className="text-slate-900 dark:text-slate-300"
                >
                  Duration
                </Label>
                <Select name="duration">
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
                onClick={() => setIsOpen(false)}
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="default">
                {isSubmitting ? (
                  'Creating...'
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job
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
