// src/components/Modal.tsx

'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
      <DialogContent className="bg-card text-foreground border-none shadow-lg">
        <DialogTitle className="text-2xl font-bold mb-4">{title}</DialogTitle>
        <div className="mb-6">{children}</div>
        <Button
          onClick={onClose}
          className="bbg-primary dark:bg-background  hover:bg-primary/90 text-primary-foreground dark:text-foreground font-bold py-2 px-4 rounded"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
