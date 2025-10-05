import { useCallback, useEffect, useState } from 'react';

import {
  enrollmentAnalyticsService,
  type EnrollmentAnalytics,
  type FetchEnrollmentAnalyticsOptions,
} from '@/services/enrollmentAnalyticsService';

interface EnrollmentAnalyticsState {
  data: EnrollmentAnalytics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useEnrollmentAnalytics = (
  options?: FetchEnrollmentAnalyticsOptions,
): EnrollmentAnalyticsState => {
  const [data, setData] = useState<EnrollmentAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result =
        await enrollmentAnalyticsService.fetchEnrollmentAnalytics(options);
      setData(result);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load enrollment analytics.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};
