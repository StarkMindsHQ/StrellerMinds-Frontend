import {
  assessCohortRisk,
  buildRiskAlerts,
  normalizeRiskThresholdConfig,
} from '@/services/engagementScoreEngine';
import {
  type AggregatedLearningMetrics,
  type AnalyticsTimePoint,
  type CourseAnalyticsPoint,
  type HeatmapCell,
  type LearningAnalyticsSnapshot,
  type LearningTrendSummary,
  type MetricTrend,
  type RiskThresholdConfig,
  type StudentLearningRecord,
  type TrendComparison,
  type TrendDirection,
} from '@/types/learningAnalytics';

const DAY_MS = 24 * 60 * 60 * 1000;
const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HEATMAP_BUCKETS = [0, 4, 8, 12, 16, 20];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const round = (value: number, precision = 2): number => {
  const scalar = Math.pow(10, precision);
  return Math.round(value * scalar) / scalar;
};

const safeAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const compareValues = (
  current: number,
  previous: number,
  directionTolerance: number,
): TrendDirection => {
  const delta = current - previous;

  if (Math.abs(delta) <= directionTolerance) return 'stable';
  return delta > 0 ? 'up' : 'down';
};

const buildTrendComparison = (
  current: number,
  previous: number,
  window: 'weekly' | 'monthly',
  directionTolerance: number,
): TrendComparison => {
  const delta = round(current - previous, 2);
  const deltaPercent =
    previous === 0
      ? delta === 0
        ? 0
        : 100
      : round((delta / Math.abs(previous)) * 100, 2);

  return {
    window,
    current: round(current, 2),
    previous: round(previous, 2),
    delta,
    deltaPercent,
    direction: compareValues(current, previous, directionTolerance),
  };
};

const toIsoDay = (date: Date): string => date.toISOString().slice(0, 10);

const toTimelineMap = (records: StudentLearningRecord[]) => {
  const grouped = new Map<
    string,
    { completion: number[]; watch: number[]; score: number[]; count: number }
  >();

  for (const record of records) {
    for (const point of record.timeline) {
      const current = grouped.get(point.date) ?? {
        completion: [],
        watch: [],
        score: [],
        count: 0,
      };

      current.completion.push(point.completionRate);
      current.watch.push(point.watchTimeRatio);
      current.score.push(point.testScore);
      current.count += 1;
      grouped.set(point.date, current);
    }
  }

  return grouped;
};

const computeWindowAverages = (
  timelineMap: Map<
    string,
    { completion: number[]; watch: number[]; score: number[]; count: number }
  >,
  now: Date,
  days: number,
): {
  completionCurrent: number;
  completionPrevious: number;
  watchCurrent: number;
  watchPrevious: number;
  scoreCurrent: number;
  scorePrevious: number;
} => {
  const currentStart = new Date(now.getTime() - (days - 1) * DAY_MS);
  const previousStart = new Date(now.getTime() - (days * 2 - 1) * DAY_MS);
  const previousEnd = new Date(currentStart.getTime() - DAY_MS);

  const currentCompletion: number[] = [];
  const currentWatch: number[] = [];
  const currentScore: number[] = [];
  const previousCompletion: number[] = [];
  const previousWatch: number[] = [];
  const previousScore: number[] = [];

  for (const [dateKey, values] of timelineMap.entries()) {
    const pointDate = new Date(`${dateKey}T00:00:00.000Z`);
    const completionAverage = safeAverage(values.completion);
    const watchAverage = safeAverage(values.watch);
    const scoreAverage = safeAverage(values.score);

    if (pointDate >= currentStart && pointDate <= now) {
      currentCompletion.push(completionAverage);
      currentWatch.push(watchAverage);
      currentScore.push(scoreAverage);
    } else if (pointDate >= previousStart && pointDate <= previousEnd) {
      previousCompletion.push(completionAverage);
      previousWatch.push(watchAverage);
      previousScore.push(scoreAverage);
    }
  }

  return {
    completionCurrent: safeAverage(currentCompletion),
    completionPrevious: safeAverage(previousCompletion),
    watchCurrent: safeAverage(currentWatch),
    watchPrevious: safeAverage(previousWatch),
    scoreCurrent: safeAverage(currentScore),
    scorePrevious: safeAverage(previousScore),
  };
};

const buildMetricTrend = (
  weeklyCurrent: number,
  weeklyPrevious: number,
  monthlyCurrent: number,
  monthlyPrevious: number,
  tolerance: number,
): MetricTrend => ({
  weekly: buildTrendComparison(
    weeklyCurrent,
    weeklyPrevious,
    'weekly',
    tolerance,
  ),
  monthly: buildTrendComparison(
    monthlyCurrent,
    monthlyPrevious,
    'monthly',
    tolerance,
  ),
});

export const aggregateLearningMetrics = (
  records: StudentLearningRecord[],
): AggregatedLearningMetrics => {
  if (records.length === 0) {
    return {
      completionRate: 0,
      averageWatchTimeRatio: 0,
      averageTestScore: 0,
      missedQuizRate: 0,
      totalStudents: 0,
    };
  }

  const completionRate = safeAverage(
    records.map((record) => record.currentProgress),
  );
  const averageWatchTimeRatio = safeAverage(
    records.map((record) => {
      if (record.baselineWatchMinutes === 0) return 1;
      return record.watchMinutes / record.baselineWatchMinutes;
    }),
  );
  const averageTestScore = safeAverage(
    records.map((record) => record.quizAverageScore),
  );

  const totalAssigned = records.reduce(
    (sum, record) => sum + record.quizzesAssigned,
    0,
  );
  const totalMissed = records.reduce(
    (sum, record) => sum + record.quizzesMissed,
    0,
  );
  const missedQuizRate =
    totalAssigned === 0 ? 0 : (totalMissed / totalAssigned) * 100;

  return {
    completionRate: round(completionRate, 2),
    averageWatchTimeRatio: round(averageWatchTimeRatio, 3),
    averageTestScore: round(averageTestScore, 2),
    missedQuizRate: round(missedQuizRate, 2),
    totalStudents: records.length,
  };
};

export const detectLearningTrends = (
  records: StudentLearningRecord[],
  now = new Date(),
): LearningTrendSummary => {
  const timelineMap = toTimelineMap(records);
  const weekly = computeWindowAverages(timelineMap, now, 7);
  const monthly = computeWindowAverages(timelineMap, now, 30);

  return {
    completionRate: buildMetricTrend(
      weekly.completionCurrent,
      weekly.completionPrevious,
      monthly.completionCurrent,
      monthly.completionPrevious,
      0.9,
    ),
    averageWatchTimeRatio: buildMetricTrend(
      weekly.watchCurrent,
      weekly.watchPrevious,
      monthly.watchCurrent,
      monthly.watchPrevious,
      0.02,
    ),
    averageTestScore: buildMetricTrend(
      weekly.scoreCurrent,
      weekly.scorePrevious,
      monthly.scoreCurrent,
      monthly.scorePrevious,
      0.9,
    ),
  };
};

export const buildTimelineSeries = (
  records: StudentLearningRecord[],
  now = new Date(),
  days = 30,
): AnalyticsTimePoint[] => {
  const timelineMap = toTimelineMap(records);
  const start = new Date(now.getTime() - (days - 1) * DAY_MS);
  const points: AnalyticsTimePoint[] = [];

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(start.getTime() + offset * DAY_MS);
    const key = toIsoDay(date);
    const grouped = timelineMap.get(key);
    const completionRate = grouped ? safeAverage(grouped.completion) : 0;
    const watchTimeRatio = grouped ? safeAverage(grouped.watch) : 0;
    const testScore = grouped ? safeAverage(grouped.score) : 0;

    points.push({
      date: key,
      label: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      completionRate: round(completionRate, 2),
      watchTimeRatio: round(watchTimeRatio, 3),
      testScore: round(testScore, 2),
    });
  }

  return points;
};

export const buildCourseDistribution = (
  records: StudentLearningRecord[],
): CourseAnalyticsPoint[] => {
  const grouped = new Map<
    string,
    {
      courseId: string;
      courseName: string;
      completion: number[];
      score: number[];
    }
  >();

  for (const record of records) {
    const current = grouped.get(record.courseId) ?? {
      courseId: record.courseId,
      courseName: record.courseName,
      completion: [],
      score: [],
    };

    current.completion.push(record.currentProgress);
    current.score.push(record.quizAverageScore);
    grouped.set(record.courseId, current);
  }

  return Array.from(grouped.values())
    .map((item) => ({
      courseId: item.courseId,
      courseName: item.courseName,
      students: item.completion.length,
      completionRate: round(safeAverage(item.completion), 2),
      averageTestScore: round(safeAverage(item.score), 2),
    }))
    .sort((left, right) => right.completionRate - left.completionRate);
};

const bucketHour = (hour: number): number => {
  const bucket = Math.floor(hour / 4) * 4;
  return clamp(bucket, 0, 20);
};

const normalizeHeatmap = (
  counts: Map<string, number>,
  dayOrder: string[],
): HeatmapCell[] => {
  const maxCount =
    Array.from(counts.values()).sort((left, right) => right - left)[0] ?? 1;
  const cells: HeatmapCell[] = [];

  for (const day of dayOrder) {
    for (const bucket of HEATMAP_BUCKETS) {
      const key = `${day}-${bucket}`;
      const rawCount = counts.get(key) ?? 0;
      const intensity = rawCount === 0 ? 0 : clamp(rawCount / maxCount, 0, 1);
      cells.push({
        day,
        hourBucket: bucket,
        intensity: round(intensity, 3),
      });
    }
  }

  return cells;
};

export const buildEngagementHeatmap = (
  records: StudentLearningRecord[],
): HeatmapCell[] => {
  const counts = new Map<string, number>();

  for (const record of records) {
    for (const timestamp of record.lessonCompletionTimestamps) {
      const date = new Date(timestamp);
      const day = HEATMAP_DAYS[(date.getUTCDay() + 6) % 7];
      const bucket = bucketHour(date.getUTCHours());
      const key = `${day}-${bucket}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return normalizeHeatmap(counts, HEATMAP_DAYS);
};

export const createLearningAnalyticsSnapshot = (
  records: StudentLearningRecord[],
  thresholdConfig?: Partial<RiskThresholdConfig>,
  now = new Date(),
): LearningAnalyticsSnapshot => {
  const normalizedThresholds = normalizeRiskThresholdConfig(thresholdConfig);
  const riskAssessments = assessCohortRisk(records, normalizedThresholds, now);
  const highRiskAlerts = buildRiskAlerts(
    riskAssessments,
    normalizedThresholds,
    now,
  );

  return {
    generatedAt: now.toISOString(),
    metrics: aggregateLearningMetrics(records),
    trends: detectLearningTrends(records, now),
    timeline: buildTimelineSeries(records, now, 30),
    courseDistribution: buildCourseDistribution(records),
    heatmap: buildEngagementHeatmap(records),
    riskAssessments,
    highRiskAlerts,
  };
};
