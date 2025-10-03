'use client';
import { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Course, courseService } from '@/services/electiveService';
import { CourseCard } from '@/components/electiveCard';

const Electives = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async (simulateError = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await courseService.fetchCourses({
        simulateDelay: 1500,
        simulateError,
      });
      setCourses(response.courses);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const activeCourses = courses.filter((c) => c.isActive);
  const inactiveCourses = courses.filter((c) => !c.isActive);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-purple-800 animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-purple-800 rounded-full animate-ping" />
            </div>
            <p className="mt-6 text-lg font-medium text-gray-600">
              Loading elective courses...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please wait while we fetch the latest data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-100">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Unable to Load Courses
              </h2>
              <p className="text-gray-600 text-center mb-6">{error}</p>
              <button
                onClick={() => loadCourses()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={() => loadCourses(true)}
                className="w-full mt-3 px-6 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Simulate Error (for testing)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#5c0149] rounded-xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Elective Courses
              </h1>
              <p className="text-gray-600 mt-1">
                Explore our diverse selection of elective courses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-800 rounded-full" />
              <span className="text-sm font-medium text-gray-700">
                {activeCourses.length} Active Courses
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span className="text-sm font-medium text-gray-700">
                {inactiveCourses.length} Inactive
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-gray-700">
                {courses.reduce((sum, c) => sum + c.creditHours, 0)} Total
                Credits
              </span>
            </div>
          </div>
        </div>

        {activeCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        {inactiveCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Currently Unavailable
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactiveCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        {courses.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No courses available at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Electives;
