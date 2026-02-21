import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface AnalyticsMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  className?: string;
  loading?: boolean;
}

export const AnalyticsMetricCard: React.FC<AnalyticsMetricCardProps> = React.memo(({
  title,
  value,
  description,
  icon,
  trend,
  change,
  className,
  loading,
}) => {
  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-4 w-4 bg-muted rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 bg-muted rounded mb-2"></div>
          <div className="h-3 w-32 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-md',
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-1 mt-1">
            {trend === 'up' && (
              <ArrowUpRight className="h-3 w-3 text-green-500" />
            )}
            {trend === 'down' && (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            )}
            {trend === 'stable' && <Minus className="h-3 w-3 text-gray-500" />}

            <p
              className={cn(
                'text-xs font-medium',
                trend === 'up'
                  ? 'text-green-500'
                  : trend === 'down'
                    ? 'text-red-500'
                    : 'text-muted-foreground',
              )}
            >
              {change && `${change > 0 ? '+' : ''}${change}%`}
              {description && (
                <span className="ml-1 text-muted-foreground font-normal">
                  {description}
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
