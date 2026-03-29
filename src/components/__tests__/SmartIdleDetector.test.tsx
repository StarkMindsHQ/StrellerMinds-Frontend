import { act, render } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import SmartIdleDetector from '../SmartIdleDetector';

const { logoutMock } = vi.hoisted(() => ({
  logoutMock: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    role: null,
    permissions: [],
    isAuthenticated: true,
    isLoading: false,
  }),
}));

vi.mock('@/services/auth.service', () => ({
  authService: {
    logout: logoutMock,
  },
}));

describe('SmartIdleDetector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    logoutMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('warns before timing out and resets on activity', () => {
    const handleWarning = vi.fn();
    const handleActive = vi.fn();
    const handleIdle = vi.fn();

    render(
      <SmartIdleDetector
        timeoutMs={5_000}
        warningDurationMs={2_000}
        onWarning={handleWarning}
        onActive={handleActive}
        onIdle={handleIdle}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(3_000);
    });

    expect(handleWarning).toHaveBeenCalledTimes(1);
    expect(handleIdle).not.toHaveBeenCalled();

    act(() => {
      window.dispatchEvent(new Event('mousemove'));
    });

    expect(handleActive).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(4_999);
    });

    expect(handleIdle).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(handleIdle).toHaveBeenCalledTimes(1);
  });

  it('triggers logout when idle timeout is reached', () => {
    render(
      <SmartIdleDetector
        timeoutMs={2_000}
        warningDurationMs={500}
        triggerLogoutOnIdle
      />,
    );

    act(() => {
      vi.advanceTimersByTime(2_000);
    });

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
