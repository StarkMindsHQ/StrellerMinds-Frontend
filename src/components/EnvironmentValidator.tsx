'use client';

import { useEffect } from 'react';
import { validateEnvironment } from '@/lib/env';

/**
 * Environment Validator Component
 * Validates environment variables on client-side startup
 * This component should be included early in the app lifecycle
 */
export default function EnvironmentValidator() {
  useEffect(() => {
    // Only validate on client-side
    if (typeof window !== 'undefined') {
      try {
        validateEnvironment();
      } catch (error) {
        console.error('Environment validation failed on client:', error);
        // You could show a user-friendly error message here
        // or redirect to an error page
      }
    }
  }, []);

  // This component doesn't render anything
  return null;
}
