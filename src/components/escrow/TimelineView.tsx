'use client';
import React from 'react';

export default function TimelineView({
  events,
}: {
  events: { id: string; title: string; date?: string }[];
}) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((ev) => (
          <li key={ev.id} className="pl-4 mb-6 relative">
            <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400 ring-2 ring-white dark:ring-slate-800" />
            <div className="ml-4">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {ev.title}
              </div>
              {ev.date && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {new Date(ev.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
