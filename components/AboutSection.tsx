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
            className="bg-primary dark:bg-secondary hover:bg-primary/90 text-primary-foreground dark:text-foreground font-bold py-2 px-4 rounded text-xl"
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
        <AboutUsModalContent />
      </Modal>
    </section>
  );
};

const AboutUsModalContent: React.FC = () => (
  <ul className="list-disc pl-5 text-xl text-foreground space-y-4  ">
    <li>
      <strong>We are a "self-help" housing co-operative:</strong> We utilize
      properties that are unsuitable for letting for an agreed period of time,
      which can sometimes extend for many years. For more information, please
      visit self-help-housing.org.
    </li>
    <li>
      <strong>
        Brighton Rock is guided by the general co-operative principles:
      </strong>
      It offers members a safe environment and secure tenancy. Brighton Rock has
      12 housed members, all of whom have equal rights - there is no hierarchy.
      Everyone is expected to attend regular monthly meetings and be actively
      involved in the running, decision-making, and administration of the co-op.
    </li>
    <li>
      <strong>Everyone has their own room:</strong> Personal rooms are respected
      as strictly personal space. All other areas in the co-op are shared.
    </li>
    <li>
      <strong>Brighton Rock aims to be environmentally aware:</strong> We strive
      to minimize our environmental impact through resource conservation and
      reducing waste.
    </li>
    <li>
      <strong>The rent is set at an affordable level:</strong> This is paid in
      advance (from wages or benefits). Brighton Rock has a strict arrears
      policy which is rigorously applied.
    </li>
    <li>
      <strong>All members contribute to the running of the co-op:</strong> by
      taking on a job, such as maintenance coordinator, rent officer, treasurer,
      secretary, garden coordinator, shopkeeper, and development officer.
      Members report on their role at the monthly meeting and the AGM.
    </li>
    <li>
      <strong>
        Members are expected to attend monthly general meetings and occasional
        emergency meetings:
      </strong>{' '}
      These take place on weekday evenings at 7.30pm and generally last between
      1 and 2 hours.
    </li>
    <li>
      <strong>We have a co-op handbook with policies and guidelines:</strong>
      for the safe and smooth running of the co-op. The policies and guidelines
      are written and reviewed by co-op members.
    </li>
    <li>
      <strong>Members are expected to show interest and participate:</strong>
      This might involve occasional policy and project development groups, in
      addition to garden work and general maintenance workdays.
    </li>
    <li>
      <strong>The rooms are single occupancy:</strong> and can't be allocated to
      couples or those with children who live with them. Guests are welcome,
      however, if agreed by other members of the house. We also have a no-pets
      policy.
    </li>
    <li>
      <strong>To balance all the hard work:</strong> we also have occasional
      social gatherings in the houses or garden.
    </li>
  </ul>
);

export default AboutSection;
