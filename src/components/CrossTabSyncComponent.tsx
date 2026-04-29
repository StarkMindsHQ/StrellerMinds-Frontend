'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { authService } from '@/services/auth.service';

export const CROSS_TAB_SYNC_EVENT_NAME = 'cross-tab-sync';

const DEFAULT_CHANNEL_NAME = 'strellerminds-cross-tab-sync';
const FALLBACK_STORAGE_KEY = '__strellerminds_cross_tab_sync__';
const DEFAULT_SYNC_KEYS = [
  'course_progress',
  'theme',
  'secure-playground-snippets',
  'collaboration-session',
  'collaboration-user',
  'collaboration-messages',
];
const DEFAULT_SYNC_PREFIXES = ['course-progress-', 'cms-draft-'];

export type CrossTabSyncAction =
  | 'set'
  | 'remove'
  | 'tab-open'
  | 'tab-close'
  | 'auth:logout'
  | 'custom';

export interface CrossTabSyncMessage<TValue = unknown> {
  action: CrossTabSyncAction;
  key: string;
  value?: TValue;
  reason?: string;
  timestamp: number;
  version: number;
  sourceTabId: string;
}

export interface CrossTabSyncPublishMessage<TValue = unknown> {
  action: CrossTabSyncAction;
  key: string;
  value?: TValue;
  reason?: string;
}

type CrossTabSyncListener = (message: CrossTabSyncMessage) => void;

interface CrossTabSyncContextValue {
  channelName: string;
  isSupported: boolean;
  tabId: string;
  publishMessage: <TValue = unknown>(
    message: CrossTabSyncPublishMessage<TValue>,
  ) => CrossTabSyncMessage<TValue>;
  broadcastAuthLogout: (reason?: string) => void;
  subscribe: (listener: CrossTabSyncListener) => () => void;
}

interface CrossTabSyncComponentProps {
  children: React.ReactNode;
  channelName?: string;
  syncKeys?: string[];
  syncKeyPrefixes?: string[];
  onMessage?: CrossTabSyncListener;
}

const CrossTabSyncContext = createContext<CrossTabSyncContextValue | null>(
  null,
);

const createTabId = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export default function CrossTabSyncComponent({
  children,
  channelName = DEFAULT_CHANNEL_NAME,
  syncKeys = DEFAULT_SYNC_KEYS,
  syncKeyPrefixes = DEFAULT_SYNC_PREFIXES,
  onMessage,
}: CrossTabSyncComponentProps) {
  const tabIdRef = useRef(createTabId());
  const channelRef = useRef<BroadcastChannel | null>(null);
  const syncKeysRef = useRef(syncKeys);
  const syncKeyPrefixesRef = useRef(syncKeyPrefixes);
  const localStorageRef = useRef<Storage | null>(null);
  const listenersRef = useRef(new Set<CrossTabSyncListener>());
  const localCounterRef = useRef(0);
  const latestVersionRef = useRef(new Map<string, number>());
  const applyingRemoteMessageRef = useRef(false);
  const originalSetItemRef = useRef<Storage['setItem'] | null>(null);
  const originalRemoveItemRef = useRef<Storage['removeItem'] | null>(null);

  syncKeysRef.current = syncKeys;
  syncKeyPrefixesRef.current = syncKeyPrefixes;

  const isSupported =
    typeof window !== 'undefined' &&
    (typeof window.BroadcastChannel !== 'undefined' ||
      typeof window.localStorage !== 'undefined');

  const shouldSyncKey = (key: string) => {
    if (!key) {
      return false;
    }

    if (syncKeysRef.current.includes(key)) {
      return true;
    }

    return syncKeyPrefixesRef.current.some((prefix) => key.startsWith(prefix));
  };

  const notifyListeners = (message: CrossTabSyncMessage) => {
    onMessage?.(message);
    listenersRef.current.forEach((listener) => listener(message));

    window.dispatchEvent(
      new CustomEvent<CrossTabSyncMessage>(CROSS_TAB_SYNC_EVENT_NAME, {
        detail: message,
      }),
    );
  };

  const createVersion = () => {
    localCounterRef.current += 1;
    return Date.now() * 1000 + localCounterRef.current;
  };

  const markLatestVersion = (key: string, version: number) => {
    latestVersionRef.current.set(key, version);
  };

  const getLatestVersion = (key: string) => {
    return latestVersionRef.current.get(key) ?? 0;
  };

  const sendMessage = (message: CrossTabSyncMessage) => {
    if (channelRef.current) {
      channelRef.current.postMessage(message);
      return;
    }

    if (!localStorageRef.current) {
      return;
    }

    try {
      localStorageRef.current.setItem(
        FALLBACK_STORAGE_KEY,
        JSON.stringify(message),
      );
      localStorageRef.current.removeItem(FALLBACK_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to broadcast cross-tab sync message:', error);
    }
  };

  const applyRemoteStorageChange = (message: CrossTabSyncMessage) => {
    if (!localStorageRef.current) {
      return;
    }

    applyingRemoteMessageRef.current = true;

    try {
      if (message.action === 'set' && typeof message.value === 'string') {
        const setItem = originalSetItemRef.current?.bind(
          localStorageRef.current,
        );
        setItem?.(message.key, message.value);
      }

      if (message.action === 'remove') {
        const removeItem = originalRemoveItemRef.current?.bind(
          localStorageRef.current,
        );
        removeItem?.(message.key);
      }
    } finally {
      applyingRemoteMessageRef.current = false;
    }
  };

  const handleIncomingMessage = (message: CrossTabSyncMessage) => {
    if (!message || message.sourceTabId === tabIdRef.current) {
      return;
    }

    const latestVersion = getLatestVersion(message.key);
    if (message.version <= latestVersion) {
      return;
    }

    markLatestVersion(message.key, message.version);

    if (message.action === 'set' || message.action === 'remove') {
      applyRemoteStorageChange(message);
    }

    if (message.action === 'auth:logout') {
      void authService.logout();
    }

    notifyListeners(message);
  };

  const publishMessage = <TValue,>(
    message: CrossTabSyncPublishMessage<TValue>,
  ) => {
    const fullMessage: CrossTabSyncMessage<TValue> = {
      ...message,
      timestamp: Date.now(),
      version: createVersion(),
      sourceTabId: tabIdRef.current,
    };

    markLatestVersion(fullMessage.key, fullMessage.version);
    notifyListeners(fullMessage);
    sendMessage(fullMessage);

    return fullMessage;
  };

  const broadcastAuthLogout = (reason = 'manual-logout') => {
    publishMessage({
      action: 'auth:logout',
      key: 'auth:session',
      reason,
    });
  };

  const subscribe = (listener: CrossTabSyncListener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorageRef.current = window.localStorage;
    if (typeof window.BroadcastChannel !== 'undefined') {
      channelRef.current = new window.BroadcastChannel(channelName);
      channelRef.current.onmessage = (
        event: MessageEvent<CrossTabSyncMessage>,
      ) => handleIncomingMessage(event.data);
    }

    const storage = localStorageRef.current;
    if (!storage) {
      return;
    }

    originalSetItemRef.current = storage.setItem;
    originalRemoveItemRef.current = storage.removeItem;

    storage.setItem = ((key: string, value: string) => {
      originalSetItemRef.current?.call(storage, key, value);

      if (applyingRemoteMessageRef.current || !shouldSyncKey(key)) {
        return;
      }

      publishMessage({
        action: 'set',
        key,
        value,
      });
    }) as Storage['setItem'];

    storage.removeItem = ((key: string) => {
      originalRemoveItemRef.current?.call(storage, key);

      if (applyingRemoteMessageRef.current || !shouldSyncKey(key)) {
        return;
      }

      publishMessage({
        action: 'remove',
        key,
      });
    }) as Storage['removeItem'];

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key !== FALLBACK_STORAGE_KEY || !event.newValue) {
        return;
      }

      try {
        const message = JSON.parse(event.newValue) as CrossTabSyncMessage;
        handleIncomingMessage(message);
      } catch (error) {
        console.error('Failed to parse cross-tab storage event:', error);
      }
    };

    const handleBeforeUnload = () => {
      publishMessage({
        action: 'tab-close',
        key: 'tab:lifecycle',
      });
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('beforeunload', handleBeforeUnload);

    publishMessage({
      action: 'tab-open',
      key: 'tab:lifecycle',
    });

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      publishMessage({
        action: 'tab-close',
        key: 'tab:lifecycle',
      });

      if (storage && originalSetItemRef.current) {
        storage.setItem = originalSetItemRef.current;
      }

      if (storage && originalRemoveItemRef.current) {
        storage.removeItem = originalRemoveItemRef.current;
      }

      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
    };
  }, [channelName]);

  return (
    <CrossTabSyncContext.Provider
      value={{
        channelName,
        isSupported,
        tabId: tabIdRef.current,
        publishMessage,
        broadcastAuthLogout,
        subscribe,
      }}
    >
      {children}
    </CrossTabSyncContext.Provider>
  );
}

export function useCrossTabSync(options?: { optional?: boolean }) {
  const context = useContext(CrossTabSyncContext);

  if (!context && !options?.optional) {
    throw new Error(
      'useCrossTabSync must be used within a CrossTabSyncComponent',
    );
  }

  return context;
}
