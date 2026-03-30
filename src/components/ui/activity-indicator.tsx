'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivity } from '@/contexts/activity-context';
import { cn } from '@/lib/utils';

export function ActivityIndicator() {
  const { isActive } = useActivity();

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed top-0 left-0 right-0 z-9999 h-1 origin-left bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
        >
          <motion.div
            animate={{
              x: ['0%', '100%'],
              transition: {
                repeat: Infinity,
                duration: 1.5,
                ease: 'linear',
              },
            }}
            className="absolute inset-0 h-full w-1/3 bg-linear-to-r from-transparent via-white/40 to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
