export type VideoProgress = {
  lessonId: string;
  watchedSeconds: number;
  totalSeconds: number;
  completed: boolean;
  bookmarkedAt?: number;
};

export type QuizProgress = {
  quizId: string;
  attempts: number;
  bestScore: number;
  lastScore: number;
};

export type AssignmentProgress = {
  assignmentId: string;
  status: 'not_submitted' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  submittedAt?: string;
};

export type CourseProgress = {
  courseId: string;
  videos: VideoProgress[];
  quizzes: QuizProgress[];
  assignments: AssignmentProgress[];
  lastAccessedAt: string;
};
