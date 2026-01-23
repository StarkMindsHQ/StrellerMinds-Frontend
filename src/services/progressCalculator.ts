import { CourseProgress } from '@/types/progress';

export function calculateCourseCompletion(progress: CourseProgress): number {
  const videoWeight = 0.4;
  const quizWeight = 0.3;
  const assignmentWeight = 0.3;

  const videoCompletion =
    progress.videos.length === 0
      ? 0
      : progress.videos.filter((v) => v.completed).length /
        progress.videos.length;

  const quizCompletion =
    progress.quizzes.length === 0
      ? 0
      : progress.quizzes.reduce((sum, q) => sum + q.bestScore, 0) /
        (progress.quizzes.length * 100);

  const assignmentCompletion =
    progress.assignments.length === 0
      ? 0
      : progress.assignments.filter((a) => a.status === 'graded').length /
        progress.assignments.length;

  return Math.round(
    (videoCompletion * videoWeight +
      quizCompletion * quizWeight +
      assignmentCompletion * assignmentWeight) *
      100,
  );
}
