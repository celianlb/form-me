/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour augmenter la limite de taille des fichiers uploadés
  serverExternalPackages: ['cloudinary'],
  // Configuration des limites de body pour les API routes
  serverRuntimeConfig: {
    // Augmente la limite à 50MB
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
};

module.exports = nextConfig;