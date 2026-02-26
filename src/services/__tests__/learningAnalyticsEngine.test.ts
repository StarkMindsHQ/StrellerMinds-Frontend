import { describe, expect, it } from 'vitest';
import {
  aggregateLearningMetrics,
  buildEngagementHeatmap,
  createLearningAnalyticsSnapshot,
  detectLearningTrends,
} from '@/services/learningAnalyticsEngine';
import { type DailyLearningMetric, type StudentLearningRecord } from '@/types/learningAnalytics';

const now = new Date('2026-02-26T12:00:00.000Z');

const buildTimeline = (
  startDate: Date,
  days: number,
  completionStart: number,
  completionGrowth: number,
  watchStart: number,
  watchGrowth: number,
  scoreStart: number,
  scoreGrowth: number,
): DailyLearningMetric[] => {
  return Array.from({ length: days }, (_, index) => {
    const day = new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000);
    const completionRate = Math.min(100, completionStart + completionGrowth * index);
    const watchTimeRatio = Math.min(1.3, watchStart + watchGrowth * index);
    const testScore = Math.min(100, scoreStart + scoreGrowth * index);
    const quizzesAssigned = index % 2 === 0 ? 1 : 2;
    const quizzesMissed = index % 9 === 0 ? 1 : 0;

    return {
      date: day.toISOString().slice(0, 10),
      completionRate,
      watchTimeRatio,
      testScore,
      quizzesAssigned,
      quizzesMissed,
      lessonsCompleted: index % 3 === 0 ? 2 : 1,
      activeMinutes: 42 + (index % 15),
    };
  });
};

const createRecord = (
  studentId: string,
  studentName: string,
  timeline: DailyLearningMetric[],
): StudentLearningRecord => {
  const lessonCompletionTimestamps = timeline
    .filter((point) => point.lessonsCompleted > 0)
    .map((point) => `${point.date}T10:00:00.000Z`);

  const quizzesAssigned = timeline.reduce(
    (sum, point) => sum + point.quizzesAssigned,
    0,
  );
  const quizzesMissed = timeline.reduce((sum, point) => sum + point.quizzesMissed, 0);
  const watchAverageRatio =
    timeline.reduce((sum, point) => sum + point.watchTimeRatio, 0) / timeline.length;
  const scoreAverage =
    timeline.reduce((sum, point) => sum + point.testScore, 0) / timeline.length;

  return {
    studentId,
    studentName,
    courseId: 'course-stellar',
    courseName: 'Stellar Smart Contracts',
    cohort: '2026-Q1',
    currentProgress: timeline[timeline.length - 1]?.completionRate ?? 0,
    baselineWatchMinutes: 600,
    watchMinutes: Math.round(600 * watchAverageRatio),
    quizAverageScore: Math.round(scoreAverage * 100) / 100,
    quizzesAssigned,
    quizzesMissed,
    lessonCompletionTimestamps,
    timeline,
    lastSeenAt: `${timeline[timeline.length - 1]?.date}T12:00:00.000Z`,
  };
};

describe('learningAnalyticsEngine', () => {
  const timelineStart = new Date('2025-12-24T00:00:00.000Z');
  const studentOne = createRecord(
    'student-1',
    'Aisha Ahmed',
    buildTimeline(timelineStart, 65, 38, 0.85, 0.62, 0.004, 64, 0.42),
  );
  const studentTwo = createRecord(
    'student-2',
    'Miguel Santos',
    buildTimeline(timelineStart, 65, 35, 0.92, 0.58, 0.005, 60, 0.5),
  );
  const records = [studentOne, studentTwo];

  it('aggregates completion, watch-time ratio, test scores, and missed quiz rate', () => {
    const metrics = aggregateLearningMetrics(records);

    expect(metrics.totalStudents).toBe(2);
    expect(metrics.completionRate).toBeGreaterThan(70);
    expect(metrics.averageWatchTimeRatio).toBeGreaterThan(0.7);
    expect(metrics.averageTestScore).toBeGreaterThan(70);
    expect(metrics.missedQuizRate).toBeGreaterThan(0);
  });

  it('detects weekly and monthly trends from timeline windows', () => {
    const trends = detectLearningTrends(records, now);

    expect(trends.completionRate.weekly.direction).toBe('up');
    expect(trends.averageWatchTimeRatio.monthly.current).toBeGreaterThan(0);
    expect(trends.averageTestScore.monthly.current).toBeGreaterThan(
      trends.averageTestScore.monthly.previous,
    );
  });

  it('builds a full snapshot including heatmap and risk assessments', () => {
    const snapshot = createLearningAnalyticsSnapshot(records, undefined, now);
    const heatmap = buildEngagementHeatmap(records);

    expect(snapshot.timeline.length).toBe(30);
    expect(snapshot.courseDistribution.length).toBeGreaterThan(0);
    expect(snapshot.riskAssessments.length).toBe(2);
    expect(heatmap.length).toBe(42);
  });
});
