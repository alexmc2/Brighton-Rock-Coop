import { NextRequest, NextResponse } from 'next/server';
import ical from 'ical-generator';
import { createClient } from '@supabase/supabase-js';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check for the secret key in query parameters
    // In your calendar API route
    const providedKey = request.nextUrl.searchParams.get('key');
    if (!providedKey || providedKey !== process.env.SECRET_CALENDAR_KEY) {
      // Remove NEXT_PUBLIC_ prefix
      console.error('Invalid or missing secret key');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Create Supabase client with service role key for admin access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key instead of anon key
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { data: events, error } = await supabase
      .from('calendar_events')
      .select(
        'id, title, description, start_time, end_time, event_type, category'
      )
      .order('start_time', { ascending: true });

    // Add this debug logging
    console.log('Fetched events:', events?.length);

    if (error) {
      console.error('Database error:', error);
      return new NextResponse('Error fetching events', { status: 500 });
    }

    // Create the ICS calendar
    const calendar = ical({
      name: 'Brighton Rock Co-op Calendar',
      timezone: 'Europe/London',
      prodId: { company: 'brighton-rock', product: 'calendar' },
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.brighton-rock.org',
    });

    // Add debug logging for each event
    events?.forEach((event) => {
      console.log('Processing event:', event.title);
      try {
        // Create an array of valid category names, filtering out any null/undefined values
        const categories = [event.category, event.event_type]
          .filter(Boolean) // Remove any null/undefined values
          .map((cat) => ({ name: cat })); // Format each category with a name property

        calendar.createEvent({
          start: new Date(event.start_time),
          end: new Date(event.end_time),
          summary: event.title,
          description: event.description || '',
          uid: event.id,
          categories: categories.length > 0 ? categories : [{ name: 'Other' }],
        });
        console.log('Successfully added event:', event.title);
      } catch (eventError) {
        console.error('Error creating event:', event.title, eventError);
      }
    });
    // Add this debug logging
    console.log('Calendar events count:', calendar.events().length);

    return new NextResponse(calendar.toString(), {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition':
          'attachment; filename="brighton-rock-calendar.ics"',
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
