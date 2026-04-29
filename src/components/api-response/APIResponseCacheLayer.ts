import { CacheService } from '@/services/cache/CacheService';

interface CacheOptions {
  key: string;
  ttlMs?: number;
  invalidateOn?: string[]; // mutation endpoints
}

export async function APIResponseCacheLayer<T>(
  fetcher: () => Promise<T>,
  options: CacheOptions,
): Promise<T> {
  const { key, ttlMs = 60_000 } = options;

  const cached = CacheService.get<T>(key);
  if (cached) {
    return cached;
  }

  const result = await fetcher();
  CacheService.set(key, result, ttlMs);
  return result;
}

// Example mutation wrapper
export async function invalidateOnMutation<T>(
  mutation: () => Promise<T>,
  keysToInvalidate: string[],
): Promise<T> {
  const result = await mutation();
  keysToInvalidate.forEach((key) => CacheService.invalidate(key));
  return result;
}
