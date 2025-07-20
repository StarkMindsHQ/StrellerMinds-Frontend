import { useState, useEffect } from 'react';

interface UseLoadingOptions {
  minLoadingTime?: number; // Minimum time to show loading (in ms)
  initialLoading?: boolean;
}

interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setLoading: (loading: boolean) => void;
}

export function useLoading(options: UseLoadingOptions = {}): UseLoadingReturn {
  const { minLoadingTime = 800, initialLoading = false } = options;
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  const startLoading = () => {
    setLoadingStartTime(Date.now());
    setIsLoading(true);
  };

  const stopLoading = () => {
    if (!loadingStartTime) {
      setIsLoading(false);
      return;
    }

    const elapsedTime = Date.now() - loadingStartTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

    setTimeout(() => {
      setIsLoading(false);
      setLoadingStartTime(null);
    }, remainingTime);
  };

  const setLoading = (loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading,
  };
}

// Hook for simulating data fetching with loading states
export function useAsyncData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseLoadingOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { isLoading, startLoading, stopLoading } = useLoading(options);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        startLoading();
        setError(null);
        
        const result = await fetchFunction();
        
        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
        }
      } finally {
        if (!isCancelled) {
          stopLoading();
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, dependencies);

  return { data, error, isLoading };
} 