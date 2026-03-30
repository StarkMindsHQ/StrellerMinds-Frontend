'use client';

import * as React from 'react';

interface ActivityContextType {
  isActive: boolean;
  startActivity: () => void;
  endActivity: () => void;
}

const ActivityContext = React.createContext<ActivityContextType | undefined>(
  undefined,
);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activeCount, setActiveCount] = React.useState(0);

  const startActivity = React.useCallback(() => {
    setActiveCount((prev) => prev + 1);
  }, []);

  const endActivity = React.useCallback(() => {
    setActiveCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value = React.useMemo(
    () => ({
      isActive: activeCount > 0,
      startActivity,
      endActivity,
    }),
    [activeCount, startActivity, endActivity],
  );

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = React.useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
