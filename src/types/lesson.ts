export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in seconds
  order: number;
  type: 'video' | 'quiz' | 'assignment';
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lessons: Lesson[];
}

export interface LessonProgress {
  lessonId: string;
  courseId: string;
  completed: boolean;
  watchedSeconds: number;
  totalSeconds: number;
  completedAt?: string;
}

export interface CourseProgressState {
  courseId: string;
  currentLessonId: string;
  completedLessons: string[];
  lessonProgress: Record<string, LessonProgress>;
  overallProgress: number;
}
