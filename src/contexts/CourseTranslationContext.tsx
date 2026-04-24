'use client';

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface CourseTranslation {
  title: string;
  description: string;
  lessons?: Array<{ id: string; title: string }>;
}

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translation: CourseTranslation | null;
  loading: boolean;
  error: string | null;
}

const CourseTranslationContext = createContext<
  TranslationContextType | undefined
>(undefined);

export function CourseTranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const courseId = params?.courseId as string | undefined;

  const [language, setLanguageState] = useState<string>('en');
  const [translation, setTranslation] = useState<CourseTranslation | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved language preference
  useEffect(() => {
    const saved = localStorage.getItem('course-lang');
    if (saved) {
      setLanguageState(saved);
    }
  }, []);

  // Fetch translation when courseId or language changes
  useEffect(() => {
    if (!courseId) return;

    const fetchTranslation = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/courses/${courseId}/translations?lang=${language}`,
        );
        const data = await res.json();
        if (res.ok) {
          setTranslation(data.data.translation);
        } else {
          setError(data.error || 'Failed to load translation');
          // Fallback: use English from course data if API fails
          // We'll handle this in the UI by showing original text
        }
      } catch (err) {
        setError('Network error while fetching translation');
      } finally {
        setLoading(false);
      }
    };

    fetchTranslation();
  }, [courseId, language]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('course-lang', lang);
  };

  return (
    <CourseTranslationContext.Provider
      value={{
        language,
        setLanguage,
        translation,
        loading,
        error,
      }}
    >
      {children}
    </CourseTranslationContext.Provider>
  );
}

export function useCourseTranslation() {
  const context = useContext(CourseTranslationContext);
  if (context === undefined) {
    throw new Error(
      'useCourseTranslation must be used within a CourseTranslationProvider',
    );
  }
  return context;
}
