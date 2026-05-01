'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ScrollProgressIndicatorProps {
  className?: string;
  barClassName?: string;
  heightClassName?: string;
  position?: 'top' | 'bottom';
  colorClassName?: string;
}

export default function ScrollProgressIndicator({
  className,
  barClassName,
  heightClassName = 'h-1',
  position = 'top',
  colorClassName = 'bg-primary',
}: ScrollProgressIndicatorProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }

      const next = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setProgress(next);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        updateProgress();
        frame = 0;
      });
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={cn(
        'pointer-events-none fixed left-0 z-50 w-full bg-transparent',
        heightClassName,
        position === 'top' ? 'top-0' : 'bottom-0',
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          'h-full origin-left transform-gpu transition-transform duration-100 ease-out',
          colorClassName,
          barClassName,
        )}
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
