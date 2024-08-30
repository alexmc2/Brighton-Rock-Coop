// src/app/layout.tsx
import React from 'react';
import { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';
import { Roboto } from 'next/font/google';
import ThemeEditor from 'shadcn-theme-editor';

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
  openGraph: {
    title: 'Brighton Rock Housing Co-operative',
    description:
      'Brighton Rock is a small housing co-operative in West Hove that provides affordable housing to its members. Please visit our website for more information and current vacancies.',
    url: 'https://brighton-rock.org/',
    images: [
      {
        url: 'https://d33wubrfki0l68.cloudfront.net/45dc7e2de3f6be14d03156f17331b5b091c918ab/cfeab/images/co-op50.webp',
        width: 800,
        height: 600,
        alt: 'Brighton Rock Housing Co-operative',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={roboto.className}>
      <head>
        {/* Meta tags for Open Graph */}
        <meta
          property="og:title"
          content="Brighton Rock Housing Co-operative"
        />
        <meta
          property="og:description"
          content="Brighton Rock is a small housing co-operative in West Hove that provides affordable housing to its members. Please visit our website for more information and current vacancies."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/drbz4rq7y/image/upload/v1724979773/coop-images/co-op50_v0fqdb.webp"
        />
        <meta property="og:url" content="https://brighton-rock.org/" />
        <meta property="og:type" content="website" />

        {/* Additional metadata tags */}
        <link rel="icon" href="/images/favicon.png" />
        <title>Brighton Rock Housing Co-operative</title>
      </head>
      <body>
        {/* <ThemeEditor /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
