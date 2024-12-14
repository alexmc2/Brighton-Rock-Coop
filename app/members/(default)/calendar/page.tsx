// app/members/(default)/calendar/page.tsx

import { Metadata } from 'next';
import { getCalendarEvents } from '@/lib/members/actions/calendar';
import Calendar from './calendar';
import { addMonths, subMonths } from 'date-fns';
import CalendarFeedButton from '@/components/members/ui/calendar-feed-button';

export const metadata: Metadata = {
  title: 'Calendar - Brighton Rock',
  description: 'Calendar page for Brighton Rock Co-op',
};

export const revalidate = 0;

export default async function CalendarPage() {
  const today = new Date();
  const startDate = subMonths(today, 1);
  const endDate = addMonths(today, 36);

  const events = await getCalendarEvents(startDate, endDate);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-4">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Calendar
          </h1>
          <div className="flex justify-between items-center my-4 ">
            <CalendarFeedButton />
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden min-h-[calc(100vh-12rem)]">
        <Calendar initialEvents={events} />
      </div>
    </div>
  );
}
