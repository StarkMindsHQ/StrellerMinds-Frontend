'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { PlaceholderSVG } from '@/components/PlaceholderSVG';
import { DeleteCourseDialog } from '@/components/DeleteCourseDialog';
import { toast } from '@/contexts/use-toast';
import {
  getElectiveCourseById,
  mockDeleteElectiveCourse,
} from '@/lib/elective-course-data';

export default function ElectiveCourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = (params?.id as string) || '';

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const course = getElectiveCourseById(courseId);

  if (!course) {
    return (
      <MainLayout variant="container" padding="medium">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The elective course you&apos;re looking for doesn&apos;t exist or
            has been deleted.
          </p>
          <Link href="/dashboard/admin/elective-courses">
            <Button>Back to Elective Courses</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    try {
      const result = await mockDeleteElectiveCourse(courseId);

      if (result.success) {
        toast({
          title: 'Course Deleted',
          description: result.message,
          variant: 'default',
        });

        // Redirect to list page after successful deletion
        setTimeout(() => {
          router.push('/dashboard/admin/elective-courses');
        }, 1000);
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
      setIsDeleting(false);
    }
  };

  const getLevelColor = () => {
    switch (course.level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <MainLayout variant="container" padding="medium">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/dashboard/admin/elective-courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Elective Courses
        </Link>
      </div>

      {/* Course Header */}
      <div className="mb-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
        {/* Course Image */}
        <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-800">
          {course.imageUrl.startsWith('/images') ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <PlaceholderSVG />
          )}
        </div>

        {/* Course Info */}
        <div className="p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getLevelColor()}`}
                >
                  {course.level}
                </span>
                <span className="rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-semibold text-purple-800 dark:text-purple-200">
                  Elective Course
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {course.title}
              </h1>

              {course.instructor && (
                <p className="text-lg text-blue-600 dark:text-blue-400 mb-4 font-medium">
                  Instructor: {course.instructor}
                </p>
              )}

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {course.durationHours} hours
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {course.studentsCount.toLocaleString()} students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {course.rating.toFixed(1)} rating
                  </span>
                </div>
              </div>

              {/* Price */}
              {course.price && (
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    ${course.price}
                  </span>
                  {course.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${course.originalPrice}
                    </span>
                  )}
                  {course.originalPrice && (
                    <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs font-semibold text-green-800 dark:text-green-200">
                      Save ${(course.originalPrice - course.price).toFixed(0)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Admin Actions */}
            <div className="flex flex-col gap-3 lg:ml-6">
              <Button
                variant="destructive"
                size="lg"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Course
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Features Section */}
          {course.features && course.features.length > 0 && (
            <div className="mb-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                What You&apos;ll Learn
              </h2>
              <ul className="space-y-3">
                {course.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags Section */}
          {course.tags && course.tags.length > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Course Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Course Information
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">
                  Category
                </dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  {course.category}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">
                  Level
                </dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  {course.level}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">
                  Duration
                </dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  {course.durationHours} hours
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">
                  Enrolled Students
                </dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  {course.studentsCount.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">
                  Course Type
                </dt>
                <dd className="text-gray-900 dark:text-gray-100">Elective</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteCourseDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        courseTitle={course.title}
        onConfirm={handleDeleteCourse}
        isDeleting={isDeleting}
      />
    </MainLayout>
  );
}
