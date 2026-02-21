import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bell, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type AnalyticsEvent } from '@/services/realTimeAnalyticsService';

interface GlobalAlertSystemProps {
  events: AnalyticsEvent[];
  className?: string;
}

const eventTypeStyles = {
  enrollment: {
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-100 dark:border-green-900/30',
  },
  completion: {
    icon: <Info className="h-4 w-4 text-blue-500" />,
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-100 dark:border-blue-900/30',
  },
  payment: {
    icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-100 dark:border-emerald-900/30',
  },
  user_joined: {
    icon: <Bell className="h-4 w-4 text-purple-500" />,
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-100 dark:border-purple-900/30',
  },
  alert: {
    icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-100 dark:border-amber-900/30',
  },
};

export const GlobalAlertSystem: React.FC<GlobalAlertSystemProps> = React.memo(({
  events,
  className,
}) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Live Activity Feed
          </CardTitle>
          <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
            Live
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          {events.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">Waiting for live events...</p>
            </div>
          ) : (
            <div className="divide-y">
              {events.map((event) => {
                const style =
                  eventTypeStyles[event.type] || eventTypeStyles.alert;
                return (
                  <div
                    key={event.id}
                    className={cn(
                      'p-3 transition-colors hover:bg-muted/50 flex gap-3 animate-in fade-in slide-in-from-right-4 duration-500',
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 rounded-full p-1 shrink-0',
                        style.bg,
                      )}
                    >
                      {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground leading-snug">
                        {event.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
