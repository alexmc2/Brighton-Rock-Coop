// app/(default)/maintenance/[id]/request-header.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  MaintenanceRequestWithDetails,
  MaintenanceStatus,
} from '@/types/members/maintenance';
import Link from 'next/link';
import { Button } from '@/components/members/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/members/ui/alert-dialog';

interface RequestHeaderProps {
  request: MaintenanceRequestWithDetails;
}

export default function RequestHeader({ request }: RequestHeaderProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const getStatusColor = (status: MaintenanceStatus) => {
    const colors = {
      pending:
        'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200',
      scheduled:
        'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
      in_progress:
        'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200',
      completed:
        'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
      cancelled:
        'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200',
    };
    return colors[status];
  };

  const handleStatusChange = async (status: MaintenanceStatus) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ status })
        .eq('id', request.id);

      if (error) throw error;
      router.refresh();
      setIsDropdownOpen(false);
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Delete associated calendar events first
      await supabase
        .from('calendar_events')
        .delete()
        .eq('reference_id', request.id)
        .eq('event_type', 'maintenance_request');

      // Then delete the request
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', request.id);

      if (error) throw error;

      router.push('/members/maintenance');
    } catch (err) {
      console.error('Error deleting request:', err);
      setError('Failed to delete request');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const statusOptions: MaintenanceStatus[] = [
    'pending',
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
  ];

  return (
    <div className="mb-8">
      <Link
        href="/members/maintenance"
        className="text-sm font-medium text-coop-600 hover:text-coop-700 dark:text-coop-400 dark:hover:text-coop-300"
      >
        ← Back to Maintenance
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2 mt-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {request.title}
        </h1>

        <div className="flex flex-col sm:flex-row items-start gap-3">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            className="min-w-[140px] justify-center"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isUpdating}
              className={`min-w-[140px] justify-center inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${getStatusColor(
                request.status
              )}`}
            >
              {request.status.charAt(0).toUpperCase() +
                request.status.slice(1).replace('_', ' ')}
              <svg
                className="w-3 h-3 shrink-0 ml-2 fill-current opacity-70"
                viewBox="0 0 12 12"
              >
                <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="origin-top-right absolute top-full right-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded-lg overflow-hidden z-10">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full text-left px-3 py-1 text-sm font-medium transition-colors ${
                      status === request.status
                        ? 'text-coop-600 dark:text-coop-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1).replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 rounded">
          {error}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this maintenance request and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 dark:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete Request'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
