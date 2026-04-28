'use client';

import React from 'react';
import DynamicLearningAnalyticsDashboard from '@/components/analytics/DynamicLearningAnalyticsDashboard';
import InstructorAnalyticsWidgets from '@/components/instructor/InstructorAnalyticsWidgets';

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <DynamicLearningAnalyticsDashboard role="instructor" />
      <InstructorAnalyticsWidgets />
    </div>
  );
}
