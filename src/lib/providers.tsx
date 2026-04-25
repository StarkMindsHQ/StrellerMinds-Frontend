'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Web3Provider } from './web3/providers';
import { DynamicThemeLoader } from '@/components/DynamicThemeLoader';
import { AuthProvider } from '@/contexts/AuthContext';
import CrossTabSyncComponent from '@/components/CrossTabSyncComponent';
import SmartIdleDetector from '@/components/SmartIdleDetector';
import { TourProvider } from '@/contexts/TourContext';
import { TourOverlay } from '@/components/ui/TourOverlay';
import { GlobalStateSyncProvider } from '@/contexts/GlobalStateSyncProvider';

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
        <GlobalStateSyncProvider>
          <CrossTabSyncComponent>
            <Web3Provider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <DynamicThemeLoader>
                  <TourProvider>
                    <SmartIdleDetector
                      timeoutMs={15 * 60 * 1000}
                      warningDurationMs={60 * 1000}
                      triggerLogoutOnIdle
                      requireAuthenticatedSession
                    />
                    {children}
                    <TourOverlay />
                  </TourProvider>
                </DynamicThemeLoader>
              </ThemeProvider>
            </Web3Provider>
          </CrossTabSyncComponent>
        </GlobalStateSyncProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
