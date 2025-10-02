'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { ElectiveCard } from '@/components/ElectiveCard';
import { ElectiveFilters } from '@/components/ElectiveFilters';
import { ElectivePagination } from '@/components/ElectivePagination';
import { allElectives } from '@/lib/electives-data';

const ITEMS_PER_PAGE = 6;

export default function ElectivesPage() {
  const searchParams = useSearchParams();

  // Filter states - initialize with empty values to avoid hydration mismatch
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCreditHours, setSelectedCreditHours] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize state from URL params after hydration
  useEffect(() => {
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

  // Filtered and paginated data with useMemo optimization
  const { filteredElectives, totalPages, totalResults } = useMemo(() => {
    let filtered = allElectives.filter((elective) => elective.isActive);

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

  return (
    <MainLayout variant="container" padding="medium">
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
              {...elective}
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
    </MainLayout>
  );
}
