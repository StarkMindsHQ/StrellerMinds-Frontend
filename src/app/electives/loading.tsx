import MainLayout from '@/components/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';

export default function ElectivesLoading() {
  return (
    <MainLayout variant="container" padding="medium">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-full max-w-3xl" />
        <Skeleton className="h-6 w-2/3 max-w-2xl mt-2" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Filter Toggle Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Results Summary Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Electives Grid Skeleton */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 h-full min-h-[420px]"
          >
            {/* Image Skeleton */}
            <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
              <div className="absolute right-3 top-3">
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
              <div className="absolute left-3 top-3">
                <Skeleton className="h-7 w-16 rounded-lg" />
              </div>
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-20 w-20 rounded" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-1 flex-col p-6">
              {/* Category Badge */}
              <Skeleton className="h-6 w-24 rounded-md mb-3" />

              {/* Title and Instructor */}
              <div className="mb-3">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Description */}
              <div className="mb-4">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Prerequisites */}
              <div className="mb-4">
                <Skeleton className="h-3 w-20 mb-1" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16 rounded" />
                  <Skeleton className="h-5 w-20 rounded" />
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-12 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-14 rounded-md" />
                </div>
              </div>

              {/* Stats and Button */}
              <div className="mt-auto">
                <div className="flex justify-between border-t border-gray-200 pt-4 dark:border-gray-800 mb-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center space-x-2">
        <Skeleton className="h-9 w-20" />
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-9" />
          ))}
        </div>
        <Skeleton className="h-9 w-16" />
      </div>
    </MainLayout>
  );
}
