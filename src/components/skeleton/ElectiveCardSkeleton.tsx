'use client';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

interface ElectiveCardSkeletonProps {
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
  showStats?: boolean;
  showFeatures?: boolean;
}

export function ElectiveCardSkeleton({
  variant = 'default',
  className,
  showStats = true,
  showFeatures = true,
}: ElectiveCardSkeletonProps) {
  const getHeightClass = () => {
    switch (variant) {
      case 'featured':
        return 'min-h-[420px]';
      case 'compact':
        return 'min-h-[320px]';
      default:
        return 'min-h-[380px]';
    }
  };

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 ${getHeightClass()} ${className || ''}`}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {/* Level Badge */}
        <div className="absolute left-3 top-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Delete Button placeholder (for admin view) */}
        <div className="absolute right-3 top-3">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Image placeholder */}
        <div className="flex h-full items-center justify-center">
          <Skeleton className="h-16 w-16 rounded-md" />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title and Instructor */}
        <div className="mb-3">
          {/* Title */}
          <Skeleton
            className={`mb-1 ${variant === 'compact' ? 'h-5 w-full' : 'h-6 w-full'}`}
          />

          {/* Instructor */}
          <Skeleton className="h-4 w-24 mb-2" />

          {/* Description */}
          {variant !== 'compact' && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
        </div>

        {/* Features List */}
        {showFeatures && variant !== 'compact' && (
          <div className="mb-4 space-y-1">
            <Skeleton className="h-3 w-16 mb-2" />
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Skeleton className="h-3 w-3 mt-0.5 rounded-sm" />
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="h-3 w-3 mt-0.5 rounded-sm" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="h-3 w-3 mt-0.5 rounded-sm" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {showStats && (
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        )}

        {/* Price and CTA */}
        <div className="mt-auto">
          <div className="mb-3 flex items-baseline gap-2">
            <Skeleton className="h-7 w-16" />
            {variant !== 'compact' && <Skeleton className="h-4 w-12" />}
          </div>

          <Skeleton
            className={`w-full ${variant === 'featured' ? 'h-12' : 'h-10'} rounded-lg`}
          />
        </div>
      </div>
    </div>
  );
}

// Grid of elective card skeletons
export function ElectiveGridSkeleton({
  count = 6,
  variant = 'default',
  className,
}: {
  count?: number;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}) {
  return (
    <div
      className={`grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${className || ''}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ElectiveCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}
