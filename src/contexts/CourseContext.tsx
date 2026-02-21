"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { mockCourse } from "@/data/mockCourse";
import { Lesson } from "@/types/course";


interface CourseContextType {
  lessons: Lesson[];
  activeLessonId: string;
  completedLessons: string[];
  setActiveLesson: (id: string) => void;
  isLessonLocked: (id: string) => boolean;
  getProgress: () => number;
  markLessonComplete: (id: string) => void;
}

const CourseContext = createContext<CourseContextType | null>(null);

const STORAGE_KEY = "course_progress";

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const lessons = mockCourse.lessons;

  const [activeLessonId, setActiveLessonId] = useState(
    lessons[0]?.id ?? ""
  );

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // 🔄 Restore progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setActiveLessonId(parsed.activeLessonId ?? lessons[0]?.id ?? "");
      setCompletedLessons(parsed.completedLessons ?? []);
    } catch {
      // corrupted storage safeguard
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [lessons]);

  // 💾 Persist progress
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ activeLessonId, completedLessons })
    );
  }, [activeLessonId, completedLessons]);

  // 🔐 Sequential Lock Logic
  const isLessonLocked = (id: string) => {
    const lessonIndex = lessons.findIndex(
      (lesson) => lesson.id === id
    );

    if (lessonIndex <= 0) return false;

    const previousLesson = lessons[lessonIndex - 1];
    return !completedLessons.includes(previousLesson.id);
  };

  // 📍 Set Active Lesson (Guarded)
  const setActiveLesson = (id: string) => {
    if (isLessonLocked(id)) return;
    setActiveLessonId(id);
  };

  // ✅ Complete Lesson + Auto Advance
  const markLessonComplete = (id: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });

    const currentIndex = lessons.findIndex(
      (lesson) => lesson.id === id
    );

    const nextLesson = lessons[currentIndex + 1];

    if (nextLesson && !isLessonLocked(nextLesson.id)) {
      setActiveLessonId(nextLesson.id);
    }
  };

  const resetProgress = () => {
  setCompletedLessons([]);
  setActiveLessonId(lessons[0]?.id ?? "");
  localStorage.removeItem(STORAGE_KEY);
};


  // 📊 Dynamic Progress
  const getProgress = () => {
    if (!lessons.length) return 0;
    return Math.round(
      (completedLessons.length / lessons.length) * 100
    );
  };

  const value: CourseContextType = useMemo(
    () => ({
      lessons,
      activeLessonId,
      completedLessons,
      setActiveLesson,
      markLessonComplete,
      isLessonLocked,
      getProgress,
    }),
    [lessons, activeLessonId, completedLessons]
  );

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within CourseProvider");
  }
  return context;
};
