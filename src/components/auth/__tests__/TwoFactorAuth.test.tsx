import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TwoFactorAuth } from '@/components/auth/TwoFactorAuth';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

describe('TwoFactorAuth', () => {
  let fetchMock: Mock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('renders the current 2FA status when disabled', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ enabled: false, backupCodes: [] }),
    });

    render(<TwoFactorAuth />);

    expect(screen.getByText(/Loading two-factor status/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText(/Disabled/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /Enable 2FA/i })).toBeDefined();
    });
  });

  it('starts setup and shows a secret key', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ enabled: false, backupCodes: [] }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        secret: 'JBSWY3DPEHPK3PXP',
        backupCodes: ['CODE1', 'CODE2'],
      }),
    });

    render(<TwoFactorAuth />);

    await waitFor(() => screen.getByRole('button', { name: /Enable 2FA/i }));
    fireEvent.click(screen.getByRole('button', { name: /Enable 2FA/i }));

    await waitFor(() => {
      expect(screen.getByText(/Secret key/i)).toBeDefined();
      expect(screen.getByText('JBSWY3DPEHPK3PXP')).toBeDefined();
    });
  });

  it('verifies a setup code and enables two-factor authentication', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ enabled: false, backupCodes: [] }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        secret: 'JBSWY3DPEHPK3PXP',
        backupCodes: ['CODE1', 'CODE2'],
      }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ backupCodes: ['CODE1', 'CODE2'] }),
    });

    render(<TwoFactorAuth />);

    await waitFor(() => screen.getByRole('button', { name: /Enable 2FA/i }));
    fireEvent.click(screen.getByRole('button', { name: /Enable 2FA/i }));

    await waitFor(() => screen.getByPlaceholderText(/Enter 6-digit code/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter 6-digit code/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Verify code/i }));

    await waitFor(() => {
      expect(screen.getByText(/Enabled/i)).toBeDefined();
      expect(screen.getByText('CODE1')).toBeDefined();
      expect(screen.getByText('CODE2')).toBeDefined();
    });
  });
});
