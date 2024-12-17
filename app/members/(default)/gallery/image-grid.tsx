// components/members/gallery/image-grid.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2Icon, DownloadIcon } from 'lucide-react';
import { Button } from '@/components/members/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/members/ui/alert-dialog';
import { ImageGridSkeleton } from './image-grid-skeleton';

interface ImageGridProps {
  refreshTrigger: number;
  setIsLoading: (loading: boolean) => void;
}

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  created_at: string;
  width?: number;
  height?: number;
}

export default function ImageGrid({
  refreshTrigger,
  setIsLoading,
}: ImageGridProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [imageToDownload, setImageToDownload] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    try {
      setIsLoadingImages(true);
      setIsLoading(true);
      
      const response = await fetch('/members/api/images');
      const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sortedImages = data.sort(
        (a: CloudinaryImage, b: CloudinaryImage) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setImages(sortedImages);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch images',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingImages(false);
      setIsLoading(false);
    }
  }, [setIsLoading, toast]);

  useEffect(() => {
    setIsLoadingImages(true);
    fetchImages();
  }, [refreshTrigger, fetchImages]);

  const handleDeleteClick = (publicId: string) => {
    setImageToDelete(publicId);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;

    try {
      const response = await fetch('/members/api/images', {
        method: 'DELETE',
        body: JSON.stringify({ publicId: imageToDelete }),
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });
      fetchImages();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setImageToDelete(null);
    }
  };

  const handleDownloadClick = (imageUrl: string, fileName: string) => {
    setImageToDownload({ url: imageUrl, name: fileName });
    setShowDownloadDialog(true);
  };

  const handleDownload = async () => {
    if (!imageToDownload) return;

    try {
      const response = await fetch(imageToDownload.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageToDownload.name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Image download started',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download image',
        variant: 'destructive',
      });
    } finally {
      setShowDownloadDialog(false);
      setImageToDownload(null);
    }
  };

  if (isLoadingImages) {
    return <ImageGridSkeleton />;
  }

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.public_id}
            className="relative group mb-4 break-inside-avoid"
          >
            <Image
              src={image.secure_url}
              alt={image.public_id}
              width={800}
              height={600}
              className="rounded-lg cursor-pointer w-full h-auto"
              priority={index < 6}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="default"
                size="icon"
                className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                onClick={() =>
                  handleDownloadClick(image.secure_url, image.public_id)
                }
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                onClick={() => handleDeleteClick(image.public_id)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this image will permanently remove it from the Co-op
              website gallery. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="transition-all duration-600 ease-in-out bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 dark:bg-red-600"
            >
              Delete Image
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download Image</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to download this image?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDownload}>
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
