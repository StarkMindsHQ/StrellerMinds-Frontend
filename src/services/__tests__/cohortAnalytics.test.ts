import { describe, expect, it } from 'vitest';
import { mockCohortBehaviorRecords } from '@/data/cohortAnalyticsMock';
import {
  aggregateCohortComparisons,
  filterCohortBehaviorRecords,
  serializeCohortAnalyticsReport,
  type CohortAnalyticsFilters,
} from '@/services/cohortAnalytics';

describe('cohortAnalytics', () => {
  const fixedNow = new Date('2026-02-26T00:00:00.000Z');

  it('filters records by course, batch, and time range', () => {
    const filters: CohortAnalyticsFilters = {
      courseId: 'blockchain-fundamentals',
      batch: '2026-Q1',
      timeRange: '30d',
    };

    const filtered = filterCohortBehaviorRecords(
      mockCohortBehaviorRecords,
      filters,
      fixedNow,
    );

    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every(
        (record) =>
          record.courseId === 'blockchain-fundamentals' &&
          record.batch === '2026-Q1',
      ),
    ).toBe(true);
  });

  it('aggregates cohorts and ranks them by composite score', () => {
    const ranked = aggregateCohortComparisons(mockCohortBehaviorRecords);

    expect(ranked.length).toBeGreaterThan(1);
    expect(ranked[0].rankingScore).toBeGreaterThanOrEqual(
      ranked[1].rankingScore,
    );
    expect(ranked[0].cohortName).toBeTruthy();
  });

  it('serializes a csv report with ranking headers', () => {
    const filters: CohortAnalyticsFilters = {
      courseId: 'all',
      batch: 'all',
      timeRange: '90d',
    };

    const ranked = aggregateCohortComparisons(mockCohortBehaviorRecords);
    const csv = serializeCohortAnalyticsReport(ranked, filters);

    expect(csv).toContain('Cohort Analytics Report');
    expect(csv).toContain('Ranking Score');
    expect(csv).toContain('Cohort');
  });
});
