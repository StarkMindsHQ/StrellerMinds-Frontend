'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CourseProgressState, LessonProgress } from '@/types/lesson';

interface CourseProgressContextType {
  state: CourseProgressState;
  completeLesson: (lessonId: string) => void;
  updateLessonProgress: (lessonId: string, watchedSeconds: number, totalSeconds: number) => void;
  setCurrentLesson: (lessonId: string) => void;
  resetProgress: () => void;
}

const CourseProgressContext = createContext<CourseProgressContextType | undefined>(undefined);

type Action =
  | { type: 'COMPLETE_LESSON'; payload: string }
  | { type: 'UPDATE_LESSON_PROGRESS'; payload: { lessonId: string; watchedSeconds: number; totalSeconds: number } }
  | { type: 'SET_CURRENT_LESSON'; payload: string }
  | { type: 'RESET_PROGRESS' }
  | { type: 'LOAD_PROGRESS'; payload: CourseProgressState };

function courseProgressReducer(state: CourseProgressState, action: Action): CourseProgressState {
  switch (action.type) {
    case 'COMPLETE_LESSON': {
      const lessonId = action.payload;
      const newCompletedLessons = [...state.completedLessons];
      
      if (!newCompletedLessons.includes(lessonId)) {
        newCompletedLessons.push(lessonId);
      }

      const newLessonProgress = {
        ...state.lessonProgress,
        [lessonId]: {
          ...state.lessonProgress[lessonId],
          completed: true,
          completedAt: new Date().toISOString(),
        },
      };

      const overallProgress = (newCompletedLessons.length / 8) * 100; // Assuming 8 total lessons

      return {
        ...state,
        completedLessons: newCompletedLessons,
        lessonProgress: newLessonProgress,
        overallProgress,
      };
    }

    case 'UPDATE_LESSON_PROGRESS': {
      const { lessonId, watchedSeconds, totalSeconds } = action.payload;
      const isCompleted = watchedSeconds >= totalSeconds * 0.9; // 90% watched = completed

      const newLessonProgress = {
        ...state.lessonProgress,
        [lessonId]: {
          lessonId,
          courseId: state.courseId,
          completed: isCompleted,
          watchedSeconds,
          totalSeconds,
          completedAt: isCompleted ? new Date().toISOString() : undefined,
        },
      };

      let newCompletedLessons = [...state.completedLessons];
      if (isCompleted && !newCompletedLessons.includes(lessonId)) {
        newCompletedLessons.push(lessonId);
      }

      const overallProgress = (newCompletedLessons.length / 8) * 100;

      return {
        ...state,
        completedLessons: newCompletedLessons,
        lessonProgress: newLessonProgress,
        overallProgress,
      };
    }

    case 'SET_CURRENT_LESSON':
      return {
        ...state,
        currentLessonId: action.payload,
      };

    case 'RESET_PROGRESS':
      return {
        courseId: state.courseId,
        currentLessonId: 'lesson-1',
        completedLessons: [],
        lessonProgress: {},
        overallProgress: 0,
      };

    case 'LOAD_PROGRESS':
      return action.payload;

    default:
      return state;
  }
}

interface CourseProgressProviderProps {
  children: React.ReactNode;
  courseId: string;
}

export function CourseProgressProvider({ children, courseId }: CourseProgressProviderProps) {
  const initialState: CourseProgressState = {
    courseId,
    currentLessonId: 'lesson-1',
    completedLessons: [],
    lessonProgress: {},
    overallProgress: 0,
  };

  const [state, dispatch] = useReducer(courseProgressReducer, initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`course-progress-${courseId}`);
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        dispatch({ type: 'LOAD_PROGRESS', payload: parsedProgress });
      } catch (error) {
        console.error('Failed to load course progress:', error);
      }
    }
  }, [courseId]);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(`course-progress-${courseId}`, JSON.stringify(state));
  }, [state, courseId]);

  const completeLesson = (lessonId: string) => {
    dispatch({ type: 'COMPLETE_LESSON', payload: lessonId });
  };

  const updateLessonProgress = (lessonId: string, watchedSeconds: number, totalSeconds: number) => {
    dispatch({ 
      type: 'UPDATE_LESSON_PROGRESS', 
      payload: { lessonId, watchedSeconds, totalSeconds } 
    });
  };

  const setCurrentLesson = (lessonId: string) => {
    dispatch({ type: 'SET_CURRENT_LESSON', payload: lessonId });
  };

  const resetProgress = () => {
    dispatch({ type: 'RESET_PROGRESS' });
  };

  return (
    <CourseProgressContext.Provider
      value={{
        state,
        completeLesson,
        updateLessonProgress,
        setCurrentLesson,
        resetProgress,
      }}
    >
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext);
  if (context === undefined) {
    throw new Error('useCourseProgress must be used within a CourseProgressProvider');
  }
  return context;
}