import { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard 
} from '@/components/ui/skeleton';

// Individual testimonial skeleton
export function TestimonialCardSkeleton() {
  return (
    <SkeletonCard className="bg-white/95 backdrop-blur-sm border-none rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar section */}
          <div className="flex-shrink-0">
            <div className="relative">
              <SkeletonAvatar size="lg" className="h-16 w-16 md:h-20 md:w-20" />
            </div>
            <div className="hidden md:flex flex-col items-center mt-4 space-y-1">
              {/* Rating stars */}
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-5 rounded-sm" />
              ))}
            </div>
          </div>
          
          {/* Content section */}
          <div className="flex-1">
            {/* Name and title */}
            <div className="mb-4">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            
            {/* Testimonial content */}
            <SkeletonText lines={4} className="h-4 mb-4" />
            
            {/* Achievement badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-20 rounded-full" />
              ))}
            </div>
            
            {/* Course info */}
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-8 w-8 rounded-md" />
              <div>
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            
            {/* Watch demo button */}
            <SkeletonButton className="w-32 h-10" />
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}

// Testimonials section skeleton
export function TestimonialsSkeleton() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <SkeletonText lines={2} className="h-5 max-w-2xl mx-auto" />
        </div>
        
        {/* Carousel controls */}
        <div className="relative max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-8 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          
          {/* Testimonial card */}
          <TestimonialCardSkeleton />
        </div>
      </div>
    </section>
  );
} 