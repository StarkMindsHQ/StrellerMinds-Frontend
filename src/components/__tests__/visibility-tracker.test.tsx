import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VisibilityTracker } from '@/components/ui/visibility-tracker';

describe('VisibilityTracker', () => {
  let observeMock: Mock;
  let disconnectMock: Mock;
  let observerCallback: IntersectionObserverCallback | null = null;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();
    observerCallback = null;

    // Mock IntersectionObserver as a class
    class MockObserver {
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = vi.fn();
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
    }

    vi.stubGlobal('IntersectionObserver', MockObserver);
  });

  it('renders children correctly', () => {
    render(
      <VisibilityTracker>
        <div data-testid="child">Target Content</div>
      </VisibilityTracker>,
    );
    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('starts observing on mount', () => {
    render(
      <VisibilityTracker>
        <div>Content</div>
      </VisibilityTracker>,
    );
    expect(observeMock).toHaveBeenCalled();
  });

  it('disconnects on unmount', () => {
    const { unmount } = render(
      <VisibilityTracker>
        <div>Content</div>
      </VisibilityTracker>,
    );
    unmount();
    expect(disconnectMock).toHaveBeenCalled();
  });

  it('calls onVisible when element becomes intersecting', () => {
    const onVisible = vi.fn();

    render(
      <VisibilityTracker onVisible={onVisible}>
        <div>Content</div>
      </VisibilityTracker>,
    );

    // Simulate intersection
    const mockEntry = { isIntersecting: true } as IntersectionObserverEntry;
    if (observerCallback) {
      observerCallback([mockEntry], {} as any);
    }

    expect(onVisible).toHaveBeenCalled();
  });

  it('calls onHidden when element stops intersecting', () => {
    const onHidden = vi.fn();

    render(
      <VisibilityTracker onHidden={onHidden}>
        <div>Content</div>
      </VisibilityTracker>,
    );

    // Simulate intersection end
    const mockEntry = { isIntersecting: false } as IntersectionObserverEntry;
    if (observerCallback) {
      observerCallback([mockEntry], {} as any);
    }

    expect(onHidden).toHaveBeenCalled();
  });

  it('disconnects after first visibility when once is true', () => {
    render(
      <VisibilityTracker once>
        <div>Content</div>
      </VisibilityTracker>,
    );

    const mockEntry = { isIntersecting: true } as IntersectionObserverEntry;
    if (observerCallback) {
      observerCallback([mockEntry], {} as any);
    }

    expect(disconnectMock).toHaveBeenCalled();
  });
});
