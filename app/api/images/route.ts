// app/api/images/route.ts

import { getCloudinaryImages } from '@/utils/cloudinary';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const images = await getCloudinaryImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json([], { status: 200 });
  }
} 