'use client';

import React, { useMemo, useState } from 'react';
import { TrendingDown, Info } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LessonDataPoint {
  lessonId: string;
  label: string;
  /** Number of learners who reached this lesson */
  reached: number;
  /** Number of learners who completed this lesson */
  completed: number;
}

export interface CourseDropOffData {
  courseId: string;
  courseTitle: string;
  lessons: LessonDataPoint[];
}

export interface DropOffDetectionGraphProps {
  /** One or more courses to visualise */
  courses: CourseDropOffData[];
  /** Percentage drop that triggers "significant drop-off" highlight */
  dropOffThreshold?: number;
  className?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function computeDropOff(lessons: LessonDataPoint[]) {
  return lessons.map((lesson, i) => {
    const prev = i === 0 ? lesson.reached : lessons[i - 1].completed;
    const dropCount = prev - lesson.reached;
    const dropPct = prev > 0 ? (dropCount / prev) * 100 : 0;
    const completionPct = lesson.reached > 0 ? (lesson.completed / lesson.reached) * 100 : 0;
    return { ...lesson, dropCount, dropPct, completionPct, prev };
  });
}

const COURSE_COLOURS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// ── Bar ────────────────────────────────────────────────────────────────────────

function LessonBar({
  lesson,
  maxReached,
  colour,
  isDropOff,
  threshold,
  onHover,
  hovered,
}: {
  lesson: ReturnType<typeof computeDropOff>[0];
  maxReached: number;
  colour: string;
  isDropOff: boolean;
  threshold: number;
  onHover: (id: string | null) => void;
  hovered: boolean;
}) {
  const barH = maxReached > 0 ? (lesson.reached / maxReached) * 100 : 0;

  return (
    <div
      className="flex flex-col items-center gap-1 flex-1 min-w-0 relative cursor-pointer"
      onMouseEnter={() => onHover(lesson.lessonId)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap pointer-events-none border border-gray-700">
          <p className="font-semibold mb-0.5">{lesson.label}</p>
          <p>Reached: <span className="text-blue-300">{lesson.reached.toLocaleString()}</span></p>
          <p>Completed: <span className="text-green-300">{lesson.completed.toLocaleString()}</span></p>
          <p>Completion: <span className="text-yellow-300">{lesson.completionPct.toFixed(1)}%</span></p>
          {lesson.dropPct > 0 && (
            <p>Drop-in: <span className="text-red-400">{lesson.dropPct.toFixed(1)}%</span></p>
          )}
        </div>
      )}

      {/* Bar stack */}
      <div className="w-full flex flex-col justify-end" style={{ height: 120 }}>
        <div
          className="w-full rounded-t transition-all duration-500 relative"
          style={{ height: `${barH}%`, backgroundColor: colour, opacity: hovered ? 1 : 0.85 }}
        >
          {/* Completion fill */}
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t"
            style={{
              height: `${lesson.completionPct}%`,
              backgroundColor: isDropOff ? '#ef4444' : '#10b981',
              opacity: 0.4,
            }}
          />
        </div>
      </div>

      {/* Drop-off indicator */}
      {isDropOff && (
        <TrendingDown className="w-3.5 h-3.5 text-red-400" aria-label="Significant drop-off" />
      )}

      {/* Label */}
      <p className="text-xs text-gray-400 truncate w-full text-center px-1">{lesson.label}</p>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * DropOffDetectionGraph — Issue #345
 *
 * Highlights where students stop progressing within a course.
 * Shows completion bars per lesson, marks significant drop-off points,
 * displays the percentage of users leaving each lesson, and supports
 * comparison across multiple courses.
 */
export default function DropOffDetectionGraph({
  courses,
  dropOffThreshold = 20,
  className = '',
}: DropOffDetectionGraphProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.courseId ?? '');
  const [hoveredLesson, setHoveredLesson] = useState<string | null>(null);

  const course = useMemo(
    () => courses.find(c => c.courseId === selectedCourse) ?? courses[0],
    [courses, selectedCourse],
  );

  const analysed = useMemo(() => (course ? computeDropOff(course.lessons) : []), [course]);
  const maxReached = useMemo(() => Math.max(...analysed.map(l => l.reached), 1), [analysed]);

  const worstDrop = useMemo(
    () => analysed.reduce((a, b) => (b.dropPct > a.dropPct ? b : a), analysed[0]),
    [analysed],
  );

  if (!course) return <p className="text-gray-400">No course data provided.</p>;

  return (
    <div className={`rounded-xl bg-gray-900 text-white p-5 space-y-4 ${className}`} data-testid="drop-off-graph">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-base">Drop-off Detection</h2>
          <p className="text-xs text-gray-400 mt-0.5">Where students stop progressing</p>
        </div>

        {/* Course selector */}
        {courses.length > 1 && (
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
            aria-label="Select course"
          >
            {courses.map((c, i) => (
              <option key={c.courseId} value={c.courseId} style={{ color: COURSE_COLOURS[i % COURSE_COLOURS.length] }}>
                {c.courseTitle}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Insight callout */}
      {worstDrop && worstDrop.dropPct >= dropOffThreshold && (
        <div className="flex items-start gap-2 bg-red-950/50 border border-red-800 rounded-lg px-3 py-2 text-sm">
          <Info className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p>
            Highest drop-off at <strong className="text-red-300">{worstDrop.label}</strong>{' '}
            — <span className="text-red-300">{worstDrop.dropPct.toFixed(1)}%</span> of students
            didn't reach this lesson.
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-500 opacity-85 inline-block" /> Reached</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500 opacity-40 inline-block" /> Completed</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500 opacity-40 inline-block" /> Drop-off zone</span>
      </div>

      {/* Bars */}
      <div className="flex gap-1.5 items-end overflow-x-auto pb-1">
        {analysed.map((lesson, i) => (
          <LessonBar
            key={lesson.lessonId}
            lesson={lesson}
            maxReached={maxReached}
            colour={COURSE_COLOURS[courses.indexOf(course) % COURSE_COLOURS.length]}
            isDropOff={lesson.dropPct >= dropOffThreshold}
            threshold={dropOffThreshold}
            onHover={setHoveredLesson}
            hovered={hoveredLesson === lesson.lessonId}
          />
        ))}
      </div>

      {/* Table summary */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-gray-700 text-gray-500">
              <th className="pb-1 pr-4">Lesson</th>
              <th className="pb-1 pr-4 text-right">Reached</th>
              <th className="pb-1 pr-4 text-right">Completed</th>
              <th className="pb-1 text-right">Drop-off %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {analysed.map(l => (
              <tr key={l.lessonId} className={l.dropPct >= dropOffThreshold ? 'text-red-300' : 'text-gray-300'}>
                <td className="py-1 pr-4 truncate max-w-[120px]">{l.label}</td>
                <td className="py-1 pr-4 text-right tabular-nums">{l.reached.toLocaleString()}</td>
                <td className="py-1 pr-4 text-right tabular-nums">{l.completed.toLocaleString()}</td>
                <td className="py-1 text-right tabular-nums">
                  {l.dropPct > 0 ? `${l.dropPct.toFixed(1)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
