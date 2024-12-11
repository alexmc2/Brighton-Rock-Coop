// app/(default)/development/[id]/project-actions.tsx

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
} from '@/components/members/ui/dialog';
import { Button } from '@/components/members/ui/button';
import { Input } from '@/components/members/ui/input';
import { Textarea } from '@/components/members/ui/textarea';
import { Label } from '@/components/members/ui/label';
import { Edit, Trash2 } from 'lucide-react';
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

interface ProjectActionsProps {
  initiative: DevelopmentInitiativeWithDetails;
}

export default function ProjectActions({ initiative }: ProjectActionsProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const supabase = createClientComponentClient();

  // Form state for projects
  const [title, setTitle] = useState(initiative.title);
  const [description, setDescription] = useState(initiative.description || '');
  const [category, setCategory] = useState<DevelopmentCategory>(
    initiative.category
  );
  const [priority, setPriority] = useState<DevelopmentPriority>(
    initiative.priority
  );
  const [status, setStatus] = useState<DevelopmentStatus>(initiative.status);
  //   const [budget, setBudget] = useState(
  //     initiative.budget ? initiative.budget.toString() : ''
  //   );

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

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
      console.error('Error deleting project:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete project');
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

      const data = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status,
        // budget: budget ? parseFloat(budget) : null,
      };

      const { error: updateError } = await supabase
        .from('development_initiatives')
        .update(data)
        .eq('id', initiative.id);

      if (updateError) throw updateError;

      setIsEditDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating project:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to update project'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsEditDialogOpen(true)}
        disabled={isSubmitting || isDeleting}
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>

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
              project and remove all associated data including comments.
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
              {isSubmitting ? 'Deleting...' : 'Delete Project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-lg bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
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

            {/* Status */}
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
    </div>
  );
}
