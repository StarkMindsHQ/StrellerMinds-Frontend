'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

export default function MyElectivesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('My Electives page error:', error);
  }, [error]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Electives
          </h1>
          <p className="text-gray-600">Manage your enrolled elective courses</p>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-6" />

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>

          <p className="text-gray-600 mb-8 max-w-md">
            We encountered an error while loading your enrolled courses. This
            could be a temporary issue.
          </p>

          <div className="flex gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </button>

            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </a>
          </div>

          {error.digest && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-500">
                Error ID:{' '}
                <code className="font-mono text-xs">{error.digest}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
