// components/Carousel.tsx

'use client';
import React from 'react';
import Image from 'next/image';
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';

interface CarouselImage {
  url: string;
  alt?: string;
  width: number;
  height: number;
}

interface CarouselProps {
  images: CarouselImage[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [api, setApi] = React.useState<any>(null);
  const autoplay = React.useRef(
    Autoplay({
      delay: 7000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    })
  );

  const handleNavigation = React.useCallback(
    (direction: 'prev' | 'next') => {
      // Stop autoplay smoothly
      autoplay.current.stop();

      // Wait for any current transition to complete
      setTimeout(() => {
        if (direction === 'prev') {
          api?.scrollPrev();
        } else {
          api?.scrollNext();
        }
      }, 50);
    },
    [api]
  );

  return (
    <div className="relative max-w-4xl mx-auto px-12">
      <ShadcnCarousel
        opts={{
          align: 'center',
          loop: true,
          skipSnaps: false,
          duration: 40,
          dragFree: false,
          inViewThreshold: 1,
          watchDrag: false,
        }}
        plugins={[autoplay.current]}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div
                className="relative w-full flex items-center justify-center carousel-slide "
                style={{
                  height: '0',
                  paddingBottom: '56.25%', // 16:9 aspect ratio
                }}
              >
                <Image
                  src={image.url}
                  alt={image.alt || ''}
                  fill
                  style={{
                    objectFit: 'contain',
                  }}
                  sizes="(max-width: 640px) 100vw, 75vw"
                  quality={100}
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="left-0"
          onClick={() => handleNavigation('prev')}
        />
        <CarouselNext
          className="right-0"
          onClick={() => handleNavigation('next')}
        />
      </ShadcnCarousel>
      <style jsx global>{`
        @media (max-width: 640px) {
          .carousel-slide {
            padding-bottom: 75% !important; // 4:3 aspect ratio for mobile
          }
        }
      `}</style>
    </div>
  );
};

export default Carousel;
