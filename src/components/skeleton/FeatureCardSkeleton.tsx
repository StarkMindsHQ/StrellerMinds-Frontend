import { 
  Skeleton, 
  SkeletonText
} from '@/components/ui/skeleton';

// Individual feature card skeleton
export function FeatureCardSkeleton() {
  return (
    <div className="block relative h-full min-h-[200px] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 m-3 shadow-sm transition-transform duration-300 hover:transform hover:-translate-y-1">
      {/* Icon skeleton */}
      <div className="flex justify-center mb-6">
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      
      {/* Title skeleton */}
      <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
      
      {/* Description skeleton */}
      <div className="text-center">
        <SkeletonText lines={3} className="h-4" />
      </div>
      
      {/* Corner decoration skeleton */}
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
        <Skeleton className="w-full h-full rounded-bl-lg" />
      </div>
    </div>
  );
}

// Feature cards grid skeleton
export function FeatureCardsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-9 w-64 mx-auto" />
        </div>
        
        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: count }).map((_, index) => (
            <FeatureCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
} 