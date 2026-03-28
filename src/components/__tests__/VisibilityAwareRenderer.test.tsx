import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VisibilityAwareRenderer from '../VisibilityAwareRenderer';

type ObserverEntry = {
  isIntersecting: boolean;
  target: Element;
};

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  callback: (entries: ObserverEntry[]) => void;

  constructor(callback: (entries: ObserverEntry[]) => void) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe() {}

  disconnect() {}

  unobserve() {}
}

describe('VisibilityAwareRenderer', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  it('renders the placeholder until the content becomes visible', () => {
    render(
      <VisibilityAwareRenderer placeholder={<div>Loading section...</div>}>
        <div>Heavy content</div>
      </VisibilityAwareRenderer>,
    );

    expect(screen.getByText('Loading section...')).toBeInTheDocument();
    expect(screen.queryByText('Heavy content')).not.toBeInTheDocument();

    const container = screen.getByText('Loading section...').parentElement;
    expect(container).not.toBeNull();

    act(() => {
      MockIntersectionObserver.instances[0].callback([
        {
          isIntersecting: true,
          target: container as Element,
        },
      ]);
    });

    expect(screen.getByText('Heavy content')).toBeInTheDocument();
  });

  it('unmounts content again when once is disabled', () => {
    render(
      <VisibilityAwareRenderer
        once={false}
        placeholder={<div>Placeholder</div>}
      >
        <div>Visible content</div>
      </VisibilityAwareRenderer>,
    );

    const container = screen.getByText('Placeholder').parentElement;
    expect(container).not.toBeNull();

    act(() => {
      MockIntersectionObserver.instances[0].callback([
        {
          isIntersecting: true,
          target: container as Element,
        },
      ]);
    });

    expect(screen.getByText('Visible content')).toBeInTheDocument();

    act(() => {
      MockIntersectionObserver.instances[0].callback([
        {
          isIntersecting: false,
          target: container as Element,
        },
      ]);
    });

    expect(screen.queryByText('Visible content')).not.toBeInTheDocument();
    expect(screen.getByText('Placeholder')).toBeInTheDocument();
  });
});
