'use client';

import { useCalendarContext } from './calendar-context';
import { format, isSameDay } from 'date-fns';
import { useCalendarStore } from '@/lib/members/stores/calendar-store';
import { getEventColor } from './event-colors';

export default function DayView() {
  const { selectedDate, events } = useCalendarContext();
  const setSelectedEventId = useCalendarStore(
    (state) => state.setSelectedEventId
  );
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayEvents = events.filter((event) =>
    isSameDay(new Date(event.start_time), selectedDate)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {format(selectedDate, 'EEEE')}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {format(selectedDate, 'MMMM d, yyyy')}
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-200 dark:divide-slate-700">
        {hours.map((hour) => {
          const hourEvents = dayEvents.filter(
            (event) => new Date(event.start_time).getHours() === hour
          );

          return (
            <div key={hour} className="group relative min-h-[60px] dark:bg-slate-900">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 w-16 py-2 text-right pr-4 sticky left-0">
                {hour === 0
                  ? '12 AM'
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? '12 PM'
                  : `${hour - 12} PM`}
              </div>
              <div className="absolute inset-0 left-16 pl-4">
                {hourEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`w-full text-left px-2 py-1 rounded text-xs ${getEventColor(
                      event.event_type === 'social_event'
                        ? 'Co-op Social'
                        : event.category
                    )}`}
                  >
                    {format(new Date(event.start_time), 'HH:mm')} -{' '}
                    {event.event_type === 'social_event' && event.subcategory
                      ? `Co-op Social (${event.subcategory
                          .split('_')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(' ')}): ${event.title}`
                      : `${event.category}: ${event.title}`}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
