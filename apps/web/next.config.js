/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@form-me/database',
    '@form-me/auth',
    '@form-me/types',
    '@form-me/storage',
    '@form-me/email',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
    // Désactive l'optimisation d'images en dev pour éviter le bug Turbopack
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;
