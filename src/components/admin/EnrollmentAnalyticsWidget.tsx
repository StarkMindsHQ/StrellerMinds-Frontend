import { cn } from '@/lib/utils';
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
  Skeleton,
  SkeletonBadge,
  SkeletonCard,
  SkeletonText,
} from '@/components/ui/skeleton';
import {
  type EnrollmentAnalytics,
  type EnrollmentCategoryDistribution,
  type EnrollmentTrendPoint,
} from '@/services/enrollmentAnalyticsService';
import { BarChart2, LineChart, TrendingUp, Users2 } from 'lucide-react';

interface EnrollmentAnalyticsWidgetProps {
  data?: EnrollmentAnalytics | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

interface TrendCoordinate {
  x: number;
  y: number;
}

const computeTrendCoordinates = (
  points: EnrollmentTrendPoint[],
): TrendCoordinate[] => {
  if (points.length === 0) {
    return [];
  }

  const max = Math.max(...points.map((point) => point.enrollments), 1);
  return points.map((point, index) => {
    const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
    const y = 90 - (point.enrollments / max) * 70;
    return { x, y };
  });
};

const buildTrendPath = (coordinates: TrendCoordinate[]): string => {
  if (coordinates.length === 0) {
    return '';
  }

  return coordinates
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
};

const buildTrendFillPath = (coordinates: TrendCoordinate[]): string => {
  if (coordinates.length === 0) {
    return '';
  }

  const path = buildTrendPath(coordinates);
  if (!path) {
    return '';
  }

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  const firstClosing = `L ${last.x} 90 L ${first.x} 90 Z`;
  return `${path} ${firstClosing}`;
};

const CategoryBars = ({
  categories,
}: {
  categories: EnrollmentCategoryDistribution[];
}) => {
  const max = Math.max(...categories.map((item) => item.enrollments), 1);

  return (
    <div className="space-y-4">
      {categories.map((item) => (
        <div key={item.category} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{item.category}</span>
            <span className="text-muted-foreground">
              {item.enrollments.toLocaleString()} ({item.percentage}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
              style={{ width: `${(item.enrollments / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const EnrollmentAnalyticsWidget = ({
  data,
  isLoading,
  error,
  onRetry,
  className,
}: EnrollmentAnalyticsWidgetProps) => {
  const trendCoordinates = data ? computeTrendCoordinates(data.trend) : [];
  const trendPath = buildTrendPath(trendCoordinates);
  const trendFillPath = buildTrendFillPath(trendCoordinates);

  return (
    <Card
      className={cn('border-purple-100 dark:border-purple-900/40', className)}
    >
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Enrollment Analytics
          </CardTitle>
          <CardDescription>
            Snapshot of current elective course performance using mock data.
          </CardDescription>
        </div>
        <Badge
          variant="secondary"
          className="bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-200"
        >
          Mock data source
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SkeletonCard>
                <SkeletonBadge className="mb-3 h-6 w-24" />
                <Skeleton className="h-8 w-20" />
                <SkeletonText className="mt-3" lines={2} />
              </SkeletonCard>
              <SkeletonCard>
                <SkeletonBadge className="mb-3 h-6 w-24" />
                <Skeleton className="h-8 w-24" />
                <SkeletonText className="mt-3" lines={2} />
              </SkeletonCard>
              <SkeletonCard>
                <SkeletonBadge className="mb-3 h-6 w-24" />
                <Skeleton className="h-8 w-24" />
                <SkeletonText className="mt-3" lines={2} />
              </SkeletonCard>
            </div>

            <Skeleton className="h-[180px] w-full rounded-xl" />
            <Skeleton className="h-[180px] w-full rounded-xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-start gap-4 rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-destructive">
            <div>
              <p className="font-medium">Failed to load analytics</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
            {onRetry && (
              <Button variant="destructive" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white">
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-wide text-purple-100/80">
                      Total Courses
                    </span>
                    <LineChart className="h-5 w-5 text-purple-100" />
                  </div>
                  <span className="text-3xl font-semibold">
                    {data.totals.courses}
                  </span>
                  <p className="text-sm text-purple-100/80">
                    {data.totals.levels
                      .map(
                        (entry) =>
                          `${entry.count} ${entry.level.toLowerCase()}`,
                      )
                      .join(' • ')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Total Enrollments
                    </span>
                    <Users2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="text-3xl font-semibold">
                    {data.totals.enrollments.toLocaleString()}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Avg. {data.totals.averageEnrollmentsPerCourse} students per
                    course
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Popularity Snapshot
                    </span>
                    <BarChart2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">
                      Top: {data.popularCourses.mostPopular.title}
                    </p>
                    <p className="text-muted-foreground">
                      {data.popularCourses.mostPopular.enrollments.toLocaleString()}{' '}
                      students
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Least: {data.popularCourses.leastPopular.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
              <Card className="lg:col-span-3">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <LineChart className="h-4 w-4 text-purple-500" />
                    Enrollment Trend
                  </CardTitle>
                  <CardDescription>
                    Recent enrollment activity across electives.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <svg viewBox="0 0 100 90" className="h-40 w-full">
                      <defs>
                        <linearGradient
                          id="trendGradient"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="rgba(124, 58, 237, 0.4)"
                          />
                          <stop
                            offset="100%"
                            stopColor="rgba(236, 72, 153, 0.1)"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d={trendFillPath}
                        fill="url(#trendGradient)"
                        stroke="none"
                      />
                      <path
                        d={trendPath}
                        fill="none"
                        stroke="url(#trendGradient)"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                      {trendCoordinates.map((coordinate, index) => (
                        <circle
                          key={data.trend[index]?.label ?? `point-${index}`}
                          cx={coordinate.x}
                          cy={coordinate.y}
                          r={2.5}
                          fill="#7c3aed"
                          stroke="#ffffff"
                          strokeWidth={1}
                        />
                      ))}
                    </svg>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      {data.trend.map((point) => (
                        <span key={point.label}>{point.label}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users2 className="h-4 w-4 text-purple-500" />
                    Enrollments by Category
                  </CardTitle>
                  <CardDescription>
                    Distribution across course categories.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryBars categories={data.categoryDistribution} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Top Performing Courses
                  </CardTitle>
                  <CardDescription>
                    Highest enrollment electives this cycle.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.popularCourses.topCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.category} • {course.level}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-purple-200 text-purple-700 dark:border-purple-900/60 dark:text-purple-200"
                      >
                        {course.enrollments.toLocaleString()} students
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">At-Risk Course</CardTitle>
                  <CardDescription>
                    Elective with the lowest enrollment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="rounded-lg border border-dashed border-purple-200 bg-purple-50 p-4 dark:border-purple-900/60 dark:bg-purple-950/40">
                    <p className="font-semibold text-purple-900 dark:text-purple-100">
                      {data.popularCourses.leastPopular.title}
                    </p>
                    <p className="text-sm text-purple-800/80 dark:text-purple-200/80">
                      {data.popularCourses.leastPopular.enrollments.toLocaleString()}{' '}
                      students enrolled
                    </p>
                    <p className="text-xs text-purple-700/80 dark:text-purple-200/60">
                      {data.popularCourses.leastPopular.category} •{' '}
                      {data.popularCourses.leastPopular.level}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Replace mock analytics by wiring this widget to the
                    `/elective-courses/report` endpoint when available.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No analytics available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

EnrollmentAnalyticsWidget.displayName = 'EnrollmentAnalyticsWidget';
