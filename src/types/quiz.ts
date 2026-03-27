// Quiz Types for the reusable quiz engine

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: string; // Shown after answering
  timeLimit?: number; // in seconds, optional per-question limit
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizConfig {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore?: number; // percentage, default 70
  timeLimit?: number; // total quiz time in seconds
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showFeedback?: boolean; // show correct/incorrect immediately
  feedbackMode?: 'instant' | 'end'; // when to show feedback
  allowReview?: boolean; // allow reviewing answers after submission
  maxAttempts?: number; // number of attempts allowed
  retakeCooldown?: number; // minutes between retakes
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  answeredAt: number; // timestamp
  timeSpent?: number; // seconds spent on this question
}

export interface QuizState {
  quizId: string;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startedAt: number;
  endedAt?: number;
  isSubmitted: boolean;
  score?: number;
  percentage?: number;
  status: 'not-started' | 'in-progress' | 'submitted' | 'paused';
}

export interface QuizResult {
  quizId: string;
  userId?: string;
  score: number;
  percentage: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  startedAt: number;
  completedAt: number;
  timeSpent: number; // in seconds
  answers: QuizAnswer[];
  detailedResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  question: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizProgressRecord {
  quizId: string;
  userId?: string;
  attempts: number;
  bestScore: number;
  lastScore: number;
  bestPercentage: number;
  lastPercentage: number;
  passed: boolean;
  firstAttemptAt: number;
  lastAttemptAt: number;
}
