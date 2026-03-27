'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTour, TourStep as TourStepType } from '@/contexts/TourContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TourStepProps {
  step: TourStepType;
  rect: DOMRect;
  isLast: boolean;
  isFirst: boolean;
}

export function TourStep({ step, rect, isLast, isFirst }: TourStepProps) {
  const { nextStep, prevStep, skipTour, currentStepIndex, steps } = useTour();

  const position = useMemo(() => {
    const padding = 16;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let top = rect.bottom + padding;
    let left = rect.left + rect.width / 2;

    // Default to bottom-center of element
    // Adjust if it goes off screen
    if (top + 200 > windowHeight) {
      top = rect.top - 200 - padding;
    }

    // Horizontal centering with bounds check
    const width = 320;
    left = Math.max(
      padding,
      Math.min(windowWidth - width - padding, left - width / 2),
    );

    return { top, left };
  }, [rect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute z-[10000] w-[320px] bg-card text-card-foreground p-6 rounded-2xl shadow-2xl border border-border pointer-events-auto"
      style={
        {
          top: `${position.top}px`,
          left: `${position.left}px`,
        } as React.CSSProperties
      }
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <h3 className="text-lg font-bold leading-tight">{step.title}</h3>
        </div>
        <button
          onClick={skipTour}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-balance text-muted-foreground mb-6 leading-relaxed">
        {step.content}
      </p>

      <div className="flex justify-between items-center gap-3">
        <button
          onClick={skipTour}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip Tour
        </button>
        <div className="flex gap-2">
          {!isFirst && (
            <Button variant="secondary" size="sm" onClick={prevStep}>
              Back
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={nextStep}>
            {isLast ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>

      {/* Triangle pointer */}
      <div
        className="absolute w-4 h-4 bg-card border-l border-t border-border rotate-45"
        style={{
          top: -8,
          left: '50%',
          marginLeft: -8,
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          display: position.top > rect.bottom ? 'block' : 'none',
        }}
      />
    </motion.div>
  );
}
