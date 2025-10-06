'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { ElectiveCourseCard } from '@/components/ElectiveCourseCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/contexts/use-toast';
import { EnrollmentAnalyticsWidget } from '@/components/admin/EnrollmentAnalyticsWidget';
import { useEnrollmentAnalytics } from '@/hooks/useEnrollmentAnalytics';
import {
  electiveCourses as initialElectiveCourses,
  mockDeleteElectiveCourse,
  type ElectiveCourseData,
} from '@/lib/elective-course-data';

export default function AdminElectiveCoursesPage() {
  const [courses, setCourses] = useState<ElectiveCourseData[]>(
    initialElectiveCourses,
  );
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useEnrollmentAnalytics();

  const handleDeleteCourse = async (courseId: string) => {
    try {
      // Call mock delete function
      const result = await mockDeleteElectiveCourse(courseId);

      if (result.success) {
        // Remove course from the list
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId),
        );

        // Show success toast
        toast({
          title: 'Course Deleted',
          description: result.message,
          variant: 'default',
        });
      } else {
        throw new Error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the course. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout variant="container" padding="medium">
      {/* Header Section */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Elective Courses
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Manage elective courses for your platform
            </p>
          </div>

          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
            disabled
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Course
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <EnrollmentAnalyticsWidget
          data={analytics}
          isLoading={isAnalyticsLoading}
          error={analyticsError}
          onRetry={refetchAnalytics}
        />
      </div>

      {/* Admin Notice */}
      <div className="mb-6 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Admin Panel:</strong> You can delete elective courses by
          clicking the trash icon on each card. This is a mock implementation
          until the API is ready.
        </p>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {courses.map((course) => (
            <ElectiveCourseCard
              key={course.id}
              {...course}
              variant="default"
              showFeatures={true}
              maxFeaturesDisplay={4}
              showDeleteButton={true}
              onDelete={handleDeleteCourse}
              className="transition-transform duration-300 hover:scale-[1.02]"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-800 p-8">
            <svg
              className="h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Elective Courses
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            All elective courses have been deleted. Add a new course to get
            started.
          </p>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
            disabled
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Course
          </Button>
        </div>
      )}
    </MainLayout>
  );
}
