'use client';

import { useEffect, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  format,
  isSameDay,
} from 'date-fns';
import { useCalendarContext } from './calendar-context';
import { useCalendarStore } from '@/lib/members/stores/calendar-store';
import { getEventColor } from './event-colors';

export default function CalendarTable() {
  const { currentMonth, currentYear, events } = useCalendarContext();
  const setSelectedEventId = useCalendarStore(
    (state) => state.setSelectedEventId
  );
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth));
    const lastDayOfMonth = endOfMonth(new Date(currentYear, currentMonth));
    const firstDayOfCalendar = startOfWeek(firstDayOfMonth);
    const lastDayOfCalendar = endOfWeek(lastDayOfMonth);
    const daysInterval = eachDayOfInterval({
      start: firstDayOfCalendar,
      end: lastDayOfCalendar,
    });
    setDays(daysInterval);
  }, [currentMonth, currentYear]);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (date: Date) => {
    return events.filter((event) =>
      isSameDay(new Date(event.start_time), date)
    );
  };

  return (
    <div className="grid grid-cols-7">
      {dayNames.map((day) => (
        <div
          key={day}
          className="p-2 text-center text-sm font-semibold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-800"
        >
          {day}
        </div>
      ))}

      {days.map((day) => {
        const dayEvents = getEventsForDay(day);
        const isCurrentMonth = isSameMonth(
          day,
          new Date(currentYear, currentMonth)
        );
        const isCurrentDay = isToday(day);

        return (
          <div
            key={day.toISOString()}
            className={`
              min-h-[120px] p-2 border border-slate-200 dark:border-slate-900
              ${
                !isCurrentMonth
                  ? 'bg-slate-100 dark:bg-slate-900/50 text-slate-400'
                  : 'bg-white dark:bg-slate-800'
              }
              ${isCurrentDay ? 'bg-slate-100 dark:bg-blue-900/20' : ''}
            `}
          >
            <div className="text-sm font-medium">{format(day, 'd')}</div>
            <div className="mt-1 space-y-1">
              {dayEvents.map((event) => (
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
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
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
  );
}
