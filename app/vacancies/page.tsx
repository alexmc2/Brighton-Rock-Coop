// src/app/vacancies/page.tsx
import React from 'react';
import Hero from '@/components/Hero';
import VacanciesSection from '@/components/VacanciesSection';
import Header from '@/components/Header';

export default function VacanciesPage() {
  return (
    <div>
      <Header />
      <VacanciesSection />
    </div>
  );
}
