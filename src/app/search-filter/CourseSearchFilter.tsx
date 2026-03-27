'use client';

import { useState, useEffect } from 'react';

type CourseSearchFilterProps = {
  onSearch: (filters: {
    keyword: string;
    category: string;
    difficulty: string;
  }) => void;
  categories: string[];
  difficulties: string[];
};

export default function CourseSearchFilter({
  onSearch,
  categories,
  difficulties,
}: CourseSearchFilterProps) {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  // Debounce keyword input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({ keyword, category, difficulty });
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [keyword, category, difficulty, onSearch]);

  const clearFilters = () => {
    setKeyword('');
    setCategory('');
    setDifficulty('');
  };

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Search courses..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="">All Levels</option>
        {difficulties.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <button onClick={clearFilters}>Clear</button>
    </div>
  );
}
