'use client';
import React from 'react';
import { useAnalyticsConsent } from '../hooks/useAnalyticsConsent';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield } from 'lucide-react';

export default function CookieBanner() {
  const { showBanner, dntEnabled, acceptConsent, rejectConsent } =
    useAnalyticsConsent();

  // Don't render anything if DNT is enabled or banner shouldn't show
  if (dntEnabled || !showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              {/* Gradient Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-purple-950/20 dark:via-gray-900 dark:to-blue-950/20" />

              <div className="relative px-6 py-5 md:px-8 md:py-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* Content */}
                  <div className="flex flex-1 items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600">
                        <Cookie className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        🍪 Cookie & Analytics Preferences
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        We use privacy-friendly analytics to improve your learning
                        experience. Your data is never sold or shared with third
                        parties. You can change your preferences anytime.
                      </p>
                      
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <Shield className="h-4 w-4" />
                        <span>Privacy-first • GDPR Compliant • No tracking cookies</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 sm:flex-row md:flex-shrink-0">
                    <button
                      onClick={rejectConsent}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
                    >
                      Reject
                    </button>
                    <button
                      onClick={acceptConsent}
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Accept Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}