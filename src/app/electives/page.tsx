'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { ElectiveCard } from '@/components/ElectiveCard';
import { ElectiveFilters } from '@/components/ElectiveFilters';
import { ElectivePagination } from '@/components/ElectivePagination';
import { allElectives } from '@/lib/electives-data';
import { Course, courseService } from '@/services/electiveService';

const ITEMS_PER_PAGE = 6;

export default function ElectivesPage() {
  const searchParams = useSearchParams();

  // Filter states - initialize with empty values to avoid hydration mismatch
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCreditHours, setSelectedCreditHours] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // New developer features: Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  // Load courses from service (new developer feature)
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

  // Initialize data loading and URL params after hydration
  useEffect(() => {
    loadCourses();
    if (searchParams) {
      setSearchTerm(searchParams.get('search') || '');
      setSelectedCategory(searchParams.get('category') || '');
      setSelectedCreditHours(searchParams.get('credits') || '');
      setSelectedLevel(searchParams.get('level') || '');
      setCurrentPage(parseInt(searchParams.get('page') || '1'));
    }
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();

    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCreditHours) params.set('credits', selectedCreditHours);
    if (selectedLevel) params.set('level', selectedLevel);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/electives?${queryString}` : '/electives';

    // Update URL without causing a page reload
    window.history.replaceState({}, '', newUrl);
  }, [
    searchTerm,
    selectedCategory,
    selectedCreditHours,
    selectedLevel,
    currentPage,
  ]);

  // Combine original electives data with service data for comprehensive filtering
  const combinedElectives = useMemo(() => {
    return [
      ...allElectives,
      ...courses.map((course) => ({
        id: course.id,
        name: course.title,
        description: course.description || '',
        category: course.category,
        creditHours: course.creditHours,
        instructor: course.instructor || '',
        level: 'Intermediate' as 'Intermediate' | 'Beginner' | 'Advanced', // Default level for service courses
        duration: '12 weeks',
        prerequisites: [],
        studentsEnrolled: 0,
        rating: 4.5,
        reviewCount: 0,
        imageUrl: '/images/electives/default.jpg',
        tags: [course.category.toLowerCase()],
        dateAdded: new Date().toISOString(),
        popularity: 0,
        isActive: course.isActive,
      })),
    ];
  }, [courses]);

  // Statistics for active/inactive courses (new developer feature)
  const activeCourses = combinedElectives.filter((course) => course.isActive);
  const inactiveCourses = combinedElectives.filter(
    (course) => !course.isActive,
  );
  const totalCredits = combinedElectives.reduce(
    (sum, course) => sum + course.creditHours,
    0,
  );

  // Filtered and paginated data with useMemo optimization
  const { filteredElectives, totalPages, totalResults } = useMemo(() => {
    let filtered = combinedElectives.filter((elective) => elective.isActive);

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (elective) =>
          elective.name.toLowerCase().includes(searchLower) ||
          elective.description.toLowerCase().includes(searchLower) ||
          elective.instructor.toLowerCase().includes(searchLower) ||
          elective.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(
        (elective) => elective.category === selectedCategory,
      );
    }

    // Apply credit hours filter
    if (selectedCreditHours && selectedCreditHours !== 'all') {
      if (selectedCreditHours === '5+') {
        filtered = filtered.filter((elective) => elective.creditHours >= 5);
      } else {
        const credits = parseInt(selectedCreditHours);
        filtered = filtered.filter(
          (elective) => elective.creditHours === credits,
        );
      }
    }

    // Apply level filter
    if (selectedLevel && selectedLevel !== 'all') {
      filtered = filtered.filter(
        (elective) => elective.level === selectedLevel,
      );
    }

    const totalResults = filtered.length;
    const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

    // Apply pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedElectives = filtered.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );

    return {
      filteredElectives: paginatedElectives,
      totalPages,
      totalResults,
    };
  }, [
    combinedElectives,
    searchTerm,
    selectedCategory,
    selectedCreditHours,
    selectedLevel,
    currentPage,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedCreditHours, selectedLevel]);

  const handleFilterChange = {
    search: (value: string) => setSearchTerm(value),
    category: (value: string) => setSelectedCategory(value),
    creditHours: (value: string) => setSelectedCreditHours(value),
    level: (value: string) => setSelectedLevel(value),
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes (only on client side)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCreditHours('');
    setSelectedLevel('');
    setCurrentPage(1);
  };

  // Loading state (new developer feature)
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

  // Error state (new developer feature)
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
    <MainLayout variant="container" padding="medium">
      {/* Statistics Display (new developer feature) */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
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
              {totalCredits} Total Credits
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-[#5c0f49] mb-4 ">
          Elective Courses
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Explore our diverse collection of elective courses to enhance your
          blockchain education. Filter by category, credit hours, or search for
          specific topics to find the perfect electives for your learning
          journey.
        </p>
      </div>

      {/* Filters Section */}
      <ElectiveFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedCreditHours={selectedCreditHours}
        selectedLevel={selectedLevel}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        totalResults={totalResults}
      />

      {/* Results Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredElectives.length} of {totalResults} electives
            {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>
      </div>

      {/* Electives Grid */}
      {filteredElectives.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {filteredElectives.map((elective) => (
            <ElectiveCard
              key={elective.id}
              course={elective}
              className="transition-transform duration-300 hover:scale-[1.02]"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No electives found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or clearing the filters to see
              more results.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <ElectivePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Active/Inactive Course Separation (new developer feature) */}
      {inactiveCourses.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Currently Unavailable Courses
            </h2>
            <p className="text-gray-600">
              These courses are temporarily unavailable but may be offered in
              future semesters.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {inactiveCourses.map((elective) => (
              <div key={elective.id} className="relative">
                <ElectiveCard
                  course={elective}
                  className="opacity-60 transition-opacity duration-300 hover:opacity-80"
                />
                <div className="absolute top-4 right-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Unavailable
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
