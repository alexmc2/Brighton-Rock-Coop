import { NextResponse } from 'next/server';
import { getCloudinaryImages, deleteCloudinaryImage } from '@/utils/cloudinary';

export async function GET() {
  try {
    const images = await getCloudinaryImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'No public_id provided' },
        { status: 400 }
      );
    }

    const success = await deleteCloudinaryImage(publicId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
