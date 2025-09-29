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

interface FeaturedCoursesWithLoadingProps {
  maxCoursesToShow?: number;
  showLoadingDemo?: boolean; // For demonstration purposes
}

export default function FeaturedCoursesWithLoading({
  maxCoursesToShow = 6,
  showLoadingDemo = false,
}: FeaturedCoursesWithLoadingProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const { isLoading, setLoading } = useLoading({ minLoadingTime: 1200 });

  // Simulate data fetching
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);

      // Simulate network delay
      await new Promise((resolve) =>
        setTimeout(resolve, showLoadingDemo ? 2000 : 500),
      );

      // Get courses (in real app, this would be an API call)
      const featuredCourses = allCourses.slice(0, maxCoursesToShow);
      setCourses(featuredCourses);

      setLoading(false);
    };

    fetchCourses();
  }, [maxCoursesToShow, setLoading, showLoadingDemo]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <div className="max-w-2xl mx-auto">
              <SkeletonText lines={2} className="h-5" />
            </div>
          </div>

          {/* Course grid skeleton */}
          <CourseGridSkeleton count={maxCoursesToShow} />
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

// CSS for the fade-in animation (add this to your global CSS)
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
