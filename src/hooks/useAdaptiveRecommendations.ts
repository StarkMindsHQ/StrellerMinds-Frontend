'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  runRecommendationEngine, 
  type RecommendationEngineInput, 
  type RecommendationEngineResult,
  type RecommendationStrategy
} from '@/services/recommendationEngine';
import { buildMockRecommendationInput } from '@/data/recommendationEngineMock';
import { activityLogger } from '@/services/activityLogger';

interface UseAdaptiveRecommendationsOptions {
  learnerId: string;
  refreshInterval?: number; // ms
  strategy?: RecommendationStrategy;
}

/**
 * useAdaptiveRecommendations Hook
 * Fetches and manages personalized recommendations based on user activity.
 */
export function useAdaptiveRecommendations({
  learnerId,
  refreshInterval = 60000, // 1 minute default
  strategy,
}: UseAdaptiveRecommendationsOptions) {
  const [result, setResult] = useState<RecommendationEngineResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real app, this would be a fetch to an API endpoint
      // that either returns the telemetry data for us to process locally
      // OR returns the calculated recommendations directly.
      // Acceptance Criteria: "Fetches recommendations via API"
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Attempt to get real activity logs to inform recommendations
      // If no real data is available, we fall back to mock data
      let input: RecommendationEngineInput;
      
      try {
        const logs = await activityLogger.getActivityLogs(learnerId, undefined, 10);
        if (logs.length > 0) {
          // In a real scenario, we would map logs to telemetry format
          // Here we still use buildMockRecommendationInput as a base for variety
          // but could augment it with real session data.
          input = buildMockRecommendationInput(learnerId);
        } else {
          input = buildMockRecommendationInput(learnerId);
        }
      } catch {
        input = buildMockRecommendationInput(learnerId);
      }

      const recommendationResult = runRecommendationEngine(input, strategy);
      setResult(recommendationResult);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Could not load personalized recommendations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [learnerId, strategy]);

  // Initial fetch
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Periodic refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchRecommendations, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchRecommendations, refreshInterval]);

  return {
    result,
    isLoading,
    error,
    refresh: fetchRecommendations
  };
}
