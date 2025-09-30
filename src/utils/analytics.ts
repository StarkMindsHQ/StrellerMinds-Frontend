/**
 * Represents the user's analytics consent state
 * - true: User has explicitly accepted analytics
 * - false: User has explicitly rejected analytics
 * - null: User has not made a decision yet
 */
export type AnalyticsConsent = true | false | null;

/**
 * Checks if the user has enabled Do Not Track (DNT) in their browser
 * @returns {boolean} true if DNT is enabled, false otherwise
 */
export function isDNTEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for various DNT signals
  const dnt =
    navigator.doNotTrack ||
    (window as any).doNotTrack ||
    (navigator as any).msDoNotTrack;

  return dnt === '1' || dnt === 'yes';
}

/**
 * Checks if analytics consent has been given
 * @returns {AnalyticsConsent} true if consent given, false if rejected, null if no decision
 */
export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return null;

  const consent = localStorage.getItem('analytics-consent');
  if (consent === null) return null;
  return consent === 'true';
}

/**
 * Sets the analytics consent preference
 * @param {boolean} consent - true to allow analytics, false to reject
 */
export function setAnalyticsConsent(consent: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('analytics-consent', consent.toString());
}

/**
 * Determines if analytics should be loaded based on DNT and consent
 * @returns {boolean} true if analytics should be loaded
 */
export function shouldLoadAnalytics(): boolean {
  // Always respect DNT first
  if (isDNTEnabled()) {
    return false;
  }

  // Then check consent
  const consent = getAnalyticsConsent();
  return consent === true;
}