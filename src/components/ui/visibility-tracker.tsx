'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface VisibilityTrackerProps {
  children: React.ReactNode;
  onVisible?: (entry: IntersectionObserverEntry) => void;
  onHidden?: (entry: IntersectionObserverEntry) => void;
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
  className?: string;
}

export function VisibilityTracker({
  children,
  onVisible,
  onHidden,
  threshold = 0.1,
  rootMargin = '0px',
  once = false,
  className,
}: VisibilityTrackerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible?.(entry);
          setHasBeenVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else {
          onHidden?.(entry);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [onVisible, onHidden, threshold, rootMargin, once]);

  return (
    <div ref={containerRef} className={cn('visibility-tracker', className)}>
      {children}
    </div>
  );
}
