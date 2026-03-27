'use client';

import React from 'react';
import { StatWidget } from './StatWidget';
import { TaskCard } from './TaskCard';
import { MilestoneTracker } from './MilestoneTracker';
import { ActivityTimeline } from './ActivityTimeline';
import { ProfileQuickView } from './ProfileQuickView';
import {
  CONTRIBUTOR_STATS,
  ASSIGNED_TASKS,
  MILESTONES,
  ACTIVITY_TIMELINE,
  CONTRIBUTOR_PROFILE,
} from '@/data/contributor-dashboard';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

export const ContributorDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Workforce Intelligence
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            Managing{' '}
            <span className="text-primary font-bold">
              5 active repositories
            </span>{' '}
            and your contribution pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl font-bold h-11 border-muted hover:bg-muted"
          >
            <Filter size={18} className="mr-2" /> Filter
          </Button>
          <Button className="rounded-xl font-bold h-11 bg-primary shadow-lg shadow-primary/20">
            <Plus size={18} className="mr-2" /> New Task
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CONTRIBUTOR_STATS.map((stat) => (
          <StatWidget
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            iconName={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Tasks and Projects (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-muted/30 rounded-[2rem] p-8 border border-muted-foreground/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black">Assigned Tasks</h3>
              <Button
                variant="link"
                className="text-primary font-black uppercase text-xs tracking-widest p-0"
              >
                View Kanban
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ASSIGNED_TASKS.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MilestoneTracker milestones={MILESTONES} />
            <ActivityTimeline activities={ACTIVITY_TIMELINE} />
          </div>
        </div>

        {/* Right Column - Profile and Context (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          <ProfileQuickView profile={CONTRIBUTOR_PROFILE} />

          {/* Mock Earning Chart Placeholder (Premium UI) */}
          <div className="bg-card rounded-[2rem] p-8 border border-muted shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
            <h3 className="text-lg font-black mb-1">Earning Forecast</h3>
            <p className="text-sm font-bold text-primary mb-6">Q1 2024</p>

            <div className="space-y-4">
              {[
                { label: 'March', amount: '$1,200', percent: 80 },
                { label: 'April', amount: '$2,400', percent: 45 },
                { label: 'May', amount: '$3,800', percent: 20 },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span>{item.amount}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-8 rounded-xl font-bold bg-muted text-foreground hover:bg-primary hover:text-white transition-all">
              Download Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
