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
            className="bg-primary dark:bg-secondary  hover:bg-primary/90 text-primary-foreground dark:text-foreground font-bold py-2 px-4 rounded text-xl"
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
        <CooperativeModalContent />
      </Modal>
    </section>
  );
};

const CooperativeModalContent: React.FC = () => (
  <ul className="list-disc pl-5 text-xl text-foreground space-y-4">
    <li>
      <strong>Voluntary and Open Membership:</strong> Cooperatives are voluntary
      organisations, open to all persons able to use their services and willing
      to accept the responsibilities of membership, without gender, social,
      racial, political or religious discrimination.
    </li>
    <li>
      <strong>Democratic Member Control:</strong> Cooperatives are democratic
      organisations controlled by their members, who actively participate in
      setting their policies and making decisions.
    </li>
    <li>
      <strong>Member Economic Participation:</strong> Members contribute
      equitably to, and democratically control, the capital of their
      cooperative.
    </li>
    <li>
      <strong>Autonomy and Independence:</strong> Cooperatives are autonomous,
      self-help organisations controlled by their members.
    </li>
    <li>
      <strong>Education, Training, and Information:</strong> Cooperatives
      provide education and training for their members, elected representatives,
      managers, and employees.
    </li>
    <li>
      <strong>Cooperation among Cooperatives:</strong> Cooperatives serve their
      members most effectively and strengthen the cooperative movement by
      working together through local, national, regional and international
      structures.
    </li>
    <li>
      <strong>Concern for Community:</strong> Cooperatives work for the
      sustainable development of their communities through policies approved by
      their members.
    </li>
  </ul>
);

export default CooperativeSection;
