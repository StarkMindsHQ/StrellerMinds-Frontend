'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUniqueCategories } from '@/lib/electives-data';
import { cn } from '@/lib/utils';

interface ElectiveFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedCreditHours: string;
  selectedLevel: string;
  onFilterChange: {
    search: (value: string) => void;
    category: (value: string) => void;
    creditHours: (value: string) => void;
    level: (value: string) => void;
  };
  onClearFilters: () => void;
  totalResults: number;
}

export function ElectiveFilters({
  searchTerm,
  selectedCategory,
  selectedCreditHours,
  selectedLevel,
  onFilterChange,
  onClearFilters,
  totalResults,
}: ElectiveFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange.search(debouncedSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, onFilterChange]);

  // Update local search state when prop changes (e.g., from URL)
  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, [searchTerm]);

  const categories = getUniqueCategories();
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const creditOptions = [
    { value: '1', label: '1 Credit' },
    { value: '2', label: '2 Credits' },
    { value: '3', label: '3 Credits' },
    { value: '4', label: '4 Credits' },
    { value: '5+', label: '5+ Credits' },
  ];

  const hasActiveFilters =
    selectedCategory || selectedCreditHours || selectedLevel || searchTerm;

  const handleClearSearch = () => {
    setDebouncedSearchTerm('');
    onFilterChange.search('');
  };

  return (
    <div className="mb-8">
      {/* Search Bar - Always Visible */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search electives by name, instructor, or tags..."
            value={debouncedSearchTerm}
            onChange={(e) => setDebouncedSearchTerm(e.target.value)}
            className="pl-10 pr-10 border-2 border-[#5c0f49]"
            aria-label="Search electives"
            maxLength={100}
          />
          {debouncedSearchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {hasActiveFilters && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              {
                [selectedCategory, selectedCreditHours, selectedLevel].filter(
                  Boolean,
                ).length
              }
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-[#5c0f49]"
          >
            <RotateCcw className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Expandable Filters */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 p-4 bg-gray-50 dark:bg-[#5c0f49] rounded-lg border border-gray-200 dark:border-gray-800">
          {/* Category Filter */}
          <div className="space-y-2 text-white">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <Select
              value={selectedCategory || 'all'}
              onValueChange={(value) =>
                onFilterChange.category(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="border-2 border-[#5c0f49] bg-[#5c0f49]">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-white"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Credit Hours Filter */}
          <div className="space-y-2 text-white">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Credit Hours
            </label>
            <Select
              value={selectedCreditHours || 'all'}
              onValueChange={(value) =>
                onFilterChange.creditHours(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Credits" />
              </SelectTrigger>
              <SelectContent className="border-2 border-[#5c0f49] bg-[#5c0f49]">
                <SelectItem value="all">Any Credits</SelectItem>
                {creditOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level Filter */}
          <div className="space-y-2 text-white">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty Level
            </label>
            <Select
              value={selectedLevel || 'all'}
              onValueChange={(value) =>
                onFilterChange.level(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent className="border-2 border-[#5c0f49] bg-[#5c0f49] text-white">
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level} className="text-white">
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm font-medium text-black dark:text-gray-300">
            Active filters:
          </span>

          {searchTerm && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-[#5c0f49] dark:bg-blue-900/100 dark:text-blue-300">
              Search: &ldquo;{searchTerm}&rdquo;
              <button
                onClick={handleClearSearch}
                className="ml-1 hover:text-blue-600 dark:hover:text-[#5c0f49]"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900/100 dark:text-green-300">
              Category: {selectedCategory}
              <button
                onClick={() => onFilterChange.category('')}
                className="ml-1 hover:text-green-600 dark:hover:text-green-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedCreditHours && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800 dark:bg-purple-900/100 dark:text-purple-300">
              Credits:{' '}
              {selectedCreditHours === '5+'
                ? '5+ Credits'
                : `${selectedCreditHours} Credit${selectedCreditHours === '1' ? '' : 's'}`}
              <button
                onClick={() => onFilterChange.creditHours('')}
                className="ml-1 hover:text-purple-600 dark:hover:text-purple-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedLevel && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800 dark:bg-orange-900/100 dark:text-orange-300">
              Level: {selectedLevel}
              <button
                onClick={() => onFilterChange.level('')}
                className="ml-1 hover:text-orange-600 dark:hover:text-orange-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {totalResults === 0
          ? 'No electives match your current filters.'
          : `Found ${totalResults} elective${totalResults === 1 ? '' : 's'} matching your criteria.`}
      </div>
    </div>
  );
}
