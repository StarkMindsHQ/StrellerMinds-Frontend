/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This will silence the warning but not fix the underlying issue
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;