'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Home,
  RefreshCw,
  BookOpen,
  AlertTriangle,
  AlertCircle,
  Search,
} from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CoursesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the courses-specific error
    console.error('Courses error:', error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="bg-[#dfb1cc]/20 dark:bg-[#dfb1cc]/10 rounded-full p-4">
              <BookOpen className="h-16 w-16 text-[#5c0f49] dark:text-[#dfb1cc]" />
            </div>
            <AlertCircle className="absolute -top-1 -right-1 h-8 w-8 text-red-500 bg-white dark:bg-gray-900 rounded-full p-1" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Courses Temporarily Unavailable
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We're experiencing issues loading the courses catalog. Our team is
            working to restore access as quickly as possible.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-[#5c0f49]/5 to-[#dfb1cc]/5 dark:from-[#5c0f49]/10 dark:to-[#dfb1cc]/10 rounded-lg p-4 text-left">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
            While we fix this, you can:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="justify-start h-auto p-3 border-[#dfb1cc]/30 hover:bg-[#dfb1cc]/10"
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="bg-[#5c0f49]/10 p-1.5 rounded">
                  <Home className="h-4 w-4 text-[#5c0f49] dark:text-[#dfb1cc]" />
                </div>
                <span className="text-sm">Visit Dashboard</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="justify-start h-auto p-3 border-[#dfb1cc]/30 hover:bg-[#dfb1cc]/10"
            >
              <Link href="/search" className="flex items-center gap-3">
                <div className="bg-[#5c0f49]/10 p-1.5 rounded">
                  <Search className="h-4 w-4 text-[#5c0f49] dark:text-[#dfb1cc]" />
                </div>
                <span className="text-sm">Search Content</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            onClick={reset}
            className="bg-[#5c0f49] hover:bg-[#4a0c3a] text-white w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Courses
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-[#dfb1cc] text-[#5c0f49] hover:bg-[#dfb1cc]/10 dark:border-[#dfb1cc] dark:text-[#dfb1cc] w-full sm:w-auto"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Status Info */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> This error is isolated to the courses
            section. Other parts of the application should work normally.
          </p>
        </div>

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm">
            <summary className="cursor-pointer font-medium text-red-700 dark:text-red-300 mb-2">
              Debug Information (Development Only)
            </summary>
            <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400 text-xs overflow-auto max-h-32">
              {error.message}
              {error.stack && (
                <>
                  {'\n\nStack trace:'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}

        {/* Additional Help */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Need immediate assistance?{' '}
          <Link
            href="/help"
            className="text-[#5c0f49] dark:text-[#dfb1cc] hover:underline font-medium"
          >
            Visit our help center
          </Link>{' '}
          or{' '}
          <Link
            href="/contact"
            className="text-[#5c0f49] dark:text-[#dfb1cc] hover:underline font-medium"
          >
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
