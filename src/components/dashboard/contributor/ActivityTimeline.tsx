'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, MessageSquare, ClipboardCheck, UserPlus } from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  user: string;
  content: string;
  timestamp: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <ClipboardCheck size={16} className="text-green-500" />;
      case 'comment':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'project_joined':
        return <UserPlus size={16} className="text-amber-500" />;
      default:
        return <History size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <History className="text-primary" size={20} />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-muted">
          {activities.map((item) => (
            <div key={item.id} className="relative pl-10">
              <div className="absolute left-0 top-1 p-1 bg-background border-2 rounded-full z-10 shadow-sm">
                {getIcon(item.type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-bold text-foreground">{item.user}</span>{' '}
                  <span className="text-muted-foreground">{item.content}</span>
                </p>
                <p className="text-xs text-muted-foreground/60 font-medium italic">
                  {item.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
