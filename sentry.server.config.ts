// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://d8a589d1f8903812fa5e94bfbd3d11f4@o4510087398686720.ingest.de.sentry.io/4510087406485584',

  // Environment configuration
  environment: process.env.NODE_ENV || 'development',

  // Release configuration (use git commit hash or version)
  release:
    process.env.SENTRY_RELEASE ||
    `${process.env.npm_package_name}@${process.env.npm_package_version}`,

  // Sample rates based on environment to control volume
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1, // 10% in prod, 100% in dev
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1, // 10% in prod, 100% in dev

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Debug mode only in development
  debug: process.env.NODE_ENV === 'development',
});
