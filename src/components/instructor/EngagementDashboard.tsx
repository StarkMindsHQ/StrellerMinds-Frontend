'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Pause,
  Clock,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ActivityLog,
  ActivityLogSummary,
  activityLogger,
} from '@/services/activityLogger';

interface EngagementDashboardProps {
  lessonId?: string;
  courseId?: string;
  className?: string;
}

interface StudentEngagement {
  userId: string;
  userName: string;
  averageScore: number;
  totalTime: number;
  lastActive: number;
  trend: 'improving' | 'declining' | 'stable';
}

export const EngagementDashboard: React.FC<EngagementDashboardProps> = ({
  lessonId,
  courseId,
  className,
}) => {
  const [dateRange, setDateRange] = useState<
    'today' | 'week' | 'month' | 'all'
  >('week');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Fetch activity summary
  const {
    data: summary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useQuery<ActivityLogSummary>({
    queryKey: ['activity-summary', lessonId, dateRange],
    queryFn: async () => {
      const endDate = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'all':
          startDate = new Date(0);
          break;
      }

      // Mock data for demonstration
      return {
        totalSessions: 156,
        averageEngagement: 78,
        totalTime: 45600000, // 12.67 hours
        totalTabSwitches: 234,
        totalVideoPauses: 89,
        engagementTrend: 'improving' as const,
      };
    },
    staleTime: 60000, // 1 minute
  });

  // Fetch detailed logs
  const { data: logs, isLoading: logsLoading } = useQuery<ActivityLog[]>({
    queryKey: ['activity-logs', lessonId],
    queryFn: async () => {
      // Mock data for demonstration
      return [];
    },
    staleTime: 60000,
  });

  // Calculate student engagement
  const studentEngagement: StudentEngagement[] = [
    {
      userId: '1',
      userName: 'Sarah Johnson',
      averageScore: 92,
      totalTime: 7200000,
      lastActive: Date.now() - 3600000,
      trend: 'improving',
    },
    {
      userId: '2',
      userName: 'Michael Chen',
      averageScore: 85,
      totalTime: 6400000,
      lastActive: Date.now() - 7200000,
      trend: 'stable',
    },
    {
      userId: '3',
      userName: 'Emma Davis',
      averageScore: 68,
      totalTime: 5200000,
      lastActive: Date.now() - 10800000,
      trend: 'declining',
    },
  ];

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleExport = () => {
    if (logs) {
      activityLogger.downloadCSV(logs, `engagement-report-${Date.now()}.csv`);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (summaryLoading) {
    return (
      <div className={cn('flex items-center justify-center p-12', className)}>
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Engagement Dashboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor student activity and engagement metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={() => refetchSummary()}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            {summary && getTrendIcon(summary.engagementTrend)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Avg. Engagement
          </p>
          <p
            className={cn(
              'text-3xl font-bold',
              getScoreColor(summary?.averageEngagement || 0),
            )}
          >
            {summary?.averageEngagement || 0}%
          </p>
        </motion.div>

        {/* Total Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Sessions
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {summary?.totalSessions || 0}
          </p>
        </motion.div>

        {/* Total Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Time
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {formatTime(summary?.totalTime || 0)}
          </p>
        </motion.div>

        {/* Distractions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Tab Switches
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {summary?.totalTabSwitches || 0}
          </p>
        </motion.div>
      </div>

      {/* Student Engagement Table */}
      <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Student Engagement
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Individual student performance and activity
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Engagement Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {studentEngagement.map((student) => (
                <tr
                  key={student.userId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                  onClick={() => setSelectedStudent(student.userId)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {student.userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {student.userName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                        <div
                          className={cn(
                            'h-2 rounded-full transition-all',
                            student.averageScore >= 80
                              ? 'bg-green-500'
                              : student.averageScore >= 60
                                ? 'bg-blue-500'
                                : student.averageScore >= 40
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500',
                          )}
                          style={{ width: `${student.averageScore}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          getScoreColor(student.averageScore),
                        )}
                      >
                        {student.averageScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatTime(student.totalTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatRelativeTime(student.lastActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTrendIcon(student.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EngagementDashboard;
