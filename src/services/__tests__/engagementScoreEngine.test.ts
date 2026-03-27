import { describe, expect, it } from 'vitest';
import {
  EngagementScoreEngine,
  assessStudentRisk,
  buildRiskAlerts,
  normalizeRiskThresholdConfig,
} from '@/services/engagementScoreEngine';
import { type StudentLearningRecord } from '@/types/learningAnalytics';

const baseTimeline = [
  {
    date: '2026-02-20',
    completionRate: 72,
    watchTimeRatio: 0.9,
    testScore: 78,
    quizzesAssigned: 1,
    quizzesMissed: 0,
    lessonsCompleted: 1,
    activeMinutes: 55,
  },
  {
    date: '2026-02-21',
    completionRate: 74,
    watchTimeRatio: 0.92,
    testScore: 80,
    quizzesAssigned: 1,
    quizzesMissed: 0,
    lessonsCompleted: 1,
    activeMinutes: 58,
  },
];

const createRecord = (
  overrides: Partial<StudentLearningRecord>,
): StudentLearningRecord => ({
  studentId: 'student-1',
  studentName: 'Aisha Ahmed',
  courseId: 'course-blockchain',
  courseName: 'Blockchain Fundamentals',
  cohort: '2026-Q1',
  currentProgress: 74,
  baselineWatchMinutes: 600,
  watchMinutes: 560,
  quizAverageScore: 80,
  quizzesAssigned: 12,
  quizzesMissed: 1,
  lessonCompletionTimestamps: [
    '2026-02-16T10:00:00.000Z',
    '2026-02-18T11:00:00.000Z',
    '2026-02-20T12:00:00.000Z',
  ],
  timeline: baseTimeline,
  lastSeenAt: '2026-02-21T12:00:00.000Z',
  ...overrides,
});

describe('engagementScoreEngine', () => {
  const now = new Date('2026-02-26T12:00:00.000Z');

  it('assigns high risk when completion cadence and watch ratio are poor', () => {
    const riskyRecord = createRecord({
      studentId: 'student-2',
      studentName: 'Noah Johnson',
      watchMinutes: 260,
      quizzesAssigned: 14,
      quizzesMissed: 8,
      lessonCompletionTimestamps: [
        '2026-01-05T09:00:00.000Z',
        '2026-01-24T09:30:00.000Z',
      ],
    });

    const assessment = assessStudentRisk(riskyRecord, undefined, now);

    expect(assessment.riskScore).toBeGreaterThanOrEqual(60);
    expect(['high', 'critical']).toContain(assessment.riskLevel);
    expect(assessment.rationale.join(' ')).toContain('Long gaps');
  });

  it('respects customized threshold values through the class engine', () => {
    const engine = new EngagementScoreEngine({
      mediumRiskMin: 20,
      highRiskMin: 40,
      criticalRiskMin: 70,
      adminAlertMin: 45,
    });

    const mediumRecord = createRecord({
      studentId: 'student-3',
      studentName: 'Lina Kim',
      watchMinutes: 420,
      quizzesAssigned: 10,
      quizzesMissed: 3,
      lessonCompletionTimestamps: [
        '2026-02-03T09:00:00.000Z',
        '2026-02-12T09:00:00.000Z',
        '2026-02-20T09:00:00.000Z',
      ],
    });

    const assessment = engine.assess(mediumRecord, now);

    expect(assessment.riskScore).toBeGreaterThanOrEqual(20);
    expect(['medium', 'high', 'critical']).toContain(assessment.riskLevel);
  });

  it('creates alerts only above the configured admin threshold', () => {
    const thresholds = normalizeRiskThresholdConfig({
      mediumRiskMin: 30,
      highRiskMin: 55,
      criticalRiskMin: 78,
      adminAlertMin: 66,
    });

    const safeAssessment = assessStudentRisk(
      createRecord({
        studentId: 'student-safe',
        studentName: 'Safe Student',
        watchMinutes: 620,
        quizzesAssigned: 11,
        quizzesMissed: 0,
      }),
      thresholds,
      now,
    );

    const riskyAssessment = assessStudentRisk(
      createRecord({
        studentId: 'student-risk',
        studentName: 'Risk Student',
        watchMinutes: 240,
        quizzesAssigned: 12,
        quizzesMissed: 7,
        lessonCompletionTimestamps: [
          '2026-01-08T09:00:00.000Z',
          '2026-01-24T09:00:00.000Z',
        ],
      }),
      thresholds,
      now,
    );

    const alerts = buildRiskAlerts(
      [safeAssessment, riskyAssessment],
      thresholds,
      now,
    );

    expect(alerts.length).toBe(1);
    expect(alerts[0].studentId).toBe('student-risk');
  });
});
