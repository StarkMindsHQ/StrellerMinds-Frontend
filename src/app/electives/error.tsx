'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';

interface ElectivesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ElectivesError({ error, reset }: ElectivesErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Electives page error:', error);
  }, [error]);

  return (
    <MainLayout variant="container" padding="medium">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-md mx-auto">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
              <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Something went wrong
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We encountered an error while loading the electives page. This might
            be a temporary issue.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="flex items-center gap-2"
              variant="primary"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-2"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>If the problem persists, please contact support or try:</p>
            <ul className="mt-2 space-y-1">
              <li>• Refreshing the page</li>
              <li>• Clearing your browser cache</li>
              <li>• Checking your internet connection</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
