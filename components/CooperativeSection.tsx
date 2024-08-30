// components/CooperativeSection.tsx
'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { Button } from '@/components/ui/button';

const CooperativeSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="pb-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Co-operative Identity, Values, and Principles
          </h2>
          <p className="mb-5 text-xl text-foreground">
            Brighton Rock subscribes to the values and principles of the
            international co-operative movement. The Statement on the
            Co-operative Identity states that a co-operative is an "autonomous
            association of persons united voluntarily to meet their common
            economic, social and cultural needs and aspirations through a
            jointly owned and democratically-controlled enterprise."
          </p>
          <Button
            className="bg-primary dark:bg-background  hover:bg-primary/90 text-primary-foreground dark:text-foreground font-bold py-2 px-4 rounded text-xl"
            onClick={() => setIsModalOpen(true)}
          >
            Find Out More
          </Button>
        </div>
      </div>

      <Modal
        id="cooperativeModal"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cooperative Identity, Values, and Principles"
      >
        {/* Add modal content here */}
        <p>Detailed information about cooperative principles goes here.</p>
      </Modal>
    </section>
  );
};

export default CooperativeSection;
