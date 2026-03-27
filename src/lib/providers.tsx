'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Web3Provider } from './web3/providers';
import { AuthProvider } from '@/contexts/AuthContext';
import CrossTabSyncComponent from '@/components/CrossTabSyncComponent';
import SmartIdleDetector from '@/components/SmartIdleDetector';

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
      <AuthProvider>
        <CrossTabSyncComponent>
          <Web3Provider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SmartIdleDetector
                timeoutMs={15 * 60 * 1000}
                warningDurationMs={60 * 1000}
                triggerLogoutOnIdle
                requireAuthenticatedSession
              />
              {children}
            </ThemeProvider>
          </Web3Provider>
        </CrossTabSyncComponent>
      </AuthProvider>
    </QueryClientProvider>
  );
}
