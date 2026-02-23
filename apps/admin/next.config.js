const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@form-me/database', '@form-me/auth', '@form-me/types', '@form-me/storage', '@form-me/email'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};

// Configuration spécifique à la production pour Vercel
// Permet de trouver les fichiers Prisma dans le monorepo
if (process.env.NODE_ENV === 'production') {
  nextConfig.outputFileTracingRoot = path.join(__dirname, '../../');
}

module.exports = nextConfig;
