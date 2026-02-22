'use client';
import React from 'react';
import type { Milestone } from '@/lib/mockEscrow';

const statusColor = (s: Milestone['status']) => {
  switch (s) {
    case 'RELEASED':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    case 'FUNDED':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300';
  }
};

export default function MilestoneList({
  milestones,
}: {
  milestones: Milestone[];
}) {
  return (
    <div className="space-y-3">
      {milestones.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50"
        >
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">
              {m.title}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Due: {m.dueDate}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {m.fundedAmount}/{m.amount}
            </div>
            <div
              className={`px-2 py-1 text-xs rounded font-medium ${statusColor(m.status)}`}
            >
              {m.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
