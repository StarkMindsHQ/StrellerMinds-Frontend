'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  columns: { header: string; width?: string }[];
  rows?: number;
  className?: string;
  showPagination?: boolean;
}

export function TableSkeleton({
  columns,
  rows = 5,
  className,
  showPagination = true,
}: TableSkeletonProps) {
  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Table Header */}
      <div className="flex rounded-lg bg-gray-100 dark:bg-gray-900 p-4">
        {columns.map((col, index) => (
          <div
            key={index}
            className="flex-1"
            style={{ width: col.width }}
          >
            <Skeleton className="h-4 w-full max-w-[100px]" />
          </div>
        ))}
      </div>

      {/* Table Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
          >
            {columns.map((col, colIndex) => (
              <div
                key={colIndex}
                className="flex-1"
                style={{ width: col.width }}
              >
                <Skeleton
                  className={cn(
                    'h-4',
                    colIndex === 0 ? 'w-24' : 'w-full max-w-[120px]',
                  )}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-8 rounded-md" />
            ))}
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}

// Compact table skeleton for smaller spaces
export function CompactTableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 rounded border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                'h-4',
                colIndex === 0 ? 'w-16' : colIndex === columns - 1 ? 'w-20' : 'flex-1',
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}