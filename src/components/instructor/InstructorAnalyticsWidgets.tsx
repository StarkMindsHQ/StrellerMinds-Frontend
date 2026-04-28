'use client';

import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';
import { Download, Loader2, RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TimeRange = 'daily' | 'weekly' | 'monthly';

type HeatmapCell = {
  date: string;
  courseId: string;
  studentId: string;
  activeMinutes: number;
  lessonsCompleted: number;
  interactions: number;
};

type EarningsPoint = {
  period: string;
  dateLabel: string;
  total: number;
  card: number;
  bankTransfer: number;
  wallet: number;
};

type FunnelStage = {
  value: number;
  stage: string;
  percentage: number;
  dropOffFromPrevious: number;
};

type LessonTimePoint = {
  lessonId: string;
  lessonTitle: string;
  module: string;
  avgMinutes: number;
  completionRate: number;
  studentsTracked: number;
};

type CourseOption = { id: string; name: string };
type StudentOption = { id: string; name: string };

const COURSE_OPTIONS: CourseOption[] = [
  { id: 'all', name: 'All Courses' },
  { id: 'stellar-101', name: 'Stellar Fundamentals' },
  { id: 'smart-contracts', name: 'Smart Contracts Deep Dive' },
  { id: 'defi-studio', name: 'DeFi Studio' },
];

const STUDENT_OPTIONS: StudentOption[] = [
  { id: 'all', name: 'All Students' },
  { id: 'stu-1', name: 'Ava Johnson' },
  { id: 'stu-2', name: 'Michael Chen' },
  { id: 'stu-3', name: 'Priya Sharma' },
];

const HEATMAP_COLOR_SCALE = ['#e2e8f0', '#bfdbfe', '#7dd3fc', '#38bdf8', '#0ea5e9'];

const HEATMAP_DATA: HeatmapCell[] = [
  { date: '2026-04-01', courseId: 'stellar-101', studentId: 'stu-1', activeMinutes: 12, lessonsCompleted: 1, interactions: 4 },
  { date: '2026-04-02', courseId: 'stellar-101', studentId: 'stu-2', activeMinutes: 34, lessonsCompleted: 2, interactions: 9 },
  { date: '2026-04-03', courseId: 'smart-contracts', studentId: 'stu-3', activeMinutes: 66, lessonsCompleted: 3, interactions: 12 },
  { date: '2026-04-04', courseId: 'defi-studio', studentId: 'stu-1', activeMinutes: 21, lessonsCompleted: 1, interactions: 6 },
  { date: '2026-04-05', courseId: 'stellar-101', studentId: 'stu-3', activeMinutes: 5, lessonsCompleted: 0, interactions: 1 },
  { date: '2026-04-06', courseId: 'smart-contracts', studentId: 'stu-2', activeMinutes: 42, lessonsCompleted: 2, interactions: 11 },
  { date: '2026-04-07', courseId: 'defi-studio', studentId: 'stu-3', activeMinutes: 75, lessonsCompleted: 4, interactions: 16 },
  { date: '2026-04-08', courseId: 'stellar-101', studentId: 'stu-2', activeMinutes: 31, lessonsCompleted: 2, interactions: 8 },
  { date: '2026-04-09', courseId: 'smart-contracts', studentId: 'stu-1', activeMinutes: 58, lessonsCompleted: 3, interactions: 14 },
  { date: '2026-04-10', courseId: 'defi-studio', studentId: 'stu-2', activeMinutes: 19, lessonsCompleted: 1, interactions: 5 },
  { date: '2026-04-11', courseId: 'stellar-101', studentId: 'stu-1', activeMinutes: 26, lessonsCompleted: 1, interactions: 7 },
  { date: '2026-04-12', courseId: 'defi-studio', studentId: 'stu-3', activeMinutes: 49, lessonsCompleted: 2, interactions: 10 },
  { date: '2026-04-13', courseId: 'smart-contracts', studentId: 'stu-1', activeMinutes: 64, lessonsCompleted: 3, interactions: 17 },
  { date: '2026-04-14', courseId: 'stellar-101', studentId: 'stu-2', activeMinutes: 37, lessonsCompleted: 2, interactions: 9 },
  { date: '2026-04-15', courseId: 'defi-studio', studentId: 'stu-1', activeMinutes: 9, lessonsCompleted: 0, interactions: 3 },
  { date: '2026-04-16', courseId: 'smart-contracts', studentId: 'stu-2', activeMinutes: 71, lessonsCompleted: 4, interactions: 18 },
  { date: '2026-04-17', courseId: 'stellar-101', studentId: 'stu-3', activeMinutes: 47, lessonsCompleted: 2, interactions: 11 },
  { date: '2026-04-18', courseId: 'defi-studio', studentId: 'stu-2', activeMinutes: 24, lessonsCompleted: 1, interactions: 6 },
  { date: '2026-04-19', courseId: 'smart-contracts', studentId: 'stu-3', activeMinutes: 52, lessonsCompleted: 3, interactions: 12 },
  { date: '2026-04-20', courseId: 'stellar-101', studentId: 'stu-1', activeMinutes: 16, lessonsCompleted: 1, interactions: 5 },
  { date: '2026-04-21', courseId: 'defi-studio', studentId: 'stu-3', activeMinutes: 67, lessonsCompleted: 4, interactions: 15 },
  { date: '2026-04-22', courseId: 'smart-contracts', studentId: 'stu-1', activeMinutes: 59, lessonsCompleted: 3, interactions: 13 },
  { date: '2026-04-23', courseId: 'stellar-101', studentId: 'stu-2', activeMinutes: 28, lessonsCompleted: 2, interactions: 7 },
  { date: '2026-04-24', courseId: 'defi-studio', studentId: 'stu-1', activeMinutes: 40, lessonsCompleted: 2, interactions: 10 },
  { date: '2026-04-25', courseId: 'smart-contracts', studentId: 'stu-2', activeMinutes: 74, lessonsCompleted: 4, interactions: 19 },
  { date: '2026-04-26', courseId: 'stellar-101', studentId: 'stu-3', activeMinutes: 33, lessonsCompleted: 2, interactions: 9 },
  { date: '2026-04-27', courseId: 'defi-studio', studentId: 'stu-2', activeMinutes: 22, lessonsCompleted: 1, interactions: 4 },
  { date: '2026-04-28', courseId: 'smart-contracts', studentId: 'stu-3', activeMinutes: 61, lessonsCompleted: 3, interactions: 14 },
];

const EARNINGS_DATA: Record<TimeRange, EarningsPoint[]> = {
  daily: [
    { period: 'Mon', dateLabel: 'Apr 22', total: 410, card: 245, bankTransfer: 115, wallet: 50 },
    { period: 'Tue', dateLabel: 'Apr 23', total: 560, card: 325, bankTransfer: 180, wallet: 55 },
    { period: 'Wed', dateLabel: 'Apr 24', total: 490, card: 280, bankTransfer: 150, wallet: 60 },
    { period: 'Thu', dateLabel: 'Apr 25', total: 620, card: 370, bankTransfer: 190, wallet: 60 },
    { period: 'Fri', dateLabel: 'Apr 26', total: 690, card: 410, bankTransfer: 220, wallet: 60 },
    { period: 'Sat', dateLabel: 'Apr 27', total: 730, card: 435, bankTransfer: 235, wallet: 60 },
    { period: 'Sun', dateLabel: 'Apr 28', total: 665, card: 380, bankTransfer: 215, wallet: 70 },
  ],
  weekly: [
    { period: 'W1', dateLabel: 'Apr 1-7', total: 3220, card: 1880, bankTransfer: 980, wallet: 360 },
    { period: 'W2', dateLabel: 'Apr 8-14', total: 3590, card: 2075, bankTransfer: 1110, wallet: 405 },
    { period: 'W3', dateLabel: 'Apr 15-21', total: 3885, card: 2275, bankTransfer: 1180, wallet: 430 },
    { period: 'W4', dateLabel: 'Apr 22-28', total: 4165, card: 2445, bankTransfer: 1305, wallet: 415 },
  ],
  monthly: [
    { period: 'Jan', dateLabel: 'Jan 2026', total: 11480, card: 6610, bankTransfer: 3520, wallet: 1350 },
    { period: 'Feb', dateLabel: 'Feb 2026', total: 12940, card: 7520, bankTransfer: 3830, wallet: 1590 },
    { period: 'Mar', dateLabel: 'Mar 2026', total: 14320, card: 8365, bankTransfer: 4240, wallet: 1715 },
    { period: 'Apr', dateLabel: 'Apr 2026', total: 14860, card: 8675, bankTransfer: 4575, wallet: 1610 },
  ],
};

const COURSE_FUNNEL: Record<string, FunnelStage[]> = {
  all: [
    { stage: 'Enrolled', value: 1440, percentage: 100, dropOffFromPrevious: 0 },
    { stage: 'Started', value: 1220, percentage: 84.7, dropOffFromPrevious: 15.3 },
    { stage: 'Progressed', value: 840, percentage: 58.3, dropOffFromPrevious: 31.1 },
    { stage: 'Completed', value: 510, percentage: 35.4, dropOffFromPrevious: 39.3 },
  ],
  'stellar-101': [
    { stage: 'Enrolled', value: 480, percentage: 100, dropOffFromPrevious: 0 },
    { stage: 'Started', value: 425, percentage: 88.5, dropOffFromPrevious: 11.5 },
    { stage: 'Progressed', value: 302, percentage: 62.9, dropOffFromPrevious: 28.9 },
    { stage: 'Completed', value: 210, percentage: 43.8, dropOffFromPrevious: 30.5 },
  ],
  'smart-contracts': [
    { stage: 'Enrolled', value: 520, percentage: 100, dropOffFromPrevious: 0 },
    { stage: 'Started', value: 420, percentage: 80.8, dropOffFromPrevious: 19.2 },
    { stage: 'Progressed', value: 280, percentage: 53.8, dropOffFromPrevious: 33.3 },
    { stage: 'Completed', value: 150, percentage: 28.8, dropOffFromPrevious: 46.4 },
  ],
  'defi-studio': [
    { stage: 'Enrolled', value: 440, percentage: 100, dropOffFromPrevious: 0 },
    { stage: 'Started', value: 375, percentage: 85.2, dropOffFromPrevious: 14.8 },
    { stage: 'Progressed', value: 258, percentage: 58.6, dropOffFromPrevious: 31.2 },
    { stage: 'Completed', value: 150, percentage: 34.1, dropOffFromPrevious: 41.9 },
  ],
};

const LESSON_TIME_DATA: Record<string, LessonTimePoint[]> = {
  all: [
    { lessonId: 'l-1', lessonTitle: 'Stellar Setup and Tooling', module: 'Module 1', avgMinutes: 18, completionRate: 94, studentsTracked: 238 },
    { lessonId: 'l-2', lessonTitle: 'Wallet Architecture', module: 'Module 1', avgMinutes: 24, completionRate: 91, studentsTracked: 226 },
    { lessonId: 'l-3', lessonTitle: 'Contract Lifecycle', module: 'Module 2', avgMinutes: 31, completionRate: 83, studentsTracked: 210 },
    { lessonId: 'l-4', lessonTitle: 'State Machines in Practice', module: 'Module 2', avgMinutes: 39, completionRate: 74, studentsTracked: 194 },
    { lessonId: 'l-5', lessonTitle: 'Secure Transaction Flows', module: 'Module 3', avgMinutes: 27, completionRate: 80, studentsTracked: 182 },
    { lessonId: 'l-6', lessonTitle: 'Performance Profiling', module: 'Module 3', avgMinutes: 42, completionRate: 69, studentsTracked: 176 },
    { lessonId: 'l-7', lessonTitle: 'Deployment and Monitoring', module: 'Module 4', avgMinutes: 35, completionRate: 77, studentsTracked: 170 },
  ],
  'stellar-101': [
    { lessonId: 's-1', lessonTitle: 'What Is Stellar?', module: 'Intro', avgMinutes: 12, completionRate: 97, studentsTracked: 180 },
    { lessonId: 's-2', lessonTitle: 'Assets and Issuers', module: 'Intro', avgMinutes: 19, completionRate: 92, studentsTracked: 176 },
    { lessonId: 's-3', lessonTitle: 'Building Your First Payment App', module: 'Core', avgMinutes: 28, completionRate: 86, studentsTracked: 165 },
    { lessonId: 's-4', lessonTitle: 'Error Handling and Retries', module: 'Core', avgMinutes: 33, completionRate: 79, studentsTracked: 152 },
  ],
  'smart-contracts': [
    { lessonId: 'c-1', lessonTitle: 'Contract Runtime Fundamentals', module: 'Module 1', avgMinutes: 29, completionRate: 88, studentsTracked: 201 },
    { lessonId: 'c-2', lessonTitle: 'Storage and Gas Costs', module: 'Module 1', avgMinutes: 36, completionRate: 81, studentsTracked: 195 },
    { lessonId: 'c-3', lessonTitle: 'Attack Vectors', module: 'Module 2', avgMinutes: 44, completionRate: 71, studentsTracked: 183 },
    { lessonId: 'c-4', lessonTitle: 'Audit Checklist Workshop', module: 'Module 2', avgMinutes: 41, completionRate: 74, studentsTracked: 178 },
  ],
  'defi-studio': [
    { lessonId: 'd-1', lessonTitle: 'Liquidity Pools 101', module: 'Module 1', avgMinutes: 23, completionRate: 90, studentsTracked: 172 },
    { lessonId: 'd-2', lessonTitle: 'Impermanent Loss Simulator', module: 'Module 1', avgMinutes: 32, completionRate: 82, studentsTracked: 168 },
    { lessonId: 'd-3', lessonTitle: 'Yield Strategy Design', module: 'Module 2', avgMinutes: 46, completionRate: 66, studentsTracked: 154 },
    { lessonId: 'd-4', lessonTitle: 'Risk Controls and Rebalancing', module: 'Module 2', avgMinutes: 38, completionRate: 72, studentsTracked: 149 },
  ],
};

const getHeatColor = (minutes: number): string => {
  if (minutes <= 0) return HEATMAP_COLOR_SCALE[0];
  if (minutes < 15) return HEATMAP_COLOR_SCALE[1];
  if (minutes < 30) return HEATMAP_COLOR_SCALE[2];
  if (minutes < 50) return HEATMAP_COLOR_SCALE[3];
  return HEATMAP_COLOR_SCALE[4];
};

const buildDailyHeatmapColumns = (rows: HeatmapCell[]) => {
  const map = new Map<string, HeatmapCell>();
  rows.forEach((row) => map.set(row.date, row));
  const columns: HeatmapCell[] = [];
  for (let day = 1; day <= 28; day += 1) {
    const date = `2026-04-${String(day).padStart(2, '0')}`;
    columns.push(
      map.get(date) ?? {
        date,
        courseId: 'n/a',
        studentId: 'n/a',
        activeMinutes: 0,
        lessonsCompleted: 0,
        interactions: 0,
      },
    );
  }
  return columns;
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const toCsv = (rows: EarningsPoint[]) => {
  const headers = ['Period', 'Date', 'Total', 'Card', 'Bank Transfer', 'Wallet'];
  const body = rows.map((row) =>
    [row.period, row.dateLabel, row.total, row.card, row.bankTransfer, row.wallet].join(','),
  );
  return [headers.join(','), ...body].join('\n');
};

const downloadCsv = (filename: string, csv: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const dateRangeOptions: { value: TimeRange; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

function StudentEngagementHeatmap() {
  const [courseId, setCourseId] = useState<string>('all');
  const [studentId, setStudentId] = useState<string>('all');

  const filteredRows = useMemo(
    () =>
      HEATMAP_DATA.filter(
        (row) =>
          (courseId === 'all' || row.courseId === courseId) &&
          (studentId === 'all' || row.studentId === studentId),
      ),
    [courseId, studentId],
  );

  const heatmapRows = useMemo(() => buildDailyHeatmapColumns(filteredRows), [filteredRows]);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Student Engagement Heatmap</CardTitle>
            <CardDescription>
              Daily activity intensity with quick visibility into inactive days.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger className="w-full sm:w-[190px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_OPTIONS.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger className="w-full sm:w-[190px]">
                <SelectValue placeholder="Filter by student" />
              </SelectTrigger>
              <SelectContent>
                {STUDENT_OPTIONS.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider delayDuration={90}>
          <div className="grid grid-cols-7 gap-2 sm:grid-cols-14 lg:grid-cols-28">
            {heatmapRows.map((cell) => (
              <Tooltip key={cell.date}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="h-7 w-full rounded-md border border-slate-300/40 transition-transform hover:scale-[1.05]"
                    style={{ backgroundColor: getHeatColor(cell.activeMinutes) }}
                    aria-label={`Engagement on ${cell.date}`}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs leading-5">
                  <p className="font-semibold">{cell.date}</p>
                  <p>Active minutes: {cell.activeMinutes}</p>
                  <p>Lessons completed: {cell.lessonsCompleted}</p>
                  <p>Interactions: {cell.interactions}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Legend:</span>
          <span>Low</span>
          {HEATMAP_COLOR_SCALE.map((color) => (
            <span key={color} className="h-3 w-6 rounded-sm border" style={{ backgroundColor: color }} />
          ))}
          <span>High</span>
        </div>
      </CardContent>
    </Card>
  );
}

function InstructorEarningsAnalytics() {
  const [range, setRange] = useState<TimeRange>('weekly');
  const [courseId, setCourseId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const rows = useMemo(() => EARNINGS_DATA[range], [range]);

  const totalRevenue = useMemo(
    () => rows.reduce((acc, row) => acc + row.total, 0),
    [rows],
  );
  const sourceBreakdown = useMemo(
    () => ({
      card: rows.reduce((acc, row) => acc + row.card, 0),
      bank: rows.reduce((acc, row) => acc + row.bankTransfer, 0),
      wallet: rows.reduce((acc, row) => acc + row.wallet, 0),
    }),
    [rows],
  );

  const refresh = () => {
    setIsError(false);
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
    }, 650);
  };

  const simulateError = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setIsError(true);
    }, 400);
  };

  const exportCsv = () => {
    const csv = toCsv(rows);
    downloadCsv(`instructor-earnings-${range}.csv`, csv);
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Instructor Earnings Analytics</CardTitle>
            <CardDescription>
              Revenue trends with payment source and course filters.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={range} onValueChange={(value) => setRange(value as TimeRange)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_OPTIONS.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-semibold">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Card Payments</p>
            <p className="text-xl font-semibold">{formatCurrency(sourceBreakdown.card)}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Bank Transfers</p>
            <p className="text-xl font-semibold">{formatCurrency(sourceBreakdown.bank)}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Wallet</p>
            <p className="text-xl font-semibold">{formatCurrency(sourceBreakdown.wallet)}</p>
          </div>
        </div>

        {isError ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
            <div className="mb-2 flex items-center gap-2 font-medium text-red-700 dark:text-red-300">
              <TriangleAlert className="h-4 w-4" />
              Unable to load earnings analytics
            </div>
            <Button variant="outline" size="sm" onClick={refresh}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="h-[300px] animate-pulse rounded-xl bg-muted" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows}>
                <defs>
                  <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <RechartsTooltip
                  formatter={(value: number, key: string) => [formatCurrency(value), key]}
                  labelFormatter={(value) => {
                    const row = rows.find((item) => item.period === value);
                    return row?.dateLabel ?? value;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#0ea5e9"
                  fill="url(#earningsFill)"
                  strokeWidth={2}
                  name="Total Earnings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={simulateError} className="text-muted-foreground">
          Simulate Error State
        </Button>
      </CardContent>
    </Card>
  );
}

function CourseCompletionFunnel() {
  const [courseId, setCourseId] = useState<string>('all');
  const data = useMemo(() => COURSE_FUNNEL[courseId] ?? COURSE_FUNNEL.all, [courseId]);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Course Completion Funnel</CardTitle>
            <CardDescription>
              Enrolled to completed progression and stage drop-off rates.
            </CardDescription>
          </div>
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="w-full sm:w-[190px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {COURSE_OPTIONS.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <RechartsTooltip
                formatter={(value: number, name: string, item: { payload?: FunnelStage }) => {
                  const payload = item?.payload;
                  if (!payload) return [value, name];
                  return [`${payload.value.toLocaleString()} students`, `${payload.stage} (${payload.percentage.toFixed(1)}%)`];
                }}
              />
              <Funnel dataKey="value" data={data} isAnimationActive>
                {data.map((entry) => (
                  <Cell
                    key={entry.stage}
                    fill={entry.dropOffFromPrevious > 35 ? '#ef4444' : entry.dropOffFromPrevious > 20 ? '#f59e0b' : '#10b981'}
                  />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {data.map((stage) => (
            <div key={stage.stage} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{stage.stage}</p>
                <p className="text-sm">{stage.value.toLocaleString()}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {stage.percentage.toFixed(1)}% of enrolled
              </p>
              {stage.dropOffFromPrevious > 0 ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Drop-off from previous stage: {stage.dropOffFromPrevious.toFixed(1)}%
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TimeSpentPerLessonChart() {
  const [courseId, setCourseId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'avgMinutes' | 'completionRate'>('avgMinutes');

  const rows = useMemo(() => {
    const base = LESSON_TIME_DATA[courseId] ?? LESSON_TIME_DATA.all;
    return [...base].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [courseId, sortBy]);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Time Spent Per Lesson</CardTitle>
            <CardDescription>
              Compare average viewing time, completion rates, and lesson engagement.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger className="w-full sm:w-[190px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_OPTIONS.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'avgMinutes' | 'completionRate')}>
              <SelectTrigger className="w-full sm:w-[190px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avgMinutes">Sort by Time Spent</SelectItem>
                <SelectItem value="completionRate">Sort by Completion Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="lessonTitle"
                width={150}
                tick={{ fontSize: 11 }}
              />
              <RechartsTooltip
                formatter={(value: number, key: string, item: { payload?: LessonTimePoint }) => {
                  const payload = item?.payload;
                  if (!payload) return [value, key];
                  if (key === 'avgMinutes') return [`${value} min`, 'Average Time'];
                  return [`${value}%`, 'Completion Rate'];
                }}
                labelFormatter={(label, payload) => {
                  const point = payload?.[0]?.payload as LessonTimePoint | undefined;
                  if (!point) return label;
                  return `${point.lessonTitle} (${point.module})`;
                }}
              />
              <Bar dataKey="avgMinutes" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="avgMinutes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground">
          Optimized for larger lesson sets through compact vertical bars and sortable metrics.
        </p>
      </CardContent>
    </Card>
  );
}

export default function InstructorAnalyticsWidgets() {
  return (
    <div className="space-y-6">
      <StudentEngagementHeatmap />
      <div className="grid gap-6 xl:grid-cols-2">
        <InstructorEarningsAnalytics />
        <CourseCompletionFunnel />
      </div>
      <TimeSpentPerLessonChart />
    </div>
  );
}
