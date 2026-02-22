export const authConfig = {
  sessionMaxAge: 60 * 60 * 24, // 24 hours
  refreshTokenRotation: true,
  secureCookies: process.env.NODE_ENV === 'production',
};
