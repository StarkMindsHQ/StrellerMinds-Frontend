'use client';
import { useState } from 'react';

const AVAILABLE_COURSES = [
  {
    id: 1,
    title: 'Python Fundamentals',
    category: 'Engineering',
    duration: '12h',
  },
  {
    id: 2,
    title: 'Data Structures & Algorithms',
    category: 'Engineering',
    duration: '18h',
  },
  {
    id: 3,
    title: 'Machine Learning Basics',
    category: 'AI & ML',
    duration: '20h',
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    category: 'Design',
    duration: '10h',
  },
  { id: 5, title: 'SQL & Database Design', category: 'Data', duration: '8h' },
  {
    id: 6,
    title: 'Cloud Architecture (AWS)',
    category: 'Cloud',
    duration: '15h',
  },
  {
    id: 7,
    title: 'React Advanced Patterns',
    category: 'Engineering',
    duration: '14h',
  },
  {
    id: 8,
    title: 'Product Management 101',
    category: 'Business',
    duration: '9h',
  },
  {
    id: 9,
    title: 'Deep Learning with TensorFlow',
    category: 'AI & ML',
    duration: '24h',
  },
  { id: 10, title: 'Figma for Developers', category: 'Design', duration: '6h' },
];

const CATEGORY_COLORS = {
  Engineering: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'AI & ML': { bg: '#faf5ff', text: '#7c3aed', border: '#ddd6fe' },
  Design: { bg: '#fdf4ff', text: '#a21caf', border: '#f5d0fe' },
  Data: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  Cloud: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  Business: { bg: '#fefce8', text: '#a16207', border: '#fde68a' },
};

let pathId = 1;

export default function LearningPaths() {
  const [paths, setPaths] = useState([
    {
      id: pathId++,
      name: 'Backend Engineer Track',
      courses: [
        AVAILABLE_COURSES[0],
        AVAILABLE_COURSES[1],
        AVAILABLE_COURSES[4],
      ],
      assignees: ['All Students'],
    },
  ]);
  const [activePath, setActivePath] = useState(paths[0].id);
  const [newPathName, setNewPathName] = useState('');
  const [assignInput, setAssignInput] = useState('');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);

  const currentPath = paths.find((p) => p.id === activePath);

  const addPath = () => {
    if (!newPathName.trim()) return;
    const np = {
      id: pathId++,
      name: newPathName.trim(),
      courses: [],
      assignees: [],
    };
    setPaths([...paths, np]);
    setActivePath(np.id);
    setNewPathName('');
  };

  const removePath = (id) => {
    const remaining = paths.filter((p) => p.id !== id);
    setPaths(remaining);
    if (activePath === id && remaining.length > 0)
      setActivePath(remaining[0].id);
  };

  const addCourse = (course) => {
    if (currentPath.courses.find((c) => c.id === course.id)) return;
    setPaths(
      paths.map((p) =>
        p.id === activePath ? { ...p, courses: [...p.courses, course] } : p,
      ),
    );
  };

  const removeCourse = (courseId) => {
    setPaths(
      paths.map((p) =>
        p.id === activePath
          ? { ...p, courses: p.courses.filter((c) => c.id !== courseId) }
          : p,
      ),
    );
  };

  const moveCourse = (idx, dir) => {
    const c = [...currentPath.courses];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= c.length) return;
    [c[idx], c[swapIdx]] = [c[swapIdx], c[idx]];
    setPaths(
      paths.map((p) => (p.id === activePath ? { ...p, courses: c } : p)),
    );
  };

  const addAssignee = () => {
    if (!assignInput.trim()) return;
    setPaths(
      paths.map((p) =>
        p.id === activePath
          ? {
              ...p,
              assignees: [...new Set([...p.assignees, assignInput.trim()])],
            }
          : p,
      ),
    );
    setAssignInput('');
  };

  const removeAssignee = (a) => {
    setPaths(
      paths.map((p) =>
        p.id === activePath
          ? { ...p, assignees: p.assignees.filter((x) => x !== a) }
          : p,
      ),
    );
  };

  const savePath = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const filteredCourses = AVAILABLE_COURSES.filter(
    (c) =>
      !currentPath?.courses.find((x) => x.id === c.id) &&
      c.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalHours =
    currentPath?.courses.reduce((sum, c) => sum + parseInt(c.duration), 0) || 0;

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        maxWidth: 720,
        margin: '0 auto',
        padding: '2rem 1rem',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700&display=swap');
        .lp-tab { padding: 8px 16px; border-radius: 8px; font-size: 14px; cursor: pointer; border: 1.5px solid transparent; transition: all 0.15s; font-family: inherit; background: transparent; color: #64748b; white-space: nowrap; }
        .lp-tab.active { background: #0f172a; color: #fff; }
        .lp-tab:hover:not(.active) { background: #f1f5f9; color: #334155; }
        .lp-remove { background: transparent; border: none; cursor: pointer; color: #94a3b8; padding: 2px 6px; border-radius: 4px; font-size: 16px; line-height: 1; }
        .lp-remove:hover { color: #ef4444; background: #fef2f2; }
        .lp-course-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; }
        .lp-add-btn { background: transparent; border: 1.5px dashed #cbd5e1; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #64748b; cursor: pointer; width: 100%; font-family: inherit; transition: all 0.15s; }
        .lp-add-btn:hover { background: #f8fafc; border-color: #6366f1; color: #6366f1; }
        .lp-input { border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; font-size: 14px; outline: none; font-family: inherit; }
        .lp-input:focus { border-color: #6366f1; }
        .lp-save-btn { background: #0f172a; color: #fff; border: none; border-radius: 10px; padding: 11px 24px; font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.15s; font-family: inherit; }
        .lp-save-btn:hover { opacity: 0.85; }
        .arrow-btn { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 3px 8px; cursor: pointer; color: #475569; font-size: 12px; }
        .arrow-btn:hover { background: #e2e8f0; }
      `}</style>

      <div style={{ marginBottom: '1.75rem' }}>
        <h1
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 4px',
            letterSpacing: '-0.5px',
          }}
        >
          Learning Paths
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
          Create structured journeys across your course catalog.
        </p>
      </div>

      {/* Path tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          marginBottom: '1.5rem',
          alignItems: 'center',
        }}
      >
        {paths.map((p) => (
          <div
            key={p.id}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <button
              className={`lp-tab${activePath === p.id ? ' active' : ''}`}
              onClick={() => setActivePath(p.id)}
            >
              {p.name}
            </button>
            {paths.length > 1 && (
              <button
                className="lp-remove"
                onClick={() => removePath(p.id)}
                title="Remove path"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <div
          style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexShrink: 0 }}
        >
          <input
            className="lp-input"
            placeholder="New path name…"
            value={newPathName}
            onChange={(e) => setNewPathName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPath()}
            style={{ width: 160 }}
          />
          <button
            className="lp-save-btn"
            style={{ padding: '9px 16px' }}
            onClick={addPath}
          >
            + Add
          </button>
        </div>
      </div>

      {currentPath && (
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
        >
          {/* Left: path editor */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                Course Order
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                {currentPath.courses.length} courses · {totalHours}h total
              </span>
            </div>

            {currentPath.courses.length === 0 && (
              <div
                style={{
                  border: '1.5px dashed #e2e8f0',
                  borderRadius: 10,
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#94a3b8',
                  fontSize: 14,
                }}
              >
                Add courses from the catalog →
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginBottom: 12,
              }}
            >
              {currentPath.courses.map((c, i) => {
                const col =
                  CATEGORY_COLORS[c.category] || CATEGORY_COLORS.Engineering;
                return (
                  <div key={c.id} className="lp-course-row">
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: 12,
                        minWidth: 20,
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {c.title}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 6,
                          marginTop: 2,
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            padding: '2px 7px',
                            borderRadius: 100,
                            background: col.bg,
                            color: col.text,
                            border: `1px solid ${col.border}`,
                          }}
                        >
                          {c.category}
                        </span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                          {c.duration}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="arrow-btn"
                        onClick={() => moveCourse(i, -1)}
                        disabled={i === 0}
                      >
                        ↑
                      </button>
                      <button
                        className="arrow-btn"
                        onClick={() => moveCourse(i, 1)}
                        disabled={i === currentPath.courses.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        className="lp-remove"
                        onClick={() => removeCourse(c.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Assignees */}
            <div
              style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: 14,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: 8,
                }}
              >
                Assign to
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                {currentPath.assignees.map((a) => (
                  <span
                    key={a}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#f1f5f9',
                      color: '#334155',
                      padding: '4px 10px',
                      borderRadius: 100,
                      fontSize: 13,
                    }}
                  >
                    {a}{' '}
                    <span
                      style={{
                        cursor: 'pointer',
                        color: '#94a3b8',
                        fontSize: 14,
                      }}
                      onClick={() => removeAssignee(a)}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="lp-input"
                  placeholder="Group or user…"
                  value={assignInput}
                  onChange={(e) => setAssignInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAssignee()}
                  style={{ flex: 1 }}
                />
                <button
                  className="lp-save-btn"
                  style={{ padding: '9px 14px' }}
                  onClick={addAssignee}
                >
                  Assign
                </button>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <button
                className="lp-save-btn"
                style={{ width: '100%' }}
                onClick={savePath}
              >
                {saved ? '✓ Path Saved' : 'Save Path'}
              </button>
            </div>
          </div>

          {/* Right: course catalog */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
                marginBottom: 8,
              }}
            >
              Course Catalog
            </div>
            <input
              className="lp-input"
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: 10,
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                maxHeight: 420,
                overflowY: 'auto',
              }}
            >
              {filteredCourses.map((c) => {
                const col =
                  CATEGORY_COLORS[c.category] || CATEGORY_COLORS.Engineering;
                return (
                  <button
                    key={c.id}
                    className="lp-add-btn"
                    style={{ textAlign: 'left', padding: '10px 12px' }}
                    onClick={() => addCourse(c)}
                  >
                    <div
                      style={{
                        fontWeight: 500,
                        color: '#0f172a',
                        fontSize: 13,
                      }}
                    >
                      {c.title}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: 6,
                        marginTop: 3,
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          padding: '2px 7px',
                          borderRadius: 100,
                          background: col.bg,
                          color: col.text,
                          border: `1px solid ${col.border}`,
                        }}
                      >
                        {c.category}
                      </span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        {c.duration}
                      </span>
                    </div>
                  </button>
                );
              })}
              {filteredCourses.length === 0 && (
                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: 13,
                    textAlign: 'center',
                    margin: '1rem 0',
                  }}
                >
                  All courses added!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
