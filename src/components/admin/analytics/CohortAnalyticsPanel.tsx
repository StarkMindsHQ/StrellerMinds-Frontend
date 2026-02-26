'use client';

import React, { useMemo, useState } from 'react';
import { Download, Filter, Trophy, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mockCohortBehaviorRecords } from '@/data/cohortAnalyticsMock';
import {
  aggregateCohortComparisons,
  downloadCohortAnalyticsReport,
  filterCohortBehaviorRecords,
  type CohortAnalyticsFilters,
  type CohortBehaviorRecord,
  type CohortTimeRange,
} from '@/services/cohortAnalytics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CohortAnalyticsPanelProps {
  records?: CohortBehaviorRecord[];
  className?: string;
}

const defaultFilters: CohortAnalyticsFilters = {
  courseId: 'all',
  batch: 'all',
  timeRange: '30d',
};

const timeRangeOptions: Array<{ value: CohortTimeRange; label: string }> = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
];

export function CohortAnalyticsPanel({
  records = mockCohortBehaviorRecords,
  className,
}: CohortAnalyticsPanelProps) {
  const [filters, setFilters] =
    useState<CohortAnalyticsFilters>(defaultFilters);

  const courses = useMemo(
    () =>
      Array.from(
        records.reduce((map, record) => {
          map.set(record.courseId, record.courseName);
          return map;
        }, new Map<string, string>()),
      ).map(([id, name]) => ({ id, name })),
    [records],
  );

  const batches = useMemo(
    () => Array.from(new Set(records.map((record) => record.batch))).sort(),
    [records],
  );

  const filteredRecords = useMemo(
    () => filterCohortBehaviorRecords(records, filters),
    [records, filters],
  );

  const rankedCohorts = useMemo(
    () => aggregateCohortComparisons(filteredRecords),
    [filteredRecords],
  );

  const overallSummary = useMemo(() => {
    if (rankedCohorts.length === 0) {
      return {
        completionRate: 0,
        testAverage: 0,
        engagementScore: 0,
        totalLearners: 0,
      };
    }

    const weightedTotals = rankedCohorts.reduce(
      (accumulator, cohort) => {
        accumulator.completionRate += cohort.completionRate * cohort.learners;
        accumulator.testAverage += cohort.testAverage * cohort.learners;
        accumulator.engagementScore += cohort.engagementScore * cohort.learners;
        accumulator.totalLearners += cohort.learners;
        return accumulator;
      },
      {
        completionRate: 0,
        testAverage: 0,
        engagementScore: 0,
        totalLearners: 0,
      },
    );

    const learners = Math.max(1, weightedTotals.totalLearners);

    return {
      completionRate:
        Math.round((weightedTotals.completionRate / learners) * 100) / 100,
      testAverage:
        Math.round((weightedTotals.testAverage / learners) * 100) / 100,
      engagementScore:
        Math.round((weightedTotals.engagementScore / learners) * 100) / 100,
      totalLearners: weightedTotals.totalLearners,
    };
  }, [rankedCohorts]);

  const topCohort = rankedCohorts[0];

  const handleExport = () => {
    try {
      downloadCohortAnalyticsReport(rankedCohorts, filters);
      toast.success('Cohort analytics report exported as CSV.');
    } catch (error) {
      console.error('Failed to export cohort report', error);
      toast.error('Unable to export report. Please try again.');
    }
  };

  return (
    <Card className={cn('border-primary/20 bg-card/90', className)}>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">
              Cohort Behavioral Comparison
            </CardTitle>
            <CardDescription className="mt-1 max-w-3xl">
              Compare completion rates, test performance, and engagement scores
              across student cohorts with course, batch, and time-based filters.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={rankedCohorts.length === 0}
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Course</p>
            <Select
              value={filters.courseId}
              onValueChange={(value) =>
                setFilters((previous) => ({ ...previous, courseId: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Batch</p>
            <Select
              value={filters.batch}
              onValueChange={(value) =>
                setFilters((previous) => ({ ...previous, batch: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All batches</SelectItem>
                {batches.map((batch) => (
                  <SelectItem key={batch} value={batch}>
                    {batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Time range
            </p>
            <Select
              value={filters.timeRange}
              onValueChange={(value) =>
                setFilters((previous) => ({
                  ...previous,
                  timeRange: value as CohortTimeRange,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border bg-background/70 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Cohorts in scope
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {rankedCohorts.length}
            </p>
          </div>
          <div className="rounded-lg border bg-background/70 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Avg completion
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {overallSummary.completionRate}%
            </p>
          </div>
          <div className="rounded-lg border bg-background/70 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Avg test score
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {overallSummary.testAverage}%
            </p>
          </div>
          <div className="rounded-lg border bg-background/70 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Avg engagement
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {overallSummary.engagementScore}%
            </p>
          </div>
        </div>

        {topCohort && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-300/50 bg-emerald-50/70 px-4 py-3 text-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <Trophy className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            <span className="font-medium text-emerald-800 dark:text-emerald-200">
              Top cohort:
            </span>
            <span className="text-emerald-700 dark:text-emerald-300">
              {topCohort.cohortName}
            </span>
            <Badge
              variant="outline"
              className="border-emerald-500/40 text-emerald-700 dark:text-emerald-200"
            >
              Score {topCohort.rankingScore}
            </Badge>
            <span className="flex items-center gap-1 text-emerald-700/90 dark:text-emerald-300/90">
              <Users className="h-3.5 w-3.5" />
              {topCohort.learners} learners
            </span>
          </div>
        )}

        {rankedCohorts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No cohorts match the selected filters.
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4 text-primary" />
                Ranking visualization
              </div>

              <div className="space-y-3">
                {rankedCohorts.map((cohort, index) => (
                  <div
                    key={cohort.cohortId}
                    className="rounded-lg border bg-background/50 p-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <span className="font-medium">{cohort.cohortName}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Composite score: {cohort.rankingScore}
                      </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary via-sky-500 to-emerald-500"
                        style={{
                          width: `${Math.min(100, cohort.rankingScore)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="bg-muted/60 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Rank</th>
                    <th className="px-4 py-3 font-medium">Cohort</th>
                    <th className="px-4 py-3 font-medium">Completion</th>
                    <th className="px-4 py-3 font-medium">Test Avg</th>
                    <th className="px-4 py-3 font-medium">Engagement</th>
                    <th className="px-4 py-3 font-medium">Learners</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedCohorts.map((cohort, index) => (
                    <tr
                      key={`${cohort.cohortId}-${index}`}
                      className="border-t"
                    >
                      <td className="px-4 py-3">#{index + 1}</td>
                      <td className="px-4 py-3 font-medium">
                        {cohort.cohortName}
                      </td>
                      <td className="px-4 py-3">{cohort.completionRate}%</td>
                      <td className="px-4 py-3">{cohort.testAverage}%</td>
                      <td className="px-4 py-3">{cohort.engagementScore}%</td>
                      <td className="px-4 py-3">{cohort.learners}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{cohort.rankingScore}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default CohortAnalyticsPanel;
