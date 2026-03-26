'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '@/contexts/TourContext';
import { TourStep } from '@/components/ui/TourStep';

export function TourOverlay() {
  const { isOpen, currentStepIndex, steps, isStepReady } = useTour();
  const [rect, setRect] = useState<DOMRect | null>(null);

  const step = useMemo(() => steps[currentStepIndex], [steps, currentStepIndex]);

  useEffect(() => {
    if (!isOpen || !step) return;

    const updateRect = () => {
      const element = document.querySelector(step.target);
      if (element) {
        setRect(element.getBoundingClientRect());
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    // Initial check might need a bit of time if things are rendering
    const interval = setInterval(updateRect, 500);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      clearInterval(interval);
    };
  }, [isOpen, step, currentStepIndex]);

  if (!isOpen || !step) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {rect && (
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <defs>
              <mask id="tour-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <motion.rect
                  initial={false}
                  animate={{
                    x: rect.left - 8,
                    y: rect.top - 8,
                    width: rect.width + 16,
                    height: rect.height + 16,
                    rx: 8,
                  }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.7)"
              mask="url(#tour-mask)"
            />
          </motion.svg>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rect && isStepReady && (
          <TourStep
            key={currentStepIndex}
            step={step}
            rect={rect}
            isLast={currentStepIndex === steps.length - 1}
            isFirst={currentStepIndex === 0}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
