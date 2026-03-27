'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourContextType {
  isOpen: boolean;
  currentStepIndex: number;
  steps: TourStep[];
  activeTourId: string | null;
  startTour: (id: string, steps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  isStepReady: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [isStepReady, setIsStepReady] = useState(false);

  const startTour = useCallback((id: string, tourSteps: TourStep[]) => {
    const isCompleted = localStorage.getItem(`tour_completed_${id}`);
    if (isCompleted) return;

    setActiveTourId(id);
    setSteps(tourSteps);
    setCurrentStepIndex(0);
    setIsOpen(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStepIndex, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    if (activeTourId) {
      localStorage.setItem(`tour_completed_${activeTourId}`, 'skipped');
    }
    setIsOpen(false);
    setActiveTourId(null);
  }, [activeTourId]);

  const completeTour = useCallback(() => {
    if (activeTourId) {
      localStorage.setItem(`tour_completed_${activeTourId}`, 'completed');
    }
    setIsOpen(false);
    setActiveTourId(null);
  }, [activeTourId]);

  // Wait for the target element to be polyfilled/available in DOM
  useEffect(() => {
    if (isOpen && steps[currentStepIndex]) {
      setIsStepReady(false);
      const timer = setTimeout(() => {
        const element = document.querySelector(steps[currentStepIndex].target);
        if (element) {
          setIsStepReady(true);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    setIsStepReady(false);
  }, [isOpen, currentStepIndex, steps]);

  return (
    <TourContext.Provider
      value={{
        isOpen,
        currentStepIndex,
        steps,
        activeTourId,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        completeTour,
        isStepReady,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
