'use client';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { useEffect, useState } from 'react';
import { shouldLoadAnalytics } from '@/utils/analytics';

export default function Analytics() {
  const [loadAnalytics, setLoadAnalytics] = useState(false);

  useEffect(() => {
    // Check if analytics should be loaded
    const shouldLoad = shouldLoadAnalytics();
    setLoadAnalytics(shouldLoad);

    if (shouldLoad) {
      console.log('✅ Analytics enabled - user has consented');
    } else {
      console.log('🚫 Analytics disabled - DNT enabled or no consent');
    }
  }, []);

  // Only render analytics if consent is given and DNT is not enabled
  if (!loadAnalytics) {
    return null;
  }

  return <VercelAnalytics />;
}