'use client';
import React, { useEffect, useState } from 'react';
import { calculatePercentage } from '@/lib/mockEscrow';

type Props = {
  total: number;
  funded: number;
};

export default function FundingProgress({ total, funded }: Props) {
  const pct = calculatePercentage(total, funded);
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 50);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Funding Progress
        </div>
        <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
          {pct}%
        </div>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-md h-3 overflow-hidden">
        <div
          className="h-3 bg-linear-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-600 transition-[width] duration-1000"
          style={{ width: `${animPct}%` }}
        />
      </div>

      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
        {funded} / {total} funded
      </div>
    </div>
  );
}
