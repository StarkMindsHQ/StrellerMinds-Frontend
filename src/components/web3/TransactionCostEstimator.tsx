'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type {
  TransactionParams,
  TransactionCostEstimatorProps,
  GasEstimate,
} from '@/types/blockchain';
import { formatUnits } from 'viem';

function LoadingState() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}

export function TransactionCostEstimator({
  params,
  onParamsChange,
  cryptoPrice = 2000,
}: TransactionCostEstimatorProps) {
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localParams, setLocalParams] = useState<TransactionParams>(params);

  // Simulate fetching gas price (in production, this would call an API)
  const fetchGasEstimate = useCallback(
    async (txParams: TransactionParams) => {
      setIsLoading(true);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulated gas estimation
        // In production, this would use wagmi's estimateGas or call an API
        const gasPrice = BigInt(20000000000); // 20 Gwei
        const gasLimit = BigInt(txParams.gasLimit || 21000); // Default ETH transfer gas
        const gasFeeWei = gasPrice * gasLimit;
        const gasFeeEth = parseFloat(formatUnits(gasFeeWei, 18));
        const gasFeeUsd = gasFeeEth * cryptoPrice;

        setGasEstimate({
          gasPrice,
          gasLimit,
          gasFeeWei,
          gasFeeEth,
          gasFeeUsd,
          gasPriceGwei: parseFloat(formatUnits(gasPrice, 9)),
        });
      } catch (error) {
        console.error('Failed to estimate gas:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [cryptoPrice],
  );

  // Fetch estimate on mount or params change
  useEffect(() => {
    fetchGasEstimate(params);
  }, [params, fetchGasEstimate]);

  const handleInputChange = (field: keyof TransactionParams, value: string) => {
    const newParams = {
      ...localParams,
      [field]: field === 'gasLimit' ? parseInt(value) || undefined : value,
    };
    setLocalParams(newParams);
    onParamsChange?.(newParams);
  };

  const handleParamsChangeDebounced = useCallback(
    (newParams: TransactionParams) => {
      fetchGasEstimate(newParams);
    },
    [fetchGasEstimate],
  );

  // Update estimate when local params change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleParamsChangeDebounced(localParams);
    }, 300);

    return () => clearTimeout(timer);
  }, [localParams, handleParamsChangeDebounced]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Transaction Cost Estimator
        </CardTitle>
        <CardDescription>
          Estimated cost in real-time based on current gas prices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Transaction Parameters Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Transaction Parameters
          </label>

          <div className="grid gap-3">
            <div>
              <label className="text-xs text-muted-foreground">
                Recipient Address
              </label>
              <Input
                placeholder="0x..."
                value={localParams.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Value (ETH)
              </label>
              <Input
                placeholder="0.0"
                type="number"
                step="0.001"
                value={localParams.value || ''}
                onChange={(e) => handleInputChange('value', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Gas Limit (optional)
              </label>
              <Input
                placeholder="21000"
                type="number"
                value={localParams.gasLimit || ''}
                onChange={(e) => handleInputChange('gasLimit', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Cost Estimate Display */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Estimated Cost
          </label>

          {isLoading ? (
            <LoadingState />
          ) : gasEstimate ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gas Price</span>
                <span className="text-sm font-mono">
                  {gasEstimate.gasPriceGwei.toFixed(2)} Gwei
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gas Limit</span>
                <span className="text-sm font-mono">
                  {gasEstimate.gasLimit.toString()}
                </span>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Network Fee
                </span>
                <span className="text-lg font-semibold font-mono">
                  {gasEstimate.gasFeeEth.toFixed(6)} ETH
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  USD Equivalent
                </span>
                <span className="text-lg font-semibold">
                  ${gasEstimate.gasFeeUsd.toFixed(2)}
                </span>
              </div>

              {/* Crypto/Fiat conversion */}
              {cryptoPrice > 0 && (
                <div className="mt-3 p-2 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground text-center">
                    Using ETH price: ${cryptoPrice.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Unable to estimate cost
            </p>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Calculating...
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionCostEstimator;
