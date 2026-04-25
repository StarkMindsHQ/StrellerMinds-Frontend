'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface VisibilityAwareRendererProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  disabled?: boolean;
  minHeight?: number | string;
  onVisibilityChange?: (
    isVisible: boolean,
    entry?: IntersectionObserverEntry,
  ) => void;
}

export default function VisibilityAwareRenderer({
  children,
  placeholder = null,
  className,
  rootMargin = '200px 0px',
  threshold = 0.1,
  once = true,
  disabled = false,
  minHeight,
  onVisibilityChange,
}: VisibilityAwareRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(disabled);
  const [hasBeenVisible, setHasBeenVisible] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    if (
      typeof window === 'undefined' ||
      typeof window.IntersectionObserver === 'undefined'
    ) {
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting;
        setIsVisible(nextVisible);
        onVisibilityChange?.(nextVisible, entry);

        if (nextVisible) {
          setHasBeenVisible(true);
        }

        if (nextVisible && once) {
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [disabled, onVisibilityChange, once, rootMargin, threshold]);

  const shouldRenderChildren =
    disabled || isVisible || (once && hasBeenVisible);

  return (
    <div
      ref={containerRef}
      className={cn('w-full', className)}
      style={minHeight ? { minHeight } : undefined}
    >
      {shouldRenderChildren ? children : placeholder}
    </div>
  );
}
