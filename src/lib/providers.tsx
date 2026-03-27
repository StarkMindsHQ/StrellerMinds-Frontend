'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Web3Provider } from './web3/providers';
import { DynamicThemeLoader } from '@/components/DynamicThemeLoader';

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
          <DynamicThemeLoader>{children}</DynamicThemeLoader>
        </ThemeProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
}
