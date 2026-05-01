/**
 * Test Score Leaderboard Types
 *
 * Ranking Strategy: Shared ranking (ties get same rank, next rank skips positions)
 * Example: Scores [100, 95, 95, 90] → Ranks: [1, 2, 2, 4]
 *
 * This approach is standard for competitive leaderboards and is consistent
 * with how sports/education leaderboards typically work.
 */

export type TestScoreLeaderboardSortBy = 'score' | 'timeSpent' | 'attempts';

export interface TestScoreLeaderboardFilters {
  courseId?: string;
  testId?: string; // quizId
  moduleId?: string;
  sortBy?: TestScoreLeaderboardSortBy;
  order?: 'asc' | 'desc';
  minScore?: number;
  maxScore?: number;
}

export interface TestScoreLeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userEmail?: string;
  score: number; // percentage (0-100)
  totalPoints?: number;
  maxPoints?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  attempts: number;
  timeSpent?: number; // in seconds
  completedAt: string;
  courseId?: string;
  courseName?: string;
  testId: string;
  testTitle?: string;
  trend?: 'up' | 'down' | 'stable' | 'new';
  previousRank?: number;
}

export interface CursorInfo {
  lastScore: number;
  lastUserId: string;
  lastAttemptId: string;
  createdAt: string;
}

export interface TestScoreLeaderboardResponse {
  data: TestScoreLeaderboardEntry[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
  currentUserEntry?: TestScoreLeaderboardEntry;
  filters: TestScoreLeaderboardFilters;
  sortBy: TestScoreLeaderboardSortBy;
  order: 'asc' | 'desc';
}

// API Request query params
export interface TestScoreLeaderboardQueryParams {
  courseId?: string;
  testId?: string;
  moduleId?: string;
  sortBy?: TestScoreLeaderboardSortBy;
  order?: 'asc' | 'desc';
  limit?: number;
  cursor?: string;
  includeAttempts?: boolean; // include all attempts vs best only
  currentUserId?: string; // for highlighting
}
