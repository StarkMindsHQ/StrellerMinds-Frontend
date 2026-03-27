'use client';

import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { CourseCard, type CourseCardProps } from '@/components/CourseCard';
import { cn } from '@/lib/utils';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
} from '@/components/ui/skeleton';

export interface CourseRecommendationCarouselProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  courses?: CourseCardProps[];
  isLoading?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  className?: string;
  itemClassName?: string;
}

export function CourseRecommendationCarousel({
  title = 'Recommended for You',
  description = 'Courses tailored to your interests and goals.',
  courses = [],
  isLoading = false,
  autoScroll = true,
  autoScrollInterval = 5000,
  className,
  itemClassName,
}: CourseRecommendationCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  // Auto-scroll logic
  useEffect(() => {
    if (!api || !autoScroll || courses.length === 0) return;

    let intervalId: NodeJS.Timeout;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0); // loop back
        }
      }, autoScrollInterval);
    };

    startAutoScroll();

    // Pause on hover or interaction
    const onInteract = () => {
      clearInterval(intervalId);
    };

    const onMouseLeave = () => {
      startAutoScroll();
    };

    const container = api.rootNode();
    if (container) {
      container.addEventListener('mouseenter', onInteract);
      container.addEventListener('mouseleave', onMouseLeave);
      container.addEventListener('touchstart', onInteract, { passive: true });
      container.addEventListener('touchend', onMouseLeave, { passive: true });
    }

    return () => {
      clearInterval(intervalId);
      if (container) {
        container.removeEventListener('mouseenter', onInteract);
        container.removeEventListener('mouseleave', onMouseLeave);
        container.removeEventListener('touchstart', onInteract);
        container.removeEventListener('touchend', onMouseLeave);
      }
    };
  }, [api, autoScroll, autoScrollInterval, courses.length]);

  return (
    <section className={cn('py-8 w-full', className)}>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end px-4 md:px-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="relative w-full px-4 md:px-8">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 py-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem
                  key={`skeleton-${index}`}
                  className={cn(
                    'pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4',
                    itemClassName,
                  )}
                >
                  <CourseCardSkeleton />
                </CarouselItem>
              ))
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <CarouselItem
                  key={course.id}
                  className={cn(
                    'pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4',
                    itemClassName,
                  )}
                >
                  <CourseCard {...course} />
                </CarouselItem>
              ))
            ) : (
              <div className="flex w-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-800 ml-4">
                <p className="text-gray-500 dark:text-gray-400">
                  No courses available at the moment.
                </p>
              </div>
            )}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-4 lg:-left-6" />
            <CarouselNext className="-right-4 lg:-right-6" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="flex h-full min-h-[380px] w-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      {/* Image placeholders */}
      <Skeleton className="h-48 w-full rounded-none" />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 grow space-y-4">
          <SkeletonText lines={1} className="h-6 w-3/4" />
          <SkeletonText lines={1} className="h-6 w-1/2" />

          <Skeleton className="h-4 w-1/3 mt-3" />

          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-4 flex justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
          <SkeletonButton className="w-full h-11 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
