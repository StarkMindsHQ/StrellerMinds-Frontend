'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CheckCircle2, CloudOff, Loader2, RefreshCw, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LessonProgress {
  lessonId: string;
  title: string;
  completed: boolean;
  watchedSeconds: number;
  totalSeconds: number;
}

export interface CourseProgressState {
  courseId: string;
  courseTitle: string;
  lessons: LessonProgress[];
  lastSyncedAt?: Date;
}

type SyncStatus = 'idle' | 'saving' | 'saved' | 'offline' | 'error' | 'retrying';

interface LiveCourseProgressSyncProps {
  initialProgress: CourseProgressState;
  onSave?: (progress: CourseProgressState) => Promise<void>;
  debounceMs?: number;
  retryDelayMs?: number;
  className?: string;
}

// ─── Mock API ─────────────────────────────────────────────────────────────────

async function defaultSave(progress: CourseProgressState): Promise<void> {
  // Simulate network — swap for real fetch/axios call
  await new Promise((r) => setTimeout(r, 600));
  if (Math.random() < 0.05) throw new Error('Network error');
  console.log('[LiveCourseProgressSync] Saved:', progress);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcOverallProgress(lessons: LessonProgress[]): number {
  if (lessons.length === 0) return 0;
  const completed = lessons.filter((l) => l.completed).length;
  return Math.round((completed / lessons.length) * 100);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function LiveCourseProgressSync({
  initialProgress,
  onSave = defaultSave,
  debounceMs = 1500,
  retryDelayMs = 4000,
  className,
}: LiveCourseProgressSyncProps) {
  const [progress, setProgress] = useState<CourseProgressState>(initialProgress);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [retryCount, setRetryCount] = useState(0);

  const pendingRef = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestProgressRef = useRef(progress);
  latestProgressRef.current = progress;

  // ── Online / offline detection
  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, []);

  // ── Sync on tab focus
  useEffect(() => {
    const onFocus = () => {
      if (pendingRef.current && isOnline) {
        triggerSave(latestProgressRef.current);
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerSave = useCallback(
    async (data: CourseProgressState) => {
      if (!isOnline) {
        setSyncStatus('offline');
        pendingRef.current = true;
        return;
      }
      if (syncStatus === 'saving') return; // prevent duplicate

      pendingRef.current = false;
      setSyncStatus('saving');

      try {
        await onSave(data);
        setSyncStatus('saved');
        setRetryCount(0);
        setProgress((prev) => ({ ...prev, lastSyncedAt: new Date() }));
        setTimeout(() => setSyncStatus('idle'), 2500);
      } catch {
        const nextRetry = retryCount + 1;
        setRetryCount(nextRetry);
        setSyncStatus('retrying');
        pendingRef.current = true;

        retryTimer.current = setTimeout(() => {
          setSyncStatus('error');
          triggerSave(latestProgressRef.current);
        }, retryDelayMs * Math.min(nextRetry, 4));
      }
    },
    [isOnline, onSave, retryCount, retryDelayMs, syncStatus],
  );

  // ── Debounced auto-save whenever progress changes
  const scheduleAutoSave = useCallback(
    (data: CourseProgressState) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      pendingRef.current = true;
      debounceTimer.current = setTimeout(() => triggerSave(data), debounceMs);
    },
    [debounceMs, triggerSave],
  );

  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (retryTimer.current) clearTimeout(retryTimer.current);
  }, []);

  // ── Toggle lesson complete
  const toggleLesson = (lessonId: string) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        lessons: prev.lessons.map((l) =>
          l.lessonId === lessonId ? { ...l, completed: !l.completed } : l,
        ),
      };
      scheduleAutoSave(updated);
      return updated;
    });
  };

  // ── Update watch time
  const updateWatchTime = (lessonId: string, seconds: number) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        lessons: prev.lessons.map((l) =>
          l.lessonId === lessonId ? { ...l, watchedSeconds: seconds } : l,
        ),
      };
      scheduleAutoSave(updated);
      return updated;
    });
  };

  const overallPct = calcOverallProgress(progress.lessons);

  const statusConfig: Record<SyncStatus, { icon: React.ReactNode; label: string; color: string }> = {
    idle: { icon: <Wifi className="h-3.5 w-3.5" />, label: 'Live sync on', color: 'text-muted-foreground' },
    saving: { icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />, label: 'Saving…', color: 'text-sky-500' },
    saved: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: 'Saved', color: 'text-emerald-500' },
    offline: { icon: <CloudOff className="h-3.5 w-3.5" />, label: 'Offline — will sync when back', color: 'text-amber-500' },
    error: { icon: <RefreshCw className="h-3.5 w-3.5" />, label: 'Sync failed', color: 'text-destructive' },
    retrying: { icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />, label: `Retrying (${retryCount})…`, color: 'text-amber-500' },
  };

  const status = statusConfig[syncStatus];

  return (
    <div className={cn('rounded-xl border bg-card/90 p-5 shadow-sm', className)}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-card-foreground">{progress.courseTitle}</h3>
          <p className="text-xs text-muted-foreground">
            {progress.lessons.filter((l) => l.completed).length} of{' '}
            {progress.lessons.length} lessons complete
          </p>
        </div>

        <div className={cn('flex items-center gap-1.5 text-xs font-medium', status.color)}>
          {status.icon}
          <span>{status.label}</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-5 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Overall progress</span>
          <span className="font-semibold text-card-foreground">{overallPct}%</span>
        </div>
        <Progress value={overallPct} className="h-2" />
        {progress.lastSyncedAt && (
          <p className="text-[11px] text-muted-foreground">
            Last synced {progress.lastSyncedAt.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Lesson list */}
      <ul className="space-y-2">
        {progress.lessons.map((lesson) => {
          const lessonPct =
            lesson.totalSeconds > 0
              ? Math.round((lesson.watchedSeconds / lesson.totalSeconds) * 100)
              : 0;

          return (
            <li
              key={lesson.lessonId}
              className={cn(
                'group flex items-center gap-3 rounded-lg border p-3 transition-colors',
                lesson.completed
                  ? 'border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                  : 'bg-background/60 hover:bg-accent/30',
              )}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleLesson(lesson.lessonId)}
                aria-label={`Mark ${lesson.title} as ${lesson.completed ? 'incomplete' : 'complete'}`}
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  lesson.completed
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-muted-foreground/40 hover:border-primary',
                )}
              >
                {lesson.completed && (
                  <svg className="h-2.5 w-2.5" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'truncate text-sm font-medium',
                    lesson.completed ? 'text-emerald-700 dark:text-emerald-300' : 'text-card-foreground',
                  )}
                >
                  {lesson.title}
                </p>

                {!lesson.completed && lesson.totalSeconds > 0 && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all duration-300"
                        style={{ width: `${lessonPct}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {formatDuration(lesson.watchedSeconds)} / {formatDuration(lesson.totalSeconds)}
                    </span>
                  </div>
                )}
              </div>

              {/* Badge */}
              {lesson.completed && (
                <Badge
                  variant="outline"
                  className="shrink-0 border-emerald-400/50 text-[10px] text-emerald-600 dark:text-emerald-300"
                >
                  Done
                </Badge>
              )}
            </li>
          );
        })}
      </ul>

      {/* Manual retry if error */}
      {syncStatus === 'error' && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-xs text-destructive">Changes not saved — sync failed.</p>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1.5 text-xs"
            onClick={() => triggerSave(latestProgressRef.current)}
          >
            <RefreshCw className="h-3 w-3" />
            Retry now
          </Button>
        </div>
      )}
    </div>
  );
}

export default LiveCourseProgressSync;