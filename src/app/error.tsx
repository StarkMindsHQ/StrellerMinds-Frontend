'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon with gradient */}
        <div className="relative flex justify-center">
          <div className="relative">
            <AlertTriangle className="h-24 w-24 text-[#5c0f49] dark:text-[#dfb1cc]" />
            <div className="absolute inset-0 h-24 w-24 text-[#5c0f49]/20 dark:text-[#dfb1cc]/20 blur-sm">
              <AlertTriangle className="h-24 w-24" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            We encountered an unexpected error. Don't worry, our team has been
            notified and we're working on fixing it.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
              <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Details (Development)
              </summary>
              <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400 text-xs overflow-auto">
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
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={reset}
            className="bg-[#5c0f49] hover:bg-[#4a0c3a] text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-[#dfb1cc] text-[#5c0f49] hover:bg-[#dfb1cc]/10 dark:border-[#dfb1cc] dark:text-[#dfb1cc]"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Decorative Element */}
        <div className="flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-[#5c0f49] to-[#dfb1cc] rounded-full"></div>
        </div>

        {/* Additional Help Text */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          If this problem persists, please{' '}
          <Link
            href="/contact"
            className="text-[#5c0f49] dark:text-[#dfb1cc] hover:underline font-medium"
          >
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
