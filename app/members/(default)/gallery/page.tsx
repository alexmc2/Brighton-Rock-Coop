import { Metadata } from 'next';
import GalleryManager from '@/app/members/(default)/gallery/gallery-manager';

export const metadata: Metadata = {
  title: 'Gallery Management - Co-op',
  description: 'Manage gallery images for the co-op website',
};

export default function GalleryPage() {
  return (
    <div className="relative  h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Co-op Image Gallery 📷
          </h1>
        </div>
        <GalleryManager />
      </div>
    </div>
  );
}
