import React from 'react';
import type { Metadata } from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import CookieBanner from '../components/CookieBanner';
import Analytics from '../components/Analytics';
import { Toaster } from 'sonner';
import { Providers } from '../lib/providers';
import EnvironmentValidator from '../components/EnvironmentValidator';
import { initializeServerEnvironment } from '../lib/env-server';
import StyledComponentsRegistry from '../lib/registry';
import MainLayoutWrapper from '../components/MainLayoutWrapper';

// Initialize fonts (ONLY ONCE)
const inter = Inter({ subsets: ['latin'], display: 'swap' });
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], display: 'swap' });

// Initialize server environment validation (ONLY ONCE)
initializeServerEnvironment();

// Determine base URL dynamically
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return 'https://strellerminds.com';
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: 'StrellerMinds | Leading Blockchain & DeFi Education',
    template: '%s | StrellerMinds',
  },

  description:
    'Empowering minds through cutting-edge blockchain education. Master DeFi, Smart Contracts, and Web3 development with expert-led, interactive courses.',

  keywords: [
    'blockchain',
    'education',
    'DeFi',
    'smart contracts',
    'cryptocurrency',
    'web3',
    'learning platform',
    'blockchain courses',
    'crypto education',
    'decentralized finance',
  ],

  authors: [{ name: 'StrellerMinds Team' }],
  creator: 'StrellerMinds',
  publisher: 'StrellerMinds',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'StrellerMinds',
    title: 'StrellerMinds | Leading Blockchain & DeFi Education',
    description:
      'Master DeFi, Smart Contracts, and Web3 development with expert-led blockchain courses.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'StrellerMinds - Blockchain Education Platform',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@strellerminds',
    creator: '@strellerminds',
    images: ['/opengraph-image.png'],
  },

  robots: {
    index: true,
    follow: true,
  },

  applicationName: 'StrellerMinds',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${sourceCodePro.className}`}>
        <StyledComponentsRegistry>
          <Providers>
            <EnvironmentValidator />

            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-16 focus:bg-[#5c0f49] focus:text-white focus:p-4 focus:outline-none focus:z-50"
            >
              Skip to content
            </a>

            <Navbar />
            <MainLayoutWrapper>{children}</MainLayoutWrapper>
            <Footer />

            <Toaster position="top-right" />
            <Analytics />
            <CookieBanner />
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}