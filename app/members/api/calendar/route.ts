// import { NextRequest, NextResponse } from 'next/server';
// import ical from 'ical-generator';
// import { createClient } from '@supabase/supabase-js';

// // Mark this route as dynamic
// export const dynamic = 'force-dynamic';

// export async function GET(request: NextRequest) {
//   try {
//     // Check for the secret key in query parameters
//     // In your calendar API route
//     const providedKey = request.nextUrl.searchParams.get('key');
//     if (!providedKey || providedKey !== process.env.SECRET_CALENDAR_KEY) {
//       // Remove NEXT_PUBLIC_ prefix
//       console.error('Invalid or missing secret key');
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     // Create Supabase client with service role key for admin access
//     const supabase = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key instead of anon key
//       {
//         auth: {
//           persistSession: false,
//         },
//       }
//     );

//     const { data: events, error } = await supabase
//       .from('calendar_events')
//       .select(
//         'id, title, description, start_time, end_time, event_type, category'
//       )
//       .order('start_time', { ascending: true });

//     // Add this debug logging
//     console.log('Fetched events:', events?.length);

//     if (error) {
//       console.error('Database error:', error);
//       return new NextResponse('Error fetching events', { status: 500 });
//     }

//     // Create the ICS calendar
//     const calendar = ical({
//       name: 'Brighton Rock Co-op Calendar',
//       timezone: 'Europe/London',
//       prodId: { company: 'brighton-rock', product: 'calendar' },
//       url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.brighton-rock.org',
//     });

//     // Add debug logging for each event
//     events?.forEach((event) => {
//       console.log('Processing event:', event.title);
//       try {
//         // Create an array of valid category names, filtering out any null/undefined values
//         const categories = [event.category, event.event_type]
//           .filter(Boolean) // Remove any null/undefined values
//           .map((cat) => ({ name: cat })); // Format each category with a name property

//         calendar.createEvent({
//           start: new Date(event.start_time),
//           end: new Date(event.end_time),
//           summary: event.title,
//           description: event.description || '',
//           uid: event.id,
//           categories: categories.length > 0 ? categories : [{ name: 'Other' }],
//         });
//         console.log('Successfully added event:', event.title);
//       } catch (eventError) {
//         console.error('Error creating event:', event.title, eventError);
//       }
//     });
//     // Add this debug logging
//     console.log('Calendar events count:', calendar.events().length);

//     return new NextResponse(calendar.toString(), {
//       headers: {
//         'Content-Type': 'text/calendar; charset=utf-8',
//         'Content-Disposition':
//           'attachment; filename="brighton-rock-calendar.ics"',
//       },
//     });
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import ical from 'ical-generator';
import { createClient } from '@supabase/supabase-js';
import { parseISO, addHours } from 'date-fns';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Helper function to format subcategory
function formatSubcategory(subcategory: string): string {
  return subcategory
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to format the event title with context
function formatEventTitle(event: any) {
  const prefix = 'Co-op';

  switch (event.event_type) {
    case 'social_event':
      const socialCategory = event.subcategory
        ? formatSubcategory(event.subcategory)
        : 'Social';
      return `${prefix} Social (${socialCategory}): ${event.title}`;

    case 'garden_task':
      return `${prefix} Garden: ${event.title}`;

    case 'development_event':
      const devCategory = event.subcategory
        ? formatSubcategory(event.subcategory)
        : 'Development';
      return `${prefix} Development (${devCategory}): ${event.title}`;

    case 'maintenance_visit':
      return `${prefix} Maintenance Visit: ${event.title}`;

    case 'manual':
      return `${prefix} ${event.category}: ${event.title}`;

    default:
      return `${prefix} ${event.category || 'Event'}: ${event.title}`;
  }
}

// Helper function to calculate event duration
function calculateEndTime(
  startTime: string,
  duration: string | null,
  event_type: string
): Date {
  const start = parseISO(startTime);

  if (!duration) {
    // Default durations based on event type
    switch (event_type) {
      case 'social_event':
        return addHours(start, 3); // Default 3 hours for social events
      case 'garden_task':
        return addHours(start, 2); // Default 2 hours for garden tasks
      case 'development_event':
        return addHours(start, 2); // Default 2 hours for development events
      case 'maintenance_visit':
        return addHours(start, 1); // Default 1 hour for maintenance visits
      default:
        return addHours(start, 1); // Default 1 hour for other events
    }
  }

  if (duration === 'All day') {
    const end = new Date(start);
    end.setHours(23, 59, 59);
    return end;
  }

  // Parse duration string to hours
  const durationHours = parseFloat(duration);
  if (isNaN(durationHours)) {
    return addHours(start, 1);
  }

  return addHours(start, durationHours);
}

// Helper function to create categories array for color coding
function createCategories(event: any) {
  const categories = [{ name: 'Co-op' }, { name: event.category }];

  switch (event.event_type) {
    case 'social_event':
      if (event.subcategory) {
        categories.push({ name: formatSubcategory(event.subcategory) });
      }
      categories.push({ name: 'Social' });
      break;

    case 'garden_task':
      categories.push({ name: 'Garden' });
      break;

    case 'development_event':
      if (event.subcategory) {
        categories.push({ name: formatSubcategory(event.subcategory) });
      }
      categories.push({ name: 'Development' });
      break;

    case 'maintenance_visit':
      categories.push({ name: 'P4P Visit' });
      break;
  }

  return categories.filter(Boolean);
}

export async function GET(request: NextRequest) {
  try {
    const providedKey = request.nextUrl.searchParams.get('key');
    if (!providedKey || providedKey !== process.env.SECRET_CALENDAR_KEY) {
      console.error('Invalid or missing secret key');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false },
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
        duration,
        location
      `
      )
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return new NextResponse('Error fetching events', { status: 500 });
    }

    const calendar = ical({
      name: 'Brighton Rock Co-op Calendar',
      timezone: 'Europe/London',
      prodId: { company: 'brighton-rock', product: 'calendar' },
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.brighton-rock.org',
    });

    events?.forEach((event) => {
      try {
        const startTime = new Date(event.start_time);
        const endTime = calculateEndTime(
          event.start_time,
          event.duration,
          event.event_type
        );

        let description = event.description || '';
        if (event.location) {
          description = `Location: ${event.location}\n\n${description}`;
        }

        calendar.createEvent({
          start: startTime,
          end: endTime,
          summary: formatEventTitle(event),
          description: description,
          location: event.location,
          uid: event.id,
          categories: createCategories(event),
        });
      } catch (eventError) {
        console.error('Error creating event:', event.title, eventError);
      }
    });

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
