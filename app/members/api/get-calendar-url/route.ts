// app/api/get-calendar-url/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    url: `https://www.brighton-rock.org/members/api/calendar?key=${process.env.SECRET_CALENDAR_KEY}`,
  });
}
