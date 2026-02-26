'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock3,
  GraduationCap,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AnalyticsCard } from '@/components/analytics/AnalyticsCard';
import { RiskIndicatorBadge } from '@/components/analytics/RiskIndicatorBadge';
import { ThresholdCustomizationPanel } from '@/components/analytics/ThresholdCustomizationPanel';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDynamicLearningAnalytics } from '@/hooks/useDynamicLearningAnalytics';
import { cn } from '@/lib/utils';
import { type AnalyticsRole } from '@/types/learningAnalytics';

interface DynamicLearningAnalyticsDashboardProps {
  role?: AnalyticsRole;
  studentId?: string;
  realtimeMode?: 'polling' | 'websocket';
  websocketUrl?: string;
  className?: string;
}

const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HEATMAP_BUCKETS = [0, 4, 8, 12, 16, 20];

const toPercent = (value: number, decimals = 1): string => `${value.toFixed(decimals)}%`;

const heatCellBackground = (intensity: number): string => {
  if (intensity <= 0) return 'rgba(148, 163, 184, 0.12)';
  if (intensity <= 0.25) return 'rgba(59, 130, 246, 0.35)';
  if (intensity <= 0.5) return 'rgba(45, 212, 191, 0.45)';
  if (intensity <= 0.75) return 'rgba(245, 158, 11, 0.55)';
  return 'rgba(225, 29, 72, 0.65)';
};

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.75rem',
  color: 'hsl(var(--foreground))',
};

export function DynamicLearningAnalyticsDashboard({
  role = 'student',
  studentId,
  realtimeMode = 'polling',
  websocketUrl,
  className,
}: DynamicLearningAnalyticsDashboardProps) {
  const {
    snapshot,
    records,
    thresholds,
    updateThresholds,
    refreshNow,
    isRealtimeConnected,
    lastUpdatedAt,
  } = useDynamicLearningAnalytics({
    role,
    studentId,
    mode: realtimeMode,
    websocketUrl,
  });

  const latestStudentRisk = snapshot.riskAssessments[0];
  const topRiskRows = snapshot.riskAssessments.slice(0, 6);
  const alertRows = snapshot.highRiskAlerts.slice(0, 5);

  const roleLabel =
    role === 'admin' ? 'Admin View' : role === 'instructor' ? 'Instructor View' : 'Student View';

  return (
    <div className={cn('space-y-6', className)}>
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-sky-500/10 to-emerald-500/10">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Dynamic Learning Analytics Dashboard
              </CardTitle>
              <CardDescription className="mt-1">
                Real-time aggregation of completion, watch-time, test scores, and risk predictions.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-full border bg-background px-3 py-1 text-xs font-semibold">
                {roleLabel}
              </div>
              <div className="flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs font-medium">
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    isRealtimeConnected ? 'animate-pulse bg-emerald-500' : 'bg-amber-500',
                  )}
                />
                {isRealtimeConnected ? 'Live' : 'Reconnecting'}
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={refreshNow}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">
            Last update: {new Date(lastUpdatedAt).toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard
          title="Completion Rate"
          value={toPercent(snapshot.metrics.completionRate)}
          description={`${snapshot.metrics.totalStudents} learners in scope`}
          icon={<GraduationCap className="h-4 w-4" />}
          trend={snapshot.trends.completionRate.weekly}
        />
        <AnalyticsCard
          title="Avg Watch-Time Ratio"
          value={toPercent(snapshot.metrics.averageWatchTimeRatio * 100)}
          description="Watch-time versus assigned lesson duration"
          icon={<Clock3 className="h-4 w-4" />}
          trend={snapshot.trends.averageWatchTimeRatio.weekly}
        />
        <AnalyticsCard
          title="Avg Test Score"
          value={toPercent(snapshot.metrics.averageTestScore)}
          description="Rolling average from assessments"
          icon={<BarChart3 className="h-4 w-4" />}
          trend={snapshot.trends.averageTestScore.weekly}
        />
        <AnalyticsCard
          title="Missed Quiz Rate"
          value={toPercent(snapshot.metrics.missedQuizRate)}
          description="Higher values indicate disengagement risk"
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      {role === 'student' && latestStudentRisk ? (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Predictive Completion Risk</CardTitle>
            <CardDescription>
              EngagementScoreEngine evaluates lesson intervals, missed quizzes, and watch-time ratio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <RiskIndicatorBadge
                riskLevel={latestStudentRisk.riskLevel}
                riskScore={latestStudentRisk.riskScore}
              />
              <span className="text-xs text-muted-foreground">
                {latestStudentRisk.studentName} - {latestStudentRisk.courseName}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                Completion interval risk: {Math.round(latestStudentRisk.signals.completionIntervalRisk)}%
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                Missed quiz risk: {Math.round(latestStudentRisk.signals.missedQuizRisk)}%
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                Watch-time risk: {Math.round(latestStudentRisk.signals.watchTimeRisk)}%
              </div>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {latestStudentRisk.rationale.map((item, index) => (
                <li key={`${item}-${index}`}>- {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Trend Detection (Weekly vs Monthly)</CardTitle>
            <CardDescription>
              Animated line chart of completion and test-score movement over the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={snapshot.timeline} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.35} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#0ea5e9"
                  strokeWidth={2.2}
                  dot={false}
                  isAnimationActive={true}
                  name="Completion %"
                />
                <Line
                  type="monotone"
                  dataKey="testScore"
                  stroke="#f59e0b"
                  strokeWidth={2.2}
                  dot={false}
                  isAnimationActive={true}
                  name="Test score %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Completion by Course</CardTitle>
            <CardDescription>Bar chart by cohort/course grouping.</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snapshot.courseDistribution} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="courseName" tick={{ fontSize: 10 }} interval={0} angle={-10} textAnchor="end" height={55} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="completionRate" fill="#10b981" radius={[6, 6, 0, 0]} name="Completion %" isAnimationActive={true} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Engagement Heatmap</CardTitle>
          <CardDescription>
            Heat intensity tracks lesson-completion activity by day and hour window.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-[70px_repeat(6,minmax(0,1fr))] gap-2 text-[11px] font-semibold text-muted-foreground">
            <span />
            {HEATMAP_BUCKETS.map((bucket) => (
              <span key={bucket} className="text-center">{`${bucket}:00`}</span>
            ))}
          </div>
          <div className="space-y-2">
            {HEATMAP_DAYS.map((day) => (
              <div key={day} className="grid grid-cols-[70px_repeat(6,minmax(0,1fr))] items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{day}</span>
                {HEATMAP_BUCKETS.map((bucket) => {
                  const cell = snapshot.heatmap.find(
                    (item) => item.day === day && item.hourBucket === bucket,
                  );
                  const intensity = cell?.intensity ?? 0;

                  return (
                    <motion.div
                      key={`${day}-${bucket}`}
                      initial={{ opacity: 0.2 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="h-7 rounded-md border border-black/10"
                      style={{ backgroundColor: heatCellBackground(intensity) }}
                      title={`${day} ${bucket}:00 - intensity ${(intensity * 100).toFixed(0)}%`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {role !== 'student' ? (
        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Risk Indicator Badge Matrix
              </CardTitle>
              <CardDescription>
                Ranked students by dynamic completion-risk score.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topRiskRows.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                  No student risk data available.
                </div>
              ) : (
                <div className="space-y-2">
                  {topRiskRows.map((assessment) => (
                    <div
                      key={assessment.studentId}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background/70 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold">{assessment.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {assessment.courseName} - {assessment.daysSinceLastLessonCompletion.toFixed(1)} days since last completion
                        </p>
                      </div>
                      <RiskIndicatorBadge
                        riskLevel={assessment.riskLevel}
                        riskScore={assessment.riskScore}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                Admin Alert System
              </CardTitle>
              <CardDescription>
                Alerts triggered at {thresholds.adminAlertMin}% risk score.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alertRows.length === 0 ? (
                <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                  No high-risk students detected above current threshold.
                </div>
              ) : (
                <div className="space-y-2">
                  {alertRows.map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-lg border border-rose-500/25 bg-rose-500/10 p-3"
                    >
                      <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                        <AlertTriangle className="mr-1 inline h-4 w-4" />
                        {alert.studentName}
                      </p>
                      <p className="text-xs text-rose-700/90 dark:text-rose-300/90">
                        {alert.courseName} - Risk {Math.round(alert.riskScore)}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {role === 'admin' ? (
        <ThresholdCustomizationPanel
          thresholds={thresholds}
          onThresholdChange={updateThresholds}
        />
      ) : null}

      {role === 'student' ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Realtime Student Scope</CardTitle>
            <CardDescription>
              Personal analytics is scoped to one student profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Tracking {records[0]?.studentName ?? 'Student'} with continuous polling updates.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

export default DynamicLearningAnalyticsDashboard;
