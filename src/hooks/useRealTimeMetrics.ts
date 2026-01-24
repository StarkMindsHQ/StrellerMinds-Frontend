import { useState, useEffect } from 'react';
import {
  realTimeAnalyticsService,
  type RealTimeState,
} from '@/services/realTimeAnalyticsService';

export function useRealTimeMetrics() {
  const [data, setData] = useState<RealTimeState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = realTimeAnalyticsService.subscribe((state) => {
      setData({ ...state });
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { data, isLoading };
}
