import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DynamicPermissionGate } from '@/components/auth/DynamicPermissionGate';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('DynamicPermissionGate', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders a loading fallback while permissions are loading', async () => {
    vi.mocked(fetch).mockImplementation(
      () =>
        new Promise(() => {
          return undefined;
        }) as Promise<Response>,
    );

    render(
      <DynamicPermissionGate
        requiredPermissions={['view:admin']}
        loadingFallback={<span>Loading permissions...</span>}
      >
        <span>Secure content</span>
      </DynamicPermissionGate>,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Loading permissions...')).toBeInTheDocument();
    expect(screen.queryByText('Secure content')).not.toBeInTheDocument();
  });

  it('renders children after permissions load successfully', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Permissions loaded successfully',
        data: {
          authenticated: true,
          role: 'admin',
          permissions: ['view:admin'],
        },
      }),
    } as Response);

    render(
      <DynamicPermissionGate requiredPermissions={['view:admin']}>
        <span>Secure content</span>
      </DynamicPermissionGate>,
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(screen.getByText('Secure content')).toBeInTheDocument();
    });
  });

  it('prevents unauthorized content from rendering', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Permissions loaded successfully',
        data: {
          authenticated: true,
          role: 'user',
          permissions: [],
        },
      }),
    } as Response);

    render(
      <DynamicPermissionGate
        requiredPermissions={['view:admin']}
        fallback={<span>Access denied</span>}
      >
        <span>Secure content</span>
      </DynamicPermissionGate>,
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(screen.getByText('Access denied')).toBeInTheDocument();
    });

    expect(screen.queryByText('Secure content')).not.toBeInTheDocument();
  });
});
