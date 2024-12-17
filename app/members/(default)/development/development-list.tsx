'use client';

import React, { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/members/ui/button';
import InitiativeCard from './initiative-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/members/ui/select';
import {
  DevelopmentInitiativeWithDetails,
  DevelopmentCategory,
  DevelopmentStatus,
  InitiativeType,
} from '@/types/members/development';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useQueryState } from 'nuqs';

interface InitiativeListProps {
  initiatives?: DevelopmentInitiativeWithDetails[];
}

const ITEMS_PER_PAGE = 6;

type SortField = 'created_at' | 'event_date';
type SortOrder = 'asc' | 'desc';

export default function InitiativeList({
  initiatives: initialInitiatives = [],
}: InitiativeListProps) {
  const supabase = createClientComponentClient();
  const [initiatives, setInitiatives] = React.useState(initialInitiatives);

  // State management with URL parameters
  const [currentPage, setCurrentPage] = useQueryState('page', {
    defaultValue: '1',
    parse: (value) => value,
  });
  const [type, setType] = useQueryState('type', {
    defaultValue: 'all',
    parse: (value): 'all' | InitiativeType => value as any,
  });
  const [category, setCategory] = useQueryState('category', {
    defaultValue: 'all',
    parse: (value): 'all' | DevelopmentCategory => value as any,
  });
  const [status, setStatus] = useQueryState('status', {
    defaultValue: 'all',
    parse: (value): 'all' | DevelopmentStatus => value as any,
  });
  const [sortField, setSortField] = useQueryState<SortField>('sortField', {
    defaultValue: 'event_date',
    parse: (value): SortField => value as SortField,
  });
  const [sortOrder, setSortOrder] = useQueryState<SortOrder>('sortOrder', {
    defaultValue: 'asc',
    parse: (value): SortOrder => value as SortOrder,
  });

  // Set up real-time subscription for participant updates
  useEffect(() => {
    // Subscribe to changes in event_participants table
    const channel = supabase
      .channel('event_participants_changes')
      .on(
        'postgres_changes' as never,
        {
          event: '*',
          schema: 'public',
          table: 'event_participants',
        },
        async (
          payload: RealtimePostgresChangesPayload<{
            event_id: string;
            user_id: string;
            status: string;
          }> & {
            new: { event_id: string } | null;
            old: { event_id: string } | null;
          }
        ) => {
          const eventId = payload.new?.event_id || payload.old?.event_id;
          if (!eventId) return;

          // Fetch updated participants for the affected initiative
          const { data: participants } = await supabase
            .from('event_participants')
            .select(
              `
              *,
              user:profiles!event_participants_user_id_fkey (
                email,
                full_name
              )
            `
            )
            .eq('event_id', eventId);

          // Update the initiatives state with new participant data
          setInitiatives((prevInitiatives) =>
            prevInitiatives.map((initiative) => {
              if (initiative.id === eventId) {
                return {
                  ...initiative,
                  participants: participants || [],
                };
              }
              return initiative;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Update local state when props change
  useEffect(() => {
    setInitiatives(initialInitiatives);
  }, [initialInitiatives]);

  // Filter and sort initiatives
  const filteredInitiatives = initiatives
    .filter((initiative) => {
      if (type !== 'all' && initiative.initiative_type !== type) return false;
      if (category !== 'all' && initiative.category !== category) return false;
      if (status !== 'all' && initiative.status !== status) return false;
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (!aValue && !bValue) return 0;
      if (!aValue) return sortOrder === 'asc' ? 1 : -1;
      if (!bValue) return sortOrder === 'asc' ? -1 : 1;

      const comparison = aValue > bValue ? 1 : -1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination logic
  const totalItems = filteredInitiatives.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (parseInt(currentPage) - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedInitiatives = filteredInitiatives.slice(startIndex, endIndex);

  // Get unique categories and statuses from initiatives
  const categories: Array<'all' | DevelopmentCategory> = [
    'all',
    ...(Array.from(
      new Set(initiatives.map((i) => i.category))
    ) as DevelopmentCategory[]),
  ];

  const statuses: Array<'all' | DevelopmentStatus> = [
    'all',
    ...(Array.from(
      new Set(initiatives.map((i) => i.status))
    ) as DevelopmentStatus[]),
  ];

  const formatFilterLabel = (value: string): string => {
    if (value === 'all') return 'All';
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <Select
            value={type}
            onValueChange={(value: 'all' | InitiativeType) => {
              setType(value);
              setCurrentPage('1');
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={category}
            onValueChange={(value: 'all' | DevelopmentCategory) => {
              setCategory(value);
              setCurrentPage('1');
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {formatFilterLabel(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value: 'all' | DevelopmentStatus) => {
              setStatus(value);
              setCurrentPage('1');
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatFilterLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortField}
            onValueChange={(value: SortField) => {
              setSortField(value);
              setCurrentPage('1');
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="event_date">Event Date</SelectItem>
              <SelectItem value="created_at">Created Date</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value: SortOrder) => {
              setSortOrder(value);
              setCurrentPage('1');
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid of Initiative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedInitiatives.map((initiative) => (
          <InitiativeCard key={initiative.id} initiative={initiative} />
        ))}
      </div>

      {/* Empty State */}
      {paginatedInitiatives.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No initiatives found matching your filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setCurrentPage((parseInt(currentPage) - 1).toString())}
            disabled={currentPage === '1'}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((parseInt(currentPage) + 1).toString())}
            disabled={parseInt(currentPage) >= totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
