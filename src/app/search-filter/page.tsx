'use client';

import { useState } from 'react';
import CourseSearchFilter from './CourseSearchFilter';

const mockCategories = ['Web Development', 'Data Science', 'UI/UX'];
const mockDifficulties = ['Beginner', 'Intermediate', 'Advanced'];

export default function Page() {
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    difficulty: '',
  });

  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters);
    console.log('Search Filters:', newFilters);
    // Here you would call the API with filters
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Course Search & Filter Demo</h1>
      <CourseSearchFilter
        onSearch={handleSearch}
        categories={mockCategories}
        difficulties={mockDifficulties}
      />
      <div style={{ marginTop: '16px' }}>
        <p>Current Filters:</p>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </div>
    </div>
  );
}
