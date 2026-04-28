import { loadProgress } from './storage';
import { VideoProgress } from '@/types/progress';

export interface Lesson {
  id: string;
  title: string;
  order: number;
  videoId?: string;
  isLocked?: boolean;
}

/**
 * Checks if a lesson is locked based on completion of previous lessons
 * @param lessons - Array of lessons in order
 * @param currentLessonId - The lesson to check
 * @returns boolean indicating if the lesson is locked
 */
export function isLessonLocked(lessons: Lesson[], currentLessonId: string): boolean {
  const currentLesson = lessons.find(l => l.id === currentLessonId);
  if (!currentLesson) return true;

  // First lesson is never locked
  if (currentLesson.order === 0) return false;

  // Find the previous lesson
  const previousLesson = lessons.find(l => l.order === currentLesson.order - 1);
  if (!previousLesson) return true;

  // If previous lesson doesn't have a video, it's not locked
  if (!previousLesson.videoId) return false;

  // Check if previous lesson's video is completed
  const progress = loadProgress();
  const videoProgress = progress.videos.find(v => v.lessonId === previousLesson.videoId);
  
  return !videoProgress?.completed;
}

/**
 * Gets all lessons with their lock status
 * @param lessons - Array of lessons in order
 * @returns Array of lessons with lock status
 */
export function getLessonsWithLockStatus(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => ({
    ...lesson,
    isLocked: isLessonLocked(lessons, lesson.id)
  }));
}

/**
 * Gets the next available (unlocked) lesson
 * @param lessons - Array of lessons in order
 * @returns The next unlocked lesson or null if all are locked
 */
export function getNextAvailableLesson(lessons: Lesson[]): Lesson | null {
  const lessonsWithStatus = getLessonsWithLockStatus(lessons);
  return lessonsWithStatus.find(lesson => !lesson.isLocked) || null;
}

/**
 * Checks if a user can access a specific lesson
 * @param lessons - Array of lessons in order  
 * @param lessonId - The lesson to check access for
 * @returns Object with canAccess boolean and reason if locked
 */
export function canAccessLesson(lessons: Lesson[], lessonId: string): {
  canAccess: boolean;
  reason?: string;
} {
  const isLocked = isLessonLocked(lessons, lessonId);
  
  if (isLocked) {
    const lesson = lessons.find(l => l.id === lessonId);
    const previousLesson = lessons.find(l => l.order === (lesson?.order || 0) - 1);
    
    return {
      canAccess: false,
      reason: `Complete "${previousLesson?.title}" before accessing this lesson`
    };
  }
  
  return { canAccess: true };
}

/**
 * Gets completion status for all lessons
 * @param lessons - Array of lessons
 * @returns Array of lesson completion status
 */
export function getLessonCompletionStatus(lessons: Lesson[]): Array<{
  lessonId: string;
  title: string;
  isCompleted: boolean;
  isLocked: boolean;
}> {
  const progress = loadProgress();
  
  return lessons.map(lesson => {
    const videoProgress = lesson.videoId 
      ? progress.videos.find(v => v.lessonId === lesson.videoId)
      : null;
    
    return {
      lessonId: lesson.id,
      title: lesson.title,
      isCompleted: videoProgress?.completed || false,
      isLocked: isLessonLocked(lessons, lesson.id)
    };
  });
}
