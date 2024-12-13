import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import ical from 'ical-generator';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Get user session for authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Get events for next 6 months
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 6);

  const { data: events, error } = await supabase
    .from('calendar_events')
    .select(
      `
      *,
      created_by_user:created_by(email, full_name)
    `
    )
    .gte('start_time', startDate.toISOString())
    .lte('end_time', endDate.toISOString())
    .order('start_time', { ascending: true });

  if (error) {
    return new NextResponse('Error fetching events', { status: 500 });
  }

  // Create calendar
  const calendar = ical({
    name: 'Co-op Calendar',
    timezone: 'Europe/London',
    prodId: { company: 'co-op', product: 'calendar' },
  });

  // Add events to calendar
  events.forEach((event) => {
    calendar.createEvent({
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      summary: event.title,
      description: event.description || '',
      location: '',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/members/calendar?event=${event.id}`,
      uid: event.id,
      organizer: {
        name: event.created_by_user?.full_name || 'Unknown',
        email: event.created_by_user?.email || 'no-reply@example.com',
      },
      categories: [event.category],
    });
  });

  // Set response headers
  const headers = new Headers();
  headers.set('Content-Type', 'text/calendar; charset=utf-8');
  headers.set(
    'Content-Disposition',
    'attachment; filename="co-op-calendar.ics"'
  );

  // Return calendar
  return new NextResponse(calendar.toString(), { headers });
}
