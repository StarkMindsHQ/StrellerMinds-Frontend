import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SessionManagementDashboard } from '@/components/auth/SessionManagementDashboard';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

const mockSessions = [
  {
    id: 'session-1',
    createdAt: '2026-04-25T12:00:00.000Z',
    lastSeenAt: '2026-04-25T12:15:00.000Z',
    device: 'MacBook Pro',
    browser: 'Safari',
    ip: '192.168.0.27',
    location: 'San Francisco, CA',
    isCurrent: true,
  },
  {
    id: 'session-2',
    createdAt: '2026-04-24T08:00:00.000Z',
    lastSeenAt: '2026-04-25T12:10:00.000Z',
    device: 'Windows PC',
    browser: 'Chrome',
    ip: '172.16.12.8',
    location: 'Austin, TX',
    isCurrent: false,
  },
];

describe('SessionManagementDashboard', () => {
  let fetchMock: Mock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('renders the active session table after loading', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSessions,
    });

    render(<SessionManagementDashboard />);

    expect(screen.getByText(/Loading active sessions/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('MacBook Pro')).toBeDefined();
      expect(screen.getByText('Windows PC')).toBeDefined();
    });
  });

  it('terminates an inactive session when the button is clicked', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSessions,
    });
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });

    render(<SessionManagementDashboard />);

    const terminateButton = await screen.findByRole('button', { name: /Terminate/i });
    fireEvent.click(terminateButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith('/api/auth/sessions?id=session-2', {
        method: 'DELETE',
      });
      expect(screen.queryByText('Windows PC')).toBeNull();
    });
  });
});
