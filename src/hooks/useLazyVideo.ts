'use client';

import { RefObject, useCallback, useEffect, useState } from 'react';

interface UseLazyVideoOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useLazyVideo(
  ref: RefObject<HTMLElement>,
  options: UseLazyVideoOptions = {
    rootMargin: '300px',
    threshold: 0,
  },
) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const element = ref.current;
    if (!element) return;

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options.rootMargin,
        threshold: options.threshold,
      },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [ref, options.rootMargin, options.threshold, shouldLoad]);

  const triggerLoad = useCallback(() => {
    setShouldLoad(true);
  }, []);

  return { shouldLoad, triggerLoad };
}
