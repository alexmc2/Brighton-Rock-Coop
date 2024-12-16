// src/app/page.tsx
import React from 'react';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import GallerySection from '@/components/GallerySection';
import CooperativeSection from '@/components/CooperativeSection';
import ChibahSection from '@/components/ChibahSection';
import Header from '@/components/Header';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <Hero
        title="Welcome to Brighton Rock"
        description="A small housing co-op established in 1987, located in West Hove"
        showLogo={true}
      />

      <AboutSection />
      <GallerySection />
      <CooperativeSection />
      <ChibahSection />
    </div>
  );
};

export default Home;
