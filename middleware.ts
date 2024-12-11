import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Get the pathname of the request (e.g. /, /members, /members/dashboard)
  const path = request.nextUrl.pathname;

  // Allow public access to main site routes
  if (!path.startsWith('/members')) {
    return res;
  }

  // Allow access to login-related routes even when not logged in
  if (
    path === '/members/login' ||
    path === '/members/signup' ||
    path === '/members/reset-password'
  ) {
    // If user is logged in, redirect away from auth pages
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
  matcher: [
    // Match all routes
    '/(.*)',
  ],
};
