/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  experimental: {
    // Disable Next 14 client-side Router Cache so admin sees fresh data
    // immediately after mutations (no more "must hard-refresh").
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
};

export default nextConfig;
