import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DeviceActivityTracker } from '@/components/auth/DeviceActivityTracker';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

const mockActivity = [
  {
    id: 'device-1',
    device: 'MacBook Air',
    browser: 'Safari',
    ip: '198.51.100.22',
    location: 'San Francisco, CA',
    firstSeenAt: '2026-04-24T08:00:00.000Z',
    lastSeenAt: '2026-04-25T12:00:00.000Z',
    suspicious: false,
  },
  {
    id: 'device-2',
    device: 'Android Phone',
    browser: 'Chrome Mobile',
    ip: '192.0.2.14',
    location: 'Moscow, Russia',
    firstSeenAt: '2026-04-25T04:00:00.000Z',
    lastSeenAt: '2026-04-25T12:15:00.000Z',
    suspicious: true,
    reason: 'Unusual login location',
  },
];

describe('DeviceActivityTracker', () => {
  let fetchMock: Mock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('renders device history and suspicious alert', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockActivity,
    });

    render(<DeviceActivityTracker />);

    expect(screen.getByText(/Loading device history/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('MacBook Air')).toBeDefined();
      expect(screen.getByText('Android Phone')).toBeDefined();
      expect(
        screen.getByText(/Suspicious login activity detected/i),
      ).toBeDefined();
      expect(screen.getByText(/Unusual login location/i)).toBeDefined();
    });
  });
});
