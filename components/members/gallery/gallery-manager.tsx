// components/members/gallery/gallery-manager.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

import ImageUploader from '@/components/members/gallery/image-uploader';
import ImageGrid from './image-grid';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

export default function GalleryManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ImageUploader 
          onSuccess={() => {
            handleRefresh();
            toast({
              title: "Success",
              description: "Image uploaded successfully",
            });
          }}
          onError={(error) => {
            toast({
              title: "Error",
              description: error,
              variant: "destructive",
            });
          }}
        />
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <ReloadIcon className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      <ImageGrid 
        refreshTrigger={refreshTrigger}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}