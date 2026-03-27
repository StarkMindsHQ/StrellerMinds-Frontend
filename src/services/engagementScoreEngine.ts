import {
  type HighRiskAlert,
  type RiskLevel,
  type RiskThresholdConfig,
  type StudentLearningRecord,
  type StudentRiskAssessment,
} from '@/types/learningAnalytics';

const DAY_MS = 24 * 60 * 60 * 1000;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const round = (value: number, precision = 2): number => {
  const scalar = Math.pow(10, precision);
  return Math.round(value * scalar) / scalar;
};

export const DEFAULT_RISK_THRESHOLDS: RiskThresholdConfig = {
  mediumRiskMin: 35,
  highRiskMin: 60,
  criticalRiskMin: 80,
  adminAlertMin: 65,
};

export const normalizeRiskThresholdConfig = (
  config?: Partial<RiskThresholdConfig>,
): RiskThresholdConfig => {
  const mediumRiskMin = clamp(
    config?.mediumRiskMin ?? DEFAULT_RISK_THRESHOLDS.mediumRiskMin,
    1,
    94,
  );
  const highRiskMin = clamp(
    config?.highRiskMin ?? DEFAULT_RISK_THRESHOLDS.highRiskMin,
    mediumRiskMin + 1,
    97,
  );
  const criticalRiskMin = clamp(
    config?.criticalRiskMin ?? DEFAULT_RISK_THRESHOLDS.criticalRiskMin,
    highRiskMin + 1,
    99,
  );
  const adminAlertMin = clamp(
    config?.adminAlertMin ?? DEFAULT_RISK_THRESHOLDS.adminAlertMin,
    highRiskMin,
    100,
  );

  return {
    mediumRiskMin,
    highRiskMin,
    criticalRiskMin,
    adminAlertMin,
  };
};

const averageLessonIntervalDays = (timestamps: string[]): number => {
  if (timestamps.length < 2) return 8.5;

  const sorted = [...timestamps].sort((left, right) => {
    return new Date(left).getTime() - new Date(right).getTime();
  });

  let totalGapDays = 0;

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = new Date(sorted[index - 1]).getTime();
    const current = new Date(sorted[index]).getTime();
    totalGapDays += Math.max(0, (current - previous) / DAY_MS);
  }

  return totalGapDays / (sorted.length - 1);
};

const daysSinceLastCompletion = (timestamps: string[], now: Date): number => {
  if (timestamps.length === 0) return 30;

  const latest = timestamps
    .map((timestamp) => new Date(timestamp).getTime())
    .sort((left, right) => right - left)[0];

  return Math.max(0, (now.getTime() - latest) / DAY_MS);
};

const riskLevelFromScore = (
  score: number,
  config: RiskThresholdConfig,
): RiskLevel => {
  if (score >= config.criticalRiskMin) return 'critical';
  if (score >= config.highRiskMin) return 'high';
  if (score >= config.mediumRiskMin) return 'medium';
  return 'low';
};

const buildRiskRationale = (
  completionIntervalRisk: number,
  missedQuizRisk: number,
  watchTimeRisk: number,
  inactivityDays: number,
): string[] => {
  const rationale: string[] = [];

  if (completionIntervalRisk >= 60 || inactivityDays >= 7) {
    rationale.push('Long gaps detected between lesson completions.');
  }

  if (missedQuizRisk >= 35) {
    rationale.push('Frequent missed quizzes are reducing momentum.');
  }

  if (watchTimeRisk >= 30) {
    rationale.push('Watch-time ratio is below expected learning cadence.');
  }

  if (rationale.length === 0) {
    rationale.push('Engagement indicators are currently within healthy range.');
  }

  return rationale;
};

const computeSignals = (
  record: StudentLearningRecord,
  now: Date,
): {
  completionIntervalRisk: number;
  missedQuizRisk: number;
  watchTimeRisk: number;
  daysInactive: number;
} => {
  const averageIntervalDays = averageLessonIntervalDays(
    record.lessonCompletionTimestamps,
  );
  const daysInactive = daysSinceLastCompletion(
    record.lessonCompletionTimestamps,
    now,
  );

  const baseIntervalRisk = clamp(
    ((averageIntervalDays - 1.5) / 9) * 100,
    0,
    100,
  );
  const inactivityPenalty = clamp(daysInactive * 4.5, 0, 30);
  const completionIntervalRisk = clamp(
    baseIntervalRisk + inactivityPenalty,
    0,
    100,
  );

  const missedQuizRate =
    record.quizzesAssigned === 0
      ? 0
      : (record.quizzesMissed / record.quizzesAssigned) * 100;
  const missedQuizRisk = clamp(missedQuizRate, 0, 100);

  const watchTimeRatio =
    record.baselineWatchMinutes === 0
      ? 1
      : record.watchMinutes / record.baselineWatchMinutes;
  const watchTimeRisk = clamp((1 - watchTimeRatio) * 100, 0, 100);

  return {
    completionIntervalRisk: round(completionIntervalRisk, 2),
    missedQuizRisk: round(missedQuizRisk, 2),
    watchTimeRisk: round(watchTimeRisk, 2),
    daysInactive: round(daysInactive, 1),
  };
};

const computeRiskScore = (
  completionIntervalRisk: number,
  missedQuizRisk: number,
  watchTimeRisk: number,
): number => {
  const weighted =
    completionIntervalRisk * 0.45 + missedQuizRisk * 0.35 + watchTimeRisk * 0.2;
  return round(clamp(weighted, 0, 100), 2);
};

export const assessStudentRisk = (
  record: StudentLearningRecord,
  thresholdConfig?: Partial<RiskThresholdConfig>,
  now = new Date(),
): StudentRiskAssessment => {
  const config = normalizeRiskThresholdConfig(thresholdConfig);
  const signals = computeSignals(record, now);
  const riskScore = computeRiskScore(
    signals.completionIntervalRisk,
    signals.missedQuizRisk,
    signals.watchTimeRisk,
  );
  const riskLevel = riskLevelFromScore(riskScore, config);

  return {
    studentId: record.studentId,
    studentName: record.studentName,
    courseName: record.courseName,
    riskScore,
    riskLevel,
    signals: {
      completionIntervalRisk: signals.completionIntervalRisk,
      missedQuizRisk: signals.missedQuizRisk,
      watchTimeRisk: signals.watchTimeRisk,
    },
    rationale: buildRiskRationale(
      signals.completionIntervalRisk,
      signals.missedQuizRisk,
      signals.watchTimeRisk,
      signals.daysInactive,
    ),
    daysSinceLastLessonCompletion: signals.daysInactive,
  };
};

export const assessCohortRisk = (
  records: StudentLearningRecord[],
  thresholdConfig?: Partial<RiskThresholdConfig>,
  now = new Date(),
): StudentRiskAssessment[] => {
  return records
    .map((record) => assessStudentRisk(record, thresholdConfig, now))
    .sort((left, right) => right.riskScore - left.riskScore);
};

export const buildRiskAlerts = (
  assessments: StudentRiskAssessment[],
  thresholdConfig?: Partial<RiskThresholdConfig>,
  now = new Date(),
): HighRiskAlert[] => {
  const config = normalizeRiskThresholdConfig(thresholdConfig);

  return assessments
    .filter((assessment) => assessment.riskScore >= config.adminAlertMin)
    .map((assessment) => ({
      id: `alert-${assessment.studentId}-${Math.round(now.getTime() / 1000)}`,
      studentId: assessment.studentId,
      studentName: assessment.studentName,
      courseName: assessment.courseName,
      riskScore: assessment.riskScore,
      riskLevel: assessment.riskLevel,
      message: `${assessment.studentName} shows elevated completion risk (${assessment.riskScore}%).`,
      triggeredAt: now.toISOString(),
    }));
};

export class EngagementScoreEngine {
  private config: RiskThresholdConfig;

  constructor(config?: Partial<RiskThresholdConfig>) {
    this.config = normalizeRiskThresholdConfig(config);
  }

  getThresholds(): RiskThresholdConfig {
    return { ...this.config };
  }

  updateThresholds(config: Partial<RiskThresholdConfig>): RiskThresholdConfig {
    this.config = normalizeRiskThresholdConfig({
      ...this.config,
      ...config,
    });
    return this.getThresholds();
  }

  assess(
    record: StudentLearningRecord,
    now = new Date(),
  ): StudentRiskAssessment {
    return assessStudentRisk(record, this.config, now);
  }

  assessMany(
    records: StudentLearningRecord[],
    now = new Date(),
  ): StudentRiskAssessment[] {
    return assessCohortRisk(records, this.config, now);
  }

  buildAlerts(
    assessments: StudentRiskAssessment[],
    now = new Date(),
  ): HighRiskAlert[] {
    return buildRiskAlerts(assessments, this.config, now);
  }
}

export const engagementScoreEngine = new EngagementScoreEngine();
