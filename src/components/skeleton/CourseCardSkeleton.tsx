import {
  Skeleton,
  SkeletonText,
  SkeletonImage,
  SkeletonBadge,
  SkeletonButton,
  SkeletonCard,
} from '@/components/ui/skeleton';

interface CourseCardSkeletonProps {
  className?: string;
}

export function CourseCardSkeleton({ className }: CourseCardSkeletonProps) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 ${className || ''}`}
    >
      {/* Card Header with Badge and Image */}
      <div className="relative p-0">
        {/* Badge Skeleton */}
        <div className="absolute right-2 top-2 z-10">
          <SkeletonBadge className="h-6 w-20" />
        </div>

        {/* Image Skeleton */}
        <div className="flex h-48 items-center justify-center bg-gray-100 dark:bg-gray-900">
          <Skeleton className="h-20 w-20 rounded-md" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col space-y-4 p-6">
        {/* Title Skeleton */}
        <Skeleton className="h-7 w-full" />

        {/* Description Skeleton */}
        <SkeletonText lines={2} className="h-4" />
      </div>

      {/* Card Footer */}
      <div className="flex flex-col space-y-4 border-t border-gray-200 p-6 dark:border-gray-800">
        {/* Stats Row */}
        <div className="flex w-full justify-between">
          {/* Duration */}
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Students Count */}
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        {/* Enroll Button */}
        <SkeletonButton className="w-full h-10" />
      </div>
    </div>
  );
}

// Multiple course cards skeleton for loading grids
export function CourseGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className || ''}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
