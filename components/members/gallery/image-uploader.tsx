'use client';

import { useState } from 'react';
import { Button } from '@/components/members/ui/button';
import { Input } from '@/components/members/ui/input';
import { UploadIcon } from '@radix-ui/react-icons';

interface ImageUploaderProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function ImageUploader({
  onSuccess,
  onError,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/members/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      onSuccess();
    } catch (error) {
      onError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
        className="max-w-xs"
      />
      {isUploading && <UploadIcon className="animate-spin" />}
    </div>
  );
}
