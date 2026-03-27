import React, { useEffect, useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CrossTabSyncComponent, { useCrossTabSync } from '../CrossTabSyncComponent';

const { logoutMock } = vi.hoisted(() => ({
  logoutMock: vi.fn(),
}));

vi.mock('@/services/auth.service', () => ({
  authService: {
    logout: logoutMock,
  },
}));

class MockBroadcastChannel {
  static channels = new Map<string, Set<MockBroadcastChannel>>();

  name: string;

  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;

    if (!MockBroadcastChannel.channels.has(name)) {
      MockBroadcastChannel.channels.set(name, new Set());
    }

    MockBroadcastChannel.channels.get(name)?.add(this);
  }

  postMessage(message: unknown) {
    const peers = MockBroadcastChannel.channels.get(this.name);
    peers?.forEach((peer) => {
      if (peer === this || !peer.onmessage) {
        return;
      }

      peer.onmessage({ data: message } as MessageEvent);
    });
  }

  close() {
    MockBroadcastChannel.channels.get(this.name)?.delete(this);
  }
}

function TestConsumer() {
  const crossTabSync = useCrossTabSync();
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    return crossTabSync.subscribe(() => {
      setMessageCount((count) => count + 1);
    });
  }, [crossTabSync]);

  return <div>messages:{messageCount}</div>;
}

describe('CrossTabSyncComponent', () => {
  let setItemSpy: ReturnType<typeof vi.fn>;
  let removeItemSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
    MockBroadcastChannel.channels.clear();
    logoutMock.mockReset();
    setItemSpy = vi.fn();
    removeItemSpy = vi.fn();
    window.localStorage.setItem = setItemSpy;
    window.localStorage.removeItem = removeItemSpy;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('applies remote storage updates and notifies subscribers', () => {
    render(
      <CrossTabSyncComponent>
        <TestConsumer />
      </CrossTabSyncComponent>,
    );

    const remoteChannel = new MockBroadcastChannel(
      'strellerminds-cross-tab-sync',
    );

    act(() => {
      remoteChannel.postMessage({
        action: 'set',
        key: 'course-progress-course-1',
        value: '{"overallProgress":50}',
        timestamp: Date.now(),
        version: 1,
        sourceTabId: 'remote-tab',
      });
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      'course-progress-course-1',
      '{"overallProgress":50}',
    );
    expect(screen.getByText('messages:2')).toBeInTheDocument();
  });

  it('triggers a logout when an auth logout message arrives from another tab', () => {
    render(
      <CrossTabSyncComponent>
        <TestConsumer />
      </CrossTabSyncComponent>,
    );

    const remoteChannel = new MockBroadcastChannel(
      'strellerminds-cross-tab-sync',
    );

    act(() => {
      remoteChannel.postMessage({
        action: 'auth:logout',
        key: 'auth:session',
        reason: 'idle-timeout',
        timestamp: Date.now(),
        version: 2,
        sourceTabId: 'remote-tab',
      });
    });

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
