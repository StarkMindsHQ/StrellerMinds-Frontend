'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Web3Provider } from './web3/providers';

import { TourProvider } from '@/contexts/TourContext';
import { TourOverlay } from '@/components/ui/TourOverlay';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <Web3Provider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TourProvider>
            {children}
            <TourOverlay />
          </TourProvider>
        </ThemeProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
}
