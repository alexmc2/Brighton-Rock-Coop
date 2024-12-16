// components/GallerySection.tsx

import React from 'react';
import Carousel from './Carousel';
import FadeWrapper from './FadeWrapper';

async function getImages() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/images`, {
      next: { revalidate: 0 },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch images:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    
    return data.map((image: any) => ({
      url: image.secure_url,
      alt: image.public_id.split('/').pop(),
      width: image.width,
      height: image.height,
    }));
  } catch (error) {
    console.error('Error in getImages:', error);
    return []; // Return empty array instead of throwing
  }
}

export default async function GallerySection() {
  const images = await getImages();

  if (!images.length) {
    return null; // Don't render section if no images
  }

  return (
    <section className="pb-10 bg-background">
      <FadeWrapper useCustomAnimation delay={200}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-sm p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-7 text-foreground text-center">
              Gallery
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="relative w-full">
                <Carousel images={images} />
              </div>
            </div>
          </div>
        </div>
      </FadeWrapper>
    </section>
  );
}
