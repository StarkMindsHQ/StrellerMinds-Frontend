'use client';

import React from 'react';
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type RiskLevel } from '@/types/learningAnalytics';

interface RiskIndicatorBadgeProps {
  riskLevel: RiskLevel;
  riskScore: number;
  className?: string;
}

const levelConfig: Record<
  RiskLevel,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  low: {
    label: 'Low risk',
    icon: ShieldCheck,
    className:
      'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  medium: {
    label: 'Medium risk',
    icon: Shield,
    className:
      'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  high: {
    label: 'High risk',
    icon: AlertTriangle,
    className:
      'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
  },
  critical: {
    label: 'Critical risk',
    icon: ShieldAlert,
    className: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
};

export function RiskIndicatorBadge({
  riskLevel,
  riskScore,
  className,
}: RiskIndicatorBadgeProps) {
  const config = levelConfig[riskLevel];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn('gap-1.5 rounded-full px-2.5 py-1', config.className, className)}>
      <Icon className="h-3.5 w-3.5" />
      <span>
        {config.label} ({Math.round(riskScore)}%)
      </span>
    </Badge>
  );
}

export default RiskIndicatorBadge;
