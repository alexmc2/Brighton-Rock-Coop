// components/GallerySection.tsx
import React from 'react';
import Carousel from './Carousel';
import { getCloudinaryImages } from '../utils/cloudinary';

export default async function GallerySection() {
  const images = await getCloudinaryImages();

  return (
    <section className="pb-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold mb-9 text-foreground">Gallery</h2>
          <div className="max-w-4xl mx-auto">
            {images.length > 0 && (
              <div className="relative w-full">
                <Carousel images={images} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
