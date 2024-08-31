// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCloudinaryImages() {
  try {
    const result = await cloudinary.search

      .expression('folder:coop-images/*')
      .sort_by('public_id', 'desc')
      .max_results(500)
      .execute();

    return result.resources.map((resource: any) => ({
      url: resource.secure_url,
      alt: resource.public_id.split('/').pop(),
      width: resource.width,
      height: resource.height,
    }));
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}
