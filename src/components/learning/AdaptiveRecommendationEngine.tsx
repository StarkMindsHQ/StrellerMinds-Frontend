'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  History,
  RotateCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAdaptiveRecommendations } from '@/hooks/useAdaptiveRecommendations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SmartSuggestionCard } from './SmartSuggestionCard';
import { Skeleton } from '@/components/ui/skeleton';

interface AdaptiveRecommendationEngineProps {
  learnerId: string;
  className?: string;
  onRefresh?: () => void;
  showActivitySummary?: boolean;
}

/**
 * AdaptiveRecommendationEngine Component
 * Displays personalized course suggestions based on deep analysis of user activity.
 * Adapts in real-time to changes in learning pace and quiz performance.
 */
export const AdaptiveRecommendationEngine: React.FC<AdaptiveRecommendationEngineProps> = ({
  learnerId,
  className,
  onRefresh,
  showActivitySummary = true,
}: AdaptiveRecommendationEngineProps) => {
  const { result, isLoading, error, refresh } = useAdaptiveRecommendations({
    learnerId,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    onRefresh?.();
    setIsRefreshing(false);
  };

  // Define tones/labels for pace analysis
  const speedLabel = {
    fast: 'Faster than expected target',
    'on-track': 'Aligned with current goals',
    slow: 'Below optimal performance threshold',
  };

  const speedColor = {
    fast: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    'on-track': 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    slow: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <Card className={cn('relative overflow-hidden border-primary/20 bg-card/90 shadow-lg backdrop-blur-md transition-shadow hover:shadow-primary/5', className)}>
      {/* Visual background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
      
      <CardHeader className="relative z-10 border-b border-primary/10 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              Adaptive Intelligent Learning Path
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground/80">
              Personalized recommendations dynamically optimized for your current speed and mastery level.
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="h-9 gap-2 font-semibold transition-all hover:bg-primary/5"
            >
              <RotateCw className={cn('h-4 w-4', (isLoading || isRefreshing) && 'animate-spin')} />
              Refresh Path
            </Button>
            <Badge variant="secondary" className="px-2.5 py-1 text-xs font-bold ring-1 ring-inset ring-primary/20">
              {result?.strategy === 'weakness-first' ? 'Gap Analysis Mode' : 'Momentum Balance Mode'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-8 pt-8">
        {/* Performance Overview Section */}
        {showActivitySummary && result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            <div className={cn('flex flex-col rounded-xl border p-4 transition-all hover:scale-[1.02]', speedColor[result.analysis.completionSpeedLabel])}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
                <History className="h-3.5 w-3.5" />
                Velocity Metrics
              </div>
              <div className="mt-2 text-2xl font-black">
                {result.analysis.averageCompletionSpeedRatio}x <span className="text-sm font-medium opacity-70">multiplier</span>
              </div>
              <p className="mt-1 text-[10px] sm:text-xs font-medium opacity-90 leading-tight">
                {speedLabel[result.analysis.completionSpeedLabel]}
              </p>
            </div>

            <div className="flex flex-col rounded-xl border border-primary/10 bg-primary/5 p-4 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary opacity-80">
                <TrendingUp className="h-3.5 w-3.5" />
                Mastery Index
              </div>
              <div className="mt-2 text-2xl font-black text-foreground">
                {result.analysis.averageQuizScore}% <span className="text-sm font-medium opacity-60">avg score</span>
              </div>
              <p className="mt-1 text-xs font-medium text-muted-foreground leading-tight">
                Based on integrated quiz session analysis
              </p>
            </div>

            <div className="flex flex-col rounded-xl border border-destructive/10 bg-destructive/5 p-4 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-destructive opacity-80">
                <AlertTriangle className="h-3.5 w-3.5" />
                Gap Detection
              </div>
              <div className="mt-2 text-2xl font-black text-foreground">
                {result.analysis.weakTopics.length} <span className="text-sm font-medium opacity-60">critical hotspots</span>
              </div>
              <p className="mt-1 text-xs font-medium text-muted-foreground truncate leading-tight">
                {result.analysis.weakTopics.slice(0, 1).map(t => t.topic)[0] || 'No immediate risks identified'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Recommendations Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <Activity className="h-4 w-4 text-primary" />
              Next Curated Steps
            </h3>
            {result && (
              <span className="text-[10px] font-medium text-muted-foreground/60 italic">
                Path generated at {new Date(result.generatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isLoading && !result ? (
              <div key="loading" className="grid gap-6 lg:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3 rounded-2xl border p-5">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 p-12 text-center"
              >
                <div className="rounded-full bg-destructive/10 p-4 mb-4">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-lg font-bold text-foreground mb-2">Engine Disruption</p>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">{error}</p>
                <Button variant="outline" onClick={handleRefresh}>
                  Reset Engine Connection
                </Button>
              </motion.div>
            ) : result?.suggestions.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-muted/20 p-12 text-center"
              >
                <Sparkles className="h-10 w-10 text-primary/40 mb-4" />
                <p className="text-lg font-bold text-foreground mb-1">Path Optimized</p>
                <p className="text-sm text-muted-foreground">Continue with your main course. No remedial steps required for the current mastery level.</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
                className="grid gap-6 lg:grid-cols-2"
              >
                {result?.suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <SmartSuggestionCard 
                      suggestion={suggestion} 
                      className="border-primary/10 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdaptiveRecommendationEngine;
