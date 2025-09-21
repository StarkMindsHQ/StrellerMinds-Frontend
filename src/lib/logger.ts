const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },

  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },

  error: (...args: unknown[]) => {
    // Always log errors regardless of environment
    console.error(...args);
  },
};
