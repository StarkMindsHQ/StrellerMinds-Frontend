'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Number with gradient */}
        <div className="relative">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#5c0f49] to-[#dfb1cc] bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-[#5c0f49]/10 dark:text-[#dfb1cc]/10 -z-10 blur-sm">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild className="bg-[#5c0f49] hover:bg-[#4a0c3a] text-white">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-[#dfb1cc] text-[#5c0f49] hover:bg-[#dfb1cc]/10 dark:border-[#dfb1cc] dark:text-[#dfb1cc]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Decorative Element */}
        <div className="flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-[#5c0f49] to-[#dfb1cc] rounded-full"></div>
        </div>

        {/* Additional Help Text */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          If you think this is a mistake, please{' '}
          <Link 
            href="/contact" 
            className="text-[#5c0f49] dark:text-[#dfb1cc] hover:underline font-medium"
          >
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
} 