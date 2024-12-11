// src/app/vacancies/page.tsx
import React from 'react';
import Hero from '@/components/Hero';
import MeetingsPage from '@/components/Meetings';
import Header from '@/components/Header';

export default function Meetings() {
  return (
    <div>
      <Header />
      <MeetingsPage />
    </div>
  );
}
