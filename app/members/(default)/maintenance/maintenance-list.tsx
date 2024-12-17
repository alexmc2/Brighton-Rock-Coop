// app/(default)/maintenance/maintenance-list.tsx
'use client';

import { useQueryState } from 'nuqs';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  MaintenanceRequestWithDetails,
  MaintenanceStatus,
  MaintenancePriority,
} from '@/types/members/maintenance';
import { Button } from '@/components/members/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/members/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/members/ui/select';

interface MaintenanceListProps {
  requests: MaintenanceRequestWithDetails[];
}

type SortOrder = 'created_desc' | 'created_asc';
type HouseFilter = 'all' | '399' | '397' | '395';

const ITEMS_PER_PAGE = 10;

export default function MaintenanceList({ requests }: MaintenanceListProps) {
  // State management with URL parameters
  const [status, setStatus] = useQueryState('status', {
    defaultValue: 'all',
    parse: (value): 'all' | MaintenanceStatus => value as any,
  });
  const [priority, setPriority] = useQueryState('priority', {
    defaultValue: 'all',
    parse: (value): 'all' | MaintenancePriority => value as any,
  });
  const [house, setHouse] = useQueryState('house', {
    defaultValue: 'all',
    parse: (value): HouseFilter => value as HouseFilter,
  });
  const [sortOrder, setSortOrder] = useQueryState<SortOrder>('sortOrder', {
    defaultValue: 'created_desc',
    parse: (value): SortOrder => value as SortOrder,
  });
  const [currentPage, setCurrentPage] = useQueryState('page', {
    defaultValue: '1',
    parse: (value) => value,
  });

  // Filter and sort requests
  const filteredRequests = requests
    .filter((request) => {
      if (status !== 'all' && request.status !== status) return false;
      if (priority !== 'all' && request.priority !== priority) return false;
      if (house !== 'all' && request.house.name !== `${house} Kingsway`)
        return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'created_desc' ? dateB - dateA : dateA - dateB;
    });

  // Calculate pagination
  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (parseInt(currentPage) - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  // Handle page changes
  const goToNextPage = () => {
    if (parseInt(currentPage) < totalPages) {
      setCurrentPage((parseInt(currentPage) + 1).toString());
    }
  };

  const goToPreviousPage = () => {
    if (parseInt(currentPage) > 1) {
      setCurrentPage((parseInt(currentPage) - 1).toString());
    }
  };

  // Reset pagination when filters change
  const handleFilterChange = (
    filterType: 'status' | 'priority' | 'house' | 'sort',
    value: string
  ) => {
    setCurrentPage('1'); // Reset to first page
    switch (filterType) {
      case 'status':
        setStatus(value as 'all' | MaintenanceStatus);
        break;
      case 'priority':
        setPriority(value as 'all' | MaintenancePriority);
        break;
      case 'house':
        setHouse(value as HouseFilter);
        break;
      case 'sort':
        setSortOrder(value as SortOrder);
        break;
    }
  };

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
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority: MaintenancePriority) => {
    const colors = {
      low: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400',
      medium:
        'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      high: 'bg-orange-100 text-orange-600 dark:text-orange-400 dark:bg-orange-500/20',
      urgent: 'bg-red-100 text-red-600 dark:text-red-400 dark:bg-red-600/20',
    };
    return colors[priority] || colors.medium;
  };

  const formatFilterLabel = (value: string): string => {
    if (value === 'all') return 'All';
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6">
        {/* Matching social events filter layout */}
        <div className="max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* Status Filter */}
            <Select
              value={status}
              onValueChange={(value: 'all' | MaintenanceStatus) => {
                handleFilterChange('status', value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {[
                  'pending',
                  'scheduled',
                  'in_progress',
                  'completed',
                  'cancelled',
                ].map((status) => (
                  <SelectItem key={status} value={status}>
                    {formatFilterLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={priority}
              onValueChange={(value: 'all' | MaintenancePriority) => {
                handleFilterChange('priority', value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {['low', 'medium', 'high', 'urgent'].map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {formatFilterLabel(priority)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* House Filter */}
            <Select
              value={house}
              onValueChange={(value: HouseFilter) => {
                handleFilterChange('house', value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="House" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Houses</SelectItem>
                <SelectItem value="399">399 Kingsway</SelectItem>
                <SelectItem value="397">397 Kingsway</SelectItem>
                <SelectItem value="395">395 Kingsway</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select
              value={sortOrder}
              onValueChange={(value: SortOrder) => {
                handleFilterChange('sort', value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_desc">Newest First</SelectItem>
                <SelectItem value="created_asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Maintenance Requests Table */}
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="relative w-full">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <Table className="min-w-[1000px] w-full divide-y divide-slate-200 dark:divide-slate-700 rounded-lg">
                  <TableHeader className="bg-slate-50 dark:bg-slate-900/20 rounded-lg">
                    <TableRow>
                      <TableHead className="min-w-[180px] w-[18%] px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Title
                      </TableHead>
                      <TableHead className="min-w-[140px] w-[15%] px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100">
                        House
                      </TableHead>
                      <TableHead className="min-w-[100px] w-[10%] px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Status
                      </TableHead>
                      <TableHead className="min-w-[90px] w-[10%] px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Priority
                      </TableHead>
                      <TableHead className="min-w-[140px] w-[10%] px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Reported By
                      </TableHead>
                      <TableHead className="min-w-[140px] w-[10%] px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Assigned To
                      </TableHead>
                      <TableHead className="min-w-[100px] w-[10%] px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Date
                      </TableHead>
                      <TableHead className="min-w-[180px] w-[12%] px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Next P4P Visit
                      </TableHead>
                      <TableHead className="min-w-[80px] w-[5%] px-4 py-3 text-center text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Comments
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests.map((request) => {
                      const nextVisit = request.visits
                        .filter(
                          (v) =>
                            !v.completed_at &&
                            new Date(v.scheduled_date) > new Date()
                        )
                        .sort(
                          (a, b) =>
                            new Date(a.scheduled_date).getTime() -
                            new Date(b.scheduled_date).getTime()
                        )[0];

                      return (
                        <TableRow key={request.id}>
                          <TableCell className="px-4 py-3">
                            <Link
                              href={`/members/maintenance/${request.id}`}
                              className="font-medium text-coop-600 dark:text-coop-400 hover:underline truncate block max-w-[180px]"
                              title={request.title}
                            >
                              {request.title}
                            </Link>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            {request.house.name}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div
                              className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1).replace('_', ' ')}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div
                              className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${getPriorityColor(
                                request.priority
                              )}`}
                            >
                              {request.priority.charAt(0).toUpperCase() +
                                request.priority.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            {request.reported_by_user.full_name ||
                              request.reported_by_user.email}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            {request.assigned_to_user?.full_name ||
                              request.assigned_to_user?.email ||
                              '-'}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            {format(
                              new Date(request.created_at),
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            {nextVisit
                              ? format(
                                  new Date(nextVisit.scheduled_date),
                                  'MMM d, yyyy h:mm a'
                                )
                              : '-'}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            {request.comments.length}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {paginatedRequests.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center py-8 text-slate-500 dark:text-slate-400"
                        >
                          No maintenance requests found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <nav
              className="mb-4 sm:mb-0 sm:order-1"
              role="navigation"
              aria-label="Navigation"
            >
              <ul className="flex justify-center">
                <li className="ml-3 first:ml-0">
                  <Button
                    onClick={goToPreviousPage}
                    disabled={currentPage === '1'}
                    variant="outline"
                    size="sm"
                  >
                    &lt;- Previous
                  </Button>
                </li>
                <li className="ml-3 first:ml-0">
                  <Button
                    onClick={goToNextPage}
                    disabled={parseInt(currentPage) >= totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next -&gt;
                  </Button>
                </li>
              </ul>
            </nav>
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Showing{' '}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {startIndex + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {endIndex}
              </span>{' '}
              of{' '}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {totalItems}
              </span>{' '}
              results
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
