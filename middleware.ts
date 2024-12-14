// middleware.ts

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = request.nextUrl.pathname;
  const providedKey = request.nextUrl.searchParams.get('key');

  // Allow public access to the calendar ICS feed if the secret key is provided
  if (path === '/members/api/calendar') {
    if (providedKey === process.env.SECRET_CALENDAR_KEY) {
      // If the secret key matches, skip session check and allow access
      return res;
    } else if (!session) {
      // If no valid key and no session, redirect to login
      return NextResponse.redirect(new URL('/members/login', request.url));
    }
  }

  // Allow public access to main site routes (outside /members)
  if (!path.startsWith('/members')) {
    return res;
  }

  // Allow access to login-related routes even when not logged in
  if (
    path === '/members/login' ||
    path === '/members/signup' ||
    path === '/members/reset-password'
  ) {
    if (session) {
      return NextResponse.redirect(new URL('/members/dashboard', request.url));
    }
    return res;
  }

  // For all other /members routes, require authentication
  if (!session) {
    const redirectUrl = new URL('/members/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', path);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/(.*)'],
};


// import { createClient } from '@supabase/supabase-js';
// import { Database } from '@/types/members/database';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: false,
//     flowType: 'pkce',
//     // Add these to help with rate limiting
//     storageKey: 'brighton-rock-auth', // Unique key for your app
//     storage: {
//       getItem: (key) => {
//         try {
//           // Add error handling for SSR
//           if (typeof window === 'undefined') {
//             return Promise.resolve(null);
//           }
//           const item = localStorage.getItem(key);
//           // Add basic validation
//           if (!item) return Promise.resolve(null);
//           try {
//             // Validate JSON structure
//             JSON.parse(item);
//             return Promise.resolve(item);
//           } catch {
//             // If invalid JSON, remove it
//             localStorage.removeItem(key);
//             return Promise.resolve(null);
//           }
//         } catch {
//           return Promise.resolve(null);
//         }
//       },
//       setItem: (key, value) => {
//         try {
//           if (typeof window === 'undefined') {
//             return Promise.resolve();
//           }
//           // Validate value before storing
//           if (typeof value === 'string') {
//             localStorage.setItem(key, value);
//           }
//           return Promise.resolve();
//         } catch {
//           return Promise.resolve();
//         }
//       },
//       removeItem: (key) => {
//         try {
//           if (typeof window === 'undefined') {
//             return Promise.resolve();
//           }
//           localStorage.removeItem(key);
//           return Promise.resolve();
//         } catch {
//           return Promise.resolve();
//         }
//       },
//     },
//     // Add autoRefreshToken options
//     autoRefreshToken: {
//       // Refresh 5 minutes before expiry
//       threshold: 5 * 60, // in seconds
//       // Maximum retries if refresh fails
//       maxRetries: 3,
//     },
//   },
//   // Add global options to help with rate limiting
//   global: {
//     headers: { 'x-application-name': 'brighton-rock' },
//   },
//   // Add retry configuration
//   realtime: {
//     params: {
//       eventsPerSecond: 2,
//     },
//   },
// });