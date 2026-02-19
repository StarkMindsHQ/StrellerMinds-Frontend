'use client';
import React from 'react';
import { mockEarningsData, mockTasks, mockMilestones, mockActivities, mockProfileData } from '@/lib/contributor-dashboard-data';

// Import components directly
import EarningsSummaryCard from '@/components/contributor/EarningsSummaryCard';
import AssignedTasksSection from '@/components/contributor/AssignedTasksSection';
import MilestoneProgressTracker from '@/components/contributor/MilestoneProgressTracker';
import ActivityTimeline from '@/components/contributor/ActivityTimeline';
import ProfileQuickViewCard from '@/components/contributor/ProfileQuickViewCard';

const ContributorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contributor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your contribution summary.</p>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile and Earnings */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileQuickViewCard profileData={mockProfileData} />
            <EarningsSummaryCard earningsData={mockEarningsData} />
          </div>

          {/* Middle Column - Tasks */}
          <div className="lg:col-span-2">
            <AssignedTasksSection tasks={mockTasks} />
          </div>
        </div>

        {/* Second Row - Milestones and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <MilestoneProgressTracker milestones={mockMilestones} />
          </div>
          <div className="lg:col-span-1">
            <ActivityTimeline activities={mockActivities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorDashboard;