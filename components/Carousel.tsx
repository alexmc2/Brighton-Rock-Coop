'use client';
import React, { useState } from 'react';
import { Carousel as ReactCarousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FadeWrapper from './FadeWrapper';
import { Fade } from 'react-awesome-reveal';

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
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <ReactCarousel
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        autoPlay={true}
        interval={4000}
        infiniteLoop={true}
        onChange={handleChange}
        className="max-w-full"
        renderArrowPrev={(clickHandler, hasPrev) => (
          <button
            onClick={clickHandler}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full z-10 transition"
            style={{ left: '10px' }}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        renderArrowNext={(clickHandler, hasNext) => (
          <button
            onClick={clickHandler}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full z-10 transition"
            style={{ right: '10px' }}
          >
            <ChevronRight size={24} />
          </button>
        )}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-full flex items-center justify-center carousel-slide"
            style={{
              height: '0',
              paddingBottom: '56.25%', // 16:9 aspect ratio
            }}
          >
            <FadeWrapper duration={700} triggerOnce={false}>
              <Image
                src={image.url}
                alt={image.alt || ''}
                fill
                style={{
                  objectFit: 'contain',
                }}
                sizes="(max-width: 640px) 100vw, 75vw"
                quality={100}
              />
            </FadeWrapper>
          </div>
        ))}
      </ReactCarousel>
      <style jsx global>{`
        @media (max-width: 640px) {
          .carousel-slide {
            padding-bottom: 75% !important; // 4:3 aspect ratio for mobile
          }
          .carousel .slide img {
            object-fit: contain !important;
            max-height: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Carousel;
