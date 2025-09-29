import type { Metadata } from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Toaster } from 'sonner';
import { Providers } from '@/lib/providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const sourceCodePro = Source_Code_Pro({
  variable: '--font-source-code-pro',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'StrellerMinds - Blockchain Education Platform',
    template: '%s | StrellerMinds',
  },
  description:
    'Empowering minds through cutting-edge blockchain education. Learn DeFi, Smart Contracts, and blockchain development with expert-led courses.',
  keywords: [
    'blockchain',
    'education',
    'DeFi',
    'smart contracts',
    'cryptocurrency',
    'web3',
    'learning platform',
  ],
  authors: [{ name: 'StrellerMinds Team' }],
  creator: 'StrellerMinds',
  publisher: 'StrellerMinds',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://strellerminds.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://strellerminds.com',
    siteName: 'StrellerMinds',
    title: 'StrellerMinds - Blockchain Education Platform',
    description:
      'Empowering minds through cutting-edge blockchain education. Learn DeFi, Smart Contracts, and blockchain development with expert-led courses.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StrellerMinds - Blockchain Education Platform',
    description:
      'Empowering minds through cutting-edge blockchain education. Learn DeFi, Smart Contracts, and blockchain development with expert-led courses.',
    creator: '@strellerminds',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

import StyledComponentsRegistry from '@/lib/registry';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <StyledComponentsRegistry>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-16 focus:bg-[#5c0f49] focus:text-white focus:p-4 focus:outline-none focus:z-100"
            >
              Skip to content
            </a>
            <Navbar />
            {children}
            <Footer />
            <Toaster position="top-right" />
          </StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  );
}
