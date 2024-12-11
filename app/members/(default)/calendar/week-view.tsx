'use client';

import { useCalendarContext } from './calendar-context';
import { format, isSameDay, addDays } from 'date-fns';
import { useCalendarStore } from '@/lib/members/stores/calendar-store';
import { getEventColor } from './event-colors';

export default function WeekView() {
  const { selectedDate, events } = useCalendarContext();
  const setSelectedEventId = useCalendarStore(
    (state) => state.setSelectedEventId
  );
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (date: Date) => {
    return events.filter((event) =>
      isSameDay(new Date(event.start_time), date)
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-auto dark:bg-slate-800">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-[4rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[6rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr] divide-x divide-slate-200 dark:divide-slate-700">
              <div className="sticky left-0 bg-white dark:bg-slate-800 " />
              {days.map((date, index) => (
                <div key={date.toISOString()} className="px-2 py-3 text-center">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100 ">
                    {dayNames[index]}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {format(date, 'MMM d')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {hours.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-[4rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[6rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr] divide-x divide-slate-200 dark:divide-slate-700 border-b  border-slate-200 dark:border-slate-700"
            >
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 py-1 text-center sticky left-0 bg-white dark:bg-slate-800  ">
                {hour === 0
                  ? '12 AM'
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? '12 PM'
                  : `${hour - 12} PM`}
              </div>
              {days.map((date) => {
                const dayEvents = getEventsForDay(date);
                const hourEvents = dayEvents.filter(
                  (event) => new Date(event.start_time).getHours() === hour
                );

                return (
                  <div
                    key={date.toISOString()}
                    className="min-h-[100px] p-1 space-y-1"
                  >
                    {hourEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEventId(event.id)}
                        className={`block w-full text-left px-2 py-1 rounded text-xs ${getEventColor(
                          event.event_type === 'social_event' ? 'Co-op Social' : event.category
                        )}`}
                      >
                        <div className="font-medium">
                          {format(new Date(event.start_time), 'HH:mm')}
                        </div>
                        <div>
                          {event.event_type === 'social_event' &&
                          event.subcategory
                            ? `Co-op Social (${event.subcategory
                                .split('_')
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(' ')}): ${event.title}`
                            : `${event.category}: ${event.title}`}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
