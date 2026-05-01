interface FeatureFlags {
  [key: string]: {
    enabled: boolean;
    variant?: string; // for A/B testing
  };
}

let cachedFlags: FeatureFlags | null = null;

export class FeatureFlagService {
  static async fetchFlags(): Promise<FeatureFlags> {
    if (cachedFlags) return cachedFlags;

    // Fetch from remote config API
    const res = await fetch('/api/feature-flags');
    const data = await res.json();
    cachedFlags = data;
    return data;
  }

  static async isEnabled(flag: string): Promise<boolean> {
    const flags = await this.fetchFlags();
    return flags[flag]?.enabled ?? false;
  }

  static async getVariant(flag: string): Promise<string | undefined> {
    const flags = await this.fetchFlags();
    return flags[flag]?.variant;
  }

  static invalidateCache() {
    cachedFlags = null;
  }
}
