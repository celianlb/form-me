/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@form-me/database', '@form-me/auth', '@form-me/types', '@form-me/storage', '@form-me/email'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};

module.exports = nextConfig;
