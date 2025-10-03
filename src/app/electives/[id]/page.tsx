'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  User,
  Tag,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Course, courseService, MOCK_STUDENT } from '@/services/electiveService';

import { useToast } from '@/contexts/use-toast';

const CourseDetail = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const router = useRouter();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const loadCourse = async (simulateError = false) => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await courseService.fetchCourseById(id, {
        simulateDelay: 1000,
        simulateError,
      });

      if (data) {
        setCourse(data);
        // Mock checking enrollment status
        setIsEnrolled(MOCK_STUDENT.enrolledCourses.has(id));
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!id) return;

    setIsEnrolling(true);
    try {
      const result = await courseService.enrollInCourse(id);
      if (result.success) {
        setIsEnrolled(true);
        toast({
          title: 'Enrollment Successful',
          description: result.message,
          variant: 'success',
        });
      } else {
        toast({
          title: 'Enrollment Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Enrollment Error',
        description:
          err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  // ------------------- Loading State -------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-[#5c0149] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-[#ffcc09] animate-spin" />
          <p className="mt-6 text-lg font-medium text-[#ffcc09]">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  // ------------------- Error State -------------------
  if (error) {
    return (
      <div className="min-h-screen bg-[#5c0149] text-[#ffcc09] flex items-center justify-center px-6">
        <div className="bg-[#5c0149] border-2 border-[#ffcc09] rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-[#ffcc09] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unable to Load Course</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => loadCourse()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#ffcc09] text-[#5c0149] font-semibold rounded-lg hover:opacity-90 transition"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={() => router.push('/electives')}
            className="mt-4 w-full text-[#ffcc09] underline"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // ------------------- Not Found State -------------------
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#5c0149] text-[#ffcc09] flex items-center justify-center px-6">
        <div className="bg-[#5c0149] border-2 border-[#ffcc09] rounded-2xl p-8 max-w-md w-full text-center">
          <BookOpen className="w-12 h-12 text-[#ffcc09] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/electives')}
            className="px-6 py-3 bg-[#ffcc09] text-[#5c0149] font-semibold rounded-lg hover:opacity-90 transition"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  // ------------------- Success State -------------------
  return (
    <div className="min-h-screen  text-[#ffcc09]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.push('/electives')}
          className="mb-8 flex items-center gap-2 text-[#ffcc09] hover:opacity-80 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Courses</span>
        </button>

        <div className="bg-[#5c0149] border-2 border-[#ffcc09] rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

          {course.instructor && (
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-[#ffcc09]" />
              <span className="text-lg">{course.instructor}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3 p-4 border border-[#ffcc09] rounded-lg">
              <Tag className="w-6 h-6 text-[#ffcc09]" />
              <div>
                <p className="text-sm">Category</p>
                <p className="text-lg font-semibold">{course.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border border-[#ffcc09] rounded-lg">
              <Clock className="w-6 h-6 text-[#ffcc09]" />
              <div>
                <p className="text-sm">Credit Hours</p>
                <p className="text-lg font-semibold">
                  {course.creditHours} Credits
                </p>
              </div>
            </div>
          </div>

          {course.description && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#ffcc09]" />
                Course Description
              </h2>
              <p className="leading-relaxed text-lg">{course.description}</p>
            </div>
          )}

          <div className="pt-6 border-t border-[#ffcc09]">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleEnroll}
                className="flex-1 px-6 py-3 bg-[#ffcc09] text-[#5c0149] font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!course.isActive || isEnrolled || isEnrolling}
              >
                {isEnrolling ? (
                  <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                ) : isEnrolled ? (
                  'Already Enrolled'
                ) : course.isActive ? (
                  'Enroll Now'
                ) : (
                  'Currently Unavailable'
                )}
              </button>
              <button className="flex-1 px-6 py-3 border border-[#ffcc09] text-[#ffcc09] font-semibold rounded-lg hover:bg-[#ffcc09] hover:text-[#5c0149] transition">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
