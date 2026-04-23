'use client';
import { useState } from 'react';

const DIFFICULTY_CONFIG = {
  Beginner: {
    color: '#16a34a',
    bg: '#dcfce7',
    border: '#bbf7d0',
    icon: '◐',
    desc: 'No prior knowledge needed',
  },
  Intermediate: {
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a',
    icon: '◕',
    desc: 'Some experience recommended',
  },
  Advanced: {
    color: '#dc2626',
    bg: '#fee2e2',
    border: '#fecaca',
    icon: '●',
    desc: 'Strong foundations required',
  },
  Expert: {
    color: '#7c3aed',
    bg: '#ede9fe',
    border: '#ddd6fe',
    icon: '◉',
    desc: 'Professional-level knowledge',
  },
};

const CATEGORY_COLORS = {
  Engineering: '#3b82f6',
  'AI & ML': '#8b5cf6',
  Design: '#ec4899',
  Data: '#10b981',
  Cloud: '#f97316',
  Business: '#eab308',
};

const INITIAL_COURSES = [
  {
    id: 1,
    title: 'Python Fundamentals',
    category: 'Engineering',
    duration: '12h',
    students: 1204,
    difficulty: 'Beginner',
    auto: true,
  },
  {
    id: 2,
    title: 'Data Structures & Algorithms',
    category: 'Engineering',
    duration: '18h',
    students: 843,
    difficulty: 'Intermediate',
    auto: true,
  },
  {
    id: 3,
    title: 'Machine Learning Basics',
    category: 'AI & ML',
    duration: '20h',
    students: 672,
    difficulty: 'Intermediate',
    auto: true,
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    category: 'Design',
    duration: '10h',
    students: 988,
    difficulty: 'Beginner',
    auto: false,
  },
  {
    id: 5,
    title: 'SQL & Database Design',
    category: 'Data',
    duration: '8h',
    students: 1101,
    difficulty: 'Beginner',
    auto: true,
  },
  {
    id: 6,
    title: 'Cloud Architecture (AWS)',
    category: 'Cloud',
    duration: '15h',
    students: 512,
    difficulty: 'Advanced',
    auto: false,
  },
  {
    id: 7,
    title: 'React Advanced Patterns',
    category: 'Engineering',
    duration: '14h',
    students: 378,
    difficulty: 'Advanced',
    auto: true,
  },
  {
    id: 8,
    title: 'Deep Learning with TensorFlow',
    category: 'AI & ML',
    duration: '24h',
    students: 201,
    difficulty: 'Expert',
    auto: false,
  },
  {
    id: 9,
    title: 'Product Management 101',
    category: 'Business',
    duration: '9h',
    students: 756,
    difficulty: 'Beginner',
    auto: true,
  },
  {
    id: 10,
    title: 'Figma for Developers',
    category: 'Design',
    duration: '6h',
    students: 634,
    difficulty: 'Beginner',
    auto: true,
  },
];

function DifficultyBadge({ level, size = 'md' }) {
  const cfg = DIFFICULTY_CONFIG[level];
  const pad = size === 'sm' ? '3px 9px' : '5px 12px';
  const fs = size === 'sm' ? 11 : 12;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: pad,
        borderRadius: 100,
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontSize: fs,
        fontWeight: 500,
      }}
    >
      <span style={{ fontSize: 10 }}>{cfg.icon}</span>
      {level}
    </span>
  );
}

export default function DifficultyTagger() {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [filter, setFilter] = useState('All');
  const [editing, setEditing] = useState(null);
  const [retagging, setRetagging] = useState(false);
  const [saved, setSaved] = useState(false);

  const levels = ['All', ...Object.keys(DIFFICULTY_CONFIG)];

  const filtered =
    filter === 'All' ? courses : courses.filter((c) => c.difficulty === filter);

  const setDifficulty = (id, level) => {
    setCourses(
      courses.map((c) =>
        c.id === id ? { ...c, difficulty: level, auto: false } : c,
      ),
    );
    setEditing(null);
  };

  const autoRetag = () => {
    setRetagging(true);
    setTimeout(() => {
      setCourses(
        courses.map((c) => {
          const hrs = parseInt(c.duration);
          const students = c.students;
          let difficulty = 'Beginner';
          if (hrs >= 20 && students < 400) difficulty = 'Expert';
          else if (hrs >= 15 || students < 600) difficulty = 'Advanced';
          else if (hrs >= 10) difficulty = 'Intermediate';
          return { ...c, difficulty, auto: true };
        }),
      );
      setRetagging(false);
    }, 1200);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const countByLevel = Object.keys(DIFFICULTY_CONFIG).reduce((acc, l) => {
    acc[l] = courses.filter((c) => c.difficulty === l).length;
    return acc;
  }, {});

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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@700&display=swap');
        .dt-row { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; transition: border-color 0.15s; cursor: default; }
        .dt-row:hover { border-color: #94a3b8; }
        .dt-filter-btn { padding: 7px 16px; border-radius: 100px; font-size: 13px; cursor: pointer; border: 1.5px solid #e2e8f0; background: #fff; color: #64748b; transition: all 0.15s; font-family: inherit; }
        .dt-filter-btn.active { background: #0f172a; color: #fff; border-color: #0f172a; }
        .dt-level-btn { padding: 6px 14px; border-radius: 8px; font-size: 13px; cursor: pointer; border: 1.5px solid; font-family: inherit; font-weight: 500; transition: opacity 0.15s; }
        .dt-level-btn:hover { opacity: 0.8; }
        .dt-action-btn { border: none; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: opacity 0.15s; }
        .dt-action-btn:hover { opacity: 0.85; }
        .dt-stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; text-align: center; }
        .edit-dropdown { position: absolute; top: calc(100% + 4px); right: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); z-index: 10; padding: 6px; min-width: 160px; }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 4px',
            }}
          >
            Difficulty Tags
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Assign and manage difficulty levels across your courses.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="dt-action-btn"
            style={{ background: '#f1f5f9', color: '#334155' }}
            onClick={autoRetag}
            disabled={retagging}
          >
            {retagging ? '⟳ Retagging…' : 'Auto-tag All'}
          </button>
          <button
            className="dt-action-btn"
            style={{ background: '#0f172a', color: '#fff' }}
            onClick={handleSave}
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          marginBottom: '1.5rem',
        }}
      >
        {Object.entries(DIFFICULTY_CONFIG).map(([level, cfg]) => (
          <div
            key={level}
            className="dt-stat-card"
            style={{ borderColor: cfg.border }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: cfg.color,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {countByLevel[level]}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              {level}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        {levels.map((l) => (
          <button
            key={l}
            className={`dt-filter-btn${filter === l ? ' active' : ''}`}
            onClick={() => setFilter(l)}
          >
            {l === 'All'
              ? `All (${courses.length})`
              : `${l} (${countByLevel[l]})`}
          </button>
        ))}
      </div>

      {/* Course rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((course) => {
          const catColor = CATEGORY_COLORS[course.category] || '#6366f1';
          const isEditing = editing === course.id;
          return (
            <div key={course.id} className="dt-row">
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}
                  >
                    {course.title}
                  </span>
                  {course.auto && (
                    <span
                      style={{
                        fontSize: 10,
                        color: '#94a3b8',
                        background: '#f1f5f9',
                        padding: '2px 7px',
                        borderRadius: 100,
                      }}
                    >
                      auto
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 4,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{ fontSize: 11, color: catColor, fontWeight: 500 }}
                  >
                    {course.category}
                  </span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>·</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    {course.duration}
                  </span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>·</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    {course.students.toLocaleString()} students
                  </span>
                </div>
              </div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <DifficultyBadge level={course.difficulty} />
                <button
                  onClick={() => setEditing(isEditing ? null : course.id)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: 6,
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: '#334155',
                    fontFamily: 'inherit',
                  }}
                >
                  Edit
                </button>
                {isEditing && (
                  <div className="edit-dropdown">
                    {Object.entries(DIFFICULTY_CONFIG).map(([level, cfg]) => (
                      <button
                        key={level}
                        className="dt-level-btn"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          width: '100%',
                          marginBottom: 4,
                          background:
                            course.difficulty === level
                              ? cfg.bg
                              : 'transparent',
                          color: cfg.color,
                          borderColor:
                            course.difficulty === level
                              ? cfg.border
                              : 'transparent',
                        }}
                        onClick={() => setDifficulty(course.id, level)}
                      >
                        <span>{cfg.icon}</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: 13 }}>{level}</div>
                          <div
                            style={{
                              fontSize: 11,
                              opacity: 0.7,
                              fontWeight: 400,
                            }}
                          >
                            {cfg.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
