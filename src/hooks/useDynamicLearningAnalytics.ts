import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  generateMockLearningRecords,
  simulateLearningRecordsTick,
} from '@/data/learningAnalyticsMock';
import { normalizeRiskThresholdConfig } from '@/services/engagementScoreEngine';
import { createLearningAnalyticsSnapshot } from '@/services/learningAnalyticsEngine';
import {
  type AnalyticsRole,
  type LearningAnalyticsSnapshot,
  type RiskThresholdConfig,
  type StudentLearningRecord,
} from '@/types/learningAnalytics';

type RealtimeMode = 'polling' | 'websocket';

interface AnalyticsSocketPayload {
  type: 'analytics_update';
  records: StudentLearningRecord[];
}

export interface UseDynamicLearningAnalyticsOptions {
  role: AnalyticsRole;
  studentId?: string;
  initialRecords?: StudentLearningRecord[];
  mode?: RealtimeMode;
  pollingIntervalMs?: number;
  websocketUrl?: string;
  initialThresholds?: Partial<RiskThresholdConfig>;
}

interface UseDynamicLearningAnalyticsResult {
  snapshot: LearningAnalyticsSnapshot;
  records: StudentLearningRecord[];
  thresholds: RiskThresholdConfig;
  updateThresholds: (next: Partial<RiskThresholdConfig>) => void;
  refreshNow: () => void;
  isRealtimeConnected: boolean;
  lastUpdatedAt: string;
}

const ROLE_FALLBACK_STUDENT_ID = 'student-1';

const resolveRoleScopedRecords = (
  allRecords: StudentLearningRecord[],
  role: AnalyticsRole,
  studentId?: string,
): StudentLearningRecord[] => {
  if (role === 'student') {
    const resolvedId = studentId ?? ROLE_FALLBACK_STUDENT_ID;
    const selectedRecord = allRecords.find((record) => record.studentId === resolvedId);
    return selectedRecord ? [selectedRecord] : [allRecords[0]];
  }

  if (role === 'instructor') {
    const instructorCourses = new Set(
      allRecords.slice(0, 2).map((record) => record.courseId),
    );
    const scoped = allRecords.filter((record) => {
      return instructorCourses.has(record.courseId);
    });
    return scoped.length > 0 ? scoped : allRecords;
  }

  return allRecords;
};

const isValidSocketPayload = (payload: unknown): payload is AnalyticsSocketPayload => {
  if (!payload || typeof payload !== 'object') return false;

  const candidate = payload as AnalyticsSocketPayload;
  return candidate.type === 'analytics_update' && Array.isArray(candidate.records);
};

export const useDynamicLearningAnalytics = (
  options: UseDynamicLearningAnalyticsOptions,
): UseDynamicLearningAnalyticsResult => {
  const {
    role,
    studentId,
    initialRecords,
    mode = 'polling',
    pollingIntervalMs = 8000,
    websocketUrl,
    initialThresholds,
  } = options;

  const [records, setRecords] = useState<StudentLearningRecord[]>(
    initialRecords ?? generateMockLearningRecords(),
  );
  const [thresholds, setThresholds] = useState<RiskThresholdConfig>(
    normalizeRiskThresholdConfig(initialThresholds),
  );
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>(
    new Date().toISOString(),
  );
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(
    mode === 'polling',
  );

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const runTick = useCallback(() => {
    setRecords((current) => {
      const next = simulateLearningRecordsTick(current, new Date());
      return next;
    });
    setLastUpdatedAt(new Date().toISOString());
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollIntervalRef.current = setInterval(() => {
      runTick();
    }, pollingIntervalMs);
    setIsRealtimeConnected(true);
  }, [pollingIntervalMs, runTick, stopPolling]);

  useEffect(() => {
    if (mode === 'polling') {
      startPolling();
      return () => {
        stopPolling();
      };
    }

    if (!websocketUrl) {
      startPolling();
      return () => {
        stopPolling();
      };
    }

    const socket = new WebSocket(websocketUrl);
    socketRef.current = socket;
    setIsRealtimeConnected(false);

    socket.onopen = () => {
      setIsRealtimeConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const payload: unknown = JSON.parse(event.data);

        if (isValidSocketPayload(payload)) {
          setRecords(payload.records);
          setLastUpdatedAt(new Date().toISOString());
        }
      } catch (error) {
        console.error('Unable to parse analytics websocket payload', error);
      }
    };

    socket.onerror = () => {
      setIsRealtimeConnected(false);
      startPolling();
    };

    socket.onclose = () => {
      setIsRealtimeConnected(false);
      startPolling();
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      stopPolling();
    };
  }, [mode, websocketUrl, startPolling, stopPolling]);

  const updateThresholds = useCallback((next: Partial<RiskThresholdConfig>) => {
    setThresholds((previous) => normalizeRiskThresholdConfig({ ...previous, ...next }));
  }, []);

  const scopedRecords = useMemo(
    () => resolveRoleScopedRecords(records, role, studentId),
    [records, role, studentId],
  );

  const snapshot = useMemo(
    () => createLearningAnalyticsSnapshot(scopedRecords, thresholds, new Date()),
    [scopedRecords, thresholds],
  );

  return {
    snapshot,
    records: scopedRecords,
    thresholds,
    updateThresholds,
    refreshNow: runTick,
    isRealtimeConnected,
    lastUpdatedAt,
  };
};
