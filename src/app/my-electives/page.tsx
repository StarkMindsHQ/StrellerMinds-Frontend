'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  RefreshCw,
  Loader2,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Course, courseService } from '@/services/electiveService';
import { useToast } from '@/contexts/use-toast';

export default function MyElectivesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unenrollingCourses, setUnenrollingCourses] = useState<Set<string>>(
    new Set(),
  );
  const { toast } = useToast();

  const loadEnrolledCourses = async (simulateError = false) => {
    setLoading(true);
    setError(null);

    try {
      const courses = await courseService.getEnrolledCourses({
        simulateDelay: 1000,
        simulateError,
      });
      setEnrolledCourses(courses);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  const handleUnenroll = async (courseId: string, courseTitle: string) => {
    setUnenrollingCourses((prev) => new Set(prev).add(courseId));

    try {
      const result = await courseService.unenrollFromCourse(courseId);

      if (result.success) {
        // Remove the course from the enrolled courses list
        setEnrolledCourses((prev) =>
          prev.filter((course) => course.id !== courseId),
        );

        toast({
          title: 'Unenrollment Successful',
          description: `You have been unenrolled from "${courseTitle}"`,
        });
      } else {
        toast({
          title: 'Unenrollment Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setUnenrollingCourses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading your enrolled courses...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>
          <button
            onClick={() => loadEnrolledCourses()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      );
    }

    if (enrolledCourses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Enrolled Courses
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            You haven&apos;t enrolled in any elective courses yet. Browse our
            available courses to get started!
          </p>
          <Link
            href="/electives"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <GraduationCap className="h-5 w-5 mr-2" />
            Browse Electives
          </Link>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course) => (
          <EnrolledCourseCard
            key={course.id}
            course={course}
            onUnenroll={handleUnenroll}
            isUnenrolling={unenrollingCourses.has(course.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Electives
              </h1>
              <p className="text-gray-600">
                Manage your enrolled elective courses
              </p>
            </div>
            <button
              onClick={() => loadEnrolledCourses()}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </div>

          {!loading && !error && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                {enrolledCourses.length}{' '}
                {enrolledCourses.length === 1 ? 'course' : 'courses'} enrolled
              </p>
            </div>
          )}
        </div>

        {renderContent()}
      </div>
    </MainLayout>
  );
}

interface EnrolledCourseCardProps {
  course: Course;
  onUnenroll: (courseId: string, courseTitle: string) => void;
  isUnenrolling: boolean;
}

function EnrolledCourseCard({
  course,
  onUnenroll,
  isUnenrolling,
}: EnrolledCourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Course Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>
            <span className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-200">
              {course.category}
            </span>
          </div>
        </div>

        {course.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {course.description}
          </p>
        )}

        {/* Course Details */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.creditHours} Credits</span>
          </div>
          {course.instructor && (
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 text-center">👨‍🏫</span>
              <span className="truncate">{course.instructor}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 bg-gray-50">
        <div className="flex gap-3">
          <Link
            href={`/electives/${course.id}`}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            View Details
          </Link>
          <button
            onClick={() => onUnenroll(course.id, course.title)}
            disabled={isUnenrolling}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUnenrolling ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Unenrolling...
              </>
            ) : (
              'Unenroll'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
