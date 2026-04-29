"use client";

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, DeviceLaptop, Globe2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export type DeviceActivityEntry = {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  firstSeenAt: string;
  lastSeenAt: string;
  suspicious: boolean;
  reason?: string;
};

const formatTimestamp = (timestamp: string) =>
  new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

export function DeviceActivityTracker() {
  const { isAuthenticated } = useAuth();
  const [activity, setActivity] = useState<DeviceActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const controller = new AbortController();
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/auth/device-activity', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Unable to load device activity');
        }

        const data: DeviceActivityEntry[] = await response.json();
        if (isMounted && !controller.signal.aborted) {
          setActivity(data);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setError((err as Error).message || 'Failed to load activity data');
      } finally {
        if (isMounted && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isAuthenticated]);

  const suspiciousItems = useMemo(
    () => activity.filter((entry) => entry.suspicious),
    [activity],
  );

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sign in to review devices and suspicious login activity.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Device activity history</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <DeviceLaptop className="h-5 w-5" />
                <div>
                  <p className="text-xs uppercase tracking-[.24em] text-slate-500">
                    Known devices
                  </p>
                  <p className="text-3xl font-semibold">{activity.length}</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <ShieldCheck className="h-5 w-5" />
                <div>
                  <p className="text-xs uppercase tracking-[.24em] text-slate-500">
                    Suspicious items
                  </p>
                  <p className="text-3xl font-semibold">{suspiciousItems.length}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {suspiciousItems.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Security alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
              <div>
                <p className="font-semibold text-slate-900">Suspicious login activity detected</p>
                <p className="text-sm text-slate-600">
                  Review the highlighted entries below and lock any unfamiliar devices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Recent device history</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading device history...</p>
          ) : activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No device activity recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="px-4 py-3">Device</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">First seen</th>
                    <th className="px-4 py-3">Last active</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-slate-200 ${
                        entry.suspicious ? 'bg-amber-50/70' : 'even:bg-slate-50'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900">{entry.device}</span>
                          <span className="text-xs text-slate-500">{entry.browser}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Globe2 className="h-4 w-4 text-slate-400" />
                          <span>{entry.location}</span>
                        </div>
                        <p className="text-xs text-slate-500">{entry.ip}</p>
                      </td>
                      <td className="px-4 py-4">{formatTimestamp(entry.firstSeenAt)}</td>
                      <td className="px-4 py-4">{formatTimestamp(entry.lastSeenAt)}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[.18em] ${
                            entry.suspicious
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {entry.suspicious ? 'Suspicious' : 'Verified'}
                        </span>
                        {entry.suspicious && entry.reason ? (
                          <p className="mt-1 text-xs text-amber-700">{entry.reason}</p>
                        ) : null}
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
