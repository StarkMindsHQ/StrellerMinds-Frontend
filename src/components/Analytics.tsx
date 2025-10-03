'use client';
import { useEffect, useState } from 'react';
import { shouldLoadAnalytics } from '../utils/analytics';

export default function Analytics() {
  const [loadAnalytics, setLoadAnalytics] = useState(false);

  useEffect(() => {
    // Check if analytics should be loaded
    const shouldLoad = shouldLoadAnalytics();
    setLoadAnalytics(shouldLoad);

    if (shouldLoad) {
      // eslint-disable-next-line no-console
      console.log('✅ Analytics enabled - user has consented');
    } else {
      // eslint-disable-next-line no-console
      console.log('🚫 Analytics disabled - DNT enabled or no consent');
    }
  }, []);

  // Only render analytics if consent is given and DNT is not enabled
  if (!loadAnalytics) {
    return null;
  }

  // Placeholder for analytics - would normally render VercelAnalytics
  // TODO: Install @vercel/analytics package and import { Analytics } from '@vercel/analytics/react'
  return null;
}
