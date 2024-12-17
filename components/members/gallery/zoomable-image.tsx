// components/members/gallery/zoomable-image.tsx
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/members/ui/dialog';
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

interface ZoomableImageProps extends Omit<DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'width' | 'height'> {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function ZoomableImage({
  src,
  alt,
  className,
  priority = false,
  ...props
}: ZoomableImageProps) {
  if (!src) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={src}
          alt={alt || ''}
          sizes="100vw"
          className={className}
          style={{
            width: '100%',
            height: 'auto',
          }}
          width={500}
          height={300}
          priority={priority}
          {...props}
        />
      </DialogTrigger>
      <DialogContent 
        className="max-w-7xl border-0 bg-transparent p-0" 
        onPointerDownOutside={(e) => {
          e.preventDefault();
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        }}
      >
        <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-md">
          <Image
            src={src}
            fill
            alt={alt || ''}
            className="h-full w-full object-contain"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
