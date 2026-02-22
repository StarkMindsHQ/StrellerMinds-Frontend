'use client';
import React, { useMemo, useState } from 'react';
import FundingProgress from './FundingProgress';
import MilestoneList from './MilestoneList';
import TimelineView from './TimelineView';
import { mockEscrow, calculatePercentage, type Role } from '@/lib/mockEscrow';

export default function EscrowCard() {
  const [role, setRole] = useState<Role>(mockEscrow.role);

  const percent = useMemo(
    () => calculatePercentage(mockEscrow.totalGoal, mockEscrow.fundedAmount),
    [],
  );
  const funded = mockEscrow.fundedAmount >= mockEscrow.totalGoal;

  const timeline = [
    { id: 't1', title: 'Escrow created', date: mockEscrow.createdAt },
    ...mockEscrow.milestones.map((m) => ({
      id: `t-${m.id}`,
      title: `${m.title} - ${m.status}`,
      date: m.dueDate,
    })),
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {mockEscrow.title}
          </h2>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Escrow ID: {mockEscrow.id}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              funded
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300'
            }`}
          >
            {funded ? '✓ Fully Funded' : 'Partially Funded'}
          </div>

          <select
            aria-label="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium"
          >
            <option value="creator">Creator View</option>
            <option value="contributor">Contributor View</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <FundingProgress
              total={mockEscrow.totalGoal}
              funded={mockEscrow.fundedAmount}
            />
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium transition-all hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!funded || role !== 'creator'}
              >
                {role === 'creator' ? 'Release Funds' : 'Creator Only'}
              </button>
              <button className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed">
                View Report
              </button>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">
              Milestones
            </h3>
            <MilestoneList milestones={mockEscrow.milestones} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="p-5 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Timeline
            </h4>
            <TimelineView events={timeline} />
          </div>

          <div className="p-5 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Quick Info
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Goal:
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  ${mockEscrow.totalGoal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Funded:
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  ${mockEscrow.fundedAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Remaining:
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  ${mockEscrow.totalGoal - mockEscrow.fundedAmount}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Your role:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white capitalize">
                    {role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
