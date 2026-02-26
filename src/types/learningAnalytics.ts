export type AnalyticsRole = 'student' | 'instructor' | 'admin';

export type TrendDirection = 'up' | 'down' | 'stable';

export type TrendWindow = 'weekly' | 'monthly';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface DailyLearningMetric {
  date: string;
  completionRate: number;
  watchTimeRatio: number;
  testScore: number;
  quizzesAssigned: number;
  quizzesMissed: number;
  lessonsCompleted: number;
  activeMinutes: number;
}

export interface StudentLearningRecord {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  cohort: string;
  currentProgress: number;
  baselineWatchMinutes: number;
  watchMinutes: number;
  quizAverageScore: number;
  quizzesAssigned: number;
  quizzesMissed: number;
  lessonCompletionTimestamps: string[];
  timeline: DailyLearningMetric[];
  lastSeenAt: string;
}

export interface AggregatedLearningMetrics {
  completionRate: number;
  averageWatchTimeRatio: number;
  averageTestScore: number;
  missedQuizRate: number;
  totalStudents: number;
}

export interface TrendComparison {
  window: TrendWindow;
  current: number;
  previous: number;
  delta: number;
  deltaPercent: number;
  direction: TrendDirection;
}

export interface MetricTrend {
  weekly: TrendComparison;
  monthly: TrendComparison;
}

export interface LearningTrendSummary {
  completionRate: MetricTrend;
  averageWatchTimeRatio: MetricTrend;
  averageTestScore: MetricTrend;
}

export interface AnalyticsTimePoint {
  date: string;
  label: string;
  completionRate: number;
  watchTimeRatio: number;
  testScore: number;
}

export interface CourseAnalyticsPoint {
  courseId: string;
  courseName: string;
  students: number;
  completionRate: number;
  averageTestScore: number;
}

export interface HeatmapCell {
  day: string;
  hourBucket: number;
  intensity: number;
}

export interface RiskThresholdConfig {
  mediumRiskMin: number;
  highRiskMin: number;
  criticalRiskMin: number;
  adminAlertMin: number;
}

export interface StudentRiskSignals {
  completionIntervalRisk: number;
  missedQuizRisk: number;
  watchTimeRisk: number;
}

export interface StudentRiskAssessment {
  studentId: string;
  studentName: string;
  courseName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  signals: StudentRiskSignals;
  rationale: string[];
  daysSinceLastLessonCompletion: number;
}

export interface HighRiskAlert {
  id: string;
  studentId: string;
  studentName: string;
  courseName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  message: string;
  triggeredAt: string;
}

export interface LearningAnalyticsSnapshot {
  generatedAt: string;
  metrics: AggregatedLearningMetrics;
  trends: LearningTrendSummary;
  timeline: AnalyticsTimePoint[];
  courseDistribution: CourseAnalyticsPoint[];
  heatmap: HeatmapCell[];
  riskAssessments: StudentRiskAssessment[];
  highRiskAlerts: HighRiskAlert[];
}
