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

// Initialize server environment validation
initializeServerEnvironment();



// Determine the base URL based on environment
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

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'StrellerMinds',
    title: 'StrellerMinds | Leading Blockchain & DeFi Education',
    description:
      'Master DeFi, Smart Contracts, and Web3 development with expert-led, interactive blockchain courses.',
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
    title: 'StrellerMinds | Leading Blockchain & DeFi Education',
    description:
      'Master DeFi, Smart Contracts, and Web3 development with expert-led, interactive blockchain courses.',
    creator: '@strellerminds',
    images: ['/opengraph-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'your-google-verification-code', // TODO: Replace with actual code from Google Search Console
  },

  // Additional metadata for better SEO
  category: 'education',
  classification: 'Education',

  // App-specific metadata
  applicationName: 'StrellerMinds',
  referrer: 'origin-when-cross-origin',

  // Apple-specific
  appleWebApp: {
    capable: true,
    title: 'StrellerMinds',
    statusBarStyle: 'black-translucent',
  },

  // Other metadata
  other: {
    'msapplication-TileColor': '#0a0a0a',
  },
};

// Initialize server environment validation
initializeServerEnvironment();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Keep both: EnvironmentValidator component + initialized server env */}
        <EnvironmentValidator />

        <Providers>
          <StyledComponentsRegistry>
            {/* Accessibility Skip Link */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-16 focus:bg-[#5c0f49] focus:text-white focus:p-4 focus:outline-none focus:z-100"
            >
              Skip to content
            </a>

            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
            <Toaster position="top-right" />

            {/* Privacy-compliant Analytics */}
            <Analytics />

            {/* Cookie Consent Banner */}
            <CookieBanner />
          </StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  );
}
