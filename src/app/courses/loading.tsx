import { CourseGridSkeleton } from '@/components/skeleton';

export default function CoursesLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {/* Page title skeleton */}
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-skeleton rounded-md mb-4"></div>
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 animate-skeleton rounded-md"></div>
      </div>
      
      {/* Course grid skeleton */}
      <CourseGridSkeleton count={6} />
    </main>
  );
} 