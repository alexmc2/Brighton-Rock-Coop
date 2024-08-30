// src/components/Modal.tsx

'use client';
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  id,
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-card text-foreground border-none shadow-lg max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl w-full max-h-[95vh] overflow-y-auto mx-auto px-4 sm:px-6 md:px-8" // Set max width and horizontal centering
      >
        <DialogTitle className="text-2xl font-bold mb-4 text-center sm:text-left">
          {title}
        </DialogTitle>{' '}
        {/* Center title on mobile */}
        <div className="mb-6">{children}</div>
        <Button
          onClick={onClose}
          className="bg-primary dark:bg-secondary hover:bg-primary/90 text-primary-foreground dark:text-foreground font-bold py-2 px-4 rounded"
        >
          CLOSE
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
