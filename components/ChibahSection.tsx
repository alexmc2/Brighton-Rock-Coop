'use client';

import React from 'react';
import FadeWrapper from '@/components/FadeWrapper';

const ChibahSection: React.FC = () => {
  return (
    <section className="pb-10 bg-background">
      <FadeWrapper useCustomAnimation delay={200}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-sm p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">
              Co-operative Housing in Brighton and Hove (CHIBAH)
            </h2>
            <p className="mb-5 text-md md:text-lg text-foreground">
              Brighton Rock is a member of{' '}
              <a
                href="http://chibah.org/"
                className="dark:text-secondary text-primary hover:underline font-bold"
              >
                CHIBAH
              </a>{' '}
              - a network of local co-operatives that promotes co-operative
              housing in Brighton and Hove.
            </p>
            <p className="mb-5 text-md md:text-lg text-foreground">
              CHIBAH&apos;s purpose is to house both individuals and families
              who are in need of low-rent, co-operatively managed housing.
              CHIBAH also undertakes a programme of permanent stock development.
            </p>
            <p className="mb-5 text-md md:text-lg text-foreground">
              CHIBAH currently has seven member housing co-operatives. CHIBAH
              works with representative bodies on the local and national scene,
              principally the Confederation of Co-operative Housing (CCH) and
              the Community Voluntary Sector Forum (CVSF).
            </p>
          </div>
        </div>
      </FadeWrapper>
    </section>
  );
};

export default ChibahSection;
