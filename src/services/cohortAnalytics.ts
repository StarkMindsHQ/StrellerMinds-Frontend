export type CohortTimeRange = '7d' | '30d' | '90d' | 'all';

export interface CohortBehaviorRecord {
  id: string;
  cohortId: string;
  cohortName: string;
  courseId: string;
  courseName: string;
  batch: string;
  recordedAt: string;
  completionRate: number;
  testAverage: number;
  engagementScore: number;
  learners: number;
}

export interface CohortAnalyticsFilters {
  courseId: string;
  batch: string;
  timeRange: CohortTimeRange;
}

export interface CohortComparisonMetric {
  cohortId: string;
  cohortName: string;
  learners: number;
  sampleSize: number;
  completionRate: number;
  testAverage: number;
  engagementScore: number;
  rankingScore: number;
}

const round = (value: number, precision = 2): number => {
  const scalar = Math.pow(10, precision);
  return Math.round(value * scalar) / scalar;
};

const daysPerRange: Record<Exclude<CohortTimeRange, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

const inTimeRange = (
  timestampIso: string,
  range: CohortTimeRange,
  now = new Date(),
): boolean => {
  if (range === 'all') {
    return true;
  }

  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - daysPerRange[range]);
  const timestamp = new Date(timestampIso);

  return timestamp >= cutoffDate;
};

export const filterCohortBehaviorRecords = (
  records: CohortBehaviorRecord[],
  filters: CohortAnalyticsFilters,
  now = new Date(),
): CohortBehaviorRecord[] =>
  records.filter((record) => {
    const matchesCourse =
      filters.courseId === 'all' || record.courseId === filters.courseId;
    const matchesBatch =
      filters.batch === 'all' || record.batch === filters.batch;
    const matchesRange = inTimeRange(record.recordedAt, filters.timeRange, now);

    return matchesCourse && matchesBatch && matchesRange;
  });

export const computeCohortRankingScore = (
  completionRate: number,
  testAverage: number,
  engagementScore: number,
): number =>
  round(completionRate * 0.4 + testAverage * 0.35 + engagementScore * 0.25, 2);

export const aggregateCohortComparisons = (
  records: CohortBehaviorRecord[],
): CohortComparisonMetric[] => {
  const grouped = new Map<
    string,
    {
      cohortId: string;
      cohortName: string;
      weightedCompletion: number;
      weightedTestAverage: number;
      weightedEngagement: number;
      learners: number;
      sampleSize: number;
    }
  >();

  for (const record of records) {
    const group = grouped.get(record.cohortId) ?? {
      cohortId: record.cohortId,
      cohortName: record.cohortName,
      weightedCompletion: 0,
      weightedTestAverage: 0,
      weightedEngagement: 0,
      learners: 0,
      sampleSize: 0,
    };

    group.weightedCompletion += record.completionRate * record.learners;
    group.weightedTestAverage += record.testAverage * record.learners;
    group.weightedEngagement += record.engagementScore * record.learners;
    group.learners += record.learners;
    group.sampleSize += 1;

    grouped.set(record.cohortId, group);
  }

  const metrics: CohortComparisonMetric[] = [];

  for (const group of grouped.values()) {
    const learners = Math.max(1, group.learners);
    const completionRate = round(group.weightedCompletion / learners, 2);
    const testAverage = round(group.weightedTestAverage / learners, 2);
    const engagementScore = round(group.weightedEngagement / learners, 2);

    metrics.push({
      cohortId: group.cohortId,
      cohortName: group.cohortName,
      learners: group.learners,
      sampleSize: group.sampleSize,
      completionRate,
      testAverage,
      engagementScore,
      rankingScore: computeCohortRankingScore(
        completionRate,
        testAverage,
        engagementScore,
      ),
    });
  }

  return metrics.sort((left, right) => right.rankingScore - left.rankingScore);
};

const sanitizeCsvValue = (value: string | number): string =>
  `"${String(value).replace(/"/g, '""')}"`;

export const serializeCohortAnalyticsReport = (
  rows: CohortComparisonMetric[],
  filters: CohortAnalyticsFilters,
): string => {
  const reportRows: string[] = [
    '"Cohort Analytics Report"',
    [
      sanitizeCsvValue(`course=${filters.courseId}`),
      sanitizeCsvValue(`batch=${filters.batch}`),
      sanitizeCsvValue(`range=${filters.timeRange}`),
    ].join(','),
    '',
    [
      'Rank',
      'Cohort',
      'Learners',
      'Completion Rate',
      'Test Average',
      'Engagement Score',
      'Ranking Score',
    ]
      .map(sanitizeCsvValue)
      .join(','),
  ];

  for (const [index, row] of rows.entries()) {
    reportRows.push(
      [
        index + 1,
        row.cohortName,
        row.learners,
        `${row.completionRate}%`,
        `${row.testAverage}%`,
        `${row.engagementScore}%`,
        row.rankingScore,
      ]
        .map(sanitizeCsvValue)
        .join(','),
    );
  }

  return reportRows.join('\n');
};

export const downloadCohortAnalyticsReport = (
  rows: CohortComparisonMetric[],
  filters: CohortAnalyticsFilters,
  filePrefix = 'Cohort_Analytics_Report',
): void => {
  const report = serializeCohortAnalyticsReport(rows, filters);
  const timestamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([report], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const href = URL.createObjectURL(blob);

  link.href = href;
  link.download = `${filePrefix}_${timestamp}.csv`;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(href);
};
