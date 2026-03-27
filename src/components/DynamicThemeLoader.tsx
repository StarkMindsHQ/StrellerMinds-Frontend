'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

export interface RuntimeThemeConfig {
  name: string;
  variables: Record<string, string>;
  fontFamily?: string;
  monoFontFamily?: string;
}

interface DynamicThemeLoaderProps {
  children: React.ReactNode;
  themesEndpoint?: string;
  defaultTheme?: string;
  storageKey?: string;
  fetchThemes?: (signal: AbortSignal) => Promise<RuntimeThemeConfig[]>;
}

interface DynamicThemeContextValue {
  activeTheme: string;
  themes: RuntimeThemeConfig[];
  setTheme: (themeName: string) => void;
}

const DynamicThemeContext = createContext<DynamicThemeContextValue | null>(null);

const DEFAULT_STORAGE_KEY = 'strellerminds.theme.runtime';
const FALLBACK_THEME: RuntimeThemeConfig = {
  name: 'default',
  variables: {},
};

function applyTheme(config: RuntimeThemeConfig) {
  const root = document.documentElement;
  root.dataset.runtimeTheme = config.name;

  Object.entries(config.variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  if (config.fontFamily) {
    root.style.setProperty('--font-runtime-body', config.fontFamily);
  }
  if (config.monoFontFamily) {
    root.style.setProperty('--font-runtime-mono', config.monoFontFamily);
  }
}

async function defaultThemeFetcher(
  endpoint: string,
  signal: AbortSignal,
): Promise<RuntimeThemeConfig[]> {
  const response = await fetch(endpoint, {
    method: 'GET',
    signal,
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch themes: ${response.status}`);
  }

  const payload = (await response.json()) as
    | RuntimeThemeConfig[]
    | { themes: RuntimeThemeConfig[] };

  return Array.isArray(payload) ? payload : payload.themes;
}

export function DynamicThemeLoader({
  children,
  themesEndpoint = '/api/themes',
  defaultTheme = 'default',
  storageKey = DEFAULT_STORAGE_KEY,
  fetchThemes,
}: DynamicThemeLoaderProps) {
  const [themes, setThemes] = useState<RuntimeThemeConfig[]>([FALLBACK_THEME]);
  const [activeTheme, setActiveTheme] = useState<string>(defaultTheme);

  // Apply the persisted/default theme before paint to reduce flicker.
  useLayoutEffect(() => {
    const persistedTheme = localStorage.getItem(storageKey) ?? defaultTheme;
    setActiveTheme(persistedTheme);
    const cachedThemesRaw = localStorage.getItem(`${storageKey}.cache`);

    if (cachedThemesRaw) {
      try {
        const cachedThemes = JSON.parse(cachedThemesRaw) as RuntimeThemeConfig[];
        if (Array.isArray(cachedThemes) && cachedThemes.length > 0) {
          setThemes(cachedThemes);
          const config =
            cachedThemes.find((theme) => theme.name === persistedTheme) ??
            cachedThemes[0];
          applyTheme(config);
        }
      } catch {
        // Ignore invalid cache payloads and proceed with network fetch.
      }
    }
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    const controller = new AbortController();
    const loadThemes = async () => {
      try {
        const resolvedThemes = fetchThemes
          ? await fetchThemes(controller.signal)
          : await defaultThemeFetcher(themesEndpoint, controller.signal);

        if (!resolvedThemes || resolvedThemes.length === 0) return;

        setThemes(resolvedThemes);
        localStorage.setItem(`${storageKey}.cache`, JSON.stringify(resolvedThemes));

        const selectedTheme =
          resolvedThemes.find((theme) => theme.name === activeTheme) ??
          resolvedThemes.find((theme) => theme.name === defaultTheme) ??
          resolvedThemes[0];

        setActiveTheme(selectedTheme.name);
        localStorage.setItem(storageKey, selectedTheme.name);
        applyTheme(selectedTheme);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        // Silent fail to keep app usable with fallback theme.
      }
    };

    void loadThemes();
    return () => controller.abort();
  }, [activeTheme, defaultTheme, fetchThemes, storageKey, themesEndpoint]);

  const value = useMemo<DynamicThemeContextValue>(
    () => ({
      activeTheme,
      themes,
      setTheme: (themeName: string) => {
        const next = themes.find((theme) => theme.name === themeName);
        if (!next) return;
        setActiveTheme(themeName);
        localStorage.setItem(storageKey, themeName);
        applyTheme(next);
      },
    }),
    [activeTheme, storageKey, themes],
  );

  return (
    <DynamicThemeContext.Provider value={value}>
      {children}
    </DynamicThemeContext.Provider>
  );
}

export function useDynamicTheme() {
  const context = useContext(DynamicThemeContext);
  if (!context) {
    throw new Error('useDynamicTheme must be used within DynamicThemeLoader');
  }
  return context;
}

