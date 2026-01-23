import { CourseProgress } from '@/types/progress';

const STORAGE_KEY = 'course_progress';

export function loadProgress(): CourseProgress {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      courseId: 'default',
      videos: [],
      quizzes: [],
      assignments: [],
      lastAccessedAt: new Date().toISOString(),
    };
  }

  return JSON.parse(raw);
}

export function saveProgress(progress: CourseProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

//Sync progress to backend when online (Optional)
// window.addEventListener('online', () => {
//   syncProgressToBackend();
// });
