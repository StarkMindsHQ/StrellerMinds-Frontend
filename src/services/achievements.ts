import { CourseProgress } from '@/types/progress';
import { videoCompletion } from './videoProgress';
import { calculateCourseCompletion } from './progressCalculator';

export function evaluateAchievements(progress: CourseProgress) {
  const achievements = [];
  const completionPercentage = calculateCourseCompletion(progress);

  if (videoCompletion(progress.videos) === 100)
    achievements.push('Video Master');

  if (progress.quizzes.some((q) => q.bestScore === 100))
    achievements.push('Quiz Ace');

  if (completionPercentage === 100) achievements.push('Course Completed');

  return achievements;
}

export function updateStreak() {
  const today = new Date().toDateString();
  const last = localStorage.getItem('last_active');

  if (last !== today) {
    const streak = Number(localStorage.getItem('streak') || 0) + 1;
    localStorage.setItem('streak', String(streak));
    localStorage.setItem('last_active', today);
  }
}
