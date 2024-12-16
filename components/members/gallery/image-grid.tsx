'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2Icon } from 'lucide-react';
import { Button } from '@/components/members/ui/button';
import { useToast } from '@/hooks/use-toast';
import ZoomableImage from '@/components/members/gallery/zoomable-image';

interface ImageGridProps {
  refreshTrigger: number;
  setIsLoading: (loading: boolean) => void;
}

export default function ImageGrid({ refreshTrigger, setIsLoading }: ImageGridProps) {
  const [images, setImages] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/members/api/images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, toast]);

  useEffect(() => {
    fetchImages();
  }, [refreshTrigger, fetchImages]);

  const handleDelete = async (publicId: string) => {
    try {
      const response = await fetch('/members/api/images', {
        method: 'DELETE',
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      fetchImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.public_id} className="relative group">
          <ZoomableImage
            src={image.secure_url}
            alt={image.public_id}
            className="rounded-lg cursor-pointer"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleDelete(image.public_id)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
} 