'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  MessageSquare,
  Star,
  Trophy,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';


// ─── Types ───────────────────────────────────────────────────────────────────

export type NotificationKind = 'message' | 'achievement' | 'course' | 'review' | 'alert';

export interface BellNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  avatarInitials?: string;
  avatarColor?: string;
}

interface NotificationBellProps {
  notifications?: BellNotification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

// ─── Static mock data ─────────────────────────────────────────────────────────

const defaultNotifications: BellNotification[] = [
  {
    id: '1',
    kind: 'message',
    title: 'Kwame Asante replied',
    description: 'Great question on the system design exercise — I left detailed feedback.',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    read: false,
    avatarInitials: 'KA',
    avatarColor: '#3b82f6',
  },
  {
    id: '2',
    kind: 'achievement',
    title: 'Achievement unlocked',
    description: 'You completed your first 10 sessions — keep the momentum going!',
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    read: false,
    avatarInitials: '🏆',
  },
  {
    id: '3',
    kind: 'course',
    title: 'New content available',
    description: '"TypeScript Advanced Patterns" has 3 new lessons ready for you.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    avatarInitials: 'TS',
    avatarColor: '#a855f7',
  },
  {
    id: '4',
    kind: 'alert',
    title: 'Session in 15 minutes',
    description: 'Reminder: your session with Priya Menon starts at 3:00 PM.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
    avatarInitials: 'PM',
    avatarColor: '#ec4899',
  },
  {
    id: '5',
    kind: 'review',
    title: 'Session review received',
    description: 'Leon Fischer gave your last session 5 stars and wrote a note.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    avatarInitials: 'LF',
    avatarColor: '#ef4444',
  },
  {
    id: '6',
    kind: 'message',
    title: 'Aisha Nwosu commented',
    description: 'Left a note on your ML project submission — check it out.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    avatarInitials: 'AN',
    avatarColor: '#f59e0b',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const KindIcon: Record<NotificationKind, React.ReactNode> = {
  message: <MessageSquare className="h-3 w-3" />,
  achievement: <Trophy className="h-3 w-3" />,
  course: <BookOpen className="h-3 w-3" />,
  review: <Star className="h-3 w-3" />,
  alert: <AlertCircle className="h-3 w-3" />,
};

const KindAccent: Record<NotificationKind, string> = {
  message: 'bg-sky-500',
  achievement: 'bg-amber-500',
  course: 'bg-violet-500',
  review: 'bg-emerald-500',
  alert: 'bg-rose-500',
};

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NotificationBell({
  notifications: externalNotifications,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  className,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<BellNotification[]>(
    externalNotifications ?? defaultNotifications,
  );
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !dropdownRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      onMarkRead?.(id);
    },
    [onMarkRead],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllRead?.();
  }, [onMarkAllRead]);

  const dismiss = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      onDismiss?.(id);
    },
    [onDismiss],
  );

  const displayed =
    activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <div className={cn('relative', className)}>
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        className={cn(
          'relative flex h-9 w-9 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-all',
          isOpen
            ? 'border-primary text-primary ring-2 ring-primary/20'
            : 'hover:border-border hover:text-foreground',
        )}
      >
        <Bell className="h-4.5 w-4.5" />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full z-50 mt-2 w-[380px] overflow-hidden rounded-2xl border bg-popover shadow-xl animate-in fade-in-0 slide-in-from-top-2 duration-150 max-sm:w-[calc(100vw-32px)] max-sm:right-0"
          role="dialog"
          aria-label="Notifications"
        >
          {/* Dropdown header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-popover-foreground">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CheckCheck className="h-3 w-3" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {(['all', 'unread'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 py-2 text-[12px] font-medium capitalize transition-colors',
                  activeTab === tab
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab}
                {tab === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* List */}
          <ScrollArea className="max-h-[400px]">
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <Bell className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'unread'
                    ? 'All caught up!'
                    : 'No notifications yet'}
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {displayed.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      'group relative flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors hover:bg-accent/40',
                      !n.read && 'bg-primary/[0.04]',
                    )}
                  >
                    {/* Avatar / icon */}
                    <div className="relative shrink-0">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white"
                        style={{
                          background: n.avatarColor ?? '#64748b',
                        }}
                      >
                        {n.avatarInitials}
                      </div>

                      {/* Kind badge on avatar */}
                      <span
                        className={cn(
                          'absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white',
                          KindAccent[n.kind],
                        )}
                      >
                        {KindIcon[n.kind]}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1 pr-6">
                      <p
                        className={cn(
                          'text-sm leading-snug',
                          !n.read
                            ? 'font-semibold text-popover-foreground'
                            : 'font-medium text-muted-foreground',
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {n.description}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/70">
                        {timeAgo(n.timestamp)}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!n.read && (
                      <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary" />
                    )}

                    {/* Read check (show on hover for read items) */}
                    {n.read && (
                      <span className="absolute right-4 top-4 hidden text-muted-foreground/40 group-hover:block">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}

                    {/* Dismiss button */}
                    <button
                      onClick={(e) => dismiss(e, n.id)}
                      className="absolute right-2 top-2 hidden rounded p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group-hover:flex"
                      aria-label="Dismiss"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t px-4 py-2.5 text-center">
              <button className="text-xs font-medium text-primary hover:underline">
                View all notifications →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;