'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorRetryBlockProps {
  errorMessage: string;
  onRetry: () => Promise<any> | void;
  className?: string;
  title?: string;
}

const ErrorRetryBlock: React.FC<ErrorRetryBlockProps> = ({
  errorMessage,
  onRetry,
  className,
  title = 'Something Went Wrong',
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryClick = async () => {
    if (isRetrying) return;

    setIsRetrying(true);
    try {
      await onRetry();
      // If onRetry is successful, this component will likely be unmounted.
      // If it fails again, we reset the state after a short delay.
    } catch (error) {
      console.error('Retry attempt failed:', error);
    } finally {
      setTimeout(() => setIsRetrying(false), 500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const iconVariants = {
    initial: { scale: 0.9, opacity: 0.7 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: 1,
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-red-500/50 bg-red-500/5 p-8 text-center text-red-500 dark:bg-red-900/10',
        className,
      )}
      role="alert"
    >
      <motion.div variants={iconVariants} initial="initial" animate="animate">
        <AlertTriangle size={40} />
      </motion.div>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg text-red-600 dark:text-red-400">
          {title}
        </h3>
        <p className="text-sm text-red-500 dark:text-red-400/80">
          {errorMessage}
        </p>
      </div>
      <Button
        variant="destructive"
        onClick={handleRetryClick}
        disabled={isRetrying}
        className="mt-2"
      >
        {isRetrying ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        {isRetrying ? 'Retrying...' : 'Retry'}
      </Button>
    </motion.div>
  );
};

export default ErrorRetryBlock;
