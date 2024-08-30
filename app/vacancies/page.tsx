// src/app/vacancies/page.tsx

import React from 'react';
import Hero from '@/components/Hero';

export default function VacanciesPage() {
  return (
    <div>
      <Hero title="Vacancies" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-4">Current Vacancies</h2>
        <p>Information about current vacancies will be displayed here.</p>
        {/* Add vacancy listings or application information */}
      </div>
    </div>
  );
}
