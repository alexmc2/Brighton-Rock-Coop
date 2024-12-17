// // components/Carousel.tsx

// 'use client';
// import React from 'react';
// import Image from 'next/image';
// import {
//   Carousel as ShadcnCarousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel';
// import { cn } from '@/lib/utils';
// import Autoplay from 'embla-carousel-autoplay';

// interface CarouselImage {
//   url: string;
//   alt?: string;
//   width: number;
//   height: number;
// }

// interface CarouselProps {
//   images: CarouselImage[];
// }

// const Carousel: React.FC<CarouselProps> = ({ images }) => {
//   const [api, setApi] = React.useState<any>(null);
//   const autoplay = React.useRef(
//     Autoplay({
//       delay: 7000,
//       stopOnInteraction: false,
//       stopOnMouseEnter: false,
//       rootNode: (emblaRoot) => emblaRoot.parentElement,
//     })
//   );

//   const handleNavigation = React.useCallback(
//     (direction: 'prev' | 'next') => {
//       autoplay.current.stop();
//       setTimeout(() => {
//         if (direction === 'prev') {
//           api?.scrollPrev();
//         } else {
//           api?.scrollNext();
//         }
//       }, 50);
//     },
//     [api]
//   );

//   return (
//     <div className="relative w-full">
//       <ShadcnCarousel
//         opts={{
//           align: 'center',
//           loop: true,
//           skipSnaps: false,
//           duration: 40,
//           dragFree: false,
//           inViewThreshold: 1,
//           watchDrag: false,
//         }}
//         plugins={[autoplay.current]}
//         setApi={setApi}
//         className="w-full"
//       >
//         <CarouselContent>
//           {images.map((image, index) => (
//             <CarouselItem key={index}>
//               <div className="relative w-full h-[50vh] min-h-[300px] md:h-[60vh]">
//                 <Image
//                   src={image.url}
//                   alt={image.alt || ''}
//                   fill
//                   className="object-contain"
//                   sizes="(max-width: 768px) 100vw, 75vw"
//                   priority={index === 0}
//                 />
//               </div>
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <CarouselPrevious
//           className="left-0"
//           onClick={() => handleNavigation('prev')}
//         />
//         <CarouselNext
//           className="right-0"
//           onClick={() => handleNavigation('next')}
//         />
//       </ShadcnCarousel>
//     </div>
//   );
// };

// export default Carousel;

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
import Autoplay from 'embla-carousel-autoplay';

interface CarouselImage {
  url: string;
  alt?: string;
  width: number;
  height: number;
  created_at: string;
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
      autoplay.current.stop();
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

  const sortedImages = React.useMemo(() => {
    return [...images].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [images]);

  return (
    <div className="relative w-full">
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
          {sortedImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[50vh] min-h-[300px] md:h-[60vh]">
                <Image
                  src={image.url}
                  alt={image.alt || ''}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 75vw"
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
    </div>
  );
};

export default Carousel;
