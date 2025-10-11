/**
 * Cloudinary helpers pour les documents Convention et Émargement
 */
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary (déjà fait dans uploadToCloudinary.ts mais on s'assure)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Récupère le buffer du template depuis le système de fichiers local
 * Les templates sont stockés dans public/templates/
 */
export async function getTemplateBuffer(kind: 'CONVENTION' | 'EMARGEMENT'): Promise<Buffer> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const templateName = kind === 'CONVENTION'
    ? 'convention_template.pdf'
    : 'emargement_template.pdf';

  const templatePath = path.join(process.cwd(), 'public', 'templates', templateName);

  try {
    console.log(`[${kind}] Reading template from: ${templatePath}`);
    const buffer = await fs.readFile(templatePath);
    console.log(`✓ [${kind}] Successfully loaded template (${buffer.length} bytes)`);
    return buffer;
  } catch (error) {
    console.error(`[${kind}] Error reading template:`, error);
    throw new Error(`Failed to read template ${templateName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

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
