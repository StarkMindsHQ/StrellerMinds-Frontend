'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type RiskThresholdConfig } from '@/types/learningAnalytics';

interface ThresholdCustomizationPanelProps {
  thresholds: RiskThresholdConfig;
  onThresholdChange: (next: Partial<RiskThresholdConfig>) => void;
  className?: string;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function SliderRow({ label, value, min, max, onChange }: SliderRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
    </div>
  );
}

export function ThresholdCustomizationPanel({
  thresholds,
  onThresholdChange,
  className,
}: ThresholdCustomizationPanelProps) {
  const handleMediumChange = (value: number) => {
    const mediumRiskMin = clamp(value, 1, 92);
    const highRiskMin = Math.max(thresholds.highRiskMin, mediumRiskMin + 1);
    const criticalRiskMin = Math.max(
      thresholds.criticalRiskMin,
      highRiskMin + 1,
    );
    const adminAlertMin = Math.max(thresholds.adminAlertMin, highRiskMin);

    onThresholdChange({
      mediumRiskMin,
      highRiskMin,
      criticalRiskMin,
      adminAlertMin,
    });
  };

  const handleHighChange = (value: number) => {
    const highRiskMin = clamp(
      value,
      thresholds.mediumRiskMin + 1,
      thresholds.criticalRiskMin - 1,
    );
    const adminAlertMin = Math.max(thresholds.adminAlertMin, highRiskMin);
    onThresholdChange({ highRiskMin, adminAlertMin });
  };

  const handleCriticalChange = (value: number) => {
    const criticalRiskMin = clamp(value, thresholds.highRiskMin + 1, 99);
    onThresholdChange({ criticalRiskMin });
  };

  const handleAlertChange = (value: number) => {
    const adminAlertMin = clamp(value, thresholds.highRiskMin, 100);
    onThresholdChange({ adminAlertMin });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Threshold Customization
        </CardTitle>
        <CardDescription>
          Tune risk-level boundaries and the admin alert trigger.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SliderRow
          label="Medium risk starts"
          value={thresholds.mediumRiskMin}
          min={1}
          max={92}
          onChange={handleMediumChange}
        />
        <SliderRow
          label="High risk starts"
          value={thresholds.highRiskMin}
          min={thresholds.mediumRiskMin + 1}
          max={Math.max(
            thresholds.mediumRiskMin + 1,
            thresholds.criticalRiskMin - 1,
          )}
          onChange={handleHighChange}
        />
        <SliderRow
          label="Critical risk starts"
          value={thresholds.criticalRiskMin}
          min={thresholds.highRiskMin + 1}
          max={99}
          onChange={handleCriticalChange}
        />
        <SliderRow
          label="Admin alert threshold"
          value={thresholds.adminAlertMin}
          min={thresholds.highRiskMin}
          max={100}
          onChange={handleAlertChange}
        />
      </CardContent>
    </Card>
  );
}

export default ThresholdCustomizationPanel;
