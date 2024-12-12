// app/(default)/garden/[id]/task-header.tsx

'use client';

import Link from 'next/link';
import { GardenTaskWithDetails } from '@/types/members/garden';
import TaskActions from './task-actions';

interface TaskHeaderProps {
  task: GardenTaskWithDetails;
}

export default function TaskHeader({ task }: TaskHeaderProps) {
  return (
    <div className="mb-8">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/members/garden"
          className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
        >
          ← Back to Garden
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-2">
            {task.title}
          </h1>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Area: {task.area.name}
            </div>
            <TaskActions task={task} />
          </div>
        </div>
      </div>
    </div>
  );
}
