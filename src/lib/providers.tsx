'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Web3Provider } from './web3/providers';
import { DynamicThemeLoader } from '@/components/DynamicThemeLoader';
import { TourProvider } from '@/contexts/TourContext';
import { TourOverlay } from '@/components/ui/TourOverlay';
import { AuthProvider } from '@/contexts/AuthContext';
import { SessionTimeoutManager } from '@/components/auth/SessionTimeoutManager';

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
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <DynamicThemeLoader>
              <TourProvider>
                {children}
                <TourOverlay />
                <SessionTimeoutManager />
              </TourProvider>
            </DynamicThemeLoader>
          </ThemeProvider>
        </AuthProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
}