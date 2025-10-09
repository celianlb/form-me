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
 * Récupère l'URL sécurisée d'un template depuis son public_id
 */
export async function getTemplateUrl(kind: 'CONVENTION' | 'EMARGEMENT'): Promise<string> {
  const publicId = kind === 'CONVENTION'
    ? process.env.CONVENTION_TEMPLATE_PUBLIC_ID
    : process.env.EMARGEMENT_TEMPLATE_PUBLIC_ID;

  if (!publicId) {
    throw new Error(`Missing env var: ${kind}_TEMPLATE_PUBLIC_ID`);
  }

  // Construction de l'URL sécurisée Cloudinary
  const url = cloudinary.url(publicId, {
    resource_type: 'raw',
    secure: true,
  });

  return url;
}

/**
 * Upload d'un buffer PDF généré vers Cloudinary
 */
export async function uploadBuffer(
  buffer: Buffer,
  folder = 'generated-docs'
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder,
        format: 'pdf',
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
