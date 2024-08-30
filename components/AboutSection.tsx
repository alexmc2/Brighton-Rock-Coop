// /components/AboutSection.tsx
'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { Button } from '@/components/ui/button';

const AboutSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="pt-12 pb-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold mb-4 text-foreground">About Us</h2>
          <p className="mb-5 text-xl text-foreground">
            Brighton Rock Housing Co-operative was first established in 1987.
            The co-op consists of three terraced houses (with four bedrooms in
            each house, a large living room, kitchen, bathroom, and bike shed).
            The co-op also has a large garden that is shared between the three
            houses.
          </p>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground dark:text-foreground font-bold py-2 px-4 rounded text-xl"
            onClick={() => setIsModalOpen(true)}
          >
            More About Us
          </Button>
        </div>
      </div>

      <Modal
        id="aboutUsModal"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Brighton Rock Housing Co-operative"
      >
        {/* Modal content */}
        <p>
          This is where you can put more detailed information about Brighton
          Rock Housing Co-operative.
        </p>
      </Modal>
    </section>
  );
};

export default AboutSection;
