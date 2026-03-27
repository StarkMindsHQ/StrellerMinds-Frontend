'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Activity,
  Pause,
  Play,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActivityMetrics } from '@/hooks/useActivityMonitor';

export interface EngagementMeterProps {
  metrics: ActivityMetrics;
  isActive: boolean;
  isTabVisible: boolean;
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export const EngagementMeter: React.FC<EngagementMeterProps> = ({
  metrics,
  isActive,
  isTabVisible,
  className,
  showDetails = true,
  compact = false,
}) => {
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [previousScore, setPreviousScore] = useState(metrics.engagementScore);

  // Track score trend
  useEffect(() => {
    if (metrics.engagementScore > previousScore + 5) {
      setTrend('up');
    } else if (metrics.engagementScore < previousScore - 5) {
      setTrend('down');
    } else {
      setTrend('stable');
    }
    setPreviousScore(metrics.engagementScore);
  }, [metrics.engagementScore, previousScore]);

  // Get engagement level
  const getEngagementLevel = (
    score: number,
  ): {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ReactNode;
  } => {
    if (score >= 80) {
      return {
        label: 'Excellent',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        icon: <CheckCircle className="w-4 h-4" />,
      };
    } else if (score >= 60) {
      return {
        label: 'Good',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        icon: <TrendingUp className="w-4 h-4" />,
      };
    } else if (score >= 40) {
      return {
        label: 'Fair',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        icon: <Minus className="w-4 h-4" />,
      };
    } else {
      return {
        label: 'Needs Attention',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        icon: <AlertCircle className="w-4 h-4" />,
      };
    }
  };

  const engagementLevel = getEngagementLevel(metrics.engagementScore);

  // Format time
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Compact view
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="relative">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - metrics.engagementScore / 100)}`}
              className={engagementLevel.color}
              initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
              animate={{
                strokeDashoffset:
                  2 * Math.PI * 20 * (1 - metrics.engagementScore / 100),
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('text-xs font-bold', engagementLevel.color)}>
              {metrics.engagementScore}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isTabVisible ? (
            <Eye className="w-4 h-4 text-green-500" />
          ) : (
            <EyeOff className="w-4 h-4 text-red-500" />
          )}
          {isActive ? (
            <Activity className="w-4 h-4 text-green-500" />
          ) : (
            <Pause className="w-4 h-4 text-yellow-500" />
          )}
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Engagement Monitor
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {trend === 'up' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <TrendingUp className="w-4 h-4 text-green-500" />
              </motion.div>
            )}
            {trend === 'down' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <TrendingDown className="w-4 h-4 text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Engagement Score Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - metrics.engagementScore / 100)}`}
              className={engagementLevel.color}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{
                strokeDashoffset:
                  2 * Math.PI * 56 * (1 - metrics.engagementScore / 100),
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={cn('text-3xl font-bold', engagementLevel.color)}
              key={metrics.engagementScore}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {metrics.engagementScore}
            </motion.span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Engagement
            </span>
          </div>
        </div>
      </div>

      {/* Engagement Level Badge */}
      <div className="flex items-center justify-center mb-6">
        <div
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full',
            engagementLevel.bgColor,
          )}
        >
          {engagementLevel.icon}
          <span className={cn('text-sm font-semibold', engagementLevel.color)}>
            {engagementLevel.label}
          </span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={cn(
            'flex items-center gap-2 p-3 rounded-lg',
            isTabVisible
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-red-50 dark:bg-red-900/20',
          )}
        >
          {isTabVisible ? (
            <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Tab Status
            </p>
            <p
              className={cn(
                'text-sm font-semibold',
                isTabVisible
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400',
              )}
            >
              {isTabVisible ? 'Visible' : 'Hidden'}
            </p>
          </div>
        </div>

        <div
          className={cn(
            'flex items-center gap-2 p-3 rounded-lg',
            isActive
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-yellow-50 dark:bg-yellow-900/20',
          )}
        >
          {isActive ? (
            <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <Pause className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          )}
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Activity</p>
            <p
              className={cn(
                'text-sm font-semibold',
                isActive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-yellow-600 dark:text-yellow-400',
              )}
            >
              {isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      {showDetails && (
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total Time
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatTime(metrics.totalTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Tab Switches
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {metrics.tabSwitches}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Video Pauses
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {metrics.videoPauses}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Inactive Time
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatTime(metrics.inactiveTime)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementMeter;
