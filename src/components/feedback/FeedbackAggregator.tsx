'use client';
import { useState } from 'react';

const FEEDBACK = [
  {
    id: 1,
    course: 'Python Fundamentals',
    user: 'Aisha K.',
    rating: 5,
    comment:
      'Exceptional explanations — every concept clicked. The exercises were practical and well-paced.',
    date: '2025-06-12',
    category: 'Engineering',
  },
  {
    id: 2,
    course: 'Python Fundamentals',
    user: 'Tobias M.',
    rating: 4,
    comment:
      'Good foundation but the later modules felt rushed. Would love more real-world examples.',
    date: '2025-06-10',
    category: 'Engineering',
  },
  {
    id: 3,
    course: 'Machine Learning Basics',
    user: 'Fatima R.',
    rating: 5,
    comment:
      "Finally an ML course that doesn't assume I'm a PhD! Clear, structured, and motivating.",
    date: '2025-06-09',
    category: 'AI & ML',
  },
  {
    id: 4,
    course: 'UI/UX Design Principles',
    user: 'Carlos N.',
    rating: 3,
    comment:
      'Decent intro but the examples feel outdated. The section on accessibility was too brief.',
    date: '2025-06-08',
    category: 'Design',
  },
  {
    id: 5,
    course: 'Machine Learning Basics',
    user: 'Priya S.',
    rating: 2,
    comment:
      'The math was glossed over too quickly. I needed more depth on gradient descent.',
    date: '2025-06-07',
    category: 'AI & ML',
  },
  {
    id: 6,
    course: 'SQL & Database Design',
    user: 'Jerome L.',
    rating: 5,
    comment:
      "Best SQL course I've taken. The visual query planner section alone was worth it.",
    date: '2025-06-06',
    category: 'Data',
  },
  {
    id: 7,
    course: 'Python Fundamentals',
    user: 'Mei W.',
    rating: 4,
    comment:
      'Great for beginners. Clean video quality and very responsive to questions in the forum.',
    date: '2025-06-05',
    category: 'Engineering',
  },
  {
    id: 8,
    course: 'UI/UX Design Principles',
    user: 'Kofi A.',
    rating: 4,
    comment:
      'The case studies were insightful. Would appreciate more interactive prototyping exercises.',
    date: '2025-06-03',
    category: 'Design',
  },
  {
    id: 9,
    course: 'SQL & Database Design',
    user: 'Yasmin T.',
    rating: 1,
    comment:
      'Disappointed. Skips over indexing entirely and the practice datasets are trivial.',
    date: '2025-06-01',
    category: 'Data',
  },
  {
    id: 10,
    course: 'Cloud Architecture (AWS)',
    user: 'Raj P.',
    rating: 5,
    comment:
      'Outstanding. Hands-on labs with real AWS accounts set this apart from every other cloud course.',
    date: '2025-05-30',
    category: 'Cloud',
  },
];

const STAR_COLORS = {
  5: '#f59e0b',
  4: '#84cc16',
  3: '#94a3b8',
  2: '#f97316',
  1: '#ef4444',
};

function Stars({ rating, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: size,
            color: s <= rating ? STAR_COLORS[rating] : '#e2e8f0',
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function RatingBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}
    >
      <span
        style={{
          fontSize: 12,
          color: '#64748b',
          minWidth: 10,
          textAlign: 'right',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 6,
          background: '#f1f5f9',
          borderRadius: 100,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 100,
            transition: 'width 0.3s',
          }}
        />
      </div>
      <span style={{ fontSize: 12, color: '#94a3b8', minWidth: 22 }}>
        {value}
      </span>
    </div>
  );
}

export default function FeedbackAggregator() {
  const [filterCourse, setFilterCourse] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [sort, setSort] = useState('Newest');

  const courses = [
    'All',
    ...Array.from(new Set(FEEDBACK.map((f) => f.course))),
  ];

  const filtered = FEEDBACK.filter(
    (f) =>
      (filterCourse === 'All' || f.course === filterCourse) &&
      (filterRating === 'All' || f.rating === parseInt(filterRating)),
  ).sort((a, b) => {
    if (sort === 'Newest') return new Date(b.date) - new Date(a.date);
    if (sort === 'Highest') return b.rating - a.rating;
    if (sort === 'Lowest') return a.rating - b.rating;
    return 0;
  });

  const avgRating =
    filtered.length > 0
      ? (filtered.reduce((s, f) => s + f.rating, 0) / filtered.length).toFixed(
          1,
        )
      : '–';
  const dist = [5, 4, 3, 2, 1].map((r) => ({
    r,
    count: filtered.filter((f) => f.rating === r).length,
  }));

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        maxWidth: 680,
        margin: '0 auto',
        padding: '2rem 1rem',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:ital,wght@0,700;1,700&display=swap');
        .fb-select { border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; font-size: 13px; outline: none; font-family: inherit; color: #334155; cursor: pointer; background: #fff; }
        .fb-select:focus { border-color: #6366f1; }
        .fb-chip { padding: 6px 14px; border-radius: 100px; font-size: 13px; cursor: pointer; border: 1.5px solid #e2e8f0; background: #fff; color: #64748b; transition: all 0.15s; font-family: inherit; }
        .fb-chip.active { background: #0f172a; color: #fff; border-color: #0f172a; }
        .fb-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; transition: border-color 0.15s; }
        .fb-card:hover { border-color: #94a3b8; }
      `}</style>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 26,
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 4px',
            letterSpacing: '-0.3px',
          }}
        >
          Student Feedback
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
          Aggregated ratings and comments across your course catalog.
        </p>
      </div>

      {/* Summary row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 20,
          background: '#f8fafc',
          borderRadius: 14,
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 90,
          }}
        >
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 52,
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1,
            }}
          >
            {avgRating}
          </div>
          <Stars rating={Math.round(parseFloat(avgRating))} size={16} />
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
            {filtered.length} review{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {dist.map(({ r, count }) => (
            <RatingBar
              key={r}
              label={r}
              value={count}
              total={filtered.length}
              color={STAR_COLORS[r]}
            />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: '1.25rem',
          alignItems: 'center',
        }}
      >
        <select
          className="fb-select"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
        >
          {courses.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['All', '5', '4', '3', '2', '1'].map((r) => (
            <button
              key={r}
              className={`fb-chip${filterRating === r ? ' active' : ''}`}
              onClick={() => setFilterRating(r)}
            >
              {r === 'All' ? 'All Ratings' : `${r}★`}
            </button>
          ))}
        </div>
        <select
          className="fb-select"
          style={{ marginLeft: 'auto' }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {['Newest', 'Highest', 'Lowest'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <p
            style={{
              color: '#94a3b8',
              textAlign: 'center',
              padding: '2rem',
              fontSize: 14,
            }}
          >
            No feedback matches your filters.
          </p>
        )}
        {filtered.map((f) => (
          <div key={f.id} className="fb-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 8,
                gap: 10,
              }}
            >
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}
                >
                  {f.user}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#6366f1',
                    fontWeight: 500,
                    marginTop: 1,
                  }}
                >
                  {f.course}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 3,
                }}
              >
                <Stars rating={f.rating} />
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  {new Date(f.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <p
              style={{
                color: '#334155',
                fontSize: 14,
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              {f.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
