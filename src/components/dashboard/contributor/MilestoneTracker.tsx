'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Milestone {
  id: string;
  title: string;
  deadline: string;
  progress: number;
  status: string;
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  milestones,
}) => {
  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Target className="text-primary" size={20} />
          Key Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {milestones.map((m) => (
          <div key={m.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {m.status === 'completed' ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-primary/30" />
                )}
                <span
                  className={cn(
                    'text-sm font-semibold',
                    m.status === 'completed'
                      ? 'text-muted-foreground line-through'
                      : '',
                  )}
                >
                  {m.title}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {m.deadline}
              </span>
            </div>
            <div className="space-y-1.5 px-6">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-black text-muted-foreground/60">
                <span>Phase Progress</span>
                <span>{m.progress}%</span>
              </div>
              <Progress value={m.progress} className="h-1.5" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
