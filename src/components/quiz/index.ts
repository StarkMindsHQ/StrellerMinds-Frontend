// Barrel export for quiz engine components and hooks
// Usage: import { QuizEngine, useQuizEngine } from '@/components/quiz'

export { default as QuizEngine } from './QuizEngine';
export { default as QuizResults } from './QuizResults';
export { default as QuestionDisplay } from './QuestionDisplay';
export { default as QuizHeader } from './QuizHeader';
export { default as QuizNavigation } from './QuizNavigation';
export { default as QuestionProgressBar } from './QuestionProgressBar';
export { default as QuizAlertDialog } from './QuizAlertDialog';
export { default as QuizEngineDemo } from './QuizEngineDemo';

// Export hook
export { useQuizEngine } from '@/hooks/useQuizEngine';

// Export types
export type {
  QuizConfig,
  QuizQuestion,
  QuizOption,
  QuizState,
  QuizAnswer,
  QuizResult,
  QuestionResult,
  QuizProgressRecord,
} from '@/types/quiz';
