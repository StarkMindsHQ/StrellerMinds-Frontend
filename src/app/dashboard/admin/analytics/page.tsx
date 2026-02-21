'use client';

import React, { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  Download,
  Filter,
  Layers,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Calendar,
  RefreshCcw,
  Zap,
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRealTimeMetrics } from '@/hooks/useRealTimeMetrics';
import { exportAnalyticsData, type ExportFormat } from '@/utils/exportUtils';
import { toast } from 'sonner';

const AnalyticsMetricCard = lazy(() =>
  import('@/components/admin/analytics/AnalyticsMetricCard').then((module) => ({
    default: module.AnalyticsMetricCard,
  })),
);

const RealTimeChart = lazy(() =>
  import('@/components/admin/analytics/RealTimeChart').then((module) => ({
    default: module.RealTimeChart,
  })),
);

const GlobalAlertSystem = lazy(() =>
  import('@/components/admin/analytics/GlobalAlertSystem').then((module) => ({
    default: module.GlobalAlertSystem,
  })),
);

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useRealTimeMetrics();
  const [activeRange, setActiveRange] = useState('24h');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async (format: ExportFormat) => {
    if (!data) return;

    setIsExporting(true);
    try {
      await exportAnalyticsData(format, data, 'StarkMinds_Analytics');
      toast.success(`Report exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [data]);

  // Prepare chart data
  const usersChartData = useMemo(() => ({
    labels: data?.metricsHistory.activeUsers.map((_, i) => i.toString()) || [],
    datasets: [
      {
        label: 'Active Users',
        data: data?.metricsHistory.activeUsers || [],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  }), [data?.metricsHistory.activeUsers]);

  const revenueChartData = useMemo(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Weekly Revenue',
        data: [1200, 1900, 1500, 2400, 3200, 2800, 3100],
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Projected',
        data: [1500, 2200, 1800, 2600, 3500, 3000, 3400],
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderRadius: 4,
      },
    ],
  }), []);

  const distributionData = useMemo(() => ({
    labels: ['Smart Contracts', 'Defi', 'NFTs', 'Rust Fundamentals', 'Others'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#8b5cf6',
          '#ec4899',
          '#3b82f6',
          '#10b981',
          '#f59e0b',
        ],
        borderWidth: 0,
      },
    ],
  }), []);

  const cardFallback = (
    <Card className="animate-pulse">
      <CardContent className="h-28" />
    </Card>
  );

  return (
    <MainLayout variant="container" padding="medium">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Analytics</span>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              Advanced Analytics
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 animate-pulse"
              >
                <Zap className="h-3 w-3 mr-1 fill-current" />
                Live
              </Badge>
            </h1>
            <p className="text-muted-foreground text-lg">
              Real-time platform performance and user engagement insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              {activeRange === '24h' ? 'Last 24 Hours' : activeRange}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isExporting || isLoading}
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  Export as PDF (.pdf)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                  Export as Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV (.csv)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              className="gap-2 shadow-lg hover:shadow-primary/20"
            >
              <RefreshCcw className="h-4 w-4" />
              Auto-refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Suspense fallback={cardFallback}>
          <AnalyticsMetricCard
            title="Active Users"
            value={data?.activeUsers || 0}
            icon={<Users className="h-5 w-5" />}
            trend="up"
            change={12.5}
            description="from last hour"
            loading={isLoading}
          />
        </Suspense>
        <Suspense fallback={cardFallback}>
          <AnalyticsMetricCard
            title="Course Enrollments"
            value={data?.totalEnrollments.toLocaleString() || 0}
            icon={<Layers className="h-5 w-5" />}
            trend="up"
            change={8.2}
            description="this week"
            loading={isLoading}
          />
        </Suspense>
        <Suspense fallback={cardFallback}>
          <AnalyticsMetricCard
            title="Daily Revenue"
            value={`$${(data?.revenue || 0).toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
            trend="down"
            change={2.4}
            description="vs yesterday"
            loading={isLoading}
          />
        </Suspense>
        <Suspense fallback={cardFallback}>
          <AnalyticsMetricCard
            title="Completion Rate"
            value={`${data?.completionRate}%`}
            icon={<Activity className="h-5 w-5" />}
            trend="stable"
            change={0.1}
            description="avg. session"
            loading={isLoading}
          />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Real-time Performance
              </CardTitle>
              <CardDescription>
                Live user session activity across platform
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Badge variant="outline" className="text-[10px] font-bold">
                1m granularity
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 h-[350px] md:h-[400px]">
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted rounded-md" />}>
              <RealTimeChart
                type="line"
                data={usersChartData}
                className="w-full h-full"
              />
            </Suspense>
          </CardContent>
        </Card>

        {/* Live Feed */}
        <Suspense fallback={<Card className="h-full animate-pulse"><CardContent className="h-full min-h-[280px]" /></Card>}>
          <GlobalAlertSystem
            events={data?.recentEvents || []}
            className="h-full"
          />
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Revenue Distribution
            </CardTitle>
            <CardDescription>
              Weekly gains compared to projections
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted rounded-md" />}>
              <RealTimeChart
                type="bar"
                data={revenueChartData}
                className="w-full h-full"
              />
            </Suspense>
          </CardContent>
        </Card>

        {/* Course Popularity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Category Engagement
            </CardTitle>
            <CardDescription>
              Student distribution per course category
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <div className="w-full h-full max-w-[300px]">
              <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted rounded-md" />}>
                <RealTimeChart
                  type="doughnut"
                  data={distributionData}
                  className="w-full h-full"
                />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
