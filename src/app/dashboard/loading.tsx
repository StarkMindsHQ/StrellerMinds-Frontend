import { DashboardSkeleton } from '@/components/skeleton';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar skeleton */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 animate-skeleton rounded-md"></div>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1 bg-white dark:bg-gray-950">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center px-2 py-2 text-sm rounded-md"
                  >
                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 animate-skeleton rounded-sm mr-3"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 animate-skeleton rounded-md"></div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1">
          {/* Header skeleton */}
          <header className="bg-white dark:bg-gray-950 shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-skeleton rounded-md"></div>
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 animate-skeleton rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 animate-skeleton rounded-full"></div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <DashboardSkeleton />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
