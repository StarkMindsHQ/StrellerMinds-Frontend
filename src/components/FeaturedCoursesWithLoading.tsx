'use client';

import { useState, useEffect } from 'react';
import {
  CourseGridSkeleton,
  SkeletonText,
  Skeleton,
} from '@/components/skeleton';
import { useLoading } from '@/hooks/useLoading';
import { CourseCard } from '@/components/CourseCard';
import { allCourses } from '@/lib/course-data';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedCoursesWithLoadingProps {
  maxCoursesToShow?: number;
  showLoadingDemo?: boolean;
}

export default function FeaturedCoursesWithLoading({
  maxCoursesToShow = 6,
  showLoadingDemo = false,
}: FeaturedCoursesWithLoadingProps) {
  const [courses, setCourses] = useState<typeof allCourses>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call like:
      // const response = await fetch('/api/courses/featured');
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const featuredCourses = await response.json();

      if (showLoadingDemo && Math.random() < 0.1) {
        throw new Error('Failed to fetch courses. Please try again.');
      }
      const featuredCourses = allCourses.slice(0, maxCoursesToShow);
      setCourses(featuredCourses);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [maxCoursesToShow, showLoadingDemo]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <div className="max-w-2xl mx-auto">
              <SkeletonText lines={2} className="h-5" />
            </div>
          </div>
          <CourseGridSkeleton count={maxCoursesToShow} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Unable to Load Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <Button
              onClick={fetchCourses}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Featured Courses
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Discover our most popular courses designed to advance your
            blockchain development skills
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CourseCard {...course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
