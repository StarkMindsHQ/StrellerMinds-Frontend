import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonCard,
} from '@/components/ui/skeleton';

// Code editor skeleton
export function CodeEditorSkeleton() {
  return (
    <SkeletonCard className="mb-6">
      <div className="pb-3">
        <div className="flex justify-between items-center">
          <SkeletonText className="h-6 w-32" />
          <Skeleton className="h-8 w-40 rounded-md" />
        </div>
      </div>
      <div className="space-y-2">
        {/* Simulated code lines */}
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="flex">
            <Skeleton className="h-5 w-6 mr-4" /> {/* Line numbers */}
            <Skeleton
              className={`h-5 ${
                index % 4 === 0
                  ? 'w-1/4'
                  : index % 3 === 0
                    ? 'w-3/4'
                    : index % 2 === 0
                      ? 'w-1/2'
                      : 'w-2/3'
              }`}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <SkeletonButton className="w-24" />
      </div>
    </SkeletonCard>
  );
}

// Output panel skeleton
export function OutputPanelSkeleton() {
  return (
    <SkeletonCard>
      <div className="space-y-4">
        <SkeletonText className="h-6 w-24" />
        <div className="min-h-[200px] bg-gray-50 dark:bg-gray-900 rounded-md p-4">
          <SkeletonText lines={6} className="h-4" />
        </div>
      </div>
    </SkeletonCard>
  );
}

// Saved snippets skeleton
export function SavedSnippetsSkeleton() {
  return (
    <SkeletonCard>
      <div className="space-y-4">
        <div>
          <SkeletonText className="h-6 w-40" />
          <SkeletonText className="h-4 w-64 mt-1" />
        </div>

        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <SkeletonButton className="w-12 h-8" />
                <SkeletonButton className="w-8 h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonCard>
  );
}

// Save code form skeleton
export function SaveCodeFormSkeleton() {
  return (
    <SkeletonCard>
      <div className="space-y-4">
        <div>
          <SkeletonText className="h-6 w-24" />
          <SkeletonText className="h-4 w-48 mt-1" />
        </div>

        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <SkeletonButton className="w-full" />
        </div>
      </div>
    </SkeletonCard>
  );
}

// Documentation panel skeleton
export function DocumentationPanelSkeleton() {
  return (
    <SkeletonCard>
      <div className="space-y-4">
        <SkeletonText className="h-6 w-32" />

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <SkeletonText lines={2} className="h-3" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonCard>
  );
}

// Template selector skeleton
export function TemplateSelectorSkeleton() {
  return <Skeleton className="h-10 w-40 rounded-md" />;
}

// Full code playground skeleton
export function CodePlaygroundSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <Skeleton className="h-10 w-80 mx-auto mb-4" />
        <SkeletonText lines={2} className="h-4 max-w-2xl mx-auto" />
      </div>

      {/* Tabs skeleton */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 rounded-md" />
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CodeEditorSkeleton />
          <OutputPanelSkeleton />
        </div>

        <div className="space-y-6">
          {/* Tabs for saved/save */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>

          <SavedSnippetsSkeleton />
          <DocumentationPanelSkeleton />
        </div>
      </div>
    </div>
  );
}
