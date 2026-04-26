// Quiz Types for the reusable quiz engine

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
  correctOptionId: string | string[]; // Single answer or multiple correct answers
  explanation?: string; // Shown after answering
  timeLimit?: number; // in seconds, optional per-question limit
  difficulty?: 'easy' | 'medium' | 'hard';
  // Grading configuration for partial scoring
  gradingMode?: 'exact' | 'partial' | 'partial-penalty'; // How to score multi-select questions
  pointsPerOption?: number; // Points awarded per correct option selected (for partial grading)
  penaltyPerIncorrectOption?: number; // Points deducted per incorrect option selected
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
  selectedOptionIds: string[]; // Array of selected option IDs (for multi-select)
  confidence: number; // Confidence level (0-100)
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
  score: number; // Total points earned
  maxScore: number; // Maximum possible points
  percentage: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number; // Number of questions with exact correct answers
  partialCorrectAnswers: number; // Number of questions with partial credit
  startedAt: number;
  completedAt: number;
  timeSpent: number; // in seconds
  answers: QuizAnswer[];
  detailedResults: QuestionResult[];
  averageConfidence: number; // Average confidence across all questions (0-100)
}

export interface QuestionResult {
  questionId: string;
  question: string;
  selectedOptionIds: string[]; // Array of selected option IDs
  correctOptionIds: string[]; // Array of correct option IDs (for multi-select)
  isCorrect: boolean; // True if all selected options are correct and no incorrect options selected (for exact match)
  partialScore: number; // Points earned for this question (0 to max points)
  maxPoints: number; // Maximum points possible for this question
  confidence: number; // Confidence level (0-100) for this question
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
