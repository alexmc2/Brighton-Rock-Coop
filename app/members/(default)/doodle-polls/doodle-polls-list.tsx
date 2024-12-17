// app/(default)/doodle-polls/doodle-polls-list.tsx

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/members/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/members/ui/select';
import { DoodlePoll, DoodleEventType } from '@/types/members/doodle';
import DoodlePollCard from './doodle-poll-card';
import { useQueryState } from 'nuqs';

interface DoodlePollsListProps {
  polls: DoodlePoll[];
  currentUserId?: string;
}

const ITEMS_PER_PAGE = 6;

type SortBy = 'event_date' | 'created_date';
type SortOrder = 'asc' | 'desc';

export default function DoodlePollsList({
  polls = [],
  currentUserId,
}: DoodlePollsListProps) {
  // State management with URL parameters
  const [eventType, setEventType] = useQueryState('type', {
    defaultValue: 'all',
    parse: (value): 'all' | DoodleEventType => value as any,
  });
  const [sortBy, setSortBy] = useQueryState<SortBy>('sortBy', {
    defaultValue: 'event_date',
    parse: (value): SortBy => value as SortBy,
  });
  const [sortOrder, setSortOrder] = useQueryState<SortOrder>('sortOrder', {
    defaultValue: 'asc',
    parse: (value): SortOrder => value as SortOrder,
  });
  const [currentPage, setCurrentPage] = useQueryState('page', {
    defaultValue: '1',
    parse: (value) => value,
  });
  const [showClosed, setShowClosed] = useQueryState('showClosed', {
    defaultValue: 'true',
    parse: (value) => value,
  });

  // Load the saved preference when component mounts
  useEffect(() => {
    const savedShowClosed = localStorage.getItem('showClosedPolls');
    if (savedShowClosed !== null && savedShowClosed !== showClosed) {
      setShowClosed(savedShowClosed);
    }
  }, [setShowClosed, showClosed]);

  // Save preference whenever it changes
  useEffect(() => {
    localStorage.setItem('showClosedPolls', showClosed);
  }, [showClosed]);

  // Filter and sort polls
  const filteredPolls = polls
    .filter((poll) => {
      if (showClosed === 'false' && poll.closed) return false;
      if (eventType !== 'all' && poll.event_type !== eventType) return false;
      return true;
    })
    .sort((a, b) => {
      const aDate = Math.min(
        ...a.options.map((opt) => new Date(opt.date).getTime())
      );
      const bDate = Math.min(
        ...b.options.map((opt) => new Date(opt.date).getTime())
      );
      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
    });

  // Compute pagination
  const totalPages = Math.ceil(filteredPolls.length / ITEMS_PER_PAGE);
  const startIndex = (parseInt(currentPage) - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredPolls.length);
  const paginatedPolls = filteredPolls.slice(startIndex, endIndex);

  // Get unique event types
  const eventTypes = [
    'all',
    ...Array.from(new Set(polls.map((p) => p.event_type))),
  ] as const;

  const formatEventType = (type: string) => {
    if (type === 'all') return 'All';
    if (type === 'social_event') return 'Co-op Social';
    if (type === 'development_event') return 'Development';
    return type.replace('_', ' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={eventType}
            onValueChange={(value: typeof eventType) => {
              setEventType(value);
              setCurrentPage('1');
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {formatEventType(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value: SortBy) => {
              setSortBy(value);
              setCurrentPage('1');
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Event Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="event_date">Event Date</SelectItem>
              <SelectItem value="created_date">Created Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={sortOrder}
            onValueChange={(value: SortOrder) => {
              setSortOrder(value);
              setCurrentPage('1');
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ascending" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showClosed === 'true' ? 'outline' : 'default'}
            onClick={() => setShowClosed(showClosed === 'true' ? 'false' : 'true')}
            className="w-full sm:w-auto"
          >
            {showClosed === 'true' ? 'Hide Closed Polls' : 'Show Closed Polls'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPolls.map((poll) => (
          <DoodlePollCard key={poll.id} poll={poll} />
        ))}
      </div>

      {filteredPolls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No polls found matching your filters
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            onClick={() => {
              const newPage = Math.max(1, parseInt(currentPage) - 1).toString();
              setCurrentPage(newPage);
            }}
            disabled={currentPage === '1'}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => {
              const newPage = Math.min(
                totalPages,
                parseInt(currentPage) + 1
              ).toString();
              setCurrentPage(newPage);
            }}
            disabled={parseInt(currentPage) === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
