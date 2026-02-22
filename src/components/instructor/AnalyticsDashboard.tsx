'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_ANALYTICS } from '@/data/mockInstructorData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const CHART_COLORS = {
  primary: '#5c0f49',
  secondary: '#7c3aed',
  accent: '#ffcc00',
  success: '#16a34a',
};

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
];
const TOOLTIP_STYLE = {
  backgroundColor: '#0b1220',
  border: '1px solid #1d4ed8',
  borderRadius: 'var(--radius)',
  color: '#e5e7eb',
  boxShadow: '0 8px 24px rgba(2, 6, 23, 0.45)',
};
const TOOLTIP_LABEL_STYLE = { color: '#e5e7eb', fontWeight: 600 };
const TOOLTIP_ITEM_STYLE = { color: '#e5e7eb' };

export default function AnalyticsDashboard() {
  const { enrollmentByMonth, completionByCourse, activityByDay, summary } = MOCK_ANALYTICS;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#5c0f49]/15">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#5c0f49]">{summary.totalStudents}</p>
          </CardContent>
        </Card>
        <Card className="border-[#5c0f49]/15">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{summary.activeEnrollments}</p>
          </CardContent>
        </Card>
        <Card className="border-[#5c0f49]/15">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{summary.completionRate}%</p>
          </CardContent>
        </Card>
        <Card className="border-[#5c0f49]/15">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-500">{summary.pendingApplications}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#5c0f49]/15">
        <CardHeader>
          <CardTitle>Enrollment over time</CardTitle>
          <p className="text-sm text-muted-foreground">New enrollments by month (mock)</p>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentByMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={TOOLTIP_LABEL_STYLE}
                  itemStyle={TOOLTIP_ITEM_STYLE}
                />
                <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="Enrollments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[#5c0f49]/15">
          <CardHeader>
            <CardTitle>Completion by course</CardTitle>
            <p className="text-sm text-muted-foreground">Completed vs in progress (mock)</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={completionByCourse}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis type="category" dataKey="name" width={100} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={TOOLTIP_LABEL_STYLE}
                    itemStyle={TOOLTIP_ITEM_STYLE}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill={CHART_COLORS.success} radius={[0, 4, 4, 0]} name="Completed" />
                  <Bar dataKey="inProgress" fill={CHART_COLORS.secondary} radius={[0, 4, 4, 0]} name="In progress" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#5c0f49]/15">
          <CardHeader>
            <CardTitle>Weekly activity</CardTitle>
            <p className="text-sm text-muted-foreground">Active users by day (mock)</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={TOOLTIP_LABEL_STYLE}
                    itemStyle={TOOLTIP_ITEM_STYLE}
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke={CHART_COLORS.accent}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.accent }}
                    name="Active users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#5c0f49]/15">
        <CardHeader>
          <CardTitle>Enrollment distribution (mock)</CardTitle>
          <p className="text-sm text-muted-foreground">Share by course</p>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full flex justify-center overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionByCourse.map((c) => ({ name: c.name, value: c.completed + c.inProgress }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  labelLine={false}
                  label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {completionByCourse.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={TOOLTIP_LABEL_STYLE}
                  itemStyle={TOOLTIP_ITEM_STYLE}
                  formatter={(value) => [value ?? 0, 'Enrollments']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
