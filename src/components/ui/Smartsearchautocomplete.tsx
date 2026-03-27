'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from 'react';
import { Search, Clock, TrendingUp, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchSuggestion {
  id: string;
  label: string;
  category?: string;
  type: 'suggestion' | 'recent' | 'trending';
}

interface SmartSearchAutocompleteProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  fetchSuggestions?: (query: string) => Promise<SearchSuggestion[]>;
  className?: string;
  maxRecent?: number;
}

const RECENT_KEY = 'smart_search_recent';
const DEBOUNCE_MS = 280;
const SUGGESTION_CACHE = new Map<string, SearchSuggestion[]>();

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function loadRecent(max: number): SearchSuggestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return stored.slice(0, max);
  } catch {
    return [];
  }
}

function saveRecent(query: string, max: number) {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const prev: SearchSuggestion[] = JSON.parse(
      localStorage.getItem(RECENT_KEY) ?? '[]',
    );
    const next: SearchSuggestion[] = [
      {
        id: `recent-${Date.now()}`,
        label: query.trim(),
        type: 'recent' as const,
      },
      ...prev.filter((r) => r.label !== query.trim()),
    ].slice(0, max);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

// Default mock fetcher — replace with real API call
async function defaultFetchSuggestions(
  query: string,
): Promise<SearchSuggestion[]> {
  await new Promise((r) => setTimeout(r, 300));
  const mock = [
    'React fundamentals',
    'TypeScript advanced patterns',
    'System design interview',
    'Python for data science',
    'Node.js microservices',
    'CSS Grid mastery',
    'GraphQL with Apollo',
    'Docker and Kubernetes',
    'Machine learning basics',
    'Product management 101',
  ];
  return mock
    .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6)
    .map((label, i) => ({
      id: `sug-${i}`,
      label,
      category: i % 2 === 0 ? 'Course' : 'Topic',
      type: 'suggestion' as const,
    }));
}

const trendingDefaults: SearchSuggestion[] = [
  { id: 't1', label: 'AI & Machine Learning', type: 'trending' },
  { id: 't2', label: 'Full-Stack Development', type: 'trending' },
  { id: 't3', label: 'UX Research Methods', type: 'trending' },
];

export function SmartSearchAutocomplete({
  placeholder = 'Search courses, mentors, topics…',
  onSearch,
  fetchSuggestions = defaultFetchSuggestions,
  className,
  maxRecent = 5,
}: SmartSearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState<SearchSuggestion[]>([]);

  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent on mount
  useEffect(() => {
    setRecent(loadRecent(maxRecent));
  }, [maxRecent]);

  // Fetch suggestions on debounced query change
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const cacheKey = debouncedQuery.toLowerCase();
    if (SUGGESTION_CACHE.has(cacheKey)) {
      setSuggestions(SUGGESTION_CACHE.get(cacheKey)!);
      return;
    }

    setIsLoading(true);
    fetchSuggestions(debouncedQuery)
      .then((results) => {
        SUGGESTION_CACHE.set(cacheKey, results);
        setSuggestions(results);
      })
      .catch(() => setSuggestions([]))
      .finally(() => setIsLoading(false));
  }, [debouncedQuery, fetchSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayItems: SearchSuggestion[] = query.trim()
    ? suggestions
    : [...recent, ...trendingDefaults.slice(0, 3 - Math.min(recent.length, 3))];

  const handleSelect = useCallback(
    (item: SearchSuggestion) => {
      setQuery(item.label);
      setIsOpen(false);
      setActiveIndex(-1);
      saveRecent(item.label, maxRecent);
      setRecent(loadRecent(maxRecent));
      onSearch?.(item.label);
    },
    [maxRecent, onSearch],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, displayItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && displayItems[activeIndex]) {
        handleSelect(displayItems[activeIndex]);
      } else if (query.trim()) {
        saveRecent(query, maxRecent);
        setRecent(loadRecent(maxRecent));
        onSearch?.(query);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  const clearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  };

  const showDropdown = Boolean(
    isOpen &&
    (displayItems.length > 0 || isLoading || (query.trim() && !isLoading)),
  );

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Input */}
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5 shadow-sm transition-all duration-200',
          isOpen
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-border hover:border-primary/50',
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-activedescendant={
            activeIndex >= 0 ? `sac-item-${activeIndex}` : undefined
          }
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="rounded-full p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border bg-popover shadow-lg animate-in fade-in-0 slide-in-from-top-1 duration-150">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Searching…
            </div>
          )}

          {/* No results */}
          {!isLoading && query.trim() && displayItems.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Section: Recent */}
          {!query.trim() && recent.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-4 pb-1 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent
                </p>
                <button
                  onClick={clearRecent}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Section: Trending (no query, no recent) */}
          {!query.trim() && recent.length === 0 && (
            <div className="px-4 pb-1 pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Trending
              </p>
            </div>
          )}

          {/* Items */}
          {!isLoading && displayItems.length > 0 && (
            <ul ref={listRef} role="listbox" className="py-1">
              {displayItems.map((item, index) => (
                <li
                  key={item.id}
                  id={`sac-item-${index}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    activeIndex === index
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50',
                  )}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    {item.type === 'recent' ? (
                      <Clock className="h-3 w-3" />
                    ) : item.type === 'trending' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <Search className="h-3 w-3" />
                    )}
                  </span>

                  <span className="flex-1 truncate">{item.label}</span>

                  {item.category && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {item.category}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Footer hint */}
          <div className="border-t px-4 py-2 text-[11px] text-muted-foreground">
            ↑↓ navigate · Enter to search · Esc to close
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartSearchAutocomplete;
