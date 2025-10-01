'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#5c0f49] to-[#dfb1cc] bg-clip-text text-transparent">
            500
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-[#5c0f49]/10 dark:text-[#dfb1cc]/10 -z-10 blur-sm">
            500
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Server Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Oops! Something went wrong on our end. We&apos;re working to fix
            this issue. Please try again in a few moments.
          </p>
        </div>

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

        <div className="flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-[#5c0f49] to-[#dfb1cc] rounded-full"></div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If this problem persists, please{' '}
            <Link
              href="/contact"
              className="text-[#5c0f49] dark:text-[#dfb1cc] hover:underline font-medium"
            >
              contact our support team
            </Link>{' '}
            and we&apos;ll help you resolve this issue.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Error ID: {error.digest || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}
