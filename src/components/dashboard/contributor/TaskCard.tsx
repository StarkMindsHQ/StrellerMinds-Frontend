'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    project: string;
    status: string;
    priority: string;
    dueDate: string;
    progress: number;
  };
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <Card className="hover:border-primary/30 transition-all cursor-pointer group bg-card border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h4 className="font-bold text-base group-hover:text-primary transition-colors">
              {task.title}
            </h4>
            <p className="text-sm text-muted-foreground font-medium">
              {task.project}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'rounded-lg font-bold',
              getPriorityColor(task.priority),
            )}
          >
            {task.priority}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-bold">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-1.5" />

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Calendar size={14} />
                <span>{task.dueDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Clock size={14} />
                <span>2d left</span>
              </div>
            </div>
            <div className="p-1 px-3 bg-primary/5 rounded-lg text-primary text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Open <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
