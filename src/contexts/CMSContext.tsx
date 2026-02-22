'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import type {
  CMSState,
  CMSUser,
  Course,
  Lesson,
  Quiz,
  CourseModule,
  Draft,
  ActivityLog,
  CMSNotification,
  ContentVersion,
  Comment,
  MediaAsset,
} from '@/types/cms';

// ============================================
// CMS Context - Global State Management
// ============================================

// Action Types
type CMSAction =
  | { type: 'SET_USER'; payload: CMSUser | null }
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'SET_CURRENT_COURSE'; payload: Course | null }
  | { type: 'UPDATE_COURSE'; payload: Partial<Course> }
  | { type: 'ADD_MODULE'; payload: CourseModule }
  | {
      type: 'UPDATE_MODULE';
      payload: { moduleId: string; data: Partial<CourseModule> };
    }
  | { type: 'DELETE_MODULE'; payload: string }
  | { type: 'REORDER_MODULES'; payload: CourseModule[] }
  | { type: 'ADD_LESSON'; payload: { moduleId: string; lesson: Lesson } }
  | {
      type: 'UPDATE_LESSON';
      payload: { moduleId: string; lessonId: string; data: Partial<Lesson> };
    }
  | { type: 'DELETE_LESSON'; payload: { moduleId: string; lessonId: string } }
  | {
      type: 'REORDER_LESSONS';
      payload: { moduleId: string; lessons: Lesson[] };
    }
  | { type: 'ADD_QUIZ'; payload: { moduleId: string; quiz: Quiz } }
  | {
      type: 'UPDATE_QUIZ';
      payload: { moduleId: string; quizId: string; data: Partial<Quiz> };
    }
  | { type: 'DELETE_QUIZ'; payload: { moduleId: string; quizId: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_DRAFT'; payload: Draft | null }
  | { type: 'ADD_ACTIVITY'; payload: ActivityLog }
  | { type: 'SET_RECENT_ACTIVITY'; payload: ActivityLog[] }
  | { type: 'ADD_NOTIFICATION'; payload: CMSNotification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | {
      type: 'ADD_VERSION';
      payload: { contentId: string; version: ContentVersion };
    }
  | {
      type: 'RESTORE_VERSION';
      payload: { contentId: string; version: ContentVersion };
    };

// Initial State
const initialState: CMSState = {
  currentUser: null,
  currentCourse: null,
  courses: [],
  isLoading: false,
  isSaving: false,
  hasUnsavedChanges: false,
  sidebarOpen: true,
  previewMode: false,
  activeDraft: null,
  recentActivity: [],
  notifications: [],
};

// Reducer
function cmsReducer(state: CMSState, action: CMSAction): CMSState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };

    case 'SET_COURSES':
      return { ...state, courses: action.payload };

    case 'SET_CURRENT_COURSE':
      return {
        ...state,
        currentCourse: action.payload,
        hasUnsavedChanges: false,
      };

    case 'UPDATE_COURSE':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: { ...state.currentCourse, ...action.payload },
        hasUnsavedChanges: true,
      };

    case 'ADD_MODULE':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: [...state.currentCourse.modules, action.payload],
        },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_MODULE':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: state.currentCourse.modules.map((m) =>
            m.id === action.payload.moduleId
              ? { ...m, ...action.payload.data }
              : m,
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'DELETE_MODULE':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: state.currentCourse.modules.filter(
            (m) => m.id !== action.payload,
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'REORDER_MODULES':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: action.payload,
        },
        hasUnsavedChanges: true,
      };

    case 'ADD_LESSON':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: state.currentCourse.modules.map((m) =>
            m.id === action.payload.moduleId
              ? { ...m, lessons: [...m.lessons, action.payload.lesson] }
              : m,
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_LESSON':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: state.currentCourse.modules.map((m) =>
            m.id === action.payload.moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === action.payload.lessonId
                      ? { ...l, ...action.payload.data }
                      : l,
                  ),
                }
              : m,
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'DELETE_LESSON':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: state.currentCourse.modules.map((m) =>
            m.id === action.payload.moduleId
              ? {
                  ...m,
                  lessons: m.lessons.filter(
                    (l) => l.id !== action.payload.lessonId,
                  ),
                }
              : m,
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'REORDER_LESSONS':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: state.currentCourse.modules.map((m) =>
            m.id === action.payload.moduleId
              ? { ...m, lessons: action.payload.lessons }
              : m,
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'ADD_QUIZ':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: state.currentCourse.modules.map((m) =>
            m.id === action.payload.moduleId
              ? { ...m, quizzes: [...m.quizzes, action.payload.quiz] }
              : m,
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_QUIZ':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: state.currentCourse.modules.map((m) =>
            m.id === action.payload.moduleId
              ? {
                  ...m,
                  quizzes: m.quizzes.map((q) =>
                    q.id === action.payload.quizId
                      ? { ...q, ...action.payload.data }
                      : q,
                  ),
                }
              : m,
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'DELETE_QUIZ':
      if (!state.currentCourse) return state;
      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: state.currentCourse.modules.map((m) =>
            m.id === action.payload.moduleId
              ? {
                  ...m,
                  quizzes: m.quizzes.filter(
                    (q) => q.id !== action.payload.quizId,
                  ),
                }
              : m,
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };

    case 'SET_UNSAVED_CHANGES':
      return { ...state, hasUnsavedChanges: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'TOGGLE_PREVIEW':
      return { ...state, previewMode: !state.previewMode };

    case 'SET_DRAFT':
      return { ...state, activeDraft: action.payload };

    case 'ADD_ACTIVITY':
      return {
        ...state,
        recentActivity: [action.payload, ...state.recentActivity].slice(0, 50),
      };

    case 'SET_RECENT_ACTIVITY':
      return { ...state, recentActivity: action.payload };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n,
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    default:
      return state;
  }
}

// Context Interface
interface CMSContextValue extends CMSState {
  // User actions
  setUser: (user: CMSUser | null) => void;

  // Course actions
  setCourses: (courses: Course[]) => void;
  setCurrentCourse: (course: Course | null) => void;
  updateCourse: (data: Partial<Course>) => void;
  saveCourse: () => Promise<void>;
  publishCourse: () => Promise<void>;

  // Module actions
  addModule: (module: CourseModule) => void;
  updateModule: (moduleId: string, data: Partial<CourseModule>) => void;
  deleteModule: (moduleId: string) => void;
  reorderModules: (modules: CourseModule[]) => void;

  // Lesson actions
  addLesson: (moduleId: string, lesson: Lesson) => void;
  updateLesson: (
    moduleId: string,
    lessonId: string,
    data: Partial<Lesson>,
  ) => void;
  deleteLesson: (moduleId: string, lessonId: string) => void;
  reorderLessons: (moduleId: string, lessons: Lesson[]) => void;

  // Quiz actions
  addQuiz: (moduleId: string, quiz: Quiz) => void;
  updateQuiz: (moduleId: string, quizId: string, data: Partial<Quiz>) => void;
  deleteQuiz: (moduleId: string, quizId: string) => void;

  // UI actions
  toggleSidebar: () => void;
  togglePreview: () => void;
  setLoading: (loading: boolean) => void;

  // Draft actions
  saveDraft: () => Promise<void>;
  loadDraft: (draftId: string) => Promise<void>;
  clearDraft: () => void;

  // Version control
  createVersion: (message?: string) => Promise<ContentVersion>;
  restoreVersion: (version: ContentVersion) => void;
  compareVersions: (fromVersion: number, toVersion: number) => void;

  // Collaboration
  addComment: (comment: Comment) => void;
  resolveComment: (commentId: string) => void;

  // Notifications
  addNotification: (
    notification: Omit<CMSNotification, 'id' | 'createdAt' | 'read'>,
  ) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Activity
  logActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

// Create Context
const CMSContext = createContext<CMSContextValue | undefined>(undefined);

// Provider Component
interface CMSProviderProps {
  children: ReactNode;
}

export function CMSProvider({ children }: CMSProviderProps) {
  const [state, dispatch] = useReducer(cmsReducer, initialState);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!state.hasUnsavedChanges || !state.currentCourse) return;

    const timer = setTimeout(() => {
      saveDraft();
    }, 30000);

    return () => clearTimeout(timer);
  }, [state.hasUnsavedChanges, state.currentCourse]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  // User actions
  const setUser = useCallback((user: CMSUser | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  // Course actions
  const setCourses = useCallback((courses: Course[]) => {
    dispatch({ type: 'SET_COURSES', payload: courses });
  }, []);

  const setCurrentCourse = useCallback((course: Course | null) => {
    dispatch({ type: 'SET_CURRENT_COURSE', payload: course });
  }, []);

  const updateCourse = useCallback((data: Partial<Course>) => {
    dispatch({ type: 'UPDATE_COURSE', payload: data });
  }, []);

  const saveCourse = useCallback(async () => {
    if (!state.currentCourse) return;

    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch({ type: 'SET_UNSAVED_CHANGES', payload: false });
      addNotification({
        type: 'success',
        title: 'Course Saved',
        message: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save changes. Please try again.',
      });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state.currentCourse]);

  const publishCourse = useCallback(async () => {
    if (!state.currentCourse) return;

    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      dispatch({
        type: 'UPDATE_COURSE',
        payload: { status: 'published', publishedAt: new Date() },
      });
      dispatch({ type: 'SET_UNSAVED_CHANGES', payload: false });
      addNotification({
        type: 'success',
        title: 'Course Published',
        message: 'Your course is now live!',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Publish Failed',
        message: 'Failed to publish course. Please try again.',
      });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state.currentCourse]);

  // Module actions
  const addModule = useCallback((module: CourseModule) => {
    dispatch({ type: 'ADD_MODULE', payload: module });
  }, []);

  const updateModule = useCallback(
    (moduleId: string, data: Partial<CourseModule>) => {
      dispatch({ type: 'UPDATE_MODULE', payload: { moduleId, data } });
    },
    [],
  );

  const deleteModule = useCallback((moduleId: string) => {
    dispatch({ type: 'DELETE_MODULE', payload: moduleId });
  }, []);

  const reorderModules = useCallback((modules: CourseModule[]) => {
    dispatch({ type: 'REORDER_MODULES', payload: modules });
  }, []);

  // Lesson actions
  const addLesson = useCallback((moduleId: string, lesson: Lesson) => {
    dispatch({ type: 'ADD_LESSON', payload: { moduleId, lesson } });
  }, []);

  const updateLesson = useCallback(
    (moduleId: string, lessonId: string, data: Partial<Lesson>) => {
      dispatch({
        type: 'UPDATE_LESSON',
        payload: { moduleId, lessonId, data },
      });
    },
    [],
  );

  const deleteLesson = useCallback((moduleId: string, lessonId: string) => {
    dispatch({ type: 'DELETE_LESSON', payload: { moduleId, lessonId } });
  }, []);

  const reorderLessons = useCallback((moduleId: string, lessons: Lesson[]) => {
    dispatch({ type: 'REORDER_LESSONS', payload: { moduleId, lessons } });
  }, []);

  // Quiz actions
  const addQuiz = useCallback((moduleId: string, quiz: Quiz) => {
    dispatch({ type: 'ADD_QUIZ', payload: { moduleId, quiz } });
  }, []);

  const updateQuiz = useCallback(
    (moduleId: string, quizId: string, data: Partial<Quiz>) => {
      dispatch({ type: 'UPDATE_QUIZ', payload: { moduleId, quizId, data } });
    },
    [],
  );

  const deleteQuiz = useCallback((moduleId: string, quizId: string) => {
    dispatch({ type: 'DELETE_QUIZ', payload: { moduleId, quizId } });
  }, []);

  // UI actions
  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const togglePreview = useCallback(() => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  // Draft actions
  const saveDraft = useCallback(async () => {
    if (!state.currentCourse) return;

    const draft: Draft = {
      id: `draft-${state.currentCourse.id}`,
      contentType: 'course',
      contentId: state.currentCourse.id,
      data: state.currentCourse,
      lastSavedAt: new Date(),
      savedBy: state.currentUser?.id || 'unknown',
    };

    // Save to localStorage for now
    localStorage.setItem(
      `cms-draft-${state.currentCourse.id}`,
      JSON.stringify(draft),
    );
    dispatch({ type: 'SET_DRAFT', payload: draft });
  }, [state.currentCourse, state.currentUser]);

  const loadDraft = useCallback(async (draftId: string) => {
    const savedDraft = localStorage.getItem(`cms-draft-${draftId}`);
    if (savedDraft) {
      const draft = JSON.parse(savedDraft) as Draft;
      dispatch({ type: 'SET_DRAFT', payload: draft });
      dispatch({ type: 'SET_CURRENT_COURSE', payload: draft.data as Course });
    }
  }, []);

  const clearDraft = useCallback(() => {
    if (state.currentCourse) {
      localStorage.removeItem(`cms-draft-${state.currentCourse.id}`);
    }
    dispatch({ type: 'SET_DRAFT', payload: null });
  }, [state.currentCourse]);

  // Version control
  const createVersion = useCallback(
    async (message?: string): Promise<ContentVersion> => {
      if (!state.currentCourse || !state.currentUser) {
        throw new Error('No course or user');
      }

      const version: ContentVersion = {
        id: `v-${Date.now()}`,
        contentType: 'course',
        contentId: state.currentCourse.id,
        version: state.currentCourse.version + 1,
        changes: [], // Would be computed from diff
        snapshot: state.currentCourse,
        message,
        createdBy: state.currentUser.id,
        createdAt: new Date(),
        restorable: true,
      };

      dispatch({
        type: 'ADD_VERSION',
        payload: { contentId: state.currentCourse.id, version },
      });

      return version;
    },
    [state.currentCourse, state.currentUser],
  );

  const restoreVersion = useCallback((version: ContentVersion) => {
    dispatch({
      type: 'RESTORE_VERSION',
      payload: { contentId: version.contentId, version },
    });
    dispatch({
      type: 'SET_CURRENT_COURSE',
      payload: version.snapshot as Course,
    });
  }, []);

  const compareVersions = useCallback(
    (fromVersion: number, toVersion: number) => {
      // Would implement version comparison logic
      console.log('Comparing versions:', fromVersion, 'to', toVersion);
    },
    [],
  );

  // Collaboration
  const addComment = useCallback((comment: Comment) => {
    // Would add comment to relevant content
    console.log('Adding comment:', comment);
  }, []);

  const resolveComment = useCallback((commentId: string) => {
    // Would resolve the comment
    console.log('Resolving comment:', commentId);
  }, []);

  // Notifications
  const addNotification = useCallback(
    (notification: Omit<CMSNotification, 'id' | 'createdAt' | 'read'>) => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          ...notification,
          id: `notif-${Date.now()}`,
          createdAt: new Date(),
          read: false,
        },
      });
    },
    [],
  );

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  // Activity logging
  const logActivity = useCallback(
    (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => {
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          ...activity,
          id: `activity-${Date.now()}`,
          timestamp: new Date(),
        },
      });
    },
    [],
  );

  const value: CMSContextValue = {
    ...state,
    setUser,
    setCourses,
    setCurrentCourse,
    updateCourse,
    saveCourse,
    publishCourse,
    addModule,
    updateModule,
    deleteModule,
    reorderModules,
    addLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    toggleSidebar,
    togglePreview,
    setLoading,
    saveDraft,
    loadDraft,
    clearDraft,
    createVersion,
    restoreVersion,
    compareVersions,
    addComment,
    resolveComment,
    addNotification,
    markNotificationRead,
    clearNotifications,
    logActivity,
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

// Custom Hook
export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}

// Selector hooks for performance
export function useCMSCourse() {
  const { currentCourse, updateCourse, saveCourse, publishCourse } = useCMS();
  return { currentCourse, updateCourse, saveCourse, publishCourse };
}

export function useCMSModules() {
  const {
    currentCourse,
    addModule,
    updateModule,
    deleteModule,
    reorderModules,
  } = useCMS();
  return {
    modules: currentCourse?.modules || [],
    addModule,
    updateModule,
    deleteModule,
    reorderModules,
  };
}

export function useCMSUI() {
  const {
    sidebarOpen,
    previewMode,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    toggleSidebar,
    togglePreview,
  } = useCMS();
  return {
    sidebarOpen,
    previewMode,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    toggleSidebar,
    togglePreview,
  };
}

export default CMSContext;
