'use client';

import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  useMemo,
} from 'react';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number | ((index: number) => number);
  containerHeight: number | string;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  // If true, the list will assume items have dynamic heights and calculate them on render if possible
  dynamicHeights?: boolean;
}

/**
 * VirtualizedList component for efficient rendering of large lists by only rendering visible items.
 * Supports static or dynamic item heights and optimizes scroll performance.
 */
export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className,
  onScroll,
  dynamicHeights = false,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Memoized function to get height of a specific item
  const getItemHeight = useCallback(
    (index: number) => {
      return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight;
    },
    [itemHeight],
  );

  // Calculate cumulative heights of items for dynamic positioning
  const { cumulativeHeights, totalHeight } = useMemo(() => {
    const cumulative = [0];
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += getItemHeight(i);
      cumulative.push(total);
    }
    return { cumulativeHeights: cumulative, totalHeight: total };
  }, [items, getItemHeight]);

  // Find the index of the first visible item based on scroll position
  const findStartIndex = useCallback(
    (scrollPos: number) => {
      let low = 0;
      let high = cumulativeHeights.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (cumulativeHeights[mid] <= scrollPos) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return Math.max(0, low - 1);
    },
    [cumulativeHeights],
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = event.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll],
  );

  // Determine the range of items to render
  const containerHeightNumber =
    typeof containerHeight === 'string' ? 800 : containerHeight; // Default to 800 if string

  const startIndex = Math.max(0, findStartIndex(scrollTop) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    findStartIndex(scrollTop + containerHeightNumber) + overscan,
  );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        'overflow-y-auto overflow-x-hidden relative scrollbar-thin',
        className,
      )}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative', width: '100%' }}>
        {items.slice(startIndex, endIndex + 1).map((item, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: cumulativeHeights[actualIndex],
                left: 0,
                right: 0,
                height: getItemHeight(actualIndex),
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Memoized item wrapper for better performance
export const VirtualizedItem = memo(
  ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  },
);
