import { Metadata } from 'next';
import GalleryManager from '@/components/members/gallery/gallery-manager';

export const metadata: Metadata = {
  title: 'Gallery Management - Co-op',
  description: 'Manage gallery images for the co-op website',
};

export default function GalleryPage() {
  return (
    <div className="relative  h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Gallery Management
          </h1>
        </div>
        <GalleryManager />
      </div>
    </div>
  );
}
