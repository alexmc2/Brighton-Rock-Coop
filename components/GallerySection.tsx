// components/GallerySection.tsx

import React from 'react';
import Carousel from './Carousel';
import FadeWrapper from './FadeWrapper';

async function getImages() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/images`, {
    next: { revalidate: 0 }, // This ensures fresh data on each request
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }
  
  return response.json();
}

export default async function GallerySection() {
  const images = await getImages();

  return (
    <section className="pb-10 bg-background">
      <FadeWrapper useCustomAnimation delay={200}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-sm p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-7 text-foreground text-center ">
              Gallery
            </h2>

            <div className="max-w-4xl mx-auto">
              {images.length > 0 && (
                <div className="relative w-full">
                  <Carousel images={images} />
                </div>
              )}
            </div>
          </div>
        </div>
      </FadeWrapper>
    </section>
  );
}
