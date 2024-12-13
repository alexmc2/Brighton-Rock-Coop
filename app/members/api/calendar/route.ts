import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import ical from 'ical-generator';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get user session for authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error('No session found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get events for next 6 months
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);

    console.log('Fetching events between:', startDate.toISOString(), 'and', endDate.toISOString());

    const { data: events, error } = await supabase
      .from('calendar_events')
      .select(
        `
        id,
        title,
        description,
        start_time,
        end_time,
        event_type,
        category,
        subcategory,
        created_by,
        created_by_user:profiles!calendar_events_created_by_fkey(email, full_name)
      `
      )
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return new NextResponse('Error fetching events', { status: 500 });
    }

    console.log('Query parameters:', {
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString()
    });
    console.log('Found events:', events?.length || 0);
    if (events?.length > 0) {
      console.log('First event:', {
        title: events[0].title,
        start: events[0].start_time,
        end: events[0].end_time,
        category: events[0].category
      });
    } else {
      console.log('No events found in the date range');
    }

    // Create calendar
    const calendar = ical({
      name: 'Co-op Calendar',
      timezone: 'Europe/London',
      prodId: { company: 'co-op', product: 'calendar' },
    });

    // Add events to calendar
    events?.forEach((event) => {
      console.log('Adding event:', event.title, 'at', event.start_time);
      calendar.createEvent({
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        summary: event.title,
        description: event.description || '',
        location: '',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/members/calendar?event=${event.id}`,
        uid: event.id,
        organizer: {
          name: event.created_by_user?.[0]?.full_name || 'Unknown',
          email: event.created_by_user?.[0]?.email || 'no-reply@example.com',
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
    const calendarString = calendar.toString();
    console.log('Calendar string length:', calendarString.length);
    
    return new NextResponse(calendarString, { headers });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
