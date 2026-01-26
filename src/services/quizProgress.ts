import { QuizProgress } from '@/types/progress';
import { loadProgress, saveProgress } from './storage';

export function recordQuizResult(quizId: string, score: number) {
  const progress = loadProgress();
  const quiz = progress.quizzes.find((q) => q.quizId === quizId);

  if (!quiz) {
    progress.quizzes.push({
      quizId,
      attempts: 1,
      bestScore: score,
      lastScore: score,
    });
  } else {
    quiz.attempts += 1;
    quiz.lastScore = score;
    quiz.bestScore = Math.max(quiz.bestScore, score);
  }

  saveProgress(progress);
}

export function quizImprovement(quiz: QuizProgress) {
  return quiz.lastScore - quiz.bestScore;
}
