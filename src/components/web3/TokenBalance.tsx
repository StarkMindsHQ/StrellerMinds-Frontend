'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import styles from './TokenBalance.module.css';

interface TokenBalanceProps {
  balance?: string | number;
  symbol?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  label?: string;
  className?: string;
  lastUpdated?: Date;
}

/**
 * TokenBalance Component
 * Displays user's blockchain token or points balance with real-time updates and premium aesthetics.
 */
export function TokenBalance({
  balance,
  symbol = 'TKN',
  isLoading = false,
  error = null,
  onRefresh,
  label = 'Balance',
  className,
  lastUpdated,
}: TokenBalanceProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Handle refresh animation state
  useEffect(() => {
    if (!isLoading && isRefreshing) {
      const timer = setTimeout(() => setIsRefreshing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isRefreshing]);

  // Update relative time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    if (onRefresh && !isLoading && !isRefreshing) {
      setIsRefreshing(true);
      onRefresh();
    }
  };

  const formatLastUpdated = (date?: Date) => {
    if (!date) return 'Just now';
    const diff = Math.floor((currentTime.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  if (error) {
    return (
      <div className={cn(styles.tokenBalanceContainer, className)}>
        <div className={styles.errorState}>
          <AlertCircle size={18} />
          <span>Failed to load balance</span>
          {onRefresh && (
            <button onClick={handleRefresh} className={styles.retryText}>
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn(styles.tokenBalanceContainer, className)}>
        <div className={styles.glowEffect} />

        <div className={styles.balanceContent}>
          <span className={styles.label}>{label}</span>

          <div className={styles.balanceWrapper}>
            {isLoading && !isRefreshing ? (
              <div className="flex gap-2 items-center">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-5 w-10" />
              </div>
            ) : (
              <>
                <span className={styles.balanceAmount}>
                  {balance !== undefined ? balance : '0.00'}
                </span>
                <span className={styles.symbol}>{symbol}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 ml-auto">
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className={cn(
                styles.refreshButton,
                (isLoading || isRefreshing) && styles.rotating,
              )}
              title="Refresh Balance"
            >
              <RefreshCw size={16} />
            </button>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help text-muted-foreground hover:text-primary transition-colors">
                <Info size={16} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <p className="font-semibold">Network Balance Info</p>
                <div className="text-xs opacity-80">
                  <p>
                    Full Balance: {balance} {symbol}
                  </p>
                  <p>Last Sync: {formatLastUpdated(lastUpdated)}</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
