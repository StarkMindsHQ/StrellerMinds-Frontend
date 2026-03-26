'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, BookOpen, MessageSquare, Star, Trophy, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// ─── Types ───────────────────────────────────────────────────────────────────

export type NotificationType = 'message' | 'achievement' | 'course' | 'review' | 'alert';

export interface StreamNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'polling';

interface RealTimeNotificationStreamProps {
  /** WebSocket URL — falls back to polling when unavailable */
  wsUrl?: string;
  /** Polling interval in ms (used when WS unavailable) */
  pollIntervalMs?: number;
  /** Called on incoming notifications for external handling */
  onNotification?: (n: StreamNotification) => void;
  /** Max notifications to keep in stream view */
  maxVisible?: number;
  className?: string;
}

// ─── Mock stream (replace wsUrl + poll with real endpoints) ──────────────────

const MOCK_POOL: Omit<StreamNotification, 'id' | 'timestamp' | 'read'>[] = [
  { type: 'message', title: 'New message', body: 'Kwame replied to your question in "System Design"' },
  { type: 'achievement', title: 'Achievement unlocked!', body: 'You completed 5 sessions this month 🎉' },
  { type: 'course', title: 'Course updated', body: '"TypeScript Patterns" has new content available' },
  { type: 'review', title: 'Session reviewed', body: 'Priya gave you 5 stars — view feedback' },
  { type: 'alert', title: 'Reminder', body: 'Your session with Leon starts in 15 minutes' },
  { type: 'message', title: 'Mentor reply', body: 'Aisha commented on your progress submission' },
];

function makeMockNotification(): StreamNotification {
  const base = MOCK_POOL[Math.floor(Math.random() * MOCK_POOL.length)];
  return { ...base, id: `notif-${Date.now()}-${Math.random()}`, timestamp: new Date(), read: false };
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const TypeIcon: Record<NotificationType, React.ReactNode> = {
  message: <MessageSquare className="h-3.5 w-3.5" />,
  achievement: <Trophy className="h-3.5 w-3.5" />,
  course: <BookOpen className="h-3.5 w-3.5" />,
  review: <Star className="h-3.5 w-3.5" />,
  alert: <AlertCircle className="h-3.5 w-3.5" />,
};

const TypeColor: Record<NotificationType, string> = {
  message: 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300',
  achievement: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
  course: 'bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300',
  review: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300',
  alert: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300',
};

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function RealTimeNotificationStream({
  wsUrl,
  pollIntervalMs = 8000,
  onNotification,
  maxVisible = 20,
  className,
}: RealTimeNotificationStreamProps) {
  const [notifications, setNotifications] = useState<StreamNotification[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [, forceRender] = useState(0); // for timeAgo refresh

  const wsRef = useRef<WebSocket | null>(null);
  const seenIds = useRef(new Set<string>());
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);

  const ingestNotification = useCallback(
    (n: StreamNotification) => {
      if (seenIds.current.has(n.id)) return; // deduplicate
      seenIds.current.add(n.id);
      setNotifications((prev) => [n, ...prev].slice(0, maxVisible));
      onNotification?.(n);
    },
    [maxVisible, onNotification],
  );

  // ── WebSocket connection
  const connectWs = useCallback(() => {
    if (!wsUrl) return false;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      setStatus('connecting');

      ws.onopen = () => {
        setStatus('connected');
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as StreamNotification;
          ingestNotification({ ...data, timestamp: new Date(data.timestamp) });
        } catch {}
      };

      ws.onerror = () => setStatus('disconnected');

      ws.onclose = () => {
        setStatus('disconnected');
        // Exponential backoff reconnect
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
        reconnectAttempts.current += 1;
        reconnectTimer.current = setTimeout(connectWs, delay);
      };

      return true;
    } catch {
      return false;
    }
  }, [wsUrl, ingestNotification]);

  // ── Polling fallback
  const startPolling = useCallback(() => {
    setStatus('polling');
    pollingRef.current = setInterval(() => {
      // Real: fetch('/api/notifications/stream').then(...)
      if (Math.random() > 0.5) {
        ingestNotification(makeMockNotification());
      }
    }, pollIntervalMs);
  }, [pollIntervalMs, ingestNotification]);

  useEffect(() => {
    const wsConnected = connectWs();
    if (!wsConnected) startPolling();

    // Seed initial mock data
    setTimeout(() => ingestNotification(makeMockNotification()), 800);
    setTimeout(() => ingestNotification(makeMockNotification()), 2200);

    // Refresh timeAgo labels every minute
    const tick = setInterval(() => forceRender((n) => n + 1), 60000);

    return () => {
      wsRef.current?.close();
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      clearInterval(tick);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={cn('flex flex-col rounded-xl border bg-card/90 shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Live Notifications</h3>
          {unreadCount > 0 && (
            <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Connection pill */}
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium',
              status === 'connected'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : status === 'polling'
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
            )}
          >
            {status === 'disconnected' ? (
              <WifiOff className="h-3 w-3" />
            ) : (
              <Wifi className="h-3 w-3" />
            )}
            {status === 'connecting' && 'Connecting…'}
            {status === 'connected' && 'Live'}
            {status === 'polling' && 'Polling'}
            {status === 'disconnected' && 'Reconnecting…'}
          </span>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Stream */}
      <ul className="flex max-h-[420px] flex-col divide-y overflow-y-auto">
        {notifications.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-muted-foreground">
            No notifications yet — waiting for events…
          </li>
        )}

        {notifications.map((n) => (
          <li
            key={n.id}
            onClick={() => markRead(n.id)}
            className={cn(
              'flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-accent/40',
              !n.read && 'bg-primary/5',
            )}
          >
            {/* Icon */}
            <span
              className={cn(
                'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                TypeColor[n.type],
              )}
            >
              {TypeIcon[n.type]}
            </span>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    'text-sm leading-snug',
                    !n.read ? 'font-semibold text-card-foreground' : 'text-muted-foreground',
                  )}
                >
                  {n.title}
                </p>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {timeAgo(n.timestamp)}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.body}</p>
            </div>

            {/* Unread dot */}
            {!n.read && (
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RealTimeNotificationStream;