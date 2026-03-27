'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type TrendComparison } from '@/types/learningAnalytics';

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: TrendComparison;
  className?: string;
}

const trendStyles = {
  up: {
    icon: ArrowUpRight,
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
  down: {
    icon: ArrowDownRight,
    textClass: 'text-rose-600 dark:text-rose-400',
  },
  stable: {
    icon: Minus,
    textClass: 'text-muted-foreground',
  },
} as const;

export function AnalyticsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: AnalyticsCardProps) {
  const trendMeta = trend ? trendStyles[trend.direction] : null;
  const TrendIcon = trendMeta?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={className}
    >
      <Card className="border-primary/15 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <span className="text-primary">{icon}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <CardDescription className="text-xs">{description}</CardDescription>
          {trend && trendMeta && TrendIcon ? (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-semibold',
                trendMeta.textClass,
              )}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              <span>
                {trend.delta > 0 ? '+' : ''}
                {trend.delta}
                {title.includes('Watch') ? '' : '%'} ({trend.window})
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AnalyticsCard;
