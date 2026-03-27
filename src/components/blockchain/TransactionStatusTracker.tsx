'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  RefreshCcw,
  ArrowRight,
  ShieldCheck,
  Zap,
  HardDrive
} from 'lucide-react';
import { useTransactionStatus, TransactionStatus } from '@/hooks/useTransactionStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useChainId } from 'wagmi';
import { chainConfig } from '@/lib/web3/simple-config';

export interface TransactionStatusTrackerProps {
  txHash?: `0x${string}`;
  description?: string;
  onConfirmed?: (receipt: any) => void;
  onFailed?: (error: any) => void;
  className?: string;
  autoHide?: boolean;
  autoHideDuration?: number; // ms
}

/**
 * TransactionStatusTracker Component
 * Real-time monitoring of blockchain transactions with visual status badges.
 * Built for premium dashboard experience with subtle animations.
 */
export const TransactionStatusTracker: React.FC<TransactionStatusTrackerProps> = ({
  txHash,
  description = 'Transaction processing...',
  onConfirmed,
  onFailed,
  className,
  autoHide = false,
  autoHideDuration = 5000,
}: TransactionStatusTrackerProps) => {
  const chainId = useChainId();
  const [isVisible, setIsVisible] = useState(!!txHash);
  const { status, receipt, error, isConfirmed, isFailed, isLoading } = useTransactionStatus({
    hash: txHash,
    onConfirmed,
    onFailed,
  });

  useEffect(() => {
    if (txHash) {
      setIsVisible(true);
    }
  }, [txHash]);

  // Auto-hide logic on success/fail
  useEffect(() => {
    if (autoHide && (isConfirmed || isFailed)) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, isFailed, autoHide, autoHideDuration]);

  if (!txHash || !isVisible) return null;

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
      case 'failed':
      case 'timeout': return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
      case 'pending': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
      default: return 'text-slate-500 border-slate-500/20 bg-slate-500/5';
    }
  };

  const statusIcons: Record<TransactionStatus, React.ReactNode> = {
    idle: <Clock className="h-5 w-5" />,
    pending: <Loader2 className="h-5 w-5 animate-spin" />,
    confirmed: <CheckCircle2 className="h-5 w-5" />,
    failed: <XCircle className="h-5 w-5" />,
    timeout: <RefreshCcw className="h-5 w-5" />,
  };

  const statusLabels: Record<TransactionStatus, string> = {
    idle: 'Idle',
    pending: 'Confirming...',
    confirmed: 'Succeeded',
    failed: 'Transaction Failed',
    timeout: 'Timed Out',
  };

  const getExplorerUrl = (hash: string) => {
    const baseUrl = (chainConfig as any)[chainId]?.explorer || 'https://etherscan.io';
    return `${baseUrl}/tx/${hash}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "relative overflow-hidden group",
          className
        )}
      >
        <Card className={cn(
          "border-l-4 shadow-sm transition-all duration-300",
          status === 'confirmed' ? "border-l-emerald-500" : 
          status === 'failed' || status === 'timeout' ? "border-l-rose-500" : 
          "border-l-amber-500"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Left: Status Icon with Glow */}
              <div className={cn(
                "p-2 rounded-xl transition-colors duration-300 shadow-sm",
                status === 'confirmed' ? "bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-600" : 
                status === 'failed' || status === 'timeout' ? "bg-rose-50/50 dark:bg-rose-500/10 text-rose-600" : 
                "bg-amber-50/50 dark:bg-amber-500/10 text-amber-600"
              )}>
                {statusIcons[status]}
              </div>

              {/* Middle: Description & Info */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-tight">
                    {description}
                  </span>
                  <Badge variant="outline" className={cn(
                    "text-[10px] uppercase tracking-widest font-bold border rounded px-2 py-0.5",
                    getStatusColor(status)
                  )}>
                    {statusLabels[status]}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 tabular-nums">
                  <HardDrive className="h-3 w-3 opacity-50" />
                  Hash: {txHash.slice(0, 8)}...{txHash.slice(-8)}
                </p>

                {/* Progress Bar (Pending State) */}
                {status === 'pending' && (
                  <div className="mt-3 overflow-hidden h-1.5 w-full bg-amber-100 dark:bg-amber-900/20 rounded-full">
                    <motion.div 
                      className="h-full bg-amber-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ 
                        duration: 30, // Simulated progress for UX
                        ease: "linear",
                        repeat: Infinity 
                      }}
                    />
                  </div>
                )}

                {/* Confirmations Meta (Simulated) */}
                {status === 'confirmed' && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="h-3 w-3" />
                      Immutable
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <Zap className="h-3 w-3" />
                      Fast Confirmation
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
                  asChild
                >
                  <a href={getExplorerUrl(txHash)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                
                {isFailed && (
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    onClick={() => setIsVisible(false)}
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
