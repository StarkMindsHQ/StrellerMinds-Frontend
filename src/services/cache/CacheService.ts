type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export class CacheService {
  private static store = new Map<string, CacheEntry<any>>();

  static get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  static set<T>(key: string, value: T, ttlMs: number) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  static invalidate(key: string) {
    this.store.delete(key);
  }

  static clear() {
    this.store.clear();
  }
}
