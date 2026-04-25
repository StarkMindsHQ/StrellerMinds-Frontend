"use client";

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, DeviceLaptop, Globe2, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export type ActiveSessionItem = {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  isCurrent: boolean;
};

const formatDate = (timestamp: string) =>
  new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

export function SessionManagementDashboard() {
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<ActiveSessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const hasSessions = sessions.length > 0;

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/sessions');
      if (!response.ok) {
        throw new Error('Unable to load active sessions');
      }
      const data: ActiveSessionItem[] = await response.json();
      setSessions(data);
    } catch (err) {
      setError((err as Error).message || 'Session list failed to load');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    void loadSessions();
  }, [isAuthenticated]);

  const handleTerminate = async (sessionId: string) => {
    setDeletingSessionId(sessionId);
    setError(null);

    try {
      const response = await fetch(`/api/auth/sessions?id=${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'Failed to terminate session');
      }

      setSessions((previous) => previous.filter((session) => session.id !== sessionId));
    } catch (err) {
      setError((err as Error).message || 'Unable to terminate session');
    } finally {
      setDeletingSessionId(null);
    }
  };

  const activeSessionsSummary = useMemo(
    () => ({
      total: sessions.length,
      current: sessions.filter((session) => session.isCurrent).length,
    }),
    [sessions],
  );

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sign in to view and manage your active sessions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Activity className="h-5 w-5" />
                <div>
                  <p className="text-xs uppercase tracking-[.24em] text-slate-500">
                    Total sessions
                  </p>
                  <p className="text-3xl font-semibold">{activeSessionsSummary.total}</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <DeviceLaptop className="h-5 w-5" />
                <div>
                  <p className="text-xs uppercase tracking-[.24em] text-slate-500">
                    Current session
                  </p>
                  <p className="text-3xl font-semibold">{activeSessionsSummary.current}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session details</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {isLoading ? (
            <div className="flex items-center gap-2 text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading active sessions...
            </div>
          ) : !hasSessions ? (
            <p className="text-sm text-muted-foreground">No active sessions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="px-4 py-3">Device</th>
                    <th className="px-4 py-3">Browser</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Last active</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="border-b border-slate-200 even:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900">{session.device}</span>
                          <span className="text-xs text-slate-500">{session.ip}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{session.browser}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Globe2 className="h-4 w-4 text-slate-400" />
                          <span>{session.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{formatDate(session.lastSeenAt)}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[.18em] ${
                            session.isCurrent
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {session.isCurrent ? 'Current' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={session.isCurrent || deletingSessionId === session.id}
                          onClick={() => void handleTerminate(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {session.isCurrent ? 'Current session' : 'Terminate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
