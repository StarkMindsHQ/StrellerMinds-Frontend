'use client';

import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { prefetchRequestQueue } from '@/lib/prefetch-request-queue';

type PrefetchPriority = 'high' | 'normal' | 'low';

export interface SmartPrefetchLinkProps
  extends
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    LinkProps {
  prefetchData?: (signal: AbortSignal) => Promise<unknown>;
  prefetchKey?: string;
  prefetchOnHover?: boolean;
  prefetchOnViewport?: boolean;
  prefetchDelayMs?: number;
  prefetchPriority?: PrefetchPriority;
}

export default function SmartPrefetchLink({
  href,
  children,
  prefetchData,
  prefetchKey,
  prefetchOnHover = true,
  prefetchOnViewport = true,
  prefetchDelayMs = 80,
  prefetchPriority = 'normal',
  onMouseEnter,
  onMouseLeave,
  ...props
}: SmartPrefetchLinkProps) {
  const router = useRouter();
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const didPrefetchRef = useRef(false);

  const key = useMemo(
    () =>
      prefetchKey ??
      `prefetch:${typeof href === 'string' ? href : href.pathname || ''}`,
    [href, prefetchKey],
  );

  const runPrefetch = useCallback(() => {
    if (didPrefetchRef.current) return;
    didPrefetchRef.current = true;

    if (typeof href === 'string') {
      router.prefetch(href);
    } else {
      router.prefetch(String(href.pathname || ''));
    }

    if (prefetchData) {
      void prefetchRequestQueue.enqueue({
        key,
        priority: prefetchPriority,
        request: prefetchData,
        staleAfterMs: 10_000,
      });
    }
  }, [href, key, prefetchData, prefetchPriority, router]);

  const clearPending = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    // Cancel queued/inflight data prefetch when user moves away.
    prefetchRequestQueue.cancel(key);
  }, [key]);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onMouseEnter?.(event);
      if (!prefetchOnHover) return;

      hoverTimerRef.current = window.setTimeout(() => {
        runPrefetch();
      }, prefetchDelayMs);
    },
    [onMouseEnter, prefetchDelayMs, prefetchOnHover, runPrefetch],
  );

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onMouseLeave?.(event);
      clearPending();
    },
    [clearPending, onMouseLeave],
  );

  useEffect(() => {
    if (!prefetchOnViewport || !anchorRef.current) return;

    const target = anchorRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          runPrefetch();
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [prefetchOnViewport, runPrefetch]);

  useEffect(() => {
    return () => {
      clearPending();
    };
  }, [clearPending]);

  return (
    <Link
      {...props}
      ref={anchorRef}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
}
