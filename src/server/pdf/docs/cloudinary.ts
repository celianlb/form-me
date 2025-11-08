/**
 * Cloudinary helpers pour les documents Convention et Émargement
 *
 * Les templates PDF sont maintenant générés programmatiquement via:
 * - generateConventionTemplate() pour les conventions
 * - generateEmargementTemplate() pour les feuilles d'émargement
 */
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary (déjà fait dans uploadToCloudinary.ts mais on s'assure)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload d'un buffer PDF généré vers Cloudinary
 * @param buffer - Le buffer PDF à uploader
 * @param folder - Le dossier de destination
 * @param filename - Le nom de fichier (optionnel, sans extension)
 */
export async function uploadBuffer(
  buffer: Buffer,
  folder = 'generated-docs',
  filename?: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder,
        format: 'pdf',
        public_id: filename, // Si fourni, utilise ce nom au lieu d'un ID aléatoire
        unique_filename: !filename, // Si filename fourni, ne pas ajouter de suffixe aléatoire
        overwrite: false, // Ne pas écraser les fichiers existants
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}
