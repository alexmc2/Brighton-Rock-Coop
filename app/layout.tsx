import React from 'react';
import { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import '../styles/globals.css';
import { Roboto } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { type ReactNode } from 'react';

// Initialize the Roboto font
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Brighton Rock Housing Co-operative',
  description:
    'Brighton Rock is a small housing co-operative in West Hove that provides affordable housing to its members. Please visit our website for more information and current vacancies.',
  openGraph: {
    title: 'Brighton Rock Housing Co-operative',
    description:
      'Brighton Rock is a small housing co-operative in West Hove that provides affordable housing to its members. Please visit our website for more information and current vacancies.',
    url: 'https://www.brighton-rock.org/',
    siteName: 'Brighton Rock Housing Co-operative',
    images: [
      {
        url: 'https://d33wubrfki0l68.cloudfront.net/45dc7e2de3f6be14d03156f17331b5b091c918ab/cfeab/images/co-op50.webp',
        width: 800,
        height: 600,
        alt: 'Brighton Rock Housing Co-operative',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brighton Rock Housing Co-operative',
    description:
      'Brighton Rock is a small housing co-operative in West Hove that provides affordable housing to its members. Please visit our website for more information and current vacancies.',
    images: [
      'https://d33wubrfki0l68.cloudfront.net/45dc7e2de3f6be14d03156f17331b5b091c918ab/cfeab/images/co-op50.webp',
    ],
  },
  metadataBase: new URL('https://www.brighton-rock.org'),
  icons: {
    icon: '/images/favicon.ico',
  },

  other: {
    'og:title': 'Brighton Rock Housing Co-operative',
    'og:description':
      'Brighton Rock is a small housing co-operative in West Hove that provides affordable housing to its members. Please visit our website for more information and current vacancies.',
    'og:image':
      'https://d33wubrfki0l68.cloudfront.net/45dc7e2de3f6be14d03156f17331b5b091c918ab/cfeab/images/co-op50.webp',
    'og:url': 'https://www.brighton-rock.org/',
  },
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
          <NuqsAdapter>
            {children}
            <Analytics />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
