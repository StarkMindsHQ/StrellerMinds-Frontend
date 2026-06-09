'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Users, Wifi, WifiOff, RefreshCw } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PageBreakdown {
  page: string;
  label: string;
  count: number;
}

export interface ConcurrentUsersData {
  total: number;
  byPage?: PageBreakdown[];
  timestamp: number;
}

export interface LiveConcurrentUsersMonitorProps {
  /** WebSocket URL — if omitted, component uses simulated data */
  wsUrl?: string;
  /** Poll interval in ms when using simulated data (default 5000) */
  pollIntervalMs?: number;
  /** Show per-page/course breakdown */
  showBreakdown?: boolean;
  className?: string;
}

// ── Simulated data ─────────────────────────────────────────────────────────────

function generateSimulatedData(): ConcurrentUsersData {
  const base = 120 + Math.floor(Math.random() * 80);
  return {
    total: base,
    byPage: [
      { page: '/course/intro-to-stellar', label: 'Intro to Stellar', count: Math.floor(base * 0.35) },
      { page: '/course/defi-fundamentals', label: 'DeFi Fundamentals', count: Math.floor(base * 0.25) },
      { page: '/dashboard', label: 'Dashboard', count: Math.floor(base * 0.2) },
      { page: '/course/smart-contracts', label: 'Smart Contracts', count: Math.floor(base * 0.15) },
      { page: '/profile', label: 'Profile', count: Math.floor(base * 0.05) },
    ],
    timestamp: Date.now(),
  };
}

// ── Spark line ─────────────────────────────────────────────────────────────────

function SparkLine({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  return (
    <svg width={w} height={h} className="text-blue-400">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * LiveConcurrentUsersMonitor — Issue #348
 *
 * Displays the number of users currently active on the platform in real-time.
 * Connects via WebSocket if `wsUrl` is provided; otherwise simulates live data.
 * Handles connection loss gracefully with a reconnect button and status indicator.
 */
export default function LiveConcurrentUsersMonitor({
  wsUrl,
  pollIntervalMs = 5000,
  showBreakdown = true,
  className = '',
}: LiveConcurrentUsersMonitorProps) {
  const [data, setData] = useState<ConcurrentUsersData | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pushData = useCallback((d: ConcurrentUsersData) => {
    setData(d);
    setHistory(prev => [...prev.slice(-29), d.total]);
    setLastUpdated(new Date(d.timestamp));
  }, []);

  // WebSocket path
  const connectWs = useCallback(() => {
    if (!wsUrl) return;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onmessage = (ev) => {
      try { pushData(JSON.parse(ev.data) as ConcurrentUsersData); } catch { /* ignore bad frames */ }
    };
    ws.onclose = () => {
      setConnected(false);
      // auto-reconnect after 5s
      setTimeout(connectWs, 5000);
    };
    ws.onerror = () => ws.close();
  }, [wsUrl, pushData]);

  // Simulated polling path
  useEffect(() => {
    if (wsUrl) {
      connectWs();
      return () => { wsRef.current?.close(); };
    }

    // Simulated mode
    setConnected(true);
    pushData(generateSimulatedData());
    intervalRef.current = setInterval(() => pushData(generateSimulatedData()), pollIntervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [wsUrl, pollIntervalMs, connectWs, pushData]);

  const manualReconnect = () => {
    if (wsUrl) connectWs();
    else pushData(generateSimulatedData());
  };

  const trend = history.length >= 2
    ? history[history.length - 1] - history[history.length - 2]
    : 0;

  return (
    <div className={`rounded-xl bg-gray-900 text-white p-5 space-y-4 ${className}`} data-testid="live-concurrent-monitor">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-300">Live Users</h2>
        </div>
        <div className="flex items-center gap-2">
          {connected
            ? <Wifi className="w-4 h-4 text-green-400" data-testid="connected-icon" />
            : <WifiOff className="w-4 h-4 text-red-400" data-testid="disconnected-icon" />}
          {!connected && (
            <button onClick={manualReconnect} className="text-gray-400 hover:text-white" aria-label="Reconnect">
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {data ? (
        <>
          {/* Count + sparkline */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-bold tabular-nums">{data.total.toLocaleString()}</p>
              <p className={`text-sm mt-0.5 ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                {trend > 0 ? `+${trend}` : trend < 0 ? `${trend}` : '—'} from last update
              </p>
            </div>
            <SparkLine values={history} />
          </div>

          {/* Per-page breakdown */}
          {showBreakdown && data.byPage && data.byPage.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">By page / course</p>
              {data.byPage.map((row) => (
                <div key={row.page} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="truncate text-gray-300">{row.label}</span>
                      <span className="text-gray-400 tabular-nums shrink-0 ml-2">{row.count}</span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full">
                      <div
                        className="h-1 bg-blue-500 rounded-full transition-all duration-700"
                        style={{ width: `${data.total > 0 ? (row.count / data.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {lastUpdated && (
            <p className="text-xs text-gray-600">
              Last updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-sm">Connecting…</p>
      )}
    </div>
  );
}
