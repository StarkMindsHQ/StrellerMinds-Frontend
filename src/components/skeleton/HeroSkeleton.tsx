import { 
  Skeleton, 
  SkeletonText, 
  SkeletonButton
} from '@/components/ui/skeleton';

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <Skeleton className="h-16 w-full max-w-3xl mx-auto mb-6" />
          
          {/* Subheading */}
          <Skeleton className="h-12 w-3/4 max-w-2xl mx-auto mb-8" />
          
          {/* Description */}
          <div className="max-w-2xl mx-auto mb-10">
            <SkeletonText lines={3} className="h-5" />
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <SkeletonButton className="w-48 h-12" />
            <SkeletonButton className="w-40 h-12" />
          </div>
          
          {/* Stats or badges row */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          
          {/* Hero image/illustration placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <Skeleton className="w-full h-96 rounded-lg" />
          </div>
        </div>
      </div>
      
      {/* Background decoration elements */}
      <div className="absolute top-20 left-20 opacity-20">
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-20">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <div className="absolute top-1/2 left-10 opacity-20">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </section>
  );
}

// Simplified hero skeleton for smaller sections
export function HeroSectionSkeleton() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <Skeleton className="h-12 w-96 mx-auto mb-6 bg-white/20" />
        <div className="max-w-2xl mx-auto mb-8">
          <SkeletonText lines={2} className="h-5 bg-white/20" />
        </div>
        <SkeletonButton className="w-40 h-12 bg-white/20" />
      </div>
    </section>
  );
} 