import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import ical from 'ical-generator';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    let session;
    const token = request.nextUrl.searchParams.get('token');

    // If token is provided, create a new Supabase client with it
    if (token) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Exchange refresh token for access token
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession({
          refresh_token: token
        });

      if (refreshError) {
        console.error('Token refresh error:', refreshError);
        return new NextResponse('Unauthorized', { status: 401 });
      }

      session = refreshedSession;
    } else {
      // Fallback to cookie-based auth
      const supabase = createRouteHandlerClient({ cookies });
      const { data } = await supabase.auth.getSession();
      session = data.session;
    }

    if (!session) {
      console.error('No session found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Create a new Supabase client with the session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      }
    );

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

    console.log('Found events:', events?.length || 0);
    if (events?.length > 0) {
      console.log('Sample events:', events.map(e => ({
        title: e.title,
        start: e.start_time,
        end: e.end_time,
        category: e.category
      })));
    }

    // Create calendar
    const calendar = ical({
      name: 'Co-op Calendar',
      timezone: 'Europe/London',
      prodId: { company: 'co-op', product: 'calendar' },
    });

    // Add events to calendar
    events?.forEach((event) => {
      calendar.createEvent({
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        summary: event.title,
        description: event.description || '',
        location: '',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/members/calendar?event=${event.id}`,
        uid: event.id,
        organizer: {
          name: event.created_by_user?.[0]?.full_name || 'Unknown',
          email: event.created_by_user?.[0]?.email || 'no-reply@example.com',
        },
        categories: [event.category || event.event_type],
      });
    });

    // Set response headers
    const headers = new Headers();
    headers.set('Content-Type', 'text/calendar; charset=utf-8');
    headers.set('Content-Disposition', 'attachment; filename="co-op-calendar.ics"');
    
    // Add CORS headers
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Return calendar
    const calendarString = calendar.toString();
    console.log('Calendar string length:', calendarString.length);
    
    return new NextResponse(calendarString, { headers });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
