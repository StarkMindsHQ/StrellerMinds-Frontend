'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatWidgetProps {
  label: string;
  value: string;
  trend: string;
  iconName: string;
}

export const StatWidget: React.FC<StatWidgetProps> = ({
  label,
  value,
  trend,
  iconName,
}) => {
  const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;
  const isPositive = trend.startsWith('+');

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-card hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl">
            <IconComponent size={24} className="text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              'text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center',
              isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700',
            )}
          >
            {trend}
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
};
