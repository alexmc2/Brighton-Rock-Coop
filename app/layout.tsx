// src/app/layout.tsx
import React from 'react';
import { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';
import { Roboto } from 'next/font/google';

// Initialize the Roboto font
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Brighton Rock Housing Co-operative',
  description:
    'Brighton Rock is a small housing co-operative in West Hove that provides affordable housing to its members.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={roboto.className}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
    
        </ThemeProvider>
      </body>
    </html>
  );
}
