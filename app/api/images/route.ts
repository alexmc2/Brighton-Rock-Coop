// app/api/images/route.ts
import { getCloudinaryImages } from '@/utils/cloudinary';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// At the top of the file, add this interface
interface CloudinaryImage {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  created_at: string;
}

export async function GET() {
  try {
    const images = await getCloudinaryImages();
    // Add type annotation here
    const carouselImages = images.map((img: CloudinaryImage) => ({
      url: img.secure_url,
      alt: img.public_id,
      width: img.width,
      height: img.height,
      created_at: img.created_at,
    }));

    return NextResponse.json(carouselImages);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json([], { status: 200 });
  }
}
