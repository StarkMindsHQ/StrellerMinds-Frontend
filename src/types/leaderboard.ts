export type LeaderboardMetricType = 'completion' | 'quiz_score' | 'combined';

export type RankTrend = 'up' | 'down' | 'stable' | 'new';

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  courseId?: string;
  courseName?: string;
  cohort: string;
  score: number;
  metricType: LeaderboardMetricType;
  trend?: RankTrend;
  previousRank?: number;
  coursesCompleted?: number;
  quizzesTaken?: number;
  averageQuizScore?: number;
  completionRate?: number;
}

export interface LeaderboardFilters {
  metricType?: LeaderboardMetricType;
  courseId?: string;
  cohortId?: string;
  timeRange?: 'all_time' | 'this_month' | 'this_week';
  limit?: number;
  offset?: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalCount: number;
  currentUserEntry?: LeaderboardEntry;
  hasMore: boolean;
  filters: LeaderboardFilters;
  lastUpdatedAt: string;
}

export interface LeaderboardProps {
  /** Type of metric to display (completion, quiz_score, or combined) */
  metricType?: LeaderboardMetricType;
  /** Filter by specific course ID */
  courseId?: string;
  /** Number of students to display per page */
  limit?: number;
  /** Enable pagination */
  showPagination?: boolean;
  /** Highlight the logged-in user */
  highlightUserId?: string;
  /** Show trend indicators */
  showTrends?: boolean;
  /** Enable real-time updates */
  enableRealTime?: boolean;
  /** Custom class name */
  className?: string;
  /** Callback when a student is clicked */
  onStudentClick?: (student: LeaderboardEntry) => void;
}
