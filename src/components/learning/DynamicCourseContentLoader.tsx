'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  AlertTriangle,
  ChevronRight,
  Play,
  RefreshCcw,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useDynamicCourseContent } from '@/hooks/useDynamicCourseContent';
import { LessonContent } from './LessonContent';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Lesson } from '@/types/lesson';

export interface DynamicCourseContentLoaderProps {
  courseId: string;
  lessonId?: string;
  nextLessonId?: string;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  className?: string;
}

/**
 * DynamicCourseContentLoader Component
 * Responsively loads lesson content as user navigates, minimizing JS initial payload.
 * Supports predictive prefetching to eliminate wait times for the next module.
 */
export const DynamicCourseContentLoader: React.FC<
  DynamicCourseContentLoaderProps
> = ({
  courseId,
  lessonId,
  nextLessonId,
  onComplete,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
  className,
}: DynamicCourseContentLoaderProps) => {
  const { lesson, isLoading, error, refetch, prefetchNextLesson } =
    useDynamicCourseContent({
      courseId,
      lessonId,
    });

  const [hasStartedPrefetch, setHasStartedPrefetch] = useState(false);

  // Auto-prefetch when current lesson is ready
  useEffect(() => {
    if (lesson && nextLessonId && !hasStartedPrefetch) {
      prefetchNextLesson(nextLessonId);
      setHasStartedPrefetch(true);
    }
  }, [lesson, nextLessonId, prefetchNextLesson, hasStartedPrefetch]);

  // Reset prefetch state on lesson change
  useEffect(() => {
    setHasStartedPrefetch(false);
  }, [lessonId]);

  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center p-12 text-center rounded-2xl border bg-background space-y-4',
          className,
        )}
      >
        <div className="p-4 bg-rose-100 dark:bg-rose-900/20 text-rose-600 rounded-full animate-pulse">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Failed to load content</h3>
          <p className="text-muted-foreground text-sm max-w-[280px]">
            This might be due to a poor connection or missing data on our end.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full min-h-[400px]', className)}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-slate-50/30 dark:bg-slate-900/10 rounded-xl overflow-hidden"
          >
            {/* Loading Header Skeleton */}
            <div className="p-6 border-b border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin opacity-50" />
                  <span className="text-xs font-mono opacity-50 uppercase tracking-widest animate-pulse">
                    Streaming Data...
                  </span>
                </div>
              </div>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Loading Content Skeleton */}
            <div className="flex-1 p-6 relative">
              <div className="max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-full" />
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                  <div className="p-5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4 max-w-4xl mx-auto opacity-30">
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>

            {/* Loading Strategy Overlay */}
            <div className="absolute bottom-12 right-12 z-10 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-4 rounded-2xl border shadow-2xl"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                    Optimization Engine
                  </div>
                  <div className="text-sm font-semibold">
                    Dynamic Bundling Active
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          lesson && (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full"
            >
              {/* Actual Content Wrapper with Optimizer Badge if next is prefetched */}
              {hasStartedPrefetch && (
                <div className="absolute top-4 right-4 z-50 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full backdrop-blur-sm"
                  >
                    <Zap className="h-3 w-3 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      Next Module Cached
                    </span>
                  </motion.div>
                </div>
              )}

              <LessonContent
                lesson={lesson}
                onComplete={onComplete}
                onNext={onNext}
                onPrevious={onPrevious}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
              />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};
