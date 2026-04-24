import { describe, expect, it, beforeEach } from 'vitest';
import {
  APIResponseCacheLayer,
  invalidateOnMutation,
} from '@/components/api-response/APIResponseCacheLayer';
import { CacheService } from '@/services/cache/CacheService';

describe('APIResponseCacheLayer', () => {
  beforeEach(() => CacheService.clear());

  it('caches responses by key', async () => {
    let count = 0;
    const fetcher = async () => ++count;

    const first = await APIResponseCacheLayer(fetcher, { key: 'test' });
    const second = await APIResponseCacheLayer(fetcher, { key: 'test' });

    expect(first).toBe(1);
    expect(second).toBe(1);
  });

  it('invalidates cache on mutation', async () => {
    CacheService.set('test', { foo: 'bar' }, 1000);
    await invalidateOnMutation(async () => 'mutated', ['test']);

    expect(CacheService.get('test')).toBeNull();
  });

  it('respects TTL', async () => {
    CacheService.set('test', 'value', 1);
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(CacheService.get('test')).toBeNull();
  });
});
