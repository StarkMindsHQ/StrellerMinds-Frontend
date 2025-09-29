import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
} from '@/components/ui/skeleton';

// Stats card skeleton (for metrics like courses completed, certificates earned)
export function DashboardStatsCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <SkeletonText className="h-4 w-32" />
        <Skeleton className="h-4 w-4 rounded-sm" />
      </div>
      <div>
        <Skeleton className="h-8 w-16 mb-1" />
        <SkeletonText className="h-3 w-24" />
      </div>
    </SkeletonCard>
  );
}

// Progress card skeleton (for course progress)
export function DashboardProgressCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <SkeletonText className="h-5 w-40" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <SkeletonText lines={2} className="h-3" />
      </div>
    </SkeletonCard>
  );
}

// Activity/Events card skeleton
export function DashboardActivityCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="space-y-4">
        <div>
          <SkeletonText className="h-6 w-48" />
          <SkeletonText className="h-4 w-64 mt-1" />
        </div>

        <div className="space-y-4">
          {/* Activity items */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <Skeleton className="rounded-full p-1.5 h-8 w-8 mt-1" />
              <div className="flex-1">
                <SkeletonText className="h-4 w-56" />
                <SkeletonText className="h-3 w-32 mt-1" />
              </div>
            </div>
          ))}
        </div>

        <SkeletonButton className="w-full" />
      </div>
    </SkeletonCard>
  );
}

// Recommendations card skeleton
export function DashboardRecommendationsCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="space-y-4">
        <div>
          <SkeletonText className="h-6 w-44" />
          <SkeletonText className="h-4 w-52 mt-1" />
        </div>

        <div className="space-y-4">
          {/* Recommendation items */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-md" />
              <div className="flex-1 min-w-0">
                <SkeletonText className="h-4 w-48" />
                <SkeletonText className="h-3 w-32 mt-1" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>

        <SkeletonButton className="w-full" />
      </div>
    </SkeletonCard>
  );
}

// Community activity card skeleton
export function DashboardCommunityCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="space-y-4">
        <div>
          <SkeletonText className="h-6 w-40" />
          <SkeletonText className="h-4 w-56 mt-1" />
        </div>

        <div className="space-y-4">
          {/* Community activity items */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start gap-2">
                <SkeletonAvatar size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <SkeletonText className="h-4 w-24" />
                    <SkeletonText className="h-3 w-12" />
                  </div>
                  <SkeletonText className="h-4 w-64" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <SkeletonButton className="w-full" />
      </div>
    </SkeletonCard>
  );
}

// Full dashboard skeleton layout
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <DashboardStatsCardSkeleton key={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardProgressCardSkeleton />
        <DashboardActivityCardSkeleton />
        <DashboardRecommendationsCardSkeleton />
        <DashboardCommunityCardSkeleton />
      </div>
    </div>
  );
}
