'use client';

import { useState, useEffect } from 'react';
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  isDNTEnabled,
  type AnalyticsConsent,
} from '../utils/analytics';

export function useAnalyticsConsent() {
  const [consent, setConsent] = useState<AnalyticsConsent>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dntEnabled, setDntEnabled] = useState(false);

  useEffect(() => {
    // Check DNT status
    const dnt = isDNTEnabled();
    setDntEnabled(dnt);

    // If DNT is enabled, don't show banner
    if (dnt) {
      setShowBanner(false);
      setConsent(false);
      return;
    }

    // Check existing consent
    const existingConsent = getAnalyticsConsent();
    setConsent(existingConsent);

    // Show banner if no decision has been made
    if (existingConsent === null) {
      setShowBanner(true);
    }
  }, []);

  const acceptConsent = () => {
    setAnalyticsConsent(true);
    setConsent(true);
    setShowBanner(false);
    
    // Reload to initialize analytics
    window.location.reload();
  };

  const rejectConsent = () => {
    setAnalyticsConsent(false);
    setConsent(false);
    setShowBanner(false);
  };

  return {
    consent,
    showBanner,
    dntEnabled,
    acceptConsent,
    rejectConsent,
  };
}