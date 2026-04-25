'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

interface GlobalState {
  userSettings: any;
  progress: any;
  notifications: any[];
  isHydrated: boolean;
}

interface GlobalStateContextType {
  state: GlobalState;
  updateSettings: (settings: any) => Promise<void>;
  updateProgress: (progress: any) => Promise<void>;
  refreshState: () => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined,
);

export function GlobalStateSyncProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);

  // Use React Query for centralized state hydration and backend sync
  const {
    data: globalData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['globalState', session?.user?.email],
    queryFn: async () => {
      if (!session?.user) return null;
      // In a real app, this would be an API call
      // const response = await fetch('/api/user/global-state');
      // return response.json();

      // Mock data for demonstration
      return {
        userSettings: { theme: 'system', language: 'en' },
        progress: { completedCourses: [] },
        notifications: [],
      };
    },
    enabled: !!session?.user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [state, setState] = useState<GlobalState>({
    userSettings: null,
    progress: null,
    notifications: [],
    isHydrated: false,
  });

  useEffect(() => {
    if (globalData) {
      setState((prev) => ({
        ...prev,
        ...globalData,
        isHydrated: true,
      }));
      setIsHydrated(true);
    } else if (status === 'unauthenticated') {
      setIsHydrated(true);
    }
  }, [globalData, status]);

  const updateSettings = async (settings: any) => {
    // API call to update settings
    setState((prev) => ({
      ...prev,
      userSettings: { ...prev.userSettings, ...settings },
    }));
  };

  const updateProgress = async (progress: any) => {
    // API call to update progress
    setState((prev) => ({
      ...prev,
      progress: { ...prev.progress, ...progress },
    }));
  };

  const refreshState = () => {
    refetch();
  };

  const value = {
    state: { ...state, isHydrated: isHydrated && !isLoading },
    updateSettings,
    updateProgress,
    refreshState,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalState must be used within a GlobalStateSyncProvider',
    );
  }
  return context;
}
